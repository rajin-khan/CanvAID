// src/components/ui/StatsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  color: 'lavender' | 'peach' | 'mint';
}

const colorClasses = {
    lavender: 'text-soft-lavender',
    peach: 'text-gentle-peach',
    mint: 'text-fresh-mint',
}

const bgClasses = {
    lavender: 'bg-soft-lavender/10',
    peach: 'bg-gentle-peach/10',
    mint: 'bg-fresh-mint/10',
}

const StatsCard = ({ title, value, icon: Icon, trend, color }: StatsCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`
        ${bgClasses[color]} border border-moonstone/50 rounded-2xl p-5
        shadow-lg shadow-black/20
      `}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-300">{title}</p>
        <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
      </div>
      <div className="mt-2">
        {/* RESPONSIVE FIX: Added break-words to handle wrapping */}
        <p className="text-3xl font-semibold text-neutral-50 break-words">{value}</p>
        <p className="text-xs text-neutral-400 mt-1">{trend}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;