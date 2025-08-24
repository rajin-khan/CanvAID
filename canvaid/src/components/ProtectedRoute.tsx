// src/components/ProtectedRoute.tsx
import { Outlet, Navigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';

const ProtectedRoute = () => {
  // THE FIX: Select each piece of state individually here as well for stability.
  const canvasKey = useCourseStore(state => state.apiKeys.canvas);
  const groqKey = useCourseStore(state => state.apiKeys.groq);
  const institutionUrl = useCourseStore(state => state.institutionUrl);

  // If all credentials are present, the user is "logged in"
  if (canvasKey && groqKey && institutionUrl) {
    return <Outlet />;
  }
  
  // If anything is missing, redirect to the settings page
  return <Navigate to="/settings" replace />;
};

export default ProtectedRoute;