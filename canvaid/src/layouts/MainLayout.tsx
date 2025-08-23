// src/layouts/MainLayout.tsx
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Sidebar from '../components/ui/Sidebar';
import Header from '../components/ui/Header';
import useCourseStore from '../store/courseStore';
import { getSelf } from '../services/canvasAPI';

const MainLayout = () => {
  const { setUser } = useCourseStore();

  // Fetch the user's profile data when the layout mounts
  const { data: userData } = useQuery({
    queryKey: ['self'],
    queryFn: getSelf,
    // This query will not be refetched as often, as user data is less likely to change
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // When the data is fetched, update the global store
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  return (
    <div className="flex h-screen bg-deepest-ink text-neutral-200 aurora-background">
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