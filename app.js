const iconPaths = {
  school: '<path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9M9 20v-6h6v6"/><path d="M2 21h20"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
  message: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
  megaphone: '<path d="m3 11 18-5v12L3 13v-2z"/><path d="M11.6 16.8 13 22l4-1-2-4.8M3 11v2a3 3 0 0 0 3 3h2"/>',
  chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-5 5"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="m8.2 13.5-1.2 8 5-3 5 3-1.2-8"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/>'
};
const svg = (name, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[name] || iconPaths.file}</svg>`;
const defaultNotices = [
  { title: 'Welcome to Labogon Portal', body: 'Your school community, all in one place. Explore updates, attendance, and academic records.', time: 'Today', type: 'School update' },
  { title: 'Quarterly assessments', body: 'The first grading period records are now available to view and download.', time: 'Yesterday', type: 'Academic' },
  { title: 'School community day', body: 'Join us this Friday for a day of learning, activities, and community.', time: '2 days ago', type: 'Events' }
];
const students = [
  ['Maria Santos','2024-001','MS'],['Joshua Reyes','2024-002','JR'],['Angela Cruz','2024-003','AC'],['Daniel Garcia','2024-004','DG'],['Sofia Mendoza','2024-005','SM'],['Gabriel Flores','2024-006','GF'],['Isabella Ramos','2024-007','IR'],['Nathan Torres','2024-008','NT'],['Chloe Villanueva','2024-009','CV'],['Ethan Bautista','2024-010','EB']
];
const rizalStudents = [
  ['Liam Navarro','2024-011','LN'],['Amara Dizon','2024-012','AD'],['Noah Castillo','2024-013','NC'],['Mia Domingo','2024-014','MD'],['Lucas Herrera','2024-015','LH'],['Ella Mercado','2024-016','EM'],['Caleb Santiago','2024-017','CS'],['Zoe Aquino','2024-018','ZA'],['Isaac Lim','2024-019','IL'],['Maya Valdez','2024-020','MV']
];
const demoStudents=[...students,...rizalStudents];
demoStudents.forEach((student,index)=>{student[3]=`1120260000${String(index+1).padStart(2,'0')}`;});
function studentsForSection(section){return section==='Grade 8 - Rizal'?rizalStudents:students;}
function studentProfileByLrn(learnerId){
 const normalized=String(learnerId||'').replace(/\D/g,'');
 if(!isDemo){
  const profile=storage.get('studentDirectory',[]).find(item=>item.learnerId===normalized);
  return profile?{...profile,initials:profile.initials||initials(profile.name)}:null;
 }
 const seeded=demoStudents.find(student=>student[3]===normalized);
 const account=storage.get('accounts',[]).find(item=>item.role==='student'&&item.learnerId===normalized);
 if(account)return {name:account.name,id:account.studentId||seeded?.[1]||normalized,initials:initials(account.name),learnerId:normalized,email:account.email,section:account.section||(seeded?(students.includes(seeded)?'Grade 8 - Mabini':'Grade 8 - Rizal'):studentSectionForLrn(normalized))};
 if(seeded)return {name:seeded[0],id:seeded[1],initials:seeded[2],learnerId:normalized,email:'',section:students.includes(seeded)?'Grade 8 - Mabini':'Grade 8 - Rizal'};
 return null;
}
function studentSubjectAverage(student,subject){
 const scores=[1,2,3,4].map(period=>Number(storage.get('studentGrades',{})[`${period}:${subject.id}:${selectedSectionId}:${student.learnerId}`])).filter(Number.isFinite);
 return scores.length?(scores.reduce((sum,score)=>sum+score,0)/scores.length).toFixed(1):'—';
}
const subjects = [
  { name:'Mathematics', code:'MAT-8A', sections:2, students:20, icon:'chart' },
  { name:'Science', code:'SCI-8A', sections:2, students:20, icon:'spark' },
  { name:'English', code:'ENG-8A', sections:1, students:10, icon:'book' },
  { name:'Filipino', code:'FIL-8A', sections:1, students:10, icon:'message' },
  { name:'Araling Panlipunan', code:'AP-8A', sections:1, students:10, icon:'school' },
  { name:'Values Education', code:'VE-8A', sections:1, students:10, icon:'award' }
];
const storage = {
  get(key, fallback) {
    if(!isDemo)return Object.prototype.hasOwnProperty.call(memoryStore,key)?memoryStore[key]:fallback;
    try { return JSON.parse(localStorage.getItem(`labogon-${key}`)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    if(!isDemo){memoryStore[key]=value;return;}
    localStorage.setItem(`labogon-${key}`, JSON.stringify(value));
  }
};
let isDemo = false;
const memoryStore = {};
async function apiRequest(path,options={}){
 const response=await fetch(path,{credentials:'same-origin',headers:{'Content-Type':'application/json',...(options.headers||{})},...options});
 if(response.status===204)return null;
 const result=await response.json().catch(()=>({error:'The server returned an invalid response.'}));
 if(!response.ok){const error=new Error(result.error||`Request failed (${response.status}).`);error.status=response.status;throw error;}
 return result;
}
function clearRemoteState(){
 for(const key of ['teacherSubjects','teacherTrash','studentGrades','classGradePublications','attendanceRecords','monthlyAttendance','notices','notifications','studentDirectory','studentRecords','studentSections','dashboard','postedGrades'])delete memoryStore[key];
}
function apiTime(value){
 if(!value)return 'Just now';
 return new Intl.DateTimeFormat('en',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
}
async function loadPortalData(){
 clearRemoteState();
 if(isDemo)return;
 if(user.role==='admin'){
  const [subjectData,studentData,announcementData,notificationData,dashboardData,trashData]=await Promise.all([
   apiRequest('/api/subjects'),apiRequest('/api/students'),apiRequest('/api/announcements'),
   apiRequest('/api/notifications'),apiRequest('/api/dashboard'),apiRequest('/api/trash')
  ]);
  const items=subjectData.subjects.map(subject=>({...subject,icon:subjects.find(seed=>seed.name===subject.name)?.icon||'book',sections:subject.sections.map(section=>({
   ...section,studentLRNs:section.students.map(student=>student.learnerId.trim()),studentNames:Object.fromEntries(section.students.map(student=>[student.learnerId.trim(),student.name]))
  }))}));
  storage.set('teacherSubjects',items);
  storage.set('studentDirectory',studentData.students.map(student=>({id:student.studentId||student.learnerId.trim(),learnerId:student.learnerId.trim(),name:student.name,email:student.email||'',section:'',initials:initials(student.name)})));
  storage.set('notices',announcementData.announcements.map(item=>({...item,time:apiTime(item.createdAt),targetStudentId:item.targetLearnerId||''})));
  storage.set('notifications',notificationData.notifications);
  storage.set('dashboard',dashboardData);
  storage.set('teacherTrash',trashData.items.map(item=>({...item,deletedAt:new Date(item.deletedAt).getTime(),expiresAt:new Date(item.expiresAt).getTime()})));
  const grades={},publications={},daily={},monthly={};
  const today=localDateISO(),schoolYearStart=`${Number(schoolYear().slice(0,4))}-07-01`,month=attendanceMonth;
  const sections=items.flatMap(subject=>subject.sections.map(section=>({subject,section})));
  await Promise.all(sections.flatMap(({subject,section})=>[
   ...[1,2,3,4].map(async period=>{
    const data=await apiRequest(`/api/sections/${section.id}/grades?period=${period}`);
    data.grades.forEach(entry=>{if(entry.score!==null)grades[`${period}:${subject.id}:${section.id}:${entry.learnerId.trim()}`]=Number(entry.score);});
    if(data.published)publications[`${period}:${subject.id}:${section.id}`]=true;
   }),
   (async()=>{
    const [dailyData,monthlyData]=await Promise.all([
     apiRequest(`/api/sections/${section.id}/attendance?start=${schoolYearStart}&end=${today}`),
     apiRequest(`/api/sections/${section.id}/attendance?month=${month}`)
    ]);
    dailyData.attendance.forEach(record=>{const learnerId=record.learnerId.trim();daily[`${section.id}|${record.date}`]={...(daily[`${section.id}|${record.date}`]||{}),[learnerId]:{status:record.status,recordedBy:record.recordedBy||'Teacher'}};});
    monthly[`${section.id}|${month}`]={...(monthly[`${section.id}|${month}`]||{}),...Object.fromEntries(monthlyData.attendance.map(record=>[record.learnerId.trim(),{present:record.present,absentDays:record.absentDays,recordedBy:record.recordedBy||'Teacher'}]))};
   })()
  ]));
  storage.set('studentGrades',grades);
  storage.set('classGradePublications',publications);
  storage.set('attendanceRecords',daily);
  storage.set('monthlyAttendance',monthly);
  storage.set('postedGrades',[1,2,3,4].map(period=>sections.some(({subject,section})=>publications[`${period}:${subject.id}:${section.id}`])));
 }else{
  const [sectionData,recordData,announcementData,notificationData,dashboardData]=await Promise.all([
   apiRequest('/api/student/sections'),apiRequest('/api/student/records'),apiRequest('/api/announcements'),
   apiRequest('/api/notifications'),apiRequest('/api/dashboard')
  ]);
  const grouped=new Map();
  for(const entry of sectionData.sections){
   let subject=grouped.get(entry.subjectId);
   if(!subject){subject={id:entry.subjectId,name:entry.subject,code:entry.code,icon:subjects.find(seed=>seed.name===entry.subject)?.icon||'book',sections:[]};grouped.set(entry.subjectId,subject);}
   subject.sections.push({id:entry.id,name:entry.name,studentLRNs:[user.learnerId],studentNames:{[user.learnerId]:user.name}});
  }
  const items=[...grouped.values()];
  user.section=items[0]?.sections[0]?.name||'';
  storage.set('teacherSubjects',items);
  storage.set('studentSections',sectionData.sections);
  storage.set('studentRecords',recordData.records);
  const grades={},publications={};
  recordData.records.forEach(record=>{
   const learnerId=user.learnerId;
   grades[`${record.period}:${record.subjectId}:${record.sectionId}:${learnerId}`]=Number(record.score);
   publications[`${record.period}:${record.subjectId}:${record.sectionId}`]=true;
  });
  storage.set('studentGrades',grades);
  storage.set('classGradePublications',publications);
  storage.set('postedGrades',[1,2,3,4].map(period=>recordData.records.some(record=>record.period===period)));
  storage.set('notices',announcementData.announcements.map(item=>({...item,time:apiTime(item.createdAt),targetStudentId:item.targetLearnerId||''})));
  storage.set('notifications',notificationData.notifications);
  storage.set('dashboard',dashboardData);
  const today=localDateISO(),schoolYearStart=`${Number(schoolYear().slice(0,4))}-07-01`;
  const daily={},monthly={};
  await Promise.all(sectionData.sections.map(async section=>{
   const [dailyData,monthlyData]=await Promise.all([
    apiRequest(`/api/sections/${section.id}/attendance?start=${schoolYearStart}&end=${today}`),
    apiRequest(`/api/sections/${section.id}/attendance?month=${studentAttendanceMonth}`)
   ]);
   dailyData.attendance.forEach(record=>{daily[`${section.name}|${record.date}`]={[user.learnerId]:{status:record.status,recordedBy:record.recordedBy||'Teacher'}};});
   const entry=monthlyData.attendance[0];
   if(entry)monthly[`${section.name}|${studentAttendanceMonth}`]={[user.learnerId]:{present:entry.present,absentDays:entry.absentDays,recordedBy:entry.recordedBy||'Teacher'}};
  }));
  storage.set('attendanceRecords',daily);
  storage.set('monthlyAttendance',monthly);
 }
}
async function refreshGrades(){
 if(isDemo)return;
 if(user.role==='student'){
  const data=await apiRequest('/api/student/records');
  const grades={},publications={};
  data.records.forEach(record=>{
   grades[`${record.period}:${record.subjectId}:${record.sectionId}:${user.learnerId}`]=Number(record.score);
   publications[`${record.period}:${record.subjectId}:${record.sectionId}`]=true;
  });
  storage.set('studentRecords',data.records);storage.set('studentGrades',grades);storage.set('classGradePublications',publications);
  storage.set('postedGrades',[1,2,3,4].map(period=>data.records.some(record=>record.period===period)));
  return;
 }
 const subject=allSubjects().find(item=>item.id===selectedSubject?.id);
 const section=subject?.sections?.find(item=>item.id===selectedSectionId);
 if(!section)return;
 const period=Number(storage.get('selectedGradePeriod',1));
 const data=await apiRequest(`/api/sections/${section.id}/grades?period=${period}`);
 const grades=storage.get('studentGrades',{});
 const publications=storage.get('classGradePublications',{});
 for(const key of Object.keys(grades))if(key.startsWith(`${period}:${subject.id}:${section.id}:`))delete grades[key];
 data.grades.forEach(entry=>{if(entry.score!==null)grades[`${period}:${subject.id}:${section.id}:${entry.learnerId.trim()}`]=Number(entry.score);});
 const key=`${period}:${subject.id}:${section.id}`;
 if(data.published)publications[key]=true;else delete publications[key];
 storage.set('studentGrades',grades);storage.set('classGradePublications',publications);
}
async function refreshNotifications(){
 if(isDemo)return;
 const data=await apiRequest('/api/notifications');
 storage.set('notifications',data.notifications);
}
function attendanceDateRange(range){
 const today=new Date();today.setHours(0,0,0,0);
 const start=new Date(today);
 if(range==='This week')start.setDate(today.getDate()-((today.getDay()+6)%7));
 else if(range==='This month')start.setDate(1);
 else start.setFullYear(today.getFullYear(),today.getMonth()>=6?6:0,1);
 return {start:localDateISO(start),end:localDateISO(today)};
}
async function refreshAttendance(){
 if(isDemo)return;
 if(user.role==='admin'){
  const items=allSubjects().flatMap(subject=>subject.sections.map(section=>({subject,section})));
  if(activePage==='attendance-roster'&&attendanceSectionId){
   const current=items.find(item=>item.section.id===attendanceSectionId);
   if(!current)return;
   const [dailyData,monthlyData]=await Promise.all([
    apiRequest(`/api/sections/${current.section.id}/attendance?date=${attendanceDate}`),
    apiRequest(`/api/sections/${current.section.id}/attendance?month=${attendanceMonth}`)
   ]);
   const daily=storage.get('attendanceRecords',{}),monthly=storage.get('monthlyAttendance',{});
   daily[`${current.section.id}|${attendanceDate}`]=Object.fromEntries(dailyData.attendance.map(record=>[record.learnerId.trim(),{status:record.status,recordedBy:record.recordedBy||'Teacher'}]));
   monthly[`${current.section.id}|${attendanceMonth}`]=Object.fromEntries(monthlyData.attendance.map(record=>[record.learnerId.trim(),{present:record.present,absentDays:record.absentDays,recordedBy:record.recordedBy||'Teacher'}]));
   storage.set('attendanceRecords',daily);storage.set('monthlyAttendance',monthly);
  }else{
   const month=await Promise.all(items.map(async({section})=>{
    const data=await apiRequest(`/api/sections/${section.id}/attendance?month=${attendanceMonth}`);
    return [`${section.id}|${attendanceMonth}`,Object.fromEntries(data.attendance.map(record=>[record.learnerId.trim(),{present:record.present,absentDays:record.absentDays,recordedBy:record.recordedBy||'Teacher'}]))];
   }));
   storage.set('monthlyAttendance',Object.fromEntries(month));
  }
  return;
 }
 const sections=storage.get('studentSections',[]);
 const range=attendanceDateRange(attendanceRange);
 const daily={},monthly={};
 await Promise.all(sections.map(async section=>{
  const [dailyData,monthlyData]=await Promise.all([
   apiRequest(`/api/sections/${section.id}/attendance?start=${range.start}&end=${range.end}`),
   apiRequest(`/api/sections/${section.id}/attendance?month=${studentAttendanceMonth}`)
  ]);
  dailyData.attendance.forEach(record=>{daily[`${section.name}|${record.date}`]={[user.learnerId]:{status:record.status,recordedBy:record.recordedBy||'Teacher'}};});
  const entry=monthlyData.attendance[0];
  if(entry)monthly[`${section.name}|${studentAttendanceMonth}`]={[user.learnerId]:{present:entry.present,absentDays:entry.absentDays,recordedBy:entry.recordedBy||'Teacher'}};
 }));
 storage.set('attendanceRecords',daily);storage.set('monthlyAttendance',monthly);
}
function allSubjects(){
 const saved=storage.get('teacherSubjects',null);
 if(saved)return saved;
 if(!isDemo)return [];
 return subjects.map((subject,index)=>({...subject,id:`seed-${index+1}`,sections:Array.from({length:subject.sections},(_,sectionIndex)=>{
  const sectionName=`Grade 8 - ${sectionIndex===0?'Mabini':'Rizal'}`;
  const roster=studentsForSection(sectionName);
  return {id:`seed-${index+1}-${sectionIndex+1}`,name:sectionName,studentLRNs:roster.map(student=>student[3]),studentNames:{}};
 })}));
}
const trashRetentionDays=90;
function readTrash(){
 if(!isDemo)return storage.get('teacherTrash',[]).filter(item=>item.expiresAt>Date.now());
 const now=Date.now(),items=storage.get('teacherTrash',[]),active=items.filter(item=>item.expiresAt>now);
 if(active.length!==items.length)storage.set('teacherTrash',active);
 return active;
}
function saveTrashItem(item){const items=readTrash();items.unshift(item);storage.set('teacherTrash',items);}
function relatedClassData(subjectId,sections){
 const grades=storage.get('studentGrades',{}),publications=storage.get('classGradePublications',{}),attendance=storage.get('attendanceRecords',{}),monthly=storage.get('monthlyAttendance',{});
 const sectionIds=new Set(sections.map(section=>section.id)),unusedNames=new Set(sections.map(section=>section.name).filter(name=>!allAttendanceSections().includes(name)));
 const snapshot={grades:{},publications:{},attendance:{},monthly:{}};
 for(const [key,value] of Object.entries(grades)){const parts=key.split(':');if(parts[1]===subjectId&&sectionIds.has(parts[2])){snapshot.grades[key]=value;delete grades[key];}}
 for(const [key,value] of Object.entries(publications)){const parts=key.split(':');if(parts[1]===subjectId&&sectionIds.has(parts[2])){snapshot.publications[key]=value;delete publications[key];}}
 for(const name of unusedNames){
  for(const [key,value] of Object.entries(attendance))if(key.startsWith(`${name}|`)){snapshot.attendance[key]=value;delete attendance[key];}
  for(const [key,value] of Object.entries(monthly))if(key.startsWith(`${name}|`)){snapshot.monthly[key]=value;delete monthly[key];}
 }
 storage.set('studentGrades',grades);storage.set('classGradePublications',publications);storage.set('attendanceRecords',attendance);storage.set('monthlyAttendance',monthly);
 return snapshot;
}
function restoreClassData(snapshot){
 for(const [key,value] of Object.entries(snapshot?.grades||{})){const records=storage.get('studentGrades',{});if(!(key in records))records[key]=value;storage.set('studentGrades',records);}
 for(const [key,value] of Object.entries(snapshot?.publications||{})){const records=storage.get('classGradePublications',{});if(!(key in records))records[key]=value;storage.set('classGradePublications',records);}
 for(const [key,value] of Object.entries(snapshot?.attendance||{})){const records=storage.get('attendanceRecords',{});if(!(key in records))records[key]=value;storage.set('attendanceRecords',records);}
 for(const [key,value] of Object.entries(snapshot?.monthly||{})){const records=storage.get('monthlyAttendance',{});if(!(key in records))records[key]=value;storage.set('monthlyAttendance',records);}
}
function moveSubjectToTrash(subjectId){
 if(!isDemo){
  return apiRequest(`/api/subjects/${encodeURIComponent(subjectId)}`,{method:'DELETE'}).then(async()=>{
   if(selectedSubject?.id===subjectId){selectedSubject=null;selectedSection=null;selectedSectionId=null;activePage='subjects';}
   await loadPortalData();render();showToast('Subject moved to Recently deleted.');
  }).catch(error=>showToast(error.message));
 }
 const items=allSubjects(),index=items.findIndex(subject=>subject.id===subjectId);
 if(index<0){showToast('This subject is no longer in your teaching load.');return;}
 const [subject]=items.splice(index,1);saveSubjects(items);
 const deletedAt=Date.now();
 saveTrashItem({id:`trash-${deletedAt}-${Math.random().toString(36).slice(2,8)}`,kind:'subject',name:subject.name,subject,relatedData:relatedClassData(subject.id,subject.sections||[]),deletedAt,expiresAt:deletedAt+trashRetentionDays*24*60*60*1000});
 if(selectedSubject?.id===subjectId){selectedSubject=null;selectedSection=null;selectedSectionId=null;activePage='subjects';}
 render();showToast(`${subject.name} moved to Recently deleted.`);
}
function moveSectionToTrash(subjectId,sectionId){
 if(!isDemo){
  return apiRequest(`/api/sections/${encodeURIComponent(sectionId)}`,{method:'DELETE'}).then(async()=>{
   if(selectedSectionId===sectionId){selectedSection=null;selectedSectionId=null;activePage='sections';}
   await loadPortalData();render();showToast('Section moved to Recently deleted.');
  }).catch(error=>showToast(error.message));
 }
 const items=allSubjects(),subject=items.find(item=>item.id===subjectId),index=subject?.sections?.findIndex(section=>section.id===sectionId)??-1;
 if(index<0){showToast('This section is no longer in this subject.');return;}
 const [section]=subject.sections.splice(index,1);saveSubjects(items);
 const deletedAt=Date.now();
 saveTrashItem({id:`trash-${deletedAt}-${Math.random().toString(36).slice(2,8)}`,kind:'section',name:section.name,subjectId,subjectName:subject.name,section,relatedData:relatedClassData(subjectId,[section]),deletedAt,expiresAt:deletedAt+trashRetentionDays*24*60*60*1000});
 if(selectedSectionId===sectionId){selectedSection=null;selectedSectionId=null;activePage='sections';}
 render();showToast(`${section.name} moved to Recently deleted.`);
}
function confirmDeleteSubject(subjectId){
 const subject=allSubjects().find(item=>item.id===subjectId);
 if(!subject)return;
 showModal(`<div class="modal-header"><div><p class="eyebrow">CONFIRM DELETION</p><h2>Move this subject to Recently deleted?</h2><p>${safe(subject.name)} and its sections will be removed from your active teaching list.</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="update-detail"><p>This subject and its saved grade files will be recoverable for 90 days. After that, they will be deleted permanently.</p></div><div class="modal-actions"><button class="button" data-close>Cancel</button><button class="button danger-button" data-trash-action="delete-subject" data-trash-id="${safe(subject.id)}">Move to Recently deleted</button></div>`);
}
function confirmDeleteSection(subjectId,sectionId){
 const subject=allSubjects().find(item=>item.id===subjectId),section=subject?.sections?.find(item=>item.id===sectionId);
 if(!subject||!section)return;
 showModal(`<div class="modal-header"><div><p class="eyebrow">CONFIRM DELETION</p><h2>Move this section to Recently deleted?</h2><p>${safe(section.name)} in ${safe(subject.name)} will be removed from this class.</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="update-detail"><p>This section and its saved grade files will be recoverable for 90 days. After that, they will be deleted permanently.</p></div><div class="modal-actions"><button class="button" data-close>Cancel</button><button class="button danger-button" data-trash-action="delete-section" data-trash-id="${safe(subject.id)}" data-trash-section-id="${safe(section.id)}">Move to Recently deleted</button></div>`);
}
function restoreTrashItem(itemId){
 if(!isDemo){
  const item=readTrash().find(entry=>entry.id===itemId);
  if(!item)return;
  return apiRequest(`/api/trash/${item.kind}/${encodeURIComponent(itemId)}/restore`,{method:'POST'}).then(async()=>{
   await loadPortalData();
   selectedSubject=item.kind==='section'?allSubjects().find(subject=>subject.id===item.subjectId)||null:null;
   selectedSection=item.kind==='section'?item.name:null;selectedSectionId=null;
   activePage=item.kind==='subject'?'subjects':'sections';render();showToast(`${item.name} restored.`);
  }).catch(error=>showToast(error.message));
 }
 const items=readTrash(),index=items.findIndex(item=>item.id===itemId);
 if(index<0){showToast('This deleted item has expired or is no longer available.');render();return;}
 const item=items[index],subjectsNow=allSubjects();
 if(item.kind==='subject'){
  if(subjectsNow.some(subject=>subject.id===item.subject.id)){showToast('This subject is already active.');return;}
  subjectsNow.push(item.subject);saveSubjects(subjectsNow);restoreClassData(item.relatedData);activePage='subjects';selectedSubject=null;selectedSection=null;selectedSectionId=null;
 }else{
  const parent=subjectsNow.find(subject=>subject.id===item.subjectId);
  if(!parent){showToast('Restore the parent subject before restoring this section.');return;}
  if((parent.sections||[]).some(section=>section.id===item.section.id)){showToast('This section is already active.');return;}
  parent.sections=parent.sections||[];parent.sections.push(item.section);saveSubjects(subjectsNow);restoreClassData(item.relatedData);activePage='sections';selectedSubject=parent;selectedSection=null;selectedSectionId=null;
 }
 items.splice(index,1);storage.set('teacherTrash',items);render();showToast(`${item.name} restored.`);
}
function permanentlyDeleteTrashItem(itemId){
 if(!isDemo){
  const item=readTrash().find(entry=>entry.id===itemId);
  if(!item)return;
  return apiRequest(`/api/trash/${item.kind}/${encodeURIComponent(itemId)}`,{method:'DELETE'}).then(async()=>{
   await loadPortalData();render();showToast(`${item.name} permanently deleted.`);
  }).catch(error=>showToast(error.message));
 }
 const items=readTrash(),index=items.findIndex(item=>item.id===itemId);
 if(index<0){showToast('This deleted item has expired or is no longer available.');render();return;}
 const [item]=items.splice(index,1);storage.set('teacherTrash',items);render();showToast(`${item.name} and its archived class files were permanently deleted.`);
}
function studentSectionForLrn(learnerId){
 for(const subject of allSubjects())for(const section of subject.sections||[])if(section.studentLRNs?.includes(learnerId))return section.name;
 return '';
}
function saveSubjects(items){storage.set('teacherSubjects',items);}
function rosterForClass(subjectId,sectionId){
 const subject=allSubjects().find(item=>item.id===subjectId);
 const section=subject?.sections?.find(item=>item.id===sectionId);
 if(!section)return [];
 return (section.studentLRNs||[]).map(learnerId=>studentProfileByLrn(learnerId)||{name:section.studentNames?.[learnerId]||'Student profile pending',id:learnerId,initials:'ST',learnerId,section:section.name,email:''});
}
function attendanceRosterForSection(sectionName){
 const entries=[];
 for(const subject of allSubjects())for(const section of subject.sections||[])if(section.name===sectionName)entries.push(...rosterForClass(subject.id,section.id));
 return [...new Map(entries.map(student=>[student.learnerId,student])).values()];
}
function allAttendanceSections(){
 return [...new Set(allSubjects().flatMap(subject=>(subject.sections||[]).map(section=>section.name)))];
}
function studentClassEnrollments(learnerId){
 return allSubjects().flatMap(subject=>(subject.sections||[]).filter(section=>section.studentLRNs?.includes(learnerId)).map(section=>({subject,section})));
}
function studentDirectory(){
 if(!isDemo)return storage.get('studentDirectory',[]);
 const learnerIds=new Set(demoStudents.map(student=>student[3]));
 for(const account of storage.get('accounts',[]))if(account.role==='student'&&account.learnerId)learnerIds.add(account.learnerId);
 for(const subject of allSubjects())for(const section of subject.sections||[])for(const learnerId of section.studentLRNs||[])learnerIds.add(learnerId);
 return [...learnerIds].map(learnerId=>{
  const profile=studentProfileByLrn(learnerId);
  if(profile)return profile;
  for(const subject of allSubjects())for(const section of subject.sections||[])if(section.studentNames?.[learnerId])return {learnerId,id:learnerId,name:section.studentNames[learnerId],initials:initials(section.studentNames[learnerId]),email:''};
  return null;
 }).filter(Boolean);
}
function manuallyAddedStudentName(learnerId){
 for(const subject of allSubjects())for(const section of subject.sections||[])if(section.studentNames?.[learnerId])return section.studentNames[learnerId];
 return '';
}
function currentStudentSection(){return user?.section||studentSectionForLrn(user?.learnerId||'')||(isDemo?'Grade 8 - Mabini':'');}
let user = null;
let activePage = 'overview';
let selectedSubject = null;
let selectedSection = null;
let selectedSectionId = null;
let subjectFormOpen = false;
let sectionFormOpen = false;
let authMode = 'login';
let signupRole = 'student';
let attendanceRange = 'This week';
let attendanceDate = localDateISO();
let attendanceSection = null;
let attendanceSectionId = null;
let attendanceSubjectId = null;
let attendanceMonth = localDateISO().slice(0,7);
let studentAttendanceMonth = localDateISO().slice(0,7);
let attendanceMode = 'monthly';
let toastTimer;
const app = document.getElementById('app');

function initials(name='Labogon Student') { return name.split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase(); }
function safe(value='') { return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
function notices() {
 const items=storage.get('notices',defaultNotices);
 if(!isDemo)return items;
 if(user?.role!=='student')return items;
 const studentId=user.studentId||'';
 return items.filter(item=>!item.targetStudentId||item.targetStudentId===studentId);
}
function postedGrades() { return storage.get('postedGrades', isDemo?[true,false,false,false]:[false,false,false,false]); }
function displayDate() { return new Intl.DateTimeFormat('en',{weekday:'long',month:'long',day:'numeric'}).format(new Date()); }
function schoolYear() { const now=new Date(),year=now.getFullYear(),start=now.getMonth()>=6?year:year-1;return `${start}–${start+1}`; }
function localDateISO(date=new Date()){const year=date.getFullYear(),month=String(date.getMonth()+1).padStart(2,'0'),day=String(date.getDate()).padStart(2,'0');return `${year}-${month}-${day}`;}

function renderAuth() {
  app.innerHTML = `<div class="auth-shell">
    <section class="auth-side">
      <a class="brand" href="#" aria-label="Labogon School Portal">${brandMarkup()}</a>
      <div class="auth-copy"><p class="eyebrow">A brighter way to learn</p><h1>Your school, a little closer.</h1><p>Stay connected to your classes, your community, and every milestone along the way.</p>
        <div class="auth-bullets"><div class="auth-bullet"><span>✓</span>School updates in one place</div><div class="auth-bullet"><span>✓</span>Attendance and academic records</div><div class="auth-bullet"><span>✓</span>A stronger school community</div></div>
      </div>
      <div class="auth-side-foot">© 2025 Labogon School · Learning together</div>
    </section>
    <section class="auth-main"><div class="auth-card">
      <div class="auth-switch"><button class="auth-tab ${authMode==='login'?'active':''}" data-auth-mode="login">Sign in</button><button class="auth-tab ${authMode==='signup'?'active':''}" data-auth-mode="signup">Create account</button></div>
      <h2>${authMode==='login'?'Welcome back':'Join your school'}</h2><p>${authMode==='login'?'Sign in to continue to your portal.':'Create a student or teacher account using an invitation from your school.'}</p>
      <form class="auth-form" id="auth-form">
        ${authMode==='signup'?`<div class="field-wrap"><label class="field-label" for="auth-name">Full name</label><input class="field-input" id="auth-name" name="name" placeholder="e.g. Alex Santos" required /></div>`:''}
        ${authMode==='signup'?`<div class="field-wrap"><label class="field-label" for="auth-role">Account type</label><select class="field-select" id="auth-role" name="role"><option value="student" ${signupRole==='student'?'selected':''}>Student</option><option value="teacher" ${signupRole==='teacher'?'selected':''}>Teacher</option></select></div>`:''}
        ${authMode==='signup'?`<div class="field-wrap ${signupRole==='teacher'?'hidden':''}" id="auth-lrn-wrap"><label class="field-label" for="auth-lrn">Learner Reference Number (LRN)</label><input class="field-input" id="auth-lrn" name="learnerId" inputmode="numeric" autocomplete="off" placeholder="12-digit LRN" pattern="[0-9]{12}" maxlength="12" ${signupRole==='student'?'required':''} /><small class="field-hint">A teacher must enroll students and give them an invitation first.</small></div><div class="field-wrap"><label class="field-label" for="auth-invite">Invitation token</label><input class="field-input" id="auth-invite" name="inviteToken" autocomplete="off" required placeholder="${signupRole==='teacher'?'Paste your teacher invitation token':'Paste your student invitation token'}" /><small class="field-hint" id="auth-invite-hint">${signupRole==='teacher'?'Ask an existing teacher to invite you using this email address.':'Ask your teacher for a student invitation.'}</small></div>`:''}
        <div class="field-wrap"><label class="field-label" for="auth-email">School email</label><input class="field-input" id="auth-email" name="email" type="email" placeholder="you@labogon.edu.ph" required /></div>
        <div class="field-wrap"><label class="field-label" for="auth-password">Password</label><input class="field-input" id="auth-password" name="password" type="password" placeholder="${authMode==='signup'?'Choose a strong password':'Enter your password'}" minlength="10" required /></div>
        <div id="auth-error"></div>
        <button class="button button-primary" type="submit">${authMode==='login'?'Sign in to portal':'Create account'} ${svg('arrow')}</button>
      </form>
      ${authMode==='login'?`<div class="auth-divider">OR TRY A DEMO ACCOUNT</div><div class="demo-buttons"><button class="button" data-demo-role="student">${svg('users')} Student demo</button><button class="button" data-demo-role="admin">${svg('school')} Admin demo</button></div><p class="auth-hint">Demo access is for preview only. Changes you make are saved in this browser.</p>`:''}
      <div class="auth-footer">Need help? Contact your school administrator</div>
    </div></section>
  </div>`;
  app.querySelectorAll('[data-auth-mode]').forEach(button=>button.addEventListener('click',()=>{authMode=button.dataset.authMode;renderAuth();}));
  app.querySelectorAll('[data-demo-role]').forEach(button=>button.addEventListener('click',()=>loginDemo(button.dataset.demoRole)));
  document.getElementById('auth-role')?.addEventListener('change',event=>{
   signupRole=event.target.value;
   const isStudent=signupRole==='student';
   const learnerInput=document.getElementById('auth-lrn');
   const inviteInput=document.getElementById('auth-invite');
   const inviteHint=document.getElementById('auth-invite-hint');
   document.getElementById('auth-lrn-wrap')?.classList.toggle('hidden',!isStudent);
   if(learnerInput)learnerInput.required=isStudent;
   if(inviteInput)inviteInput.placeholder=`Paste your ${isStudent?'student':'teacher'} invitation token`;
   if(inviteHint)inviteHint.textContent=isStudent?'Ask your teacher for a student invitation.':'Ask an existing teacher to invite you using this email address.';
  });
  app.querySelector('#auth-form').addEventListener('submit',submitBackendAuth);
}
function brandMarkup() { return `<span class="brand-mark">${svg('school')}</span><span><span class="brand-name">LABOGON SCHOOL</span><span class="brand-sub">LEARNING COMMUNITY</span></span>`; }
function loginDemo(role) {
  isDemo=true;
  clearRemoteState();
  user = role==='admin' ? {name:'Teacher Alex Rivera', email:'teacher@labogon.edu.ph', role:'admin'} : {name:'Maria Santos', email:'maria@labogon.edu.ph', role:'student',studentId:'2024-001',learnerId:students[0][3],section:'Grade 8 - Mabini'};
  activePage='overview'; render();
}
function submitAuth(event) {
  event.preventDefault();
  return;
  const form=new FormData(event.currentTarget);
  const email=String(form.get('email')||'').trim();
  const password=String(form.get('password')||'');
  if(!email||password.length<4) { document.getElementById('auth-error').innerHTML='<div class="auth-error">Please enter a valid email and a password of at least 4 characters.</div>'; return; }
  if(authMode==='signup') {
    const name=String(form.get('name')||'').trim();
    const role=String(form.get('role')||'student');
    const learnerId=String(form.get('learnerId')||'').replace(/\D/g,'');
    if(!name) return;
    const accounts=storage.get('accounts',[]);
    if(accounts.some(account=>account.email.toLowerCase()===email.toLowerCase())) { document.getElementById('auth-error').innerHTML='<div class="auth-error">An account with this email already exists. Please sign in instead.</div>'; return; }
    if(role==='student'){
      if(!/^\d{12}$/.test(learnerId)){document.getElementById('auth-error').innerHTML='<div class="auth-error">Enter your 12-digit LRN to create a student account.</div>';return;}
      const duplicate=accounts.find(account=>account.role==='student'&&account.learnerId===learnerId);
      if(duplicate){document.getElementById('auth-error').innerHTML='<div class="auth-error">An account already uses this LRN. Please sign in or contact your school administrator.</div>';return;}
      const seeded=studentProfileByLrn(learnerId);
      if(seeded&&seeded.name.toLowerCase()!==name.toLowerCase()){document.getElementById('auth-error').innerHTML='<div class="auth-error">That LRN is already linked to a different student profile.</div>';return;}
      const previouslyEnteredName=manuallyAddedStudentName(learnerId);
      if(previouslyEnteredName&&previouslyEnteredName.toLowerCase()!==name.toLowerCase()){document.getElementById('auth-error').innerHTML='<div class="auth-error">The name for this LRN does not match the class roster. Ask your teacher to verify the student profile.</div>';return;}
      const rosterStudent=demoStudents.find(student=>student[3]===learnerId);
      user={name,email,role,learnerId,studentId:rosterStudent?.[1]||learnerId,section:rosterStudent?(students.includes(rosterStudent)?'Grade 8 - Mabini':'Grade 8 - Rizal'):studentSectionForLrn(learnerId)};
    }else user={name,email,role};
    accounts.push({name,email,password,role,...(role==='student'?{learnerId,studentId:user.studentId,section:user.section}:{})});storage.set('accounts',accounts);
  } else {
    const account=storage.get('accounts',[]).find(item=>item.email.toLowerCase()===email.toLowerCase()&&item.password===password);
    if(account) {const rosterStudent=account.role==='student'?demoStudents.find(student=>student[3]===account.learnerId):null;user={name:account.name,email:account.email,role:account.role,learnerId:account.learnerId,studentId:account.studentId||rosterStudent?.[1]||account.learnerId,section:account.section|| (rosterStudent?(students.includes(rosterStudent)?'Grade 8 - Mabini':'Grade 8 - Rizal'):studentSectionForLrn(account.learnerId||''))};}
    else if(email.toLowerCase()==='student@labogon.edu.ph'||email.toLowerCase()==='maria@labogon.edu.ph') user={name:'Maria Santos',email,role:'student',studentId:'2024-001',section:'Grade 8 - Mabini'};
    else if(email.toLowerCase()==='admin@labogon.edu.ph'||email.toLowerCase()==='teacher@labogon.edu.ph') user={name:'Teacher Alex Rivera',email,role:'admin'};
    else { document.getElementById('auth-error').innerHTML='<div class="auth-error">We could not find that demo account. Try the demo buttons or create an account.</div>'; return; }
  }
  storage.set('user',user);activePage='overview';render();
}

async function submitBackendAuth(event){
 event.preventDefault();
 const form=new FormData(event.currentTarget);
 const error=document.getElementById('auth-error');
 const submitButton=event.currentTarget.querySelector('button[type="submit"]');
 const email=String(form.get('email')||'').trim();
 const password=String(form.get('password')||'');
 if(!email||password.length<10){error.innerHTML='<div class="auth-error">Enter your email and a password of at least 10 characters.</div>';return;}
 const body={email,password};
 let endpoint='/api/auth/login';
 if(authMode==='signup'){
  endpoint='/api/auth/register';
  body.role=String(form.get('role')||'student');
  body.name=String(form.get('name')||'').trim();
  if(body.role==='student')body.learnerId=String(form.get('learnerId')||'').replace(/\D/g,'');
  body.inviteToken=String(form.get('inviteToken')||'').trim();
 }
 submitButton.disabled=true;
 error.textContent='';
 try{
  const result=await apiRequest(endpoint,{method:'POST',body:JSON.stringify(body)});
  user=result.user;
  isDemo=false;
 clearRemoteState();
 await loadPortalData();
  activePage='overview';
  render();
 }catch(requestError){
  error.innerHTML=`<div class="auth-error">${safe(requestError.message)}</div>`;
 }finally{
  if(submitButton.isConnected)submitButton.disabled=false;
 }
}

const navStudent=[['overview','Overview','grid'],['updates','School updates','megaphone'],['attendance','Attendance','calendar'],['records','Academic records','book'],['notifications','Notifications','bell']];
const navAdmin=[['overview','Overview','grid'],['updates','School updates','megaphone'],['attendance','Take attendance','calendar'],['subjects','Subjects I handle','book'],['post-update','Post an update','plus'],['notifications','Notifications','bell']];
function render() {
  if(!user){renderAuth();return;}
  const admin=user.role==='admin';
  const pageTitle={overview:'Overview',updates:'School updates',attendance:admin?'Take attendance':'Attendance record','attendance-roster':attendanceSection||'Class attendance',records:'Academic records',notifications:'Notifications',subjects:'Subjects I handle','recently-deleted':'Recently deleted','post-update':'Post a school update',sections:selectedSubject?.name||'Sections',students:selectedSection||'Students'};
  const nav=admin?navAdmin:navStudent;
  const page=activePage;
  app.innerHTML=`<div class="app-shell">
    <div class="mobile-overlay" id="mobile-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <a class="brand" href="#" data-page="overview">${brandMarkup()}</a>
      <div class="nav-label">Workspace</div><nav class="nav-list">${nav.map(([id,label,icon])=>`<button class="nav-item ${page===id||(page==='attendance-roster'&&id==='attendance')?'active':''}" data-page="${id}">${svg(icon)}<span>${label}</span>${id==='notifications'?`<span class="nav-count">${isDemo?notices().length:storage.get('notifications',[]).filter(item=>!item.readAt).length}</span>`:''}</button>`).join('')}</nav>
      <div class="sidebar-spacer"></div>
      <div class="sidebar-card"><strong>${admin?'Daily roll call':'Keep up the good work!'}</strong><p>${admin?'Record attendance for your class and keep student records up to date.':'You’re building a great attendance streak. Keep showing up!'}</p><button data-page="${admin?'attendance':'attendance'}">${admin?'Take attendance':'View attendance'}</button></div>
      <div class="user-mini"><div class="avatar">${initials(user.name)}</div><div class="user-mini-copy"><strong>${safe(user.name)}</strong><span>${admin?'Teacher / Facilitator':safe((user.section||'Grade 8 - Mabini').replace('Grade 8 - ','Grade 8 · Section '))}</span></div><button class="logout" id="logout" title="Sign out">${svg('logout')}</button></div>
    </aside>
    <main class="main-area"><header class="topbar"><div style="display:flex;align-items:center;gap:12px;min-width:0"><button class="icon-button mobile-menu" id="menu-button" aria-label="Open menu">☰</button><div class="crumbs"><span class="crumb-home">Labogon School</span>${svg('chevron')} <strong>${safe(pageTitle[page]||'Overview')}</strong></div></div>
      <div class="top-actions"><span class="top-date">${displayDate()}</span><button class="icon-button" data-page="notifications" aria-label="Notifications">${svg('bell')}<i class="dot"></i></button><div class="avatar">${initials(user.name)}</div></div></header>
      <div class="content" id="content">${renderPage(page,admin)}</div>
    </main></div>`;
  app.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>navigate(button.dataset.page)));
  app.querySelector('#logout').addEventListener('click',async()=>{
    const wasDemo=isDemo;
    try{if(!wasDemo)await apiRequest('/api/auth/logout',{method:'POST'});}
    catch(error){if(error.status!==401){showToast(error.message);return;}}
    user=null;isDemo=false;clearRemoteState();authMode='login';renderAuth();
  });
  app.querySelector('#menu-button').addEventListener('click',()=>{app.querySelector('#sidebar').classList.add('open');app.querySelector('#mobile-overlay').classList.add('show');});
  app.querySelector('#mobile-overlay').addEventListener('click',closeMenu);
  app.querySelector('#invite-teacher')?.addEventListener('click',openTeacherInviteModal);
  bindPageEvents(admin);
}
function closeMenu(){document.getElementById('sidebar')?.classList.remove('open');document.getElementById('mobile-overlay')?.classList.remove('show');}
async function navigate(page){
 activePage=page;closeMenu();render();
 if(isDemo||!user)return;
 try{
  if(page==='attendance'||page==='attendance-roster')await refreshAttendance();
  if(page==='records'||page==='students')await refreshGrades();
  if(page==='notifications')await refreshNotifications();
  render();
 }catch(error){showToast(`Could not load this page: ${error.message}`);}
}
function heading(kicker,title,subtitle,actions=''){return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${actions?`<div class="heading-actions">${actions}</div>`:''}</div>`;}
function hero(admin=false){return `<section class="hero"><div class="hero-content"><span class="hero-tag">${svg('spark')} ${admin?'YOUR CLASSROOM, CONNECTED':'A NOTE FROM YOUR SCHOOL'}</span><h2>${admin?'Good morning, '+safe(user.name.split(' ')[1]||'Teacher')+'.':'A new week, full of possibility.'}</h2><p>${admin?'Your classes are ready. Share an update, check on attendance, or take a look at your students’ progress.':'Every small step adds up. Keep showing up, keep asking questions, and keep being curious.'}</p><div class="hero-meta"><span>${svg('calendar')} ${displayDate()}</span><span>${svg('school')} Labogon School</span></div></div><div class="hero-art"><div class="sun"></div><div class="hill hill-a"></div><div class="hill hill-b"></div><div class="school"></div></div></section>`;}
function announcementMarkup(item,index){const color=item.type==='Academic'?'blue':item.type==='Events'?'orange':'';const clickable=Number.isInteger(index);return `<article class="announcement ${clickable?'announcement-clickable':''}" ${clickable?`data-update-index="${index}" role="button" tabindex="0" aria-label="Read update: ${safe(item.title)}"`:''}><div class="announcement-icon">${svg(item.type==='Academic'?'book':item.type==='Events'?'calendar':'megaphone')}</div><div class="announcement-body"><div class="announcement-meta"><span class="tag ${color}">${safe(item.type||'School update')}</span><time>${safe(item.time||'Just now')}</time></div><h3>${safe(item.title)}</h3><p>${safe(item.body)}</p></div></article>`;}
function overviewPage(admin){
  if(admin){
    const dashboard=isDemo?{students:20,subjects:allSubjects().length,updates:4}:storage.get('dashboard',{});
    const today=localDateISO();
    const attendance=Object.entries(storage.get('attendanceRecords',{})).filter(([key])=>key.endsWith(`|${today}`)).flatMap(([,records])=>Object.values(records));
    const presentToday=attendance.filter(record=>record.status==='Present'||record.status==='Late').length;
    const markedToday=attendance.filter(record=>record.status==='Present'||record.status==='Late'||record.status==='Absent').length;
    return heading('YOUR SCHOOL DAY','Welcome back, '+safe(user.name.split(' ')[1]||'Teacher'),'Here’s what’s happening across your classes today.',`${!isDemo?'<button class="button" id="invite-teacher">Invite a teacher</button>':''}<button class="button button-primary" data-page="post-update">${svg('plus')} Post an update</button>`)+hero(true)+
    `<div class="stats-grid">${stat('users','Students in your classes',String(dashboard.students??0),'Across your classes','LRN-linked rosters')}${stat('book','Subjects you teach',String(dashboard.subjects??0),'Your teaching load','Active subjects')}${stat('calendar','Attendance today',isDemo?'92%':markedToday?`${Math.round(presentToday/markedToday*100)}%`:'—',isDemo?'Across your sections':`${markedToday} records marked`,isDemo?'Good overall':'Teacher-entered records')}${stat('bell','Updates this month',String(dashboard.updates??0),'Shared with students',isDemo?'Last posted 2 days ago':'Published this month')}</div>
    <div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><h2>Your subjects</h2><p>Pick up where you left off</p></div><button class="text-link" data-page="subjects">All subjects →</button></div>${allSubjects().slice(0,3).map(subjectRow).join('')}</section>
    <section class="panel"><div class="panel-header"><div><h2>Recent notifications</h2><p>Stay in the loop</p></div><button class="text-link" data-page="notifications">See all →</button></div>${noticeList(true)}</section></div>`;
  }
  const recent=notices().slice(0,2),dashboard=storage.get('dashboard',{});
  const gradeRecords=storage.get('studentRecords',[]);
  const scoreValues=gradeRecords.map(record=>Number(record.score)).filter(Number.isFinite);
  const average=scoreValues.length?(scoreValues.reduce((sum,value)=>sum+value,0)/scoreValues.length).toFixed(1):'—';
  const monthlyAttendance=attendanceRows('This month');
  const attendanceValue=monthlyAttendance.length?`${attendanceRate('This month')}%`:'—';
  return heading(`${new Intl.DateTimeFormat('en',{weekday:'long'}).format(new Date()).toUpperCase()} · GRADE 8`,'Good morning, '+safe(user.name.split(' ')[0])+'.','Here’s what’s happening in your school community today.')+hero(false)+
    `<div class="stats-grid">${stat('calendar','Attendance this month',attendanceValue,'Recorded school days','Teacher-entered records')}${stat('book','Academic records',`${dashboard.publishedPeriods??0} of 4`,'Published grading periods','Teacher-shared results')}${stat('award','Current average',average,'Across published subjects',scoreValues.length?'From your records':'No published grades')}${stat('bell','New updates',String(dashboard.announcements??0),'Available to you','From your school')}</div>
    <div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><h2>Latest school updates</h2><p>A little news from your school</p></div><button class="text-link" data-page="updates">All updates →</button></div>${recent.map((item,index)=>announcementMarkup(item,index)).join('')}</section>
    <section class="panel"><div class="panel-header"><div><h2>Your attendance</h2><p>This week · School day check-ins</p></div><button class="text-link" data-page="attendance">Details →</button></div>
    <div class="mini-attendance"><div class="ring" style="--percent:${attendanceRate('This week')}%"><strong>${attendanceRate('This week')}%</strong></div><div class="mini-attendance-copy"><strong>Your attendance this week</strong><span>${attendanceRows('This week').filter(row=>row[1]==='Present'||row[1]==='Late').length} days recorded as present or late.</span></div></div><div class="week-strip">${studentWeekDays().map(day=>`<div class="day-pill">${day.label}<div class="day-dot ${day.status==='Absent'?'absent':day.status==='Late'?'late':day.future?'future':''}">${day.date}</div></div>`).join('')}</div></section></div>`;
}
function weekDays(){const today=new Date(),monday=new Date(today);monday.setDate(today.getDate()-((today.getDay()+6)%7));return Array.from({length:7},(_,i)=>{const date=new Date(monday);date.setDate(monday.getDate()+i);return {label:new Intl.DateTimeFormat('en',{weekday:'short'}).format(date)[0],date:date.getDate(),iso:localDateISO(date),future:date>today};});}
function studentWeekDays(){const saved=storage.get('attendanceRecords',{});return weekDays().map(day=>{const status=saved[`${currentStudentSection()}|${day.iso}`]?.[user.learnerId||user.studentId||'']?.status;return {...day,status};});}
function attendanceRate(range){const rows=attendanceRows(range);return rows.length?Math.round(rows.filter(row=>row[1]==='Present'||row[1]==='Late').length/rows.length*100):0;}
function stat(icon,label,value,caption,foot){return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${svg(icon)}</span></div><strong class="stat-value">${value}</strong><div class="stat-foot"><em>${foot}</em> · ${caption}</div></article>`;}
function subjectRow(subject){return `<button class="subject-row" data-subject-id="${safe(subject.id)}"><span class="subject-icon">${svg(subject.icon||'book')}</span><span><strong>${safe(subject.name)}</strong><small>${safe(subject.code||'SUBJECT')} · ${(subject.sections||[]).length} sections</small></span>${svg('chevron')}</button>`;}
function renderPage(page,admin){
  if(page==='overview')return overviewPage(admin);
  if(page==='updates')return updatesPage();
  if(page==='notifications')return notificationsPage(admin);
  if(page==='attendance')return admin?teacherAttendanceSectionsPage():attendancePage();
  if(page==='attendance-roster'&&admin)return teacherAttendanceRosterPage();
  if(page==='records'&&!admin)return recordsPage();
  if(page==='subjects'&&admin)return subjectsPage();
  if(page==='recently-deleted'&&admin)return recentlyDeletedPage();
  if(page==='sections'&&admin)return sectionsPage();
  if(page==='students'&&admin)return studentsPage();
  if(page==='post-update'&&admin)return postUpdatePage();
  return overviewPage(admin);
}
function updatesPage(){return heading('STAY IN THE LOOP','School updates','Select an update to read the full announcement.')+`<div class="feed-list">${notices().map((item,index)=>`<section class="feed-card">${announcementMarkup(item,index)}</section>`).join('')}</div>`;}
function notificationsPage(admin){return heading('YOUR INBOX','Notifications','The latest activity from your classes and school.')+`<div class="panel"><div class="panel-header"><div><h2>Recent activity</h2><p>${admin?'Updates about your students and classes':'Updates about your grades and school community'}</p></div><button class="text-link" id="mark-read">Mark all as read</button></div>${noticeList(admin)}</div>`;}
function noticeList(admin){
 if(!isDemo){
  const items=storage.get('notifications',[]);
  return `<div class="notice-list">${items.length?items.map(item=>`<article class="notice-row notice-clickable ${item.readAt?'':'notice-unread'}" data-notification-action="${safe(item.action||'overview')}" data-notification-id="${safe(item.id)}" ${item.resourceId?`data-resource-id="${safe(item.resourceId)}"`:''} role="button" tabindex="0" aria-label="Open ${safe(item.title)}"><span class="notice-icon">${svg(item.title.toLowerCase().includes('grade')?'book':item.title.toLowerCase().includes('attendance')?'calendar':'megaphone')}</span><div><strong>${safe(item.title)}</strong><span>${safe(item.body)}</span><time>${safe(apiTime(item.createdAt))}</time></div>${svg('chevron')}</article>`).join(''):'<p class="empty-state">You have no notifications yet.</p>'}</div>`;
 }
 const availableUpdates=notices();
 const personal=!admin?availableUpdates.map((item,index)=>({item,index})).filter(({item})=>item.targetStudentId).map(({item,index})=>({title:'A personal update from your teacher',body:item.title,time:item.time,action:'update',updateIndex:index})): [];
 const announcementIndex=availableUpdates.findIndex(item=>item.type==='Events'||item.title.toLowerCase().includes('announcement'));
 const items=admin?[
  {title:'First grading is ready to post',body:'Mathematics · Grade 8 Mabini is waiting for grades.',time:'Today · 9:20 AM',action:'subjects'},
  {title:'A new school announcement',body:'School community day is this Friday.',time:'Yesterday · 2:10 PM',action:'update',updateIndex:announcementIndex},
  {title:'Attendance summary is ready',body:'Your sections’ weekly attendance report is available.',time:'Nov 2 · 4:30 PM',action:'subjects'}
 ]:[
  ...personal,
  {title:'Your first grading is ready',body:'Your teacher has posted your first grading academic records.',time:'Today · 9:20 AM',action:'grade'},
  {title:'A comment from Ms. Rivera',body:'Your teacher left a comment on your progress. Keep up the thoughtful work!',time:'Today · 8:45 AM',action:'records'},
  {title:'New school announcement',body:'School community day is this Friday. See the updates page for details.',time:'Yesterday · 2:10 PM',action:'update',updateIndex:announcementIndex},
  {title:'Attendance record updated',body:'Your attendance has been recorded by your teacher.',time:'Today · 7:14 AM',action:'attendance'}
 ];
 return `<div class="notice-list">${items.map((item,i)=>`<article class="notice-row notice-clickable" data-notification-action="${item.action}" ${Number.isInteger(item.updateIndex)?`data-update-index="${item.updateIndex}"`:''} role="button" tabindex="0" aria-label="Open ${safe(item.title)}"><span class="notice-icon">${svg(item.title.toLowerCase().includes('grade')?'book':item.title.toLowerCase().includes('comment')?'message':item.title.toLowerCase().includes('attendance')?'calendar':'megaphone')}</span><div><strong>${safe(item.title)}</strong><span>${safe(item.body)}</span><time>${safe(item.time)}</time></div>${svg('chevron')}</article>`).join('')}</div>`;
}
function attendancePage(){
 let rows=attendanceRows(attendanceRange);
 const present=rows.filter(row=>row[1]==='Present').length,late=rows.filter(row=>row[1]==='Late').length,absent=rows.filter(row=>row[1]==='Absent').length;
 const percent=rows.length?Math.round((present+late)/rows.length*100):0;
 const monthRecord=storage.get('monthlyAttendance',{})[`${currentStudentSection()}|${studentAttendanceMonth}`]?.[user.learnerId||user.studentId||''];
 const monthName=monthLabel(studentAttendanceMonth);
 return heading('YOUR SCHOOL DAY','Attendance record','A clear picture of your school days, week by week.',`<select class="filter-select" id="attendance-range"><option ${attendanceRange==='This week'?'selected':''}>This week</option><option ${attendanceRange==='This month'?'selected':''}>This month</option><option ${attendanceRange==='This semester'?'selected':''}>This semester</option></select>`)+
 `<section class="panel monthly-student-summary"><div class="panel-header"><div><h2>${monthName} · Monthly summary</h2><p>Monthly attendance recorded by your teacher</p></div><div class="student-month-actions"><label class="sr-only" for="student-attendance-month">Attendance month</label><input class="filter-select" id="student-attendance-month" type="month" max="${localDateISO().slice(0,7)}" value="${studentAttendanceMonth}" /><span class="status ${monthRecord?.present?'':'absent'}">${monthRecord?(monthRecord.present?'Present this month':'Not marked present'):'Not yet recorded'}</span></div></div><div class="monthly-summary-values"><div><span>Days absent</span><strong>${monthRecord?.absentDays??'—'}</strong></div><div><span>Section</span><strong>${safe(currentStudentSection())}</strong></div></div></section>`+
 `<section class="attendance-banner"><div class="ring" style="--percent:${percent}%"><strong>${percent}%</strong></div><div><h3>You’re showing up. That matters.</h3><p>${present+late} days attended out of ${rows.length} school days in ${attendanceRange.toLowerCase()}.</p></div><div class="attendance-legend"><span class="legend-item"><i class="legend-dot"></i>${present} Present</span><span class="legend-item"><i class="legend-dot late"></i>${late} Late</span><span class="legend-item"><i class="legend-dot absent"></i>${absent} Absent</span></div></section>
 <div class="stats-grid">${stat('check','Days present',String(present),'Recorded school days','On time or early')}${stat('clock','Days late',String(late),'Recorded school days','Keep your streak')}${stat('calendar','Days absent',String(absent),'Recorded school days','Check in with your teacher')}${stat('chart','Attendance rate',percent+'%','This selected period','You’re doing well')}</div>
 <section class="panel"><div class="panel-header"><div><h2>Daily attendance</h2><p>Updates from your classroom teacher</p></div></div><div class="attendance-table-wrap"><table><thead><tr><th>School day</th><th>Status</th><th>Time in</th><th>Recorded by</th></tr></thead><tbody>${rows.slice().reverse().map(row=>`<tr><td>${row[0]}</td><td><span class="status ${row[1].toLowerCase()}">${row[1]}</span></td><td>${row[2]}</td><td>${safe(row[3])}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function attendanceRows(range){
 const today=new Date();today.setHours(0,0,0,0);const start=new Date(today);
 if(range==='This week')start.setDate(today.getDate()-((today.getDay()+6)%7));
 else if(range==='This month')start.setDate(1);
 else start.setFullYear(today.getFullYear(),today.getMonth()>=6?6:0,1);
 const saved=storage.get('attendanceRecords',{}),rows=[];
 const statuses=['Present','Present','Late','Present','Absent','Present'];
 for(let date=new Date(start),index=0;date<=today;date.setDate(date.getDate()+1)){
  if(date.getDay()===0||date.getDay()===6)continue;
  const iso=localDateISO(date),statusIndex=index%statuses.length;
  const record=saved[`${currentStudentSection()}|${iso}`]?.[user.learnerId||user.studentId||''];
  if(!isDemo&&!record)continue;
  rows.push([new Intl.DateTimeFormat('en',{weekday:'short',month:'short',day:'numeric',year:'numeric'}).format(date),record?.status||(isDemo?statuses[statusIndex]:'Not recorded'),record?.time||'—',record?.recordedBy||(isDemo?'Ms. Alex Rivera':'—')]);
  index++;
 }
 return rows;
}
function teacherAttendanceSectionsPage(){
 const monthly=storage.get('monthlyAttendance',{});
 const sections=allSubjects().flatMap(subject=>(subject.sections||[]).map(section=>({subject,section})));
 return heading('CLASSROOM TOOLS','Take attendance','Choose a section first. Then update the monthly summary or open the daily roll call.')+
 (sections.length?`<div class="section-list attendance-section-list">${sections.map(({subject,section})=>{const roster=monthly[`${section.id}|${attendanceMonth}`]||{},sectionStudents=rosterForClass(subject.id,section.id),marked=sectionStudents.filter(student=>roster[student.learnerId]).length;return `<button class="section-tile attendance-section-tile" data-attendance-section="${safe(section.name)}" data-attendance-section-id="${safe(section.id)}" data-attendance-subject-id="${safe(subject.id)}"><span class="subject-icon">${svg('users')}</span><strong>${safe(section.name)}</strong><span>${safe(subject.name)} · ${sectionStudents.length} students · ${marked} monthly records saved</span><span class="section-action">Open attendance ${svg('chevron')}</span></button>`;}).join('')}</div>`:`<section class="panel"><p style="font-size:10px;color:#77837b;margin:0">Add a section under a subject before taking attendance.</p></section>`);
}
function teacherAttendanceRosterPage(){
 const isMonthly=attendanceMode==='monthly';
 const rosterStudents=rosterForClass(attendanceSubjectId,attendanceSectionId);
 const records=storage.get('attendanceRecords',{});
 const roster=records[`${attendanceSectionId}|${attendanceDate}`]||{};
 const present=Object.values(roster).filter(record=>record.status==='Present').length;
 const late=Object.values(roster).filter(record=>record.status==='Late').length;
 const absent=Object.values(roster).filter(record=>record.status==='Absent').length;
 if(isMonthly){
  const monthly=storage.get('monthlyAttendance',{});
  const monthRoster=monthly[`${attendanceSectionId}|${attendanceMonth}`]||{};
  const days=schoolDaysInMonth(attendanceMonth);
  const marked=rosterStudents.filter(student=>monthRoster[student.learnerId]).length;
  const here=rosterStudents.filter(student=>monthRoster[student.learnerId]?.present).length;
  const monthAbsent=rosterStudents.reduce((sum,student)=>sum+Number(monthRoster[student.learnerId]?.absentDays||0),0);
  return heading('CLASSROOM TOOLS',safe(attendanceSection),'Update each student’s attendance summary for the selected month.',`<button class="button" data-page="attendance">← Change section</button>`)+
  `<div class="attendance-tabs"><button class="attendance-tab active" data-attendance-mode="monthly">Monthly summary</button><button class="attendance-tab" data-attendance-mode="daily">Daily roll call</button></div>
  <section class="attendance-banner"><span class="stat-icon">${svg('calendar')}</span><div><h3>${monthLabel(attendanceMonth)}</h3><p>${marked} of ${rosterStudents.length} student records saved · ${here} marked present this month · ${monthAbsent} absences reported</p></div></section>
  <section class="panel"><div class="panel-header attendance-panel-header"><div><h2>Monthly student attendance</h2><p>Check students who attended this month and enter each student’s number of absent days.</p></div><div class="grade-actions attendance-controls"><label class="sr-only" for="attendance-month">Attendance month</label><input class="filter-select" id="attendance-month" type="month" max="${localDateISO().slice(0,7)}" value="${attendanceMonth}" /></div></div>
  <form id="monthly-attendance-form"><div class="attendance-table-wrap"><table class="teacher-attendance-table monthly-attendance-table"><thead><tr><th>Student</th><th>Present this month</th><th>Days absent</th></tr></thead><tbody>${rosterStudents.map(student=>{const saved=monthRoster[student.learnerId]||monthRoster[student.id]||{};return `<tr><td><div class="student-row"><span class="avatar">${safe(student.initials)}</span><span><strong>${safe(student.name)}</strong><small>LRN · ${safe(student.learnerId)}</small></span></div></td><td><label class="present-toggle"><input type="checkbox" class="monthly-present" data-student-id="${safe(student.id)}" ${saved.present?'checked':''} /><span>Present</span></label></td><td><input class="field-input absent-days-input" type="number" min="0" max="${days}" step="1" inputmode="numeric" data-student-id="${safe(student.id)}" aria-label="${safe(student.name)} days absent" value="${saved.absentDays??0}" /></td></tr>`;}).join('')}</tbody></table></div><div class="attendance-save-row"><span>Enter 0 if the student had no absences. Up to ${days} school days this month.</span><button class="button button-primary" type="submit">${svg('check')} Save monthly summary</button></div></form></section>`;
 }
 return heading('CLASSROOM TOOLS',safe(attendanceSection),'Record each student’s attendance for a specific school day.',`<button class="button" data-page="attendance">← Change section</button>`)+
 `<div class="attendance-tabs"><button class="attendance-tab" data-attendance-mode="monthly">Monthly summary</button><button class="attendance-tab active" data-attendance-mode="daily">Daily roll call</button></div>
 <section class="attendance-banner"><span class="stat-icon">${svg('calendar')}</span><div><h3>${safe(attendanceSection)} · ${new Intl.DateTimeFormat('en',{dateStyle:'long'}).format(new Date(`${attendanceDate}T12:00:00`))}</h3><p>${Object.keys(roster).length} of ${rosterStudents.length} students marked · ${present} present · ${late} late · ${absent} absent</p></div></section>
 <section class="panel"><div class="panel-header attendance-panel-header"><div><h2>Daily class roll call</h2><p>Mark each student’s status, then save attendance.</p></div><div class="grade-actions attendance-controls"><label class="sr-only" for="attendance-date">Attendance date</label><input class="filter-select" id="attendance-date" type="date" value="${attendanceDate}" /></div></div>
 <form id="teacher-attendance-form"><div class="attendance-table-wrap"><table class="teacher-attendance-table"><thead><tr><th>Student</th><th>Learner Reference Number</th><th>Attendance status</th></tr></thead><tbody>${rosterStudents.map(student=>`<tr><td><div class="student-row"><span class="avatar">${safe(student.initials)}</span><span><strong>${safe(student.name)}</strong><small>${student.email?'Portal account linked':'Account not registered yet'}</small></span></div></td><td>${safe(student.learnerId)}</td><td><select class="field-select attendance-status" data-student-id="${safe(student.id)}" aria-label="${safe(student.name)} attendance status"><option value="">Select status</option>${['Present','Late','Absent'].map(status=>`<option value="${status}" ${roster[student.learnerId]?.status===status||roster[student.id]?.status===status?'selected':''}>${status}</option>`).join('')}</select></td></tr>`).join('')}</tbody></table></div><div class="attendance-save-row"><span>All students need a status before attendance can be saved.</span><button class="button button-primary" type="submit">${svg('check')} Save daily attendance</button></div></form></section>`;
}
function schoolDaysInMonth(month){const [year,monthNumber]=month.split('-').map(Number);let days=0;for(let date=new Date(year,monthNumber-1,1);date.getMonth()===monthNumber-1;date.setDate(date.getDate()+1)){if(date.getDay()!==0&&date.getDay()!==6)days++;}return days;}
function monthLabel(month){const [year,monthNumber]=month.split('-').map(Number);return new Intl.DateTimeFormat('en',{month:'long',year:'numeric'}).format(new Date(year,monthNumber-1,1,12));}
function recordsPage(){
 const published=studentPublishedGradePeriods();
 return heading('YOUR PROGRESS','Academic records','Your grading-period results, shared by your teachers.')+`<div class="info-note">${svg('info')}Your grades are private to you. Select a published grading period to review and download your records.</div><div class="grade-grid">${[1,2,3,4].map((n,i)=>`<article class="grade-card ${published[i]?'available':''}" ${published[i]?`data-grade="${n}" tabindex="0" role="button" aria-label="View ${ordinal(n)} grading grades"`:''}><div class="grade-top"><span class="grade-num">0${n}</span><span class="grade-state">${published[i]?'● PUBLISHED':'NOT YET AVAILABLE'}</span></div><h3>${ordinal(n)} Grading</h3><p>${published[i]?'Your teacher has shared your academic results for this period.':'Your records will appear here once they are posted by your teacher.'}</p><div class="grade-footer">${published[i]?'<strong>View your grades →</strong>':'<span>Awaiting teacher</span>'+svg('lock')}</div></article>`).join('')}</div><section class="panel"><div class="panel-header"><div><h2>About your records</h2><p>Understand how to access your grades</p></div></div><p style="font-size:10px;color:#77837b;line-height:1.7;margin:0">Each grading period becomes available when your teacher publishes it. Once posted, select a grading card to review your subject results and download a personal copy. If you have a question about a grade, contact your subject teacher.</p></section>`;
}
function ordinal(n){return n===1?'1st':n===2?'2nd':n===3?'3rd':'4th';}
function openGrade(n){
 if(!studentPublishedGradePeriods()[n-1])return;
 const savedGrades=storage.get('studentGrades',{}),enrollments=studentClassEnrollments(user.learnerId||'').filter(({subject,section})=>classGradeIsPublished(n,subject,section));
 const fallbackGrades={'Mathematics':94,'Science':91,'English':93,'Filipino':90,'Araling Panlipunan':92,'Values Education':95};
 const subjectsList=enrollments.length?[...new Map(enrollments.map(({subject,section})=>{
  const score=savedGrades[`${n}:${subject.id}:${section.id}:${user.learnerId}`]??savedGrades[`${n}:${user.studentId||'2024-001'}`]??(isDemo?fallbackGrades[subject.name]:'—');
  return [subject.name,[subject.name,String(score)]];
 })).values()]:isDemo?Object.entries(fallbackGrades).map(([name,score])=>[name,String(savedGrades[`${n}:${user.studentId||'2024-001'}`]??score)]):[];
 const numericScores=subjectsList.map(row=>Number(row[1])).filter(Number.isFinite);
 const average=numericScores.length?(numericScores.reduce((sum,score)=>sum+score,0)/numericScores.length).toFixed(1):'—';
 showModal(`<div class="modal-header"><div><p class="eyebrow">ACADEMIC RECORD · ${ordinal(n).toUpperCase()} GRADING</p><h2>Your grades are ready</h2><p>${safe(user.section||'Grade 8 - Mabini')} · School year ${schoolYear()}</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="grade-preview">${subjectsList.map(row=>`<div class="grade-preview-row"><span>${row[0]}</span><strong>${row[1]}</strong></div>`).join('')}<div class="grade-preview-row"><strong>General average</strong><strong>${average}</strong></div></div><label class="acknowledge"><input id="grade-ack" type="checkbox" /> I acknowledge that I am viewing and downloading my personal academic records.</label><div class="modal-actions"><button class="button" data-close>Not now</button><button class="button button-primary" id="download-grades" disabled>${svg('download')} Download grades</button></div>`);
 document.getElementById('grade-ack').addEventListener('change',event=>document.getElementById('download-grades').disabled=!event.target.checked);
 document.getElementById('download-grades').addEventListener('click',()=>downloadGrades(n,subjectsList,average));
}
function downloadGrades(period,subjectsList,average){
 const lines=[['LABOGON SCHOOL','ACADEMIC RECORD'],['Student',user.name],['Grade and section',user.section||'Grade 8 - Mabini'],['School year',schoolYear()],['Grading period',`${ordinal(period)} Grading`],[],['Subject','Grade'],...subjectsList,['General Average',average]];
 const csv=lines.map(row=>row.map(cell=>`"${String(cell??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
 const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download=`Labogon-${ordinal(period)}-Grading-Record.csv`;link.click();URL.revokeObjectURL(url);closeModal();showToast('Your academic record has been downloaded.');
}
function subjectsPage(){
 const items=allSubjects();
 return heading('YOUR TEACHING LOAD','Subjects I handle','Add the subjects you teach, then create each class section and its LRN-linked roster.',`<button class="button" data-page="recently-deleted">Recently deleted (${readTrash().length})</button><button class="button button-primary" id="toggle-subject-form">${svg('plus')} Add subject</button>`)+
 (subjectFormOpen?`<section class="panel subject-editor"><div class="panel-header"><div><h2>Add a subject</h2><p>Create a subject in your teaching load.</p></div></div><form id="subject-form" class="form-row"><div class="field-wrap"><label class="field-label" for="subject-name">Subject name</label><input class="field-input" id="subject-name" name="name" required maxlength="70" placeholder="e.g. Mathematics" /></div><div class="field-wrap"><label class="field-label" for="subject-code">Subject code</label><input class="field-input" id="subject-code" name="code" maxlength="20" placeholder="Optional" /></div><div class="subject-form-actions"><button class="button" type="button" id="cancel-subject">Cancel</button><button class="button button-primary" type="submit">Save subject</button></div></form></section>`:'')+
 (items.length? `<div class="subject-grid">${items.map(subject=>{const learnerIds=new Set((subject.sections||[]).flatMap(section=>section.studentLRNs||[]));return `<article class="subject-card"><button class="subject-card-main" data-subject-id="${safe(subject.id)}"><div class="subject-card-top"><span class="subject-icon">${svg(subject.icon||'book')}</span>${svg('chevron')}</div><h3>${safe(subject.name)}</h3><p>${safe(subject.code||'SUBJECT')}</p><div class="subject-card-bottom"><span>${(subject.sections||[]).length} ${(subject.sections||[]).length===1?'section':'sections'}</span><strong>${learnerIds.size} students</strong></div></button><details class="action-menu subject-action-menu"><summary aria-label="More actions for ${safe(subject.name)}" title="More options">⋮</summary><div class="action-menu-options"><button type="button" class="action-menu-danger" data-delete-subject="${safe(subject.id)}">Remove subject</button></div></details></article>`;}).join('')}</div>`:`<section class="panel"><div class="empty-state"><h3>No subjects yet</h3><p>Add a subject to start setting up your classes.</p></div></section>`);
}
function sectionsPage(){
 const subject=allSubjects().find(item=>item.id===selectedSubject?.id)||allSubjects()[0];
 if(!subject)return subjectsPage();
 const sections=subject.sections||[];
 return heading('YOUR CLASSES',safe(subject.name),'Add the class sections you handle, then manage their student rosters and grades.',`<button class="button" data-page="subjects">← All subjects</button><button class="button" data-page="recently-deleted">Recently deleted (${readTrash().length})</button><button class="button button-primary" id="toggle-section-form">${svg('plus')} Add section</button>`)+
 (sectionFormOpen?`<section class="panel subject-editor"><div class="panel-header"><div><h2>Add a section</h2><p>Create a class section under ${safe(subject.name)}.</p></div></div><form id="section-form" class="form-row"><div class="field-wrap"><label class="field-label" for="section-name">Class / section name</label><input class="field-input" id="section-name" name="name" required maxlength="70" placeholder="e.g. Grade 9 - Sampaguita" /></div><div class="subject-form-actions"><button class="button" type="button" id="cancel-section">Cancel</button><button class="button button-primary" type="submit">Save section</button></div></form></section>`:'')+
 (sections.length?`<div class="section-list">${sections.map(section=>`<div class="section-entry"><button class="section-tile" data-section-id="${safe(section.id)}"><strong>${safe(section.name)}</strong><span>${(section.studentLRNs||[]).length} students · Open roster</span></button></div>`).join('')}</div>`:'')+
 (sections.length?`<section class="panel"><div class="panel-header"><div><h2>Class overview</h2><p>Student lists are maintained separately for each subject section.</p></div></div><p style="font-size:10px;color:#77837b;line-height:1.7;margin:0">Choose a section to add students by LRN, review profiles, enter grades, and publish results.</p></section>`:`<section class="panel"><p style="font-size:10px;color:#77837b;margin:0">No sections yet. Add a section to start building this class roster.</p></section>`);
}
function recentlyDeletedPage(){
 const items=readTrash(),now=Date.now();
 return heading('SUBJECTS I HANDLE','Recently deleted','Deleted subjects and sections are kept here for 90 days. Restore them or permanently delete them now.',`<button class="button" data-page="subjects">← Subjects I handle</button>`)+
 (items.length?`<div class="trash-list">${items.map(item=>{const days=Math.max(0,Math.ceil((item.expiresAt-now)/(24*60*60*1000))),parentExists=item.kind==='subject'||allSubjects().some(subject=>subject.id===item.subjectId);return `<article class="panel trash-item"><div class="trash-item-info"><span class="subject-icon">${svg(item.kind==='subject'?'book':'users')}</span><div><h2>${safe(item.name)}</h2><p>${item.kind==='subject'?'Subject':'Section under '+safe(item.subjectName)} · Deleted ${new Intl.DateTimeFormat('en',{dateStyle:'medium'}).format(new Date(item.deletedAt))}</p><small>${days} ${days===1?'day':'days'} left before automatic permanent deletion</small></div></div><div class="trash-actions"><button class="button button-small" data-restore-trash="${safe(item.id)}" ${parentExists?'':'disabled'}>${parentExists?'Restore':'Restore parent subject first'}</button><button class="button button-small danger-button" data-permanently-delete="${safe(item.id)}">Delete permanently</button></div></article>`;}).join('')}</div>`:`<section class="panel"><div class="empty-state"><h3>Nothing recently deleted</h3><p>Deleted subjects and sections will be kept here for 90 days.</p></div></section>`);
}
function studentsPage(){
 const subject=allSubjects().find(item=>item.id===selectedSubject?.id)||allSubjects()[0];
 const section=subject?.sections?.find(item=>item.id===selectedSectionId)||subject?.sections?.find(item=>item.name===selectedSection);
 if(!subject||!section)return sectionsPage();
 selectedSection=section.name;
 selectedSectionId=section.id;
 const classStudents=rosterForClass(subject.id,section.id);
 const saved=storage.get('studentGrades',{});
 const period=Number(storage.get('selectedGradePeriod',1));
 const classKey=`${subject.id}:${section.id}`;
 return heading('CLASS ROSTER',safe(section.name),`${safe(subject.name)} · Add students using their LRN and manage this class roster.`,`<button class="button" data-page="sections">← Sections</button>`)+
 `<section class="panel"><div class="panel-header"><div><h2>${safe(subject.name)} · ${safe(section.name)}</h2><p>${classStudents.length} students · School year ${schoolYear()}</p></div><div class="grade-actions"><select class="filter-select" id="grade-period" aria-label="Select grading period">${[1,2,3,4].map(n=>`<option value="${n}" ${period===n?'selected':''}>${ordinal(n)} Grading</option>`).join('')}</select><button class="button button-small" id="save-grades">${svg('check')} Save scores</button><button class="button button-primary button-small" id="publish-grades">${svg('book')} Publish</button><details class="action-menu roster-action-menu"><summary aria-label="More actions for ${safe(section.name)}" title="More options">⋮</summary><div class="action-menu-options"><button type="button" class="action-menu-danger" data-delete-section="${safe(section.id)}">Remove section</button></div></details></div></div>
 <form id="enroll-student-form" class="enroll-student-form"><div class="form-row"><div class="field-wrap"><label class="field-label" for="enroll-lrn">Student LRN</label><input class="field-input" id="enroll-lrn" name="learnerId" inputmode="numeric" pattern="[0-9]{12}" maxlength="12" required placeholder="Enter 12-digit LRN" /></div><div class="field-wrap"><label class="field-label" for="enroll-name">Student name</label><input class="field-input" id="enroll-name" name="name" required maxlength="100" placeholder="Profile name loads when found" /></div><div class="enroll-submit"><button class="button button-primary" type="submit">${svg('plus')} Add to class</button></div></div><p class="field-hint" id="student-lookup-status">Enter an LRN to look for an existing student profile. If no account is registered yet, enter the student's name; their account will link when they sign up with this LRN.</p></form>
 <div class="attendance-table-wrap"><table><thead><tr><th>Student profile</th><th>Learner Reference Number</th><th>Current average</th><th>Grading score</th><th>Profile</th></tr></thead><tbody>${classStudents.map(student=>{const savedScore=saved[`${period}:${classKey}:${student.learnerId}`]??saved[`${period}:${student.id}`]??'';return `<tr><td><div class="student-row"><span class="avatar">${safe(student.initials)}</span><span><strong>${safe(student.name)}</strong><small>${student.email?'Portal account linked':'Account not registered yet'}</small></span></div></td><td>${safe(student.learnerId)}</td><td>${isDemo?(90+(classStudents.indexOf(student)*7)%10).toFixed(1):studentSubjectAverage(student,subject)}</td><td><input class="grade-input" type="number" min="0" max="100" aria-label="${safe(student.name)} grading score" placeholder="—" value="${savedScore}" data-learner-id="${safe(student.learnerId)}" /></td><td><button class="text-link profile-button" data-learner-id="${safe(student.learnerId)}">View profile</button></td></tr>`;}).join('')}</tbody></table></div></section><p style="font-size:9px;color:#9aa39d;margin:10px 2px">Enter a score from 0 to 100. Save scores before publishing a grading period to this class.</p>`;
}
function postUpdatePage(){return heading('SCHOOL COMMUNITY','Share an update','Write a note for students and families in your school community.')+`<div class="dashboard-grid"><section class="panel"><div class="panel-header"><div><h2>Write an announcement</h2><p>Share school news or send a personal note to one student</p></div></div><form class="announcement-form" id="announcement-form"><div class="field-wrap"><label class="field-label" for="update-title">Headline</label><input class="field-input" id="update-title" name="title" placeholder="What should everyone know?" required maxlength="90" /></div><div class="form-row"><div class="field-wrap"><label class="field-label" for="update-type">Category</label><select class="field-select" id="update-type" name="type"><option>School update</option><option>Academic</option><option>Events</option></select></div><div class="field-wrap"><label class="field-label" for="update-audience">Audience</label><select class="field-select" id="update-audience" name="audience"><option>All students</option><option>Grade 8</option><option>My classes</option><option>Personal note</option></select></div></div><div class="field-wrap hidden" id="personal-student-wrap"><label class="field-label" for="personal-student">Send personal note to</label><select class="field-select" id="personal-student" name="targetStudentId"><option value="">Choose a student</option>${studentDirectory().map(student=>`<option value="${safe(student.learnerId)}">${safe(student.name)} · ${safe(student.learnerId)}</option>`).join('')}</select></div><div class="field-wrap"><label class="field-label" for="update-body">Your message</label><textarea class="field-textarea" id="update-body" name="body" placeholder="Share the details students need to know..." required maxlength="500"></textarea></div><div style="display:flex;justify-content:flex-end"><button class="button button-primary" type="submit">${svg('megaphone')} Publish update</button></div></form></section><section class="panel"><div class="panel-header"><div><h2>Posting tips</h2><p>A few things to keep in mind</p></div></div><div class="notice-list"><article class="notice-row"><span class="notice-icon">${svg('users')}</span><div><strong>Keep it clear and kind</strong><span>Short, welcoming messages are easiest for students and families to follow.</span></div></article><article class="notice-row"><span class="notice-icon">${svg('calendar')}</span><div><strong>Include important details</strong><span>Add dates, times, or places whenever your update is about an event.</span></div></article><article class="notice-row"><span class="notice-icon">${svg('bell')}</span><div><strong>Reach your community</strong><span>School updates are visible to signed-in portal users in this demo.</span></div></article></div></section></div>`;}
function bindPageEvents(admin){
 app.querySelectorAll('[data-subject-id]').forEach(el=>{const open=event=>{if(event.target.closest('[data-delete-subject]'))return;selectedSubject=allSubjects().find(subject=>subject.id===el.dataset.subjectId)||null;selectedSection=null;selectedSectionId=null;activePage='sections';sectionFormOpen=false;render();};el.addEventListener('click',open);el.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target===el){event.preventDefault();open(event);}});});
 app.querySelectorAll('[data-delete-subject]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();confirmDeleteSubject(button.dataset.deleteSubject);}));
 app.querySelectorAll('[data-delete-section]').forEach(button=>button.addEventListener('click',event=>{event.stopPropagation();confirmDeleteSection(selectedSubject?.id,button.dataset.deleteSection);}));
 app.querySelectorAll('[data-restore-trash]').forEach(button=>button.addEventListener('click',()=>restoreTrashItem(button.dataset.restoreTrash)));
 app.querySelectorAll('[data-permanently-delete]').forEach(button=>button.addEventListener('click',()=>{
  const item=readTrash().find(entry=>entry.id===button.dataset.permanentlyDelete);
  if(!item)return;
  showModal(`<div class="modal-header"><div><p class="eyebrow">PERMANENT DELETION</p><h2>Delete ${safe(item.name)} permanently?</h2><p>This cannot be undone.</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="update-detail"><p>The archived ${item.kind}, its roster, and its saved files will be removed now instead of waiting for the 90-day retention period to end.</p></div><div class="modal-actions"><button class="button" data-close>Keep in Recently deleted</button><button class="button danger-button" data-trash-action="permanently-delete" data-trash-id="${safe(item.id)}">Delete permanently</button></div>`);
 }));
 app.querySelectorAll('[data-section-id]').forEach(el=>el.addEventListener('click',()=>{const section=selectedSubject?.sections?.find(item=>item.id===el.dataset.sectionId);if(!section)return;selectedSection=section.name;selectedSectionId=section.id;activePage='students';render();}));
 document.getElementById('toggle-subject-form')?.addEventListener('click',()=>{subjectFormOpen=!subjectFormOpen;render();});
 document.getElementById('cancel-subject')?.addEventListener('click',()=>{subjectFormOpen=false;render();});
 document.getElementById('subject-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget),name=String(data.get('name')||'').trim();
  if(!name)return;
  const items=allSubjects();
  if(items.some(subject=>subject.name.toLowerCase()===name.toLowerCase())){showToast('That subject is already in your teaching load.');return;}
  const code=String(data.get('code')||'').trim()||name.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,20);
  if(!isDemo){
   try{
    const result=await apiRequest('/api/subjects',{method:'POST',body:JSON.stringify({name,code})});
    await loadPortalData();selectedSubject=allSubjects().find(item=>item.id===result.subject.id)||result.subject;
    subjectFormOpen=false;activePage='sections';render();showToast(`${name} added. Add a section to set up its class.`);
   }catch(error){showToast(error.message);}
   return;
  }
  const subject={id:`subject-${Date.now()}`,name,code,icon:'book',sections:[]};
  items.push(subject);saveSubjects(items);selectedSubject=subject;subjectFormOpen=false;activePage='sections';render();showToast(`${name} added. Add a section to set up its class.`);
 });
 document.getElementById('toggle-section-form')?.addEventListener('click',()=>{sectionFormOpen=!sectionFormOpen;render();});
 document.getElementById('cancel-section')?.addEventListener('click',()=>{sectionFormOpen=false;render();});
 document.getElementById('section-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget),name=String(data.get('name')||'').trim();
  if(!name||!selectedSubject)return;
  const items=allSubjects(),subject=items.find(item=>item.id===selectedSubject.id);
  if(!subject)return;
  if((subject.sections||[]).some(section=>section.name.toLowerCase()===name.toLowerCase())){showToast('That section already exists under this subject.');return;}
  if(!isDemo){
   try{
    const result=await apiRequest(`/api/subjects/${encodeURIComponent(subject.id)}/sections`,{method:'POST',body:JSON.stringify({name})});
    await loadPortalData();selectedSubject=allSubjects().find(item=>item.id===subject.id);selectedSection=name;selectedSectionId=result.section.id;
    sectionFormOpen=false;activePage='students';render();showToast(`${name} added. Add students by LRN to build the roster.`);
   }catch(error){showToast(error.message);}
   return;
  }
  const section={id:`section-${Date.now()}`,name,studentLRNs:[],studentNames:{}};
  subject.sections=subject.sections||[];subject.sections.push(section);saveSubjects(items);selectedSubject=subject;selectedSection=name;selectedSectionId=section.id;sectionFormOpen=false;activePage='students';render();showToast(`${name} added. Add students by LRN to build the roster.`);
 });
 document.getElementById('enroll-lrn')?.addEventListener('input',event=>{
  const learnerId=event.target.value.replace(/\D/g,'').slice(0,12);
  if(event.target.value!==learnerId)event.target.value=learnerId;
  const nameInput=document.getElementById('enroll-name'),status=document.getElementById('student-lookup-status');
  if(!nameInput||!status)return;
  const profile=learnerId.length===12?studentProfileByLrn(learnerId):null;
  if(profile){nameInput.value=profile.name;nameInput.readOnly=true;status.textContent=profile.email?`Profile found: ${profile.name} · ${profile.email}`:`Demo profile found: ${profile.name}.`;status.classList.remove('lookup-pending');}
  else{nameInput.readOnly=false;if(learnerId.length===12){nameInput.value='';status.textContent='No portal profile found for this LRN yet. Enter the student’s name to add them; their account can link after sign-up.';status.classList.add('lookup-pending');}else{status.textContent='Enter an LRN to look for an existing student profile.';status.classList.remove('lookup-pending');}}
 });
 document.getElementById('enroll-student-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const data=new FormData(event.currentTarget),learnerId=String(data.get('learnerId')||'').replace(/\D/g,''),typedName=String(data.get('name')||'').trim();
  if(!/^\d{12}$/.test(learnerId)){showToast('Enter a valid 12-digit LRN.');return;}
  const items=allSubjects(),subject=items.find(item=>item.id===selectedSubject?.id),section=subject?.sections?.find(item=>item.id===selectedSectionId);
  if(!section){showToast('Choose a class section before adding a student.');return;}
  if(section.studentLRNs.includes(learnerId)){showToast('This student is already in the class roster.');return;}
  const profile=studentProfileByLrn(learnerId);
  const name=profile?.name||typedName;
  if(!name){showToast('Enter the student name or use an LRN with a registered profile.');return;}
  const existingName=manuallyAddedStudentName(learnerId);
  if(!profile&&existingName&&existingName.toLowerCase()!==name.toLowerCase()){showToast('This LRN already has a different name in another class. Verify the student information first.');return;}
  if(!isDemo){
   try{
    await apiRequest(`/api/sections/${encodeURIComponent(section.id)}/students`,{method:'POST',body:JSON.stringify({learnerId,name})});
    await loadPortalData();selectedSubject=allSubjects().find(item=>item.id===subject.id);selectedSection=section.name;selectedSectionId=section.id;
    render();showToast(`${name} added to ${section.name}.`);
   }catch(error){showToast(error.message);}
   return;
  }
  section.studentLRNs.push(learnerId);section.studentNames=section.studentNames||{};section.studentNames[learnerId]=name;
  selectedSubject=subject;saveSubjects(items);render();showToast(`${name} added to ${section.name}.`);
 });
 app.querySelectorAll('[data-section]').forEach(el=>el.addEventListener('click',()=>{selectedSection=el.dataset.section;activePage='students';render();}));
 app.querySelectorAll('[data-grade]').forEach(el=>{const open=()=>openGrade(Number(el.dataset.grade));el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
 app.querySelectorAll('.announcement[data-update-index]').forEach(el=>{const open=()=>openUpdate(Number(el.dataset.updateIndex));el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
 app.querySelectorAll('[data-notification-action]').forEach(el=>{const open=()=>{const action=el.dataset.notificationAction;if(action==='grade'){navigate('records');if(isDemo)openGrade(1);return;}if(action==='update'){navigate('updates');if(el.dataset.updateIndex!==undefined)openUpdate(Number(el.dataset.updateIndex));else if(el.dataset.resourceId){const index=notices().findIndex(item=>item.id===el.dataset.resourceId);if(index>=0)openUpdate(index);}return;}navigate(action);};el.addEventListener('click',open);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});});
 app.querySelectorAll('[data-attendance-section]').forEach(el=>el.addEventListener('click',()=>{
  attendanceSection=el.dataset.attendanceSection;attendanceSectionId=el.dataset.attendanceSectionId;attendanceSubjectId=el.dataset.attendanceSubjectId;
  attendanceMode='monthly';activePage='attendance-roster';
  if(!isDemo)refreshAttendance().then(()=>render()).catch(error=>showToast(error.message));
  else render();
 }));
 app.querySelectorAll('[data-attendance-mode]').forEach(el=>el.addEventListener('click',()=>{attendanceMode=el.dataset.attendanceMode;render();}));
 document.getElementById('attendance-range')?.addEventListener('change',event=>{attendanceRange=event.target.value;if(!isDemo)refreshAttendance().then(()=>render()).catch(error=>showToast(error.message));else render();});
 document.getElementById('attendance-month')?.addEventListener('change',event=>{if(event.target.value){attendanceMonth=event.target.value;if(!isDemo)refreshAttendance().then(()=>render()).catch(error=>showToast(error.message));else render();}});
 document.getElementById('student-attendance-month')?.addEventListener('change',event=>{if(event.target.value){studentAttendanceMonth=event.target.value;if(!isDemo)refreshAttendance().then(()=>render()).catch(error=>showToast(error.message));else render();}});
 document.getElementById('attendance-date')?.addEventListener('change',event=>{attendanceDate=event.target.value||localDateISO();if(!isDemo)refreshAttendance().then(()=>render()).catch(error=>showToast(error.message));else render();});
 document.getElementById('monthly-attendance-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const maxDays=schoolDaysInMonth(attendanceMonth);
  const records=storage.get('monthlyAttendance',{});
  const key=`${attendanceSection}|${attendanceMonth}`;
  const entries=[...app.querySelectorAll('.absent-days-input')];
  const invalid=entries.find(input=>input.value===''||!Number.isInteger(Number(input.value))||Number(input.value)<0||Number(input.value)>maxDays);
  if(invalid){showToast(`Enter a whole number of absences from 0 to ${maxDays}.`);invalid.focus();return;}
  const updatedAt=new Date().toISOString();
  const values=entries.map(input=>{
   const studentId=input.dataset.studentId;
   const student=rosterForClass(attendanceSubjectId,attendanceSectionId).find(item=>item.id===studentId);
   return {studentId,learnerId:student?.learnerId||studentId,present:app.querySelector(`.monthly-present[data-student-id="${studentId}"]`).checked,absentDays:Number(input.value)};
  });
  if(!isDemo){
   try{
    await apiRequest(`/api/sections/${encodeURIComponent(attendanceSectionId)}/attendance/monthly`,{method:'PUT',body:JSON.stringify({month:attendanceMonth,entries:values.map(({learnerId,present,absentDays})=>({learnerId,present,absentDays}))})});
    await refreshAttendance();showToast(`Monthly attendance saved for ${attendanceSection}.`);render();
   }catch(error){showToast(error.message);}
   return;
  }
  records[key]=Object.fromEntries(values.map(({studentId,present,absentDays})=>[studentId,{present,absentDays,recordedBy:user.name,updatedAt}]));
  storage.set('monthlyAttendance',records);
  showToast(`Monthly attendance saved for ${attendanceSection}.`);
  async function initializePortal(){
   try{
    const result=await apiRequest('/api/me');
    user=result.user;isDemo=false;
    await loadPortalData();
    render();
   }catch(error){
    user=null;isDemo=false;clearRemoteState();renderAuth();
    if(error.status!==401)showToast(`Could not restore your portal session: ${error.message}`);
   }
  }
  initializePortal();
 });
 document.getElementById('teacher-attendance-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const inputs=[...app.querySelectorAll('.attendance-status')];
  if(inputs.some(input=>!input.value)){showToast('Mark every student before saving attendance.');return;}
  const records=storage.get('attendanceRecords',{});
  const key=`${attendanceSection}|${attendanceDate}`;
  const savedAt=new Intl.DateTimeFormat('en',{hour:'2-digit',minute:'2-digit'}).format(new Date());
  if(!isDemo){
   const rosterStudents=rosterForClass(attendanceSubjectId,attendanceSectionId);
   const entries=inputs.map(input=>({learnerId:rosterStudents.find(student=>student.id===input.dataset.studentId)?.learnerId||input.dataset.studentId,status:input.value}));
   try{
    await apiRequest(`/api/sections/${encodeURIComponent(attendanceSectionId)}/attendance/daily`,{method:'PUT',body:JSON.stringify({date:attendanceDate,entries})});
    await refreshAttendance();await refreshNotifications();showToast(`Attendance saved for ${attendanceSection}.`);render();
   }catch(error){showToast(error.message);}
   return;
  }
  records[key]=Object.fromEntries(inputs.map(input=>[input.dataset.studentId,{status:input.value,time:input.value==='Absent'?'—':savedAt,recordedBy:user.name}]));
  storage.set('attendanceRecords',records);
  showToast(`Attendance saved for ${attendanceSection}.`);
  render();
 });
 document.getElementById('update-audience')?.addEventListener('change',event=>{const target=document.getElementById('personal-student-wrap');target?.classList.toggle('hidden',event.target.value!=='Personal note');});
 document.getElementById('announcement-form')?.addEventListener('submit',async event=>{event.preventDefault();const data=new FormData(event.currentTarget);const title=String(data.get('title')||'').trim(),body=String(data.get('body')||'').trim(),audience=String(data.get('audience')||'All students'),targetLearnerId=String(data.get('targetStudentId')||'');if(!title||!body)return;if(audience==='Personal note'&&!targetLearnerId){showToast('Choose a student for this personal note.');return;}if(!isDemo){try{await apiRequest('/api/announcements',{method:'POST',body:JSON.stringify({title,body,category:String(data.get('type')||'School update'),audience,...(audience==='Personal note'?{targetLearnerId}:{})})});await loadPortalData();showToast(audience==='Personal note'?'Your personal note has been sent.':'Your school update is now published.');activePage='updates';render();}catch(error){showToast(error.message);}return;}const items=storage.get('notices',defaultNotices);items.unshift({title,body,type:String(data.get('type')||'School update'),time:'Just now',author:user.name,audience,targetStudentId:audience==='Personal note'?targetLearnerId:''});storage.set('notices',items);showToast(audience==='Personal note'?'Your personal note has been sent.':'Your school update is now published.');activePage='updates';render();});
 document.getElementById('grade-period')?.addEventListener('change',event=>{storage.set('selectedGradePeriod',Number(event.target.value));render();});
 document.getElementById('save-grades')?.addEventListener('click',()=>saveGradeEntries(false));
 document.getElementById('publish-grades')?.addEventListener('click',()=>saveGradeEntries(true));
 app.querySelectorAll('.profile-button').forEach(button=>button.addEventListener('click',()=>{
  const profile=studentProfileByLrn(button.dataset.learnerId);
  const section=allSubjects().find(item=>item.id===selectedSubject?.id)?.sections?.find(item=>item.id===selectedSectionId);
  if(!profile||!section)return;
  showModal(`<div class="modal-header"><div><p class="eyebrow">STUDENT PROFILE · ${safe(section.name)}</p><h2>${safe(profile.name)}</h2><p>Learner Reference Number: ${safe(profile.learnerId)}</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="grade-preview"><div class="grade-preview-row"><span>LRN</span><strong>${safe(profile.learnerId)}</strong></div><div class="grade-preview-row"><span>Portal account</span><strong>${profile.email?'Linked':'Not registered yet'}</strong></div>${profile.email?`<div class="grade-preview-row"><span>School email</span><strong>${safe(profile.email)}</strong></div>`:''}</div><div class="modal-actions">${!profile.email&&!isDemo?`<button class="button button-primary" data-invite-learner="${safe(profile.learnerId)}">Generate account invitation</button>`:''}<button class="button" data-close>Close profile</button></div>`);
 }));
 document.getElementById('mark-read')?.addEventListener('click',async()=>{if(!isDemo){try{await apiRequest('/api/notifications/read',{method:'POST'});await refreshNotifications();render();showToast('You’re all caught up.');}catch(error){showToast(error.message);}return;}showToast('You’re all caught up.');});
}
function openUpdate(index){const item=notices()[index];if(!item)return;const author=item.author?`Posted by ${safe(item.author)}`:'Labogon School';const personal=item.targetStudentId?'<span class="tag orange">Personal update</span>':'';showModal(`<div class="modal-header"><div><p class="eyebrow">${safe(item.type||'School update').toUpperCase()}</p><h2>${safe(item.title)}</h2><p>${author} · ${safe(item.time||'Just now')}</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="update-detail">${personal}<p>${safe(item.body).replace(/\n/g,'<br>')}</p></div><div class="modal-actions"><button class="button button-primary" data-close>Close</button></div>`);}
function classGradePublicationKey(period,subjectId,sectionId){return `${period}:${subjectId}:${sectionId}`;}
function classGradeIsPublished(period,subject,section){
 const publications=storage.get('classGradePublications',{});
 return Boolean(publications[classGradePublicationKey(period,subject.id,section.id)]||(section.id.startsWith('seed-')&&postedGrades()[period-1]));
}
function studentPublishedGradePeriods(){
 const legacy=postedGrades(),enrollments=studentClassEnrollments(user?.learnerId||'');
 return [1,2,3,4].map((period,index)=>enrollments.some(({subject,section})=>classGradeIsPublished(period,subject,section))||(!enrollments.length&&legacy[index]));
}
async function saveGradeEntries(publish){
 const period=Number(document.getElementById('grade-period')?.value||1),records=storage.get('studentGrades',{}),subject=allSubjects().find(item=>item.id===selectedSubject?.id),section=subject?.sections?.find(item=>item.id===selectedSectionId);
 if(!subject||!section){showToast('Choose a subject and section before saving grades.');return;}
 const studentsInClass=rosterForClass(subject.id,section.id),values=[];let invalid=false,missing=false;
 app.querySelectorAll('.grade-input').forEach(input=>{const value=input.value.trim();if(value===''){missing=true;values.push(null);return;}const score=Number(value);if(!Number.isFinite(score)||score<0||score>100){invalid=true;input.focus();values.push(null);return;}values.push(score);});
 if(invalid){showToast('Enter a grade between 0 and 100.');return;}
 if(publish&&missing){showToast(`Enter all ${studentsInClass.length} student scores before publishing.`);return;}
 if(!isDemo){
  const entries=values.flatMap((score,index)=>score===null||!studentsInClass[index]?[]:[{learnerId:studentsInClass[index].learnerId,score}]);
  if(!entries.length){showToast('Enter at least one score first.');return;}
  try{
   await apiRequest(`/api/sections/${encodeURIComponent(section.id)}/grades`,{method:'PUT',body:JSON.stringify({period,entries,publish})});
   await refreshGrades();
   if(publish)await refreshNotifications();
   render();
   showToast(publish?`${ordinal(period)} grading grades published for ${section.name}.`:`Grades saved for ${entries.length} ${entries.length===1?'student':'students'}.`);
  }catch(error){showToast(error.message);}
  return;
 }
 let changed=0;
 values.forEach((score,index)=>{if(score===null)return;const student=studentsInClass[index];if(!student)return;records[`${period}:${subject.id}:${section.id}:${student.learnerId}`]=score;changed++;});
 if(!changed){showToast('Enter at least one score first.');return;}
 storage.set('studentGrades',records);
 if(publish){const published=storage.get('classGradePublications',{});published[classGradePublicationKey(period,subject.id,section.id)]=true;storage.set('classGradePublications',published);showToast(`${ordinal(period)} grading grades published for ${section.name}.`);}
 else showToast(`Grades saved for ${changed} ${changed===1?'student':'students'}.`);
}
async function createStudentInvite(learnerId){
 try{
  const result=await apiRequest(`/api/students/${encodeURIComponent(learnerId)}/invite`,{method:'POST'});
  const expiration=apiTime(result.expiresAt);
  const modal=document.querySelector('#modal-backdrop .modal');
  if(!modal)return;
  modal.innerHTML=`<div class="modal-header"><div><p class="eyebrow">STUDENT ACCOUNT INVITATION</p><h2>${safe(result.studentName)}</h2><p>Share this one-time invitation token with the student. It expires ${safe(expiration)}.</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="field-wrap"><label class="field-label" for="invite-token">Invitation token</label><input class="field-input" id="invite-token" readonly value="${safe(result.inviteToken)}" /></div><div class="update-detail"><p>The student will need their 12-digit LRN, matching name, school email, and a password of at least 10 characters to register.</p></div><div class="modal-actions"><button class="button" data-copy-invite>Copy token</button><button class="button button-primary" data-close>Done</button></div>`;
  showToast('Invitation created. Share the token securely with the student.');
 }catch(error){showToast(error.message);}
}
function openTeacherInviteModal(){
 showModal(`<div class="modal-header"><div><p class="eyebrow">TEACHER ACCESS</p><h2>Invite a teacher</h2><p>The invitation is limited to this email and expires in seven days.</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><form id="teacher-invite-form"><div class="field-wrap"><label class="field-label" for="teacher-invite-email">Teacher email</label><input class="field-input" id="teacher-invite-email" name="email" type="email" required placeholder="teacher@school.edu.ph" /></div><div class="modal-actions"><button class="button" type="button" data-close>Cancel</button><button class="button button-primary" type="submit">Generate invitation</button></div><div id="teacher-invite-error"></div></form>`);
 document.getElementById('teacher-invite-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget,button=form.querySelector('button[type="submit"]');
  const error=document.getElementById('teacher-invite-error');
  button.disabled=true;error.textContent='';
  try{
   const data=new FormData(form);
   const result=await apiRequest('/api/teachers/invite',{method:'POST',body:JSON.stringify({email:String(data.get('email')||'').trim()})});
   const modal=document.querySelector('#modal-backdrop .modal');
   if(!modal)return;
   modal.innerHTML=`<div class="modal-header"><div><p class="eyebrow">TEACHER INVITATION</p><h2>Invitation for ${safe(result.email)}</h2><p>This one-time token expires ${safe(apiTime(result.expiresAt))}. Share it only with this teacher.</p></div><button class="modal-close" data-close aria-label="Close">×</button></div><div class="field-wrap"><label class="field-label" for="invite-token">Teacher invitation token</label><input class="field-input" id="invite-token" readonly value="${safe(result.inviteToken)}" /></div><div class="update-detail"><p>The teacher should select <strong>Create account → Teacher</strong>, use this email address, and paste the invitation token.</p></div><div class="modal-actions"><button class="button" data-copy-invite>Copy token</button><button class="button button-primary" data-close>Done</button></div>`;
  }catch(requestError){error.innerHTML=`<div class="auth-error">${safe(requestError.message)}</div>`;button.disabled=false;}
 });
}
async function copyStudentInvite(){
 const input=document.getElementById('invite-token');
 if(!input)return;
 try{
  await navigator.clipboard.writeText(input.value);
  showToast('Invitation token copied.');
 }catch(error){
  input.focus();input.select();
  showToast(`Could not copy the token automatically. Select and copy it manually: ${error.message}`);
 }
}
function showModal(content){
 const wrapper=document.createElement('div');
 wrapper.className='modal-backdrop';wrapper.id='modal-backdrop';
 wrapper.innerHTML=`<section class="modal" role="dialog" aria-modal="true">${content}</section>`;
 document.body.appendChild(wrapper);
 wrapper.addEventListener('click',event=>{
  const invite=event.target.closest('[data-invite-learner]');
  if(invite){createStudentInvite(invite.dataset.inviteLearner);return;}
  if(event.target.closest('[data-copy-invite]')){copyStudentInvite();return;}
  const action=event.target.closest('[data-trash-action]');
  if(action){
   const itemId=action.dataset.trashId,sectionId=action.dataset.trashSectionId;
   closeModal();
   if(action.dataset.trashAction==='delete-subject')moveSubjectToTrash(itemId);
   else if(action.dataset.trashAction==='delete-section')moveSectionToTrash(itemId,sectionId);
   else if(action.dataset.trashAction==='permanently-delete')permanentlyDeleteTrashItem(itemId);
   return;
  }
  if(event.target===wrapper||event.target.closest('[data-close]'))closeModal();
 });
 document.addEventListener('keydown',escapeModal,{once:true});
}
function escapeModal(event){if(event.key==='Escape')closeModal();}
function closeModal(){document.getElementById('modal-backdrop')?.remove();}
function showToast(message){document.querySelector('.toast')?.remove();const element=document.createElement('div');element.className='toast';element.textContent=message;document.body.appendChild(element);clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.remove(),3000);}
render();
