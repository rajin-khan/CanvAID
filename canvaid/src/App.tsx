// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';
import AssignmentsPage from './pages/AssignmentsPage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import useCourseStore from './store/courseStore';

function App() {
  const canvasKey = useCourseStore(state => state.apiKeys.canvas);
  const groqKey = useCourseStore(state => state.apiKeys.groq);
  // --- REMOVED: institutionUrl ---

  // --- MODIFIED: Simplified credentials check ---
  const hasCredentials = !!canvasKey && !!groqKey;

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={hasCredentials ? <Dashboard /> : <WelcomePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="assignments" element={<AssignmentsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;