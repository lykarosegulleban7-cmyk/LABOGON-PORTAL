# Labogon Portal backend

The portal's normal sign-in now uses the PostgreSQL-backed API and HTTP-only session cookie. Teacher and student screens load shared records from the server; changes to subjects, sections, rosters, grades, attendance, announcements, and notifications are saved through the API. Demo buttons remain available for preview and continue to use browser-only sample data; do not treat demo data as school records.

## What the API supports

- Student and teacher account registration using single-use, seven-day invitations; sign-in, sign-out, and session lookup.
- Teacher subject and section management, student LRN enrollment, and student directory lookup.
- Per-student grades by grading period, with server-side validation and publication control.
- Daily roll call and monthly attendance summaries.
- School-wide, Grade 8, class, and personal announcements.
- Student notifications when grades are published, attendance is updated, or an announcement is posted, with mark-as-read support.
- Student-only access to published grades, their own attendance, and announcements addressed to them.
- Subject/section soft deletion, restoration, and permanent deletion after 90 days.
- Role-protected dashboard summaries.

The first teacher account must be created by an authorized operator. Set `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` in the environment, then run `npm run create-admin`; the command never prints the password. Once signed in, a teacher can invite additional teachers from the portal dashboard. Each invite is limited to the specified email, stored hashed, and expires after seven days. Public signup alone cannot grant teacher access.

In the portal, an existing teacher can choose **Invite a teacher**, enter the new teacher's email, and share the generated token securely. The invited teacher chooses **Create account → Teacher** and signs up with the invited email and token. To invite a student, a teacher can add subjects and sections, enroll students by LRN, and use **View profile → Generate account invitation**. The student chooses **Create account → Student** and enters the matching name and LRN, invitation token, school email, and password. Teachers can enter and publish each grading period, record daily/monthly attendance, and post audience-targeted announcements from the corresponding screens.

## Use a cloud PostgreSQL database

This backend works with hosted PostgreSQL; you do not need to install PostgreSQL on your computer. These steps use [Neon](https://neon.com/) as one example. Other managed PostgreSQL providers work too if they supply a standard PostgreSQL connection URL.

1. Create a Neon account and a PostgreSQL project/database in the region nearest your school.
2. In Neon, open **Connect**, select your database and role, and copy its connection string. Use the **direct** connection URL for this traditional, long-running Express server. The URL should use SSL (typically ends in `?sslmode=require`). Never share or commit this URL; it contains the database password.
3. Install Node.js 20+; PostgreSQL itself does not need to be installed locally. Copy `.env.example` to `.env` and replace its placeholder `DATABASE_URL` with the provider's connection string. Set `APP_ORIGIN` to `http://localhost:3000` for local development and set a private `SESSION_SECRET` with at least 32 characters.
4. From the project folder, install dependencies and create the tables in your cloud database:

   ```powershell
   npm install
   npm run db:migrate
   ```

5. Create the initial teacher account using the setup described above, then start the backend:

   ```powershell
   npm run create-admin
   npm start
   ```

   The admin-creation command requires `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD` environment variables. Set them in your private `.env` for this one-time command and remove them after account creation.

6. Open `http://localhost:3000`. The server runs on your computer, while its database is in the cloud. The API health check is `GET /api/health`.

`.env` is ignored by Git. Keep it private and do not paste database URLs, passwords, or session secrets into chats, source code, screenshots, or public repositories. Use a separate development database/project for testing. A hosted database persists data but does not publish the website or API to the internet.

Do not commit `.env` or use real student information in a development database.

## API outline

All routes use JSON and same-origin, HTTP-only session cookies. Mutating browser requests must come from the configured `APP_ORIGIN`. For local development, set `APP_ORIGIN=http://localhost:3000`. When deploying the API, set it to the exact HTTPS origin serving the frontend.

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public, invite required | Register as a student or teacher using the matching single-use invitation |
| POST | `/api/auth/login` | Public | Sign in |
| POST | `/api/auth/logout` | Signed in | End the session |
| GET | `/api/me` | Signed in | Current user and role |
| GET, POST | `/api/subjects` | Teacher | List/create subjects and sections |
| POST | `/api/subjects/:subjectId/sections` | Teacher | Create a section |
| POST | `/api/sections/:sectionId/students` | Teacher | Enroll a student by LRN |
| POST | `/api/students/:learnerId/invite` | Teacher | Issue a single-use student registration token |
| POST | `/api/teachers/invite` | Teacher | Issue a single-use invite bound to a teacher email |
| GET | `/api/students` | Teacher | Students in the teacher's classes |
| GET, PUT | `/api/sections/:sectionId/grades` | Teacher | Read/save grades; PUT accepts `{ "period": 1, "entries": [{ "learnerId": "123456789012", "score": 92 }], "publish": false }` |
| GET | `/api/student/records` | Student | Published academic records only |
| GET | `/api/student/sections` | Student | Enrolled active class sections |
| GET, POST | `/api/notifications`, `/api/notifications/read` | Signed in | Read notifications and mark them as read |
| GET | `/api/sections/:sectionId/attendance?date=YYYY-MM-DD` | Teacher or enrolled student | Daily attendance |
| GET | `/api/sections/:sectionId/attendance?start=YYYY-MM-DD&end=YYYY-MM-DD` | Teacher or enrolled student | Attendance for a selected week/month/semester range |
| GET | `/api/sections/:sectionId/attendance?month=YYYY-MM` | Teacher or enrolled student | Monthly attendance |
| PUT | `/api/sections/:sectionId/attendance/daily` | Teacher | Save a complete class roll call |
| PUT | `/api/sections/:sectionId/attendance/monthly` | Teacher | Save monthly summaries |
| GET, POST | `/api/announcements` | Signed in / teacher | Read audience-filtered updates and publish updates |
| GET | `/api/dashboard` | Signed in | Role-specific dashboard counts |
| GET | `/api/trash` | Teacher | List recoverable subjects and sections |
| DELETE | `/api/subjects/:subjectId`, `/api/sections/:sectionId` | Teacher | Move item to 90-day trash |
| POST, DELETE | `/api/trash/:kind/:id/restore`, `/api/trash/:kind/:id` | Teacher | Restore or permanently delete |

## Before using real school data

- Test the end-to-end teacher and student flows with a dedicated development database and non-sensitive test data. Session restoration, expired sessions, and API errors are handled by the frontend.
- Remove the browser demo buttons and sample-data paths from the production UI before launch.
- Provision the first teacher account through an authorized school process; signed-in teachers can invite additional teachers.
- Deploy the API and frontend to a hosting provider if users need to access them from outside your computer. Keep PostgreSQL private; only the backend should receive its connection string.
- Use HTTPS, restricted database access where the provider allows it, automated backups, least-privilege database credentials, and a documented retention/access policy.
- Have the school review privacy, consent, data-retention, and incident-response requirements before importing learner records.
