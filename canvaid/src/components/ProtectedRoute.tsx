// src/components/ProtectedRoute.tsx
import { Outlet, Navigate } from 'react-router-dom';
import useCourseStore from '../store/courseStore';

const ProtectedRoute = () => {
  const { canvas, groq } = useCourseStore(state => state.apiKeys);

  // If both keys are present, the user is "logged in" and can access the app content
  if (canvas && groq) {
    return <Outlet />;
  }
  
  // If keys are missing, redirect to the settings page so the user can add them
  return <Navigate to="/settings" replace />;
};

export default ProtectedRoute;