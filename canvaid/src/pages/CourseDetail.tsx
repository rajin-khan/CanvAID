// src/pages/CourseDetail.tsx
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, FileText, BookOpen } from 'lucide-react';

import useCourseStore from '../store/courseStore';
import apiClient from '../services/apiClient';
import { type CanvasModule } from '../types/canvas'; // We will add this type
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';

// --- API Function ---
// Fetches the modules for a specific course
const getCourseModules = (courseId: string): Promise<CanvasModule[]> => {
  return apiClient(`/api/v1/courses/${courseId}/modules?include[]=items`);
};

const CourseDetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-1/4" />
    <Skeleton className="h-10 w-1/2" />
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  </div>
);

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourseStore();
  const course = courses.find(c => c.id.toString() === courseId);

  const { data: modules, isLoading, isError } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => getCourseModules(courseId!),
    enabled: !!courseId, // Only run the query if courseId exists
  });

  if (!course) {
    // This can happen on a page refresh before the store is hydrated
    // A more robust solution might fetch the single course details here
    return <div>Loading course information...</div>;
  }
  
  return (
    <div className="animate-fadeIn">
      <Link to="/" className="flex items-center text-soft-lavender hover:text-violet-300 mb-6 group">
        <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold tracking-tight text-neutral-50">{course.name}</h1>
      <p className="text-neutral-300 mt-1">Instructor: {course.instructor?.name ?? 'N/A'}</p>

      <div className="mt-8">
        <h2 className="text-xl font-medium text-neutral-100 mb-4">Course Modules & Materials</h2>
        {isLoading && <CourseDetailSkeleton />}
        {isError && <ErrorDisplay message="Could not load course modules." />}
        
        <div className="space-y-4">
          {modules?.map(module => (
            <div key={module.id} className="bg-rich-slate/70 border border-moonstone/50 rounded-xl p-4">
              <h3 className="font-semibold text-neutral-100">{module.name}</h3>
              <ul className="mt-2 space-y-2">
                {module.items?.map(item => (
                  <li key={item.id} className="flex items-center text-neutral-300 pl-4 py-1 border-l-2 border-moonstone">
                    {item.type === 'File' ? <FileText className="w-4 h-4 mr-3 text-gentle-peach" /> : <BookOpen className="w-4 h-4 mr-3 text-fresh-mint" />}
                    <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-soft-lavender hover:underline">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;