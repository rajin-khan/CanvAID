// src/components/ui/AnnouncementCard.tsx
import { motion } from 'framer-motion';
import { Megaphone } from 'lucide-react';

interface AnnouncementCardProps {
  title: string;
  courseCode: string;
  snippet: string;
  postedAt: string;
  onClick: () => void; // MODIFIED: Changed from html_url to an onClick handler
}

const AnnouncementCard = ({ title, courseCode, snippet, postedAt, onClick }: AnnouncementCardProps) => {
  return (
    // MODIFIED: Changed from <a> tag to <motion.button>
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(253, 186, 116, 0.1), 0 4px 6px -2px rgba(253, 186, 116, 0.05)' }}
      className="
        block p-4 bg-rich-slate/70 rounded-2xl w-80 flex-shrink-0 text-left
        border border-moonstone/50 group transition-colors duration-200
        hover:border-gentle-peach/50
      "
    >
      <div className="flex items-start">
        <div className="p-2 bg-moonstone rounded-lg mr-4">
          <Megaphone className="w-5 h-5 text-gentle-peach" />
        </div>
        <div className="flex-1 truncate">
          <p className="text-sm font-semibold text-neutral-100 truncate">{title}</p>
          <p className="text-xs text-neutral-400">{courseCode}</p>
        </div>
      </div>
      <p className="text-sm text-neutral-300 mt-3 line-clamp-2 h-10">{snippet}</p>
      <p className="text-xs text-neutral-500 mt-3 text-right">{postedAt}</p>
    </motion.button>
  );
};

export default AnnouncementCard;