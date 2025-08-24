// src/layouts/MainLayout.tsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/ui/Sidebar';
import Header from '../components/ui/Header';
import useCourseStore from '../store/courseStore';
import { getSelf } from '../services/canvasAPI';

const MainLayout = () => {
  const { setUser, apiKeys } = useCourseStore();

  const { data: userData, isError } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
    enabled: !!apiKeys.canvas, // Only fetch user data if the canvas key exists
    staleTime: Infinity, // User data rarely changes, cache it indefinitely
    retry: 1, // Don't retry endlessly on auth errors
  });

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
    if(isError) {
      // The apiClient will have already logged the user out on a 401
      console.error("Failed to fetch user profile, likely due to invalid key.");
    }
  }, [userData, setUser, isError]);

  return (
    <div className="flex h-screen bg-deepest-ink text-neutral-200 aurora-background">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#27272A',
            color: '#fafafa',
            border: '1px solid #404040',
          },
        }}
      />
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;