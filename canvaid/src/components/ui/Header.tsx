// src/components/Header.tsx
import { Search, Bell, UserCircle } from 'lucide-react';
import useCourseStore from '../../store/courseStore';

const Header = () => {
  const { user, searchQuery, setSearchQuery } = useCourseStore();

  return (
    <header className="flex-shrink-0 bg-rich-slate/50 backdrop-blur-lg border-b border-moonstone/50">
      <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              block w-full bg-moonstone/50 border border-neutral-700 rounded-lg
              pl-10 pr-4 py-2.5 text-neutral-100 placeholder:text-neutral-500
              focus:ring-2 focus:ring-soft-lavender/50 focus:border-soft-lavender transition
            "
          />
        </div>

        {/* User Profile & Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-neutral-300 hover:bg-moonstone hover:text-neutral-100 transition">
            <Bell className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="User avatar" className="h-9 w-9 rounded-full" />
            ) : (
              <UserCircle className="h-9 w-9 text-neutral-400" />
            )}
            <div className="text-right hidden sm:block">
              {user ? (
                <>
                  <p className="text-sm font-medium text-neutral-100">{user.name}</p>
                  <p className="text-xs text-neutral-400">Student</p>
                </>
              ) : (
                <div className="space-y-1">
                  <div className="w-24 h-4 bg-moonstone rounded animate-pulse"></div>
                  <div className="w-16 h-3 bg-moonstone rounded animate-pulse ml-auto"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;