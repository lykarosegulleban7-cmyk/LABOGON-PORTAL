require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectPgSimple = require('connect-pg-simple');
const { createHash, randomBytes } = require('crypto');
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const session = require('express-session');
const helmet = require('helmet');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);
const production = process.env.NODE_ENV === 'production';
const configuredOrigin = process.env.APP_ORIGIN || `http://localhost:${port}`;
const sessionSecret = process.env.SESSION_SECRET || '';

if (sessionSecret.length < 32) {
  throw new Error('SESSION_SECRET must contain at least 32 characters.');
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set.');
}
let appOrigin;
try {
  appOrigin = new URL(configuredOrigin).origin;
} catch {
  throw new Error('APP_ORIGIN must be a valid absolute URL.');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const PgSession = connectPgSimple(session);
const asyncRoute = handler => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
const fail = (status, message) => Object.assign(new Error(message), { status });
const validEmail = value => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const validLrn = value => typeof value === 'string' && /^\d{12}$/.test(value);
const validPeriod = value => Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 4;
const validUuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

app.set('trust proxy', production ? 1 : false);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com']
    }
  }
}));
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.get('origin')) {
    let requestOrigin;
    try {
      requestOrigin = new URL(req.get('origin')).origin;
    } catch {
      return res.status(403).json({ error: 'Invalid request origin.' });
    }
    if (requestOrigin !== appOrigin) return res.status(403).json({ error: 'Request origin is not allowed.' });
  }
  next();
});
app.use(session({
  store: new PgSession({ pool, tableName: 'labogon_sessions', createTableIfMissing: true }),
  name: 'labogon.sid',
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: production,
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000
  }
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts. Try again later.' }
});

function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Sign in to continue.' });
  next();
}

function requireAdmin(req, res, next) {
  if (req.session.user?.role !== 'admin') return res.status(403).json({ error: 'Teacher access is required.' });
  next();
}

async function ownedSection(sectionId, ownerId, includeArchived = false) {
  const result = await pool.query(
    `SELECT s.id, s.name, s.subject_id, sub.name AS subject_name
       FROM sections s JOIN subjects sub ON sub.id = s.subject_id
      WHERE s.id = $1 AND sub.owner_id = $2
        AND ($3::boolean OR (s.archived_at IS NULL AND sub.archived_at IS NULL))`,
    [sectionId, ownerId, includeArchived]
  );
  if (!result.rowCount) throw fail(404, 'Class section not found.');
  return result.rows[0];
}

async function requireEnrollment(sectionId, learnerId) {
  const result = await pool.query(
    `SELECT 1 FROM enrollments e
       JOIN sections s ON s.id = e.section_id
       JOIN subjects sub ON sub.id = s.subject_id
      WHERE e.section_id = $1 AND e.learner_id = $2
        AND s.archived_at IS NULL AND sub.archived_at IS NULL`,
    [sectionId, learnerId]
  );
  if (!result.rowCount) throw fail(404, 'Student class record not found.');
}

async function transaction(work) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await work(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/auth/register', authLimiter, asyncRoute(async (req, res) => {
  const { name, email, password, learnerId, inviteToken, role = 'student' } = req.body || {};
  if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100 ||
      !validEmail(email) || typeof password !== 'string' || password.length < 10 ||
      password.length > 200 || !['student', 'teacher'].includes(role) ||
      typeof inviteToken !== 'string' || !/^[A-Za-z0-9_-]{40,60}$/.test(inviteToken)) {
    throw fail(400, 'Enter your name, valid email, invitation token, and password of at least 10 characters.');
  }
  const normalizedEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);
  const tokenHash = createHash('sha256').update(inviteToken).digest('hex');
  const created = await transaction(async client => {
    if (role === 'teacher') {
      const invite = await client.query(
        `SELECT id, email FROM teacher_invites
          WHERE email = $1 AND token_hash = $2 AND used_at IS NULL AND expires_at > NOW()
          FOR UPDATE`,
        [normalizedEmail, tokenHash]
      );
      if (!invite.rowCount) throw fail(403, 'That teacher invitation is invalid, expired, or was issued to a different email.');
      let account;
      try {
        account = await client.query(
          `INSERT INTO users (email, name, password_hash, role)
           VALUES ($1, $2, $3, 'admin')
           RETURNING id, email, name, role, learner_id AS "learnerId", student_id AS "studentId"`,
          [normalizedEmail, name.trim(), passwordHash]
        );
      } catch (error) {
        if (error.code === '23505') throw fail(409, 'An account already uses that email.');
        throw error;
      }
      await client.query('UPDATE teacher_invites SET used_at = NOW() WHERE id = $1', [invite.rows[0].id]);
      return account.rows[0];
    }
    if (!validLrn(learnerId)) throw fail(400, 'Enter your 12-digit LRN.');
    const invite = await client.query(
      `SELECT id FROM student_invites
        WHERE learner_id = $1 AND token_hash = $2 AND used_at IS NULL AND expires_at > NOW()
        FOR UPDATE`,
      [learnerId, tokenHash]
    );
    if (!invite.rowCount) throw fail(403, 'That school invitation is invalid, expired, or already used.');
    const profile = await client.query('SELECT name FROM student_profiles WHERE learner_id = $1', [learnerId]);
    if (!profile.rowCount || profile.rows[0].name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      throw fail(403, 'Your name does not match the school profile linked to this invitation.');
    }
    let account;
    try {
      account = await client.query(
        `INSERT INTO users (email, name, password_hash, role, learner_id)
         VALUES ($1, $2, $3, 'student', $4)
         RETURNING id, email, name, role, learner_id AS "learnerId", student_id AS "studentId"`,
        [normalizedEmail, name.trim(), passwordHash, learnerId]
      );
    } catch (error) {
      if (error.code === '23505') throw fail(409, 'An account already exists for that email or LRN.');
      throw error;
    }
    await client.query('UPDATE student_invites SET used_at = NOW() WHERE id = $1', [invite.rows[0].id]);
    return account.rows[0];
  });
  await new Promise((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
  req.session.user = created;
  res.status(201).json({ user: req.session.user });
}));

app.post('/api/auth/login', authLimiter, asyncRoute(async (req, res) => {
  const { email, password } = req.body || {};
  if (!validEmail(email) || typeof password !== 'string' || !password) {
    throw fail(400, 'Enter your email and password.');
  }
  const result = await pool.query(
    `SELECT id, email, name, role, learner_id AS "learnerId",
            student_id AS "studentId", password_hash
       FROM users WHERE email = $1`,
    [email.trim().toLowerCase()]
  );
  const account = result.rows[0];
  if (!account || !(await bcrypt.compare(password, account.password_hash))) {
    throw fail(401, 'Email or password is incorrect.');
  }
  delete account.password_hash;
  await new Promise((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
  req.session.user = account;
  res.json({ user: account });
}));

app.post('/api/auth/logout', requireAuth, asyncRoute(async (req, res) => {
  await new Promise((resolve, reject) => req.session.destroy(error => error ? reject(error) : resolve()));
  res.clearCookie('labogon.sid', { httpOnly: true, secure: production, sameSite: 'lax' });
  res.status(204).end();
}));

app.get('/api/me', requireAuth, asyncRoute(async (req, res) => {
  const user = req.session.user;
  if (user.role === 'student') {
    const section = await pool.query(
      `SELECT s.name FROM enrollments e
         JOIN sections s ON s.id = e.section_id
         JOIN subjects sub ON sub.id = s.subject_id
        WHERE e.learner_id = $1 AND s.archived_at IS NULL AND sub.archived_at IS NULL
        ORDER BY s.name LIMIT 1`,
      [user.learnerId]
    );
    user.section = section.rows[0]?.name || '';
  }
  res.json({ user });
}));

app.get('/api/subjects', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const subjects = await pool.query(
    `SELECT id, name, code FROM subjects
      WHERE owner_id = $1 AND archived_at IS NULL ORDER BY name`,
    [req.session.user.id]
  );
  const sections = await pool.query(
    `SELECT s.id, s.subject_id AS "subjectId", s.name,
            COALESCE(json_agg(json_build_object(
              'learnerId', e.learner_id, 'name', e.student_name
            ) ORDER BY e.student_name) FILTER (WHERE e.learner_id IS NOT NULL), '[]') AS students
       FROM sections s JOIN subjects sub ON sub.id = s.subject_id
       LEFT JOIN enrollments e ON e.section_id = s.id
      WHERE sub.owner_id = $1 AND s.archived_at IS NULL AND sub.archived_at IS NULL
      GROUP BY s.id ORDER BY s.name`,
    [req.session.user.id]
  );
  res.json({ subjects: subjects.rows.map(subject => ({
    ...subject,
    sections: sections.rows.filter(section => section.subjectId === subject.id)
  })) });
}));

app.post('/api/subjects', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { name, code } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 70 ||
      (code !== undefined && (typeof code !== 'string' || code.length > 20))) {
    throw fail(400, 'Enter a subject name (up to 70 characters) and a code of up to 20 characters.');
  }
  const normalizedCode = (code || name.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 20)).trim();
  try {
    const result = await pool.query(
      `INSERT INTO subjects (owner_id, name, code) VALUES ($1, $2, $3)
       RETURNING id, name, code`,
      [req.session.user.id, name.trim(), normalizedCode]
    );
    res.status(201).json({ subject: { ...result.rows[0], sections: [] } });
  } catch (error) {
    if (error.code === '23505') throw fail(409, 'That subject already exists in your teaching load.');
    throw error;
  }
}));

app.post('/api/subjects/:subjectId/sections', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  if (!validUuid(req.params.subjectId)) throw fail(400, 'Invalid subject ID.');
  const { name } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || name.trim().length > 70) throw fail(400, 'Enter a section name up to 70 characters.');
  const parent = await pool.query(
    'SELECT id FROM subjects WHERE id = $1 AND owner_id = $2 AND archived_at IS NULL',
    [req.params.subjectId, req.session.user.id]
  );
  if (!parent.rowCount) throw fail(404, 'Subject not found.');
  try {
    const section = await pool.query(
      `INSERT INTO sections (subject_id, name) VALUES ($1, $2)
       RETURNING id, subject_id AS "subjectId", name`,
      [req.params.subjectId, name.trim()]
    );
    res.status(201).json({ section: section.rows[0] });
  } catch (error) {
    if (error.code === '23505') throw fail(409, 'That section already exists under this subject.');
    throw error;
  }
}));

app.post('/api/sections/:sectionId/students', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  if (!validUuid(req.params.sectionId)) throw fail(400, 'Invalid section ID.');
  const { learnerId, name } = req.body || {};
  if (!validLrn(learnerId) || typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
    throw fail(400, 'Enter a 12-digit LRN and student name.');
  }
  await ownedSection(req.params.sectionId, req.session.user.id);
  await transaction(async client => {
    const existing = await client.query('SELECT name FROM student_profiles WHERE learner_id = $1', [learnerId]);
    if (existing.rowCount && existing.rows[0].name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      throw fail(409, 'That LRN is already linked to a different student profile.');
    }
    await client.query(
      `INSERT INTO student_profiles (learner_id, name) VALUES ($1, $2)
       ON CONFLICT (learner_id) DO NOTHING`,
      [learnerId, name.trim()]
    );
    await client.query(
      `INSERT INTO enrollments (section_id, learner_id, student_name) VALUES ($1, $2, $3)
       ON CONFLICT (section_id, learner_id) DO NOTHING`,
      [req.params.sectionId, learnerId, name.trim()]
    );
  });
  res.status(201).json({ learnerId, name: name.trim() });
}));

app.post('/api/students/:learnerId/invite', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { learnerId } = req.params;
  if (!validLrn(learnerId)) throw fail(400, 'Invalid learner ID.');
  const student = await pool.query(
    `SELECT p.name FROM student_profiles p
       JOIN enrollments e ON e.learner_id = p.learner_id
       JOIN sections s ON s.id = e.section_id
       JOIN subjects sub ON sub.id = s.subject_id
      WHERE p.learner_id = $1 AND sub.owner_id = $2
        AND s.archived_at IS NULL AND sub.archived_at IS NULL
      LIMIT 1`,
    [learnerId, req.session.user.id]
  );
  if (!student.rowCount) throw fail(404, 'Student is not enrolled in one of your active classes.');
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const invite = await transaction(async client => {
    await client.query(
      `UPDATE student_invites SET used_at = NOW()
        WHERE learner_id = $1 AND used_at IS NULL`,
      [learnerId]
    );
    return client.query(
      `INSERT INTO student_invites (learner_id, token_hash, created_by, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')
       RETURNING expires_at AS "expiresAt"`,
      [learnerId, tokenHash, req.session.user.id]
    );
  });
  res.status(201).json({
    learnerId,
    studentName: student.rows[0].name,
    inviteToken: token,
    expiresAt: invite.rows[0].expiresAt
  });
}));

app.post('/api/teachers/invite', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const email = req.body?.email;
  if (!validEmail(email)) throw fail(400, 'Enter a valid teacher email address.');
  const normalizedEmail = email.trim().toLowerCase();
  const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rowCount) throw fail(409, 'An account already uses that email.');
  const token = randomBytes(32).toString('base64url');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const invite = await transaction(async client => {
    await client.query(
      `UPDATE teacher_invites SET used_at = NOW()
        WHERE email = $1 AND used_at IS NULL`,
      [normalizedEmail]
    );
    return client.query(
      `INSERT INTO teacher_invites (email, token_hash, created_by, expires_at)
       VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')
       RETURNING expires_at AS "expiresAt"`,
      [normalizedEmail, tokenHash, req.session.user.id]
    );
  });
  res.status(201).json({ email: normalizedEmail, inviteToken: token, expiresAt: invite.rows[0].expiresAt });
}));

app.get('/api/students', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const result = await pool.query(
    `SELECT DISTINCT p.learner_id AS "learnerId", p.name,
            u.email, u.student_id AS "studentId"
       FROM student_profiles p
       JOIN enrollments e ON e.learner_id = p.learner_id
       JOIN sections s ON s.id = e.section_id
       JOIN subjects sub ON sub.id = s.subject_id
       LEFT JOIN users u ON u.learner_id = p.learner_id
      WHERE sub.owner_id = $1 AND s.archived_at IS NULL AND sub.archived_at IS NULL
      ORDER BY p.name`,
    [req.session.user.id]
  );
  res.json({ students: result.rows });
}));

app.get('/api/sections/:sectionId/grades', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { sectionId } = req.params;
  const period = Number(req.query.period);
  if (!validUuid(sectionId) || !validPeriod(period)) throw fail(400, 'Provide a valid section ID and grading period (1–4).');
  await ownedSection(sectionId, req.session.user.id);
  const result = await pool.query(
    `SELECT e.learner_id AS "learnerId", e.student_name AS name, g.score
       FROM enrollments e LEFT JOIN grades g
         ON g.section_id = e.section_id AND g.learner_id = e.learner_id AND g.period = $2
      WHERE e.section_id = $1 ORDER BY e.student_name`,
    [sectionId, period]
  );
  const published = await pool.query(
    'SELECT 1 FROM grade_publications WHERE section_id = $1 AND period = $2',
    [sectionId, period]
  );
  res.json({ grades: result.rows, published: published.rowCount > 0 });
}));

app.put('/api/sections/:sectionId/grades', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { sectionId } = req.params;
  const { period, entries, publish = false } = req.body || {};
  if (!validUuid(sectionId) || !validPeriod(period) || !Array.isArray(entries) || !entries.length ||
      entries.length > 1000 || typeof publish !== 'boolean') {
    throw fail(400, 'Provide a valid period, grade entries, and publish flag.');
  }
  if (entries.some(item => !item || !validLrn(item.learnerId) || typeof item.score !== 'number' ||
      !Number.isFinite(item.score) || item.score < 0 || item.score > 100)) {
    throw fail(400, 'Every grade must include a 12-digit LRN and a score from 0 to 100.');
  }
  if (new Set(entries.map(item => item.learnerId)).size !== entries.length) throw fail(400, 'Duplicate student grade entries are not allowed.');
  await ownedSection(sectionId, req.session.user.id);
  await transaction(async client => {
    const roster = await client.query('SELECT learner_id FROM enrollments WHERE section_id = $1', [sectionId]);
    const rosterIds = new Set(roster.rows.map(row => row.learner_id.trim()));
    if (entries.some(item => !rosterIds.has(item.learnerId))) throw fail(400, 'A grade was submitted for a student outside this class.');
    if (publish && (entries.length !== rosterIds.size || [...rosterIds].some(id => !entries.some(item => item.learnerId === id)))) {
      throw fail(400, 'Enter a grade for every student before publishing.');
    }
    for (const entry of entries) {
      await client.query(
        `INSERT INTO grades (section_id, learner_id, period, score, updated_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (section_id, learner_id, period)
         DO UPDATE SET score = EXCLUDED.score, updated_by = EXCLUDED.updated_by, updated_at = NOW()`,
        [sectionId, entry.learnerId, Number(period), entry.score, req.session.user.id]
      );
    }
    if (publish) {
      await client.query(
        `INSERT INTO grade_publications (section_id, period, published_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (section_id, period)
         DO UPDATE SET published_by = EXCLUDED.published_by, published_at = NOW()`,
        [sectionId, Number(period), req.session.user.id]
      );
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT DISTINCT u.id, $2, $3, 'records', $1
           FROM users u JOIN enrollments e ON e.learner_id = u.learner_id
          WHERE e.section_id = $1 AND u.role = 'student'`,
        [sectionId, `${period} grading grades are ready`,
          `Your teacher published grades for ${period} grading.`]
      );
    }
  });
  res.json({ saved: entries.length, published: publish });
}));

app.get('/api/student/records', requireAuth, asyncRoute(async (req, res) => {
  if (req.session.user.role !== 'student') throw fail(403, 'Student access is required.');
  const result = await pool.query(
    `SELECT g.period, g.score, s.id AS "sectionId",
            sub.id AS "subjectId", sub.name AS subject,
            sub.code, s.name AS section, gp.published_at AS "publishedAt"
       FROM grades g
       JOIN grade_publications gp ON gp.section_id = g.section_id AND gp.period = g.period
       JOIN sections s ON s.id = g.section_id
       JOIN subjects sub ON sub.id = s.subject_id
      WHERE g.learner_id = $1 AND s.archived_at IS NULL AND sub.archived_at IS NULL
      ORDER BY g.period, sub.name`,
    [req.session.user.learnerId]
  );
  res.json({ records: result.rows });
}));

app.get('/api/student/sections', requireAuth, asyncRoute(async (req, res) => {
  if (req.session.user.role !== 'student') throw fail(403, 'Student access is required.');
  const result = await pool.query(
    `SELECT DISTINCT s.id, s.name, sub.id AS "subjectId", sub.name AS subject, sub.code
       FROM enrollments e JOIN sections s ON s.id = e.section_id
       JOIN subjects sub ON sub.id = s.subject_id
      WHERE e.learner_id = $1 AND s.archived_at IS NULL AND sub.archived_at IS NULL
      ORDER BY s.name, sub.name`,
    [req.session.user.learnerId]
  );
  res.json({ sections: result.rows });
}));

app.get('/api/notifications', requireAuth, asyncRoute(async (req, res) => {
  const result = await pool.query(
    `SELECT id, title, body, action, resource_id AS "resourceId",
            created_at AS "createdAt", read_at AS "readAt"
       FROM notifications WHERE recipient_id = $1
      ORDER BY created_at DESC LIMIT 100`,
    [req.session.user.id]
  );
  res.json({ notifications: result.rows });
}));

app.post('/api/notifications/read', requireAuth, asyncRoute(async (req, res) => {
  await pool.query(
    'UPDATE notifications SET read_at = NOW() WHERE recipient_id = $1 AND read_at IS NULL',
    [req.session.user.id]
  );
  res.status(204).end();
}));

app.get('/api/sections/:sectionId/attendance', requireAuth, asyncRoute(async (req, res) => {
  const { sectionId } = req.params;
  if (!validUuid(sectionId)) throw fail(400, 'Invalid section ID.');
  const isAdmin = req.session.user.role === 'admin';
  if (isAdmin) await ownedSection(sectionId, req.session.user.id);
  else await requireEnrollment(sectionId, req.session.user.learnerId);
  const { date, month } = req.query;
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    const result = await pool.query(
      `SELECT d.learner_id AS "learnerId", d.status,
              d.recorded_at AS "recordedAt", u.name AS "recordedBy"
         FROM daily_attendance d
         LEFT JOIN users u ON u.id = d.recorded_by
        WHERE d.section_id = $1 AND d.school_date = $2
           AND ($3::boolean OR d.learner_id = $4)`,
      [sectionId, date, isAdmin, req.session.user.learnerId || null]
    );
    return res.json({ attendance: result.rows });
  }
  if (typeof req.query.start === 'string' && typeof req.query.end === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(req.query.start) && /^\d{4}-\d{2}-\d{2}$/.test(req.query.end) &&
      req.query.start <= req.query.end) {
    const result = await pool.query(
      `SELECT d.learner_id AS "learnerId", d.school_date AS date, d.status,
              d.recorded_at AS "recordedAt", u.name AS "recordedBy"
         FROM daily_attendance d
         LEFT JOIN users u ON u.id = d.recorded_by
        WHERE d.section_id = $1 AND d.school_date BETWEEN $2 AND $3
          AND ($4::boolean OR d.learner_id = $5)
        ORDER BY d.school_date`,
      [sectionId, req.query.start, req.query.end, isAdmin, req.session.user.learnerId || null]
    );
    return res.json({ attendance: result.rows });
  }
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const result = await pool.query(
      `SELECT m.learner_id AS "learnerId", m.present,
              m.absent_days AS "absentDays", m.recorded_at AS "recordedAt",
              u.name AS "recordedBy"
         FROM monthly_attendance m
         LEFT JOIN users u ON u.id = m.recorded_by
        WHERE m.section_id = $1 AND m.school_month = ($2 || '-01')::date
          AND ($3::boolean OR m.learner_id = $4)`,
      [sectionId, month, isAdmin, req.session.user.learnerId || null]
    );
    return res.json({ attendance: result.rows });
  }
  throw fail(400, 'Provide a date (YYYY-MM-DD), date range (start and end), or month (YYYY-MM).');
}));

app.put('/api/sections/:sectionId/attendance/daily', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { sectionId } = req.params;
  const { date, entries } = req.body || {};
  if (!validUuid(sectionId) || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      date > new Date().toISOString().slice(0, 10) || !Array.isArray(entries) || !entries.length || entries.length > 1000 ||
      entries.some(item => !item || !validLrn(item.learnerId) || !['Present', 'Late', 'Absent'].includes(item.status)) ||
      new Set(entries.map(item => item.learnerId)).size !== entries.length) {
    throw fail(400, 'Provide a past or current school date and one valid attendance status per student.');
  }
  await ownedSection(sectionId, req.session.user.id);
  await transaction(async client => {
    const roster = await client.query('SELECT learner_id FROM enrollments WHERE section_id = $1', [sectionId]);
    const ids = new Set(roster.rows.map(row => row.learner_id.trim()));
    if (entries.length !== ids.size || entries.some(item => !ids.has(item.learnerId))) {
      throw fail(400, 'Submit attendance for every student currently enrolled in the class.');
    }
    for (const entry of entries) {
      await client.query(
        `INSERT INTO daily_attendance (section_id, learner_id, school_date, status, recorded_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (section_id, learner_id, school_date)
         DO UPDATE SET status = EXCLUDED.status, recorded_by = EXCLUDED.recorded_by, recorded_at = NOW()`,
        [sectionId, entry.learnerId, date, entry.status, req.session.user.id]
      );
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT id, 'Attendance record updated', $2, 'attendance', $3
           FROM users WHERE learner_id = $1 AND role = 'student'`,
        [entry.learnerId, `Your attendance for ${date} was recorded.`, sectionId]
      );
    }
  });
  res.json({ saved: entries.length });
}));

app.put('/api/sections/:sectionId/attendance/monthly', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { sectionId } = req.params;
  const { month, entries } = req.body || {};
  if (!validUuid(sectionId) || typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month) ||
      month > new Date().toISOString().slice(0, 7) || !Array.isArray(entries) || entries.length > 1000 ||
      entries.some(item => !item || !validLrn(item.learnerId) || typeof item.present !== 'boolean' ||
        !Number.isInteger(item.absentDays) || item.absentDays < 0 || item.absentDays > 31) ||
      new Set(entries.map(item => item.learnerId)).size !== entries.length) {
    throw fail(400, 'Provide a valid month and whole absence totals from 0 to 31.');
  }
  await ownedSection(sectionId, req.session.user.id);
  await transaction(async client => {
    const roster = await client.query('SELECT learner_id FROM enrollments WHERE section_id = $1', [sectionId]);
    const ids = new Set(roster.rows.map(row => row.learner_id.trim()));
    if (entries.length !== ids.size || entries.some(item => !ids.has(item.learnerId))) {
      throw fail(400, 'Submit a monthly summary for every student currently enrolled in the class.');
    }
    const [year, monthNumber] = month.split('-').map(Number);
    const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
    const schoolDays = Array.from({ length: daysInMonth }, (_, i) => new Date(Date.UTC(year, monthNumber - 1, i + 1)))
      .filter(day => day.getUTCDay() !== 0 && day.getUTCDay() !== 6).length;
    if (entries.some(item => item.absentDays > schoolDays)) throw fail(400, `Absence totals cannot exceed ${schoolDays} weekdays in this month.`);
    for (const entry of entries) {
      await client.query(
        `INSERT INTO monthly_attendance (section_id, learner_id, school_month, present, absent_days, recorded_by)
         VALUES ($1, $2, ($3 || '-01')::date, $4, $5, $6)
         ON CONFLICT (section_id, learner_id, school_month)
         DO UPDATE SET present = EXCLUDED.present, absent_days = EXCLUDED.absent_days,
                       recorded_by = EXCLUDED.recorded_by, recorded_at = NOW()`,
        [sectionId, entry.learnerId, month, entry.present, entry.absentDays, req.session.user.id]
      );
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT id, 'Monthly attendance updated', $2, 'attendance', $3
           FROM users WHERE learner_id = $1 AND role = 'student'`,
        [entry.learnerId, `Your attendance summary for ${month} was updated.`, sectionId]
      );
    }
  });
  res.json({ saved: entries.length });
}));

app.get('/api/announcements', requireAuth, asyncRoute(async (req, res) => {
  const user = req.session.user;
  const result = await pool.query(
    `SELECT DISTINCT a.id, a.title, a.body, a.category AS type, a.audience,
            a.target_learner_id AS "targetLearnerId",
            a.created_at AS "createdAt", u.name AS author
       FROM announcements a JOIN users u ON u.id = a.author_id
       LEFT JOIN enrollments e ON e.learner_id = $1
       LEFT JOIN sections gs ON gs.id = e.section_id
       LEFT JOIN announcement_sections axs
         ON axs.announcement_id = a.id AND axs.section_id = e.section_id
      WHERE $2::text = 'admin'
         OR a.audience = 'All students'
         OR (a.audience = 'Personal note' AND a.target_learner_id = $1)
         OR (a.audience = 'Grade 8' AND gs.name ILIKE 'Grade 8%')
         OR (a.audience = 'My classes' AND axs.announcement_id IS NOT NULL)
      ORDER BY a.created_at DESC LIMIT 200`,
    [user.learnerId || null, user.role]
  );
  res.json({ announcements: result.rows });
}));

app.post('/api/announcements', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { title, body, category = 'School update', audience = 'All students', targetLearnerId } = req.body || {};
  const categories = ['School update', 'Academic', 'Events'];
  const audiences = ['All students', 'Grade 8', 'My classes', 'Personal note'];
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 90 ||
      typeof body !== 'string' || !body.trim() || body.trim().length > 500 ||
      !categories.includes(category) || !audiences.includes(audience) ||
      (audience === 'Personal note' ? !validLrn(targetLearnerId) : targetLearnerId !== undefined)) {
    throw fail(400, 'Check the title, message, category, audience, and personal-note recipient.');
  }
  const result = await transaction(async client => {
    if (audience === 'Personal note') {
      const student = await client.query('SELECT 1 FROM student_profiles WHERE learner_id = $1', [targetLearnerId]);
      if (!student.rowCount) throw fail(404, 'The recipient is not in the school directory.');
    }
    const inserted = await client.query(
      `INSERT INTO announcements (author_id, title, body, category, audience, target_learner_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, body, category AS type, audience, created_at AS "createdAt"`,
      [req.session.user.id, title.trim(), body.trim(), category, audience, audience === 'Personal note' ? targetLearnerId : null]
    );
    if (audience === 'My classes') {
      await client.query(
        `INSERT INTO announcement_sections (announcement_id, section_id)
         SELECT $1, s.id FROM sections s JOIN subjects sub ON sub.id = s.subject_id
          WHERE sub.owner_id = $2 AND s.archived_at IS NULL AND sub.archived_at IS NULL`,
        [inserted.rows[0].id, req.session.user.id]
      );
    }
    const announcementId = inserted.rows[0].id;
    if (audience === 'Personal note') {
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT id, $2, $3, 'updates', $4 FROM users WHERE learner_id = $1 AND role = 'student'`,
        [targetLearnerId, title.trim(), body.trim(), announcementId]
      );
    } else if (audience === 'All students') {
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT id, $1, $2, 'updates', $3 FROM users WHERE role = 'student'`,
        [title.trim(), body.trim(), announcementId]
      );
    } else if (audience === 'Grade 8') {
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT DISTINCT u.id, $1, $2, 'updates', $3
           FROM users u JOIN enrollments e ON e.learner_id = u.learner_id
           JOIN sections s ON s.id = e.section_id
          WHERE u.role = 'student' AND s.name ILIKE 'Grade 8%'
            AND s.archived_at IS NULL`,
        [title.trim(), body.trim(), announcementId]
      );
    } else {
      await client.query(
        `INSERT INTO notifications (recipient_id, title, body, action, resource_id)
         SELECT DISTINCT u.id, $1, $2, 'updates', $3
           FROM users u JOIN enrollments e ON e.learner_id = u.learner_id
           JOIN announcement_sections axs ON axs.section_id = e.section_id
          WHERE axs.announcement_id = $3 AND u.role = 'student'`,
        [title.trim(), body.trim(), announcementId]
      );
    }
    return inserted.rows[0];
  });
  res.status(201).json({ announcement: { ...result, author: req.session.user.name } });
}));

app.delete('/api/subjects/:subjectId', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  if (!validUuid(req.params.subjectId)) throw fail(400, 'Invalid subject ID.');
  await transaction(async client => {
    const result = await client.query(
      `UPDATE subjects SET archived_at = NOW(), expires_at = NOW() + INTERVAL '90 days'
        WHERE id = $1 AND owner_id = $2 AND archived_at IS NULL RETURNING id`,
      [req.params.subjectId, req.session.user.id]
    );
    if (!result.rowCount) throw fail(404, 'Subject not found.');
    await client.query(
      `UPDATE sections
          SET archived_at = (SELECT archived_at FROM subjects WHERE id = $1),
              expires_at = (SELECT expires_at FROM subjects WHERE id = $1)
        WHERE subject_id = $1 AND archived_at IS NULL`,
      [req.params.subjectId]
    );
  });
  res.status(204).end();
}));

app.delete('/api/sections/:sectionId', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  if (!validUuid(req.params.sectionId)) throw fail(400, 'Invalid section ID.');
  const section = await ownedSection(req.params.sectionId, req.session.user.id);
  await pool.query(
    `UPDATE sections SET archived_at = NOW(), expires_at = NOW() + INTERVAL '90 days'
      WHERE id = $1`,
    [section.id]
  );
  res.status(204).end();
}));

app.get('/api/trash', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const result = await pool.query(
    `SELECT id, 'subject' AS kind, name, NULL::uuid AS "subjectId",
            NULL::text AS "subjectName", archived_at AS "deletedAt", expires_at AS "expiresAt"
       FROM subjects WHERE owner_id = $1 AND archived_at IS NOT NULL
     UNION ALL
     SELECT s.id, 'section' AS kind, s.name, s.subject_id AS "subjectId",
            sub.name AS "subjectName", s.archived_at AS "deletedAt", s.expires_at AS "expiresAt"
       FROM sections s JOIN subjects sub ON sub.id = s.subject_id
      WHERE sub.owner_id = $1 AND s.archived_at IS NOT NULL
     ORDER BY "deletedAt" DESC`,
    [req.session.user.id]
  );
  res.json({ items: result.rows });
}));

app.post('/api/trash/:kind/:id/restore', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { kind, id } = req.params;
  if (!validUuid(id) || !['subject', 'section'].includes(kind)) throw fail(400, 'Invalid deleted item.');
  await transaction(async client => {
    if (kind === 'subject') {
      const archived = await client.query(
        `SELECT archived_at FROM subjects
          WHERE id = $1 AND owner_id = $2 AND archived_at IS NOT NULL AND expires_at > NOW()`,
        [id, req.session.user.id]
      );
      if (!archived.rowCount) throw fail(404, 'Deleted subject expired or not found.');
      const restored = await client.query(
        `UPDATE subjects SET archived_at = NULL, expires_at = NULL
          WHERE id = $1 AND owner_id = $2 AND archived_at IS NOT NULL AND expires_at > NOW()
          RETURNING id`,
        [id, req.session.user.id]
      );
      if (!restored.rowCount) throw fail(404, 'Deleted subject expired or not found.');
      await client.query(
        `UPDATE sections SET archived_at = NULL, expires_at = NULL
          WHERE subject_id = $1 AND archived_at = $2 AND expires_at > NOW()`,
        [id, archived.rows[0].archived_at]
      );
      return;
    }
    const restored = await client.query(
      `UPDATE sections s SET archived_at = NULL, expires_at = NULL
        FROM subjects sub
       WHERE s.id = $1 AND s.subject_id = sub.id AND sub.owner_id = $2
         AND sub.archived_at IS NULL AND s.archived_at IS NOT NULL AND s.expires_at > NOW()
       RETURNING s.id`,
      [id, req.session.user.id]
    );
    if (!restored.rowCount) throw fail(404, 'Deleted section expired, its subject is deleted, or it was not found.');
  });
  res.status(204).end();
}));

app.delete('/api/trash/:kind/:id', requireAuth, requireAdmin, asyncRoute(async (req, res) => {
  const { kind, id } = req.params;
  if (!validUuid(id) || !['subject', 'section'].includes(kind)) throw fail(400, 'Invalid deleted item.');
  const table = kind === 'subject' ? 'subjects' : 'sections';
  const ownership = kind === 'subject' ? 'owner_id = $2' : 'EXISTS (SELECT 1 FROM subjects sub WHERE sub.id = sections.subject_id AND sub.owner_id = $2)';
  const result = await pool.query(
    `DELETE FROM ${table} WHERE id = $1 AND ${ownership} AND archived_at IS NOT NULL RETURNING id`,
    [id, req.session.user.id]
  );
  if (!result.rowCount) throw fail(404, 'Deleted item not found.');
  res.status(204).end();
}));

app.get('/api/dashboard', requireAuth, asyncRoute(async (req, res) => {
  const user = req.session.user;
  if (user.role === 'admin') {
    const result = await pool.query(
      `SELECT
         (SELECT COUNT(*)::int FROM subjects WHERE owner_id = $1 AND archived_at IS NULL) AS subjects,
         (SELECT COUNT(DISTINCT e.learner_id)::int FROM enrollments e
            JOIN sections s ON s.id = e.section_id JOIN subjects sub ON sub.id = s.subject_id
           WHERE sub.owner_id = $1 AND s.archived_at IS NULL AND sub.archived_at IS NULL) AS students,
         (SELECT COUNT(*)::int FROM announcements
           WHERE author_id = $1 AND created_at >= date_trunc('month', NOW())) AS updates`,
      [user.id]
    );
    return res.json({ role: user.role, ...result.rows[0] });
  }
  const [updates, attendance, grades] = await Promise.all([
    pool.query(
      `SELECT COUNT(*)::int AS count FROM announcements a
        WHERE a.audience = 'All students' OR a.target_learner_id = $1
           OR (a.audience = 'Grade 8' AND EXISTS (
             SELECT 1 FROM enrollments e JOIN sections s ON s.id = e.section_id
              WHERE e.learner_id = $1 AND s.name ILIKE 'Grade 8%'))`,
      [user.learnerId]
    ),
    pool.query(`SELECT COUNT(*)::int AS count FROM daily_attendance WHERE learner_id = $1`, [user.learnerId]),
    pool.query(`SELECT COUNT(DISTINCT period)::int AS count FROM grade_publications gp
      JOIN enrollments e ON e.section_id = gp.section_id WHERE e.learner_id = $1`, [user.learnerId])
  ]);
  res.json({
    role: user.role,
    announcements: updates.rows[0].count,
    recordedAttendanceDays: attendance.rows[0].count,
    publishedPeriods: grades.rows[0].count
  });
}));

app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/app.js', (req, res) => res.sendFile(path.join(__dirname, 'app.js')));
app.get('/styles.css', (req, res) => res.sendFile(path.join(__dirname, 'styles.css')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error.code === '23505') return res.status(409).json({ error: 'That record already exists.' });
  if (error.code === '23503') return res.status(400).json({ error: 'The requested record is still in use or does not exist.' });
  if (error.code === '22P02') return res.status(400).json({ error: 'Invalid identifier or value.' });
  const status = Number.isInteger(error.status) ? error.status : 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status >= 500 ? 'A server error occurred.' : error.message });
});

async function removeExpiredRecords() {
  await pool.query('DELETE FROM sections WHERE archived_at IS NOT NULL AND expires_at <= NOW()');
  await pool.query('DELETE FROM subjects WHERE archived_at IS NOT NULL AND expires_at <= NOW()');
}

async function start() {
  await pool.query('SELECT 1');
  await removeExpiredRecords();
  setInterval(() => removeExpiredRecords().catch(error => console.error('Trash cleanup failed:', error)), 24 * 60 * 60 * 1000).unref();
  app.listen(port, () => console.log(`Labogon Portal API listening on port ${port}`));
}

start().catch(async error => {
  console.error('Database connection or cleanup failed:', error);
  await pool.end();
  process.exitCode = 1;
});
