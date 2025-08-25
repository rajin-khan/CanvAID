// src/components/ProtectedRoute.tsx
import { Outlet, Navigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';

const ProtectedRoute = () => {
  const canvasKey = useCourseStore(state => state.apiKeys.canvas);
  const groqKey = useCourseStore(state => state.apiKeys.groq);
  // --- REMOVED: institutionUrl ---

  // --- MODIFIED: Simplified credentials check ---
  if (canvasKey && groqKey) {
    return <Outlet />;
  }
  
  return <Navigate to="/settings" replace />;
};

export default ProtectedRoute;