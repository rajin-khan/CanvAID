// src/components/CourseCard.tsx
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  id: number;
  title: string;
  instructor: string;
  progress: number;
}

const CourseCard = ({ id, title, instructor, progress }: CourseCardProps) => {
  return (
    <Link to={`/courses/${id}`} className="block h-full group">
      <div className="
        p-[1px] rounded-2xl bg-linear-to-br from-moonstone to-rich-slate
        h-full transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-soft-lavender/10
      ">
        <div className="
          bg-deepest-ink rounded-[15px] h-full p-6
          flex flex-col justify-between relative overflow-hidden
          transition-all duration-300 group-hover:bg-rich-slate
        ">
          {/* --- PERFORMANCE OVERHAUL: Replaced animated spin with a static glow that fades in --- */}
          <div className="
            absolute -inset-24
            bg-[radial-gradient(circle_at_center,theme(colors.soft-lavender/0.1),transparent_40%)]
            opacity-0 group-hover:opacity-100 transition-opacity duration-500
          "></div>
          
          <div className="relative z-10">
            <p className="text-sm font-medium text-soft-lavender">{instructor}</p>
            <h3 className="text-lg font-medium text-neutral-50 mt-1">{title}</h3>
          </div>

          <div className="relative z-10 mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-neutral-300">Progress</span>
              <span className="text-sm font-medium text-neutral-100">{progress}%</span>
            </div>
            <div className="w-full bg-moonstone rounded-full h-2">
              <div
                className="bg-linear-to-r from-soft-lavender to-gentle-peach h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center text-sm font-medium text-neutral-300 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
              View Course <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;