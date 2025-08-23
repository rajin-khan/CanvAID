// src/components/Sidebar.tsx
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Settings, LifeBuoy } from 'lucide-react';

const NavItem = ({ icon: Icon, text, href, active = false }: { icon: React.ElementType; text: string; href: string; active?: boolean }) => (
  <Link to={href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${active ? 'bg-soft-lavender/10 text-neutral-50 shadow-inner shadow-soft-lavender/5' : 'text-neutral-400 hover:bg-rich-slate hover:text-neutral-100'}`}>
    <Icon className={`w-5 h-5 mr-3 transition-transform duration-200 ${active ? 'text-soft-lavender' : 'group-hover:scale-110'}`} />
    <span>{text}</span>
  </Link>
);

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex flex-col w-64 bg-rich-slate/50 backdrop-blur-lg border-r border-moonstone/50">
      <div className="flex items-center justify-center h-20 border-b border-moonstone/50">
        <Link to="/" className="text-2xl font-bold tracking-tighter bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">
          CanvAID
        </Link>
      </div>
      <div className="flex-1 flex flex-col pt-6 px-4 space-y-2">
        <NavItem icon={Home} text="Dashboard" href="/" active={location.pathname === '/'} />
        {/* The href="#" below is a placeholder. You would make these real links as you build out those pages. */}
        <NavItem icon={BookOpen} text="Courses" href="#" active={location.pathname.startsWith('/courses')} />
        <NavItem icon={CheckSquare} text="Assignments" href="#" active={location.pathname.startsWith('/assignments')} />
        
        <div className="flex-grow" />
        
        <NavItem icon={LifeBuoy} text="Help & Support" href="#" />
        <NavItem icon={Settings} text="Settings" href="#" />
        
        <div className="p-4 mt-4 bg-moonstone/30 rounded-lg text-center border border-moonstone/50">
            <p className="text-sm font-semibold text-neutral-200">Unlock Your Potential</p>
            <p className="text-xs text-neutral-400 mt-1">Go Pro for unlimited study material generation.</p>
            <button className="mt-4 text-sm font-semibold text-white bg-linear-to-r from-violet-500 to-pink-500 px-4 py-2.5 rounded-lg w-full transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-2px] focus:ring-4 focus:ring-violet-500/40">
                Upgrade Now
            </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;