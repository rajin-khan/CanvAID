// src/components/AssignmentCard.tsx
import { MoreVertical } from "lucide-react";

interface AssignmentCardProps {
    title: string;
    course: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
}

const priorityDotClasses = {
    high: 'bg-gentle-peach',
    medium: 'bg-soft-lavender',
    low: 'bg-fresh-mint',
}

const AssignmentCard = ({ title, course, dueDate, priority }: AssignmentCardProps) => {
  return (
    <div className="
      flex items-center p-4 bg-rich-slate/70 border border-moonstone/50 
      rounded-xl transition-all duration-200 group
      hover:bg-moonstone/80 hover:border-soft-lavender/50
    ">
      <div className={`w-2 h-10 rounded-full mr-4 ${priorityDotClasses[priority]}`}></div>
      <div className="flex-1">
        <p className="text-base font-medium text-neutral-100">{title}</p>
        <div className="flex items-center text-xs text-neutral-400 mt-1 space-x-2">
            <span>{course}</span>
            <span className="text-neutral-600">•</span>
            <span>{dueDate}</span>
        </div>
      </div>
      <button className="p-2 rounded-full text-neutral-400 hover:bg-rich-slate hover:text-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreVertical size={18} />
      </button>
    </div>
  );
};

export default AssignmentCard;