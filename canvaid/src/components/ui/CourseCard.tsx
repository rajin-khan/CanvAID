// src/components/CourseCard.tsx
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CourseCardProps {
  title: string;
  instructor: string;
  progress: number;
}

const CourseCard = ({ title, instructor, progress }: CourseCardProps) => {
  return (
    // Gradient Border Effect: Outer div has the gradient and padding
    <div className="
      p-[1px] rounded-2xl bg-linear-to-br from-moonstone to-rich-slate
      h-full transition-all duration-300 group hover:shadow-2xl hover:shadow-soft-lavender/10
    ">
      {/* Inner div has the background color, creating the border effect */}
      <div className="
        bg-rich-slate rounded-[15px] h-full p-6
        flex flex-col justify-between relative overflow-hidden
      ">
        {/* Hover Glow Effect */}
        <div className="
          absolute -top-1/2 -left-1/2 w-[200%] h-[200%] 
          
          /* --- THIS IS THE CORRECTED LINE --- */
          bg-[radial-gradient(circle_at_center,theme(colors.soft-lavender/0.1),transparent_40%)]

          opacity-0 group-hover:opacity-100 transition-opacity duration-500
          animate-spin [animation-duration:5s]
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
          <button className="flex items-center text-sm font-medium text-neutral-300 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View Course <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;