import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/LoginPages'; 
import StudentList from './pages/student/StudentList';
import Attendancelist from './pages/attendance/AttendanceList';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentAssignment from './pages/student/StudentAssignment';
import StudentResult from './pages/student/StudentResult';
import StudentProfile from './pages/student/StudentProfile';
import StudentMainPage from './pages/student/StudentMainPage';
import StudentSubject from './pages/student/StudentSubject';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentList />} />
        <Route path="/attendance" element={<AttendanceList />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/assignment" element={<StudentAssignment />} />
        <Route path="/result" element={<StudentResult />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/student/main" element={<StudentMainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
