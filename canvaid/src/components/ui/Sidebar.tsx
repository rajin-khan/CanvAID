// src/components/ui/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Home, CheckSquare, Settings, LifeBuoy } from 'lucide-react';
import useCourseStore from '../../store/courseStore';
import { type CanvasCourse } from '../../types/canvas';
import { Skeleton } from './Skeleton';

// Animation variants for staggered list items
const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

// Reusable NavItem for primary navigation
const NavItem = ({ icon: Icon, text, href, active = false }: { icon: React.ElementType; text: string; href: string; active?: boolean; }) => (
  <motion.li variants={itemVariants}>
    <Link
      to={href}
      className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 group ${
        active
          ? 'bg-moonstone text-neutral-50'
          : 'text-neutral-400 hover:bg-rich-slate hover:text-neutral-100'
      }`}
    >
      <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${active ? 'text-soft-lavender' : 'group-hover:scale-110'}`} />
      <span>{text}</span>
    </Link>
  </motion.li>
);

// New component for the dynamic course list
const CourseNavItem = ({ course, active = false }: { course: CanvasCourse; active?: boolean; }) => (
  <motion.li variants={itemVariants}>
    <Link
      to={`/courses/${course.id}`}
      className={`relative flex items-center pl-4 pr-3 py-2 text-sm rounded-md transition-colors duration-200 group ${
        active
          ? 'bg-rich-slate text-neutral-50'
          : 'text-neutral-400 hover:bg-moonstone hover:text-neutral-100'
      }`}
    >
      {/* Active indicator bar */}
      {active && <motion.div layoutId="activeCourse" className="absolute left-0 top-1 bottom-1 w-1 bg-soft-lavender rounded-r-full" />}
      {/* CHANGE 1: Dot color updated to yellow/peach */}
      <span className="w-2 h-2 rounded-full bg-gentle-peach mr-3 flex-shrink-0"></span>
      <span className="truncate">{course.name}</span>
    </Link>
  </motion.li>
);

const Sidebar = () => {
  const location = useLocation();
  const { courses, apiKeys } = useCourseStore();
  const isLoggedIn = !!apiKeys.canvas && !!apiKeys.groq;

  // Find the current course ID from the URL for active state highlighting
  const currentCourseId = location.pathname.startsWith('/courses/') ? location.pathname.split('/')[2] : null;
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-rich-slate/80 border-r border-moonstone/50 h-full">
      {/* Logo Header */}
      <div className="flex items-center h-20 px-4 border-b border-moonstone/50 flex-shrink-0">
        <Link to="/" className="flex items-center w-full">
          <img src="/logo.png" alt="CanvAID Logo" className="h-8 w-8 mr-3" />
          <span className="text-2xl font-bold tracking-tighter bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">
            CanvAID
          </span>
        </Link>
      </div>

      {/* Main Scrolling Area */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
        <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-1">
          <NavItem icon={Home} text="Dashboard" href="/" active={location.pathname === '/'} />
          <NavItem icon={CheckSquare} text="Assignments" href="/assignments" active={location.pathname.startsWith('/assignments')} />
        </motion.ul>

        {isLoggedIn && (
          <div>
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">My Courses</h3>
            {courses.length > 0 ? (
              <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-1">
                {courses.map(course => (
                  <CourseNavItem key={course.id} course={course} active={currentCourseId === course.id.toString()} />
                ))}
              </motion.ul>
            ) : (
                // Skeleton loader for courses
                <div className="space-y-2 px-2 mt-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Area */}
      <div className="px-3 py-4 border-t border-moonstone/50 flex-shrink-0">
        <motion.ul variants={listVariants} initial="hidden" animate="visible" className="space-y-1 mb-4">
          <NavItem icon={Settings} text="Settings" href="/settings" active={location.pathname === '/settings'} />
          <NavItem icon={LifeBuoy} text="Help & Support" href="#" />
        </motion.ul>
        
        {/* CHANGE 2: Added the premium/upgrade block back */}
        {isLoggedIn && (
          <div className="p-4 bg-moonstone/30 rounded-lg text-center border border-moonstone/50">
              <p className="text-sm font-semibold text-neutral-200">Unlock Your Potential</p>
              <p className="text-xs text-neutral-400 mt-1">Go Pro for unlimited study material generation.</p>
              <button className="mt-4 text-sm font-semibold text-white bg-linear-to-r from-violet-500 to-pink-500 px-4 py-2.5 rounded-lg w-full transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-2px] focus:ring-4 focus:ring-violet-500/40">
                  Upgrade Now
              </button>
          </div>
        )}
        {/* CHANGE 3: Removed the redundant user profile section from the sidebar */}
      </div>
    </div>
  );
};

export default Sidebar;