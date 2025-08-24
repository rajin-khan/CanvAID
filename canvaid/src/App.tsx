// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import AssignmentsPage from './pages/AssignmentsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';

function App() {
  const hasKeys = !!useCourseStore.getState().apiKeys.canvas && !!useCourseStore.getState().apiKeys.groq;

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={hasKeys ? <Dashboard /> : <WelcomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="assignments" element={<AssignmentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

import useCourseStore from './store/courseStore';
export default App;