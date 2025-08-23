// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import AssignmentsPage from './pages/AssignmentsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="courses/:courseId" element={<CourseDetail />} />
        <Route path="assignments" element={<AssignmentsPage />} />
      </Route>
    </Routes>
  );
}

export default App;