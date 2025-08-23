// src/pages/CourseDetail.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, FileText, BookOpen, Sparkles, Loader } from 'lucide-react';

import useCourseStore from '../store/courseStore';
import apiClient from '../services/apiClient';
import { generateStudyGuide } from '../services/groqAPI';
import { type CanvasModule } from '../types/canvas';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { StudyGuideDisplay } from '../components/StudyGuideDisplay';

// API Function to fetch modules for a specific course
const getCourseModules = (courseId: string): Promise<CanvasModule[]> => {
  return apiClient(`/api/v1/courses/${courseId}/modules?include[]=items`);
};

const CourseDetailSkeleton = () => (
    <div className="space-y-6 mt-8">
      <Skeleton className="h-10 w-1/2" />
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
);

const AILoadingIndicator = () => (
    <div className="flex flex-col items-center justify-center bg-rich-slate/50 p-6 rounded-xl border border-moonstone/50 mt-6">
        <Loader className="w-8 h-8 text-soft-lavender animate-spin"/>
        <p className="mt-4 text-neutral-300">CanvAID is thinking...</p>
        <p className="text-sm text-neutral-400">Generating your personalized study guide.</p>
    </div>
);


const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourseStore();
  const course = courses.find(c => c.id.toString() === courseId);

  // State for AI generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyGuideContent, setStudyGuideContent] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const { data: modules, isLoading, isError } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => getCourseModules(courseId!),
    enabled: !!courseId,
  });

  const handleGenerateStudyGuide = async () => {
    if (!modules || !course) return;

    setIsGenerating(true);
    setAiError(null);
    setStudyGuideContent(null);

    // 1. Compile course content into a structured string
    const courseContentText = modules.map(module => 
      `Module: ${module.name}\n` + 
      (module.items?.map(item => `  - ${item.title} (Type: ${item.type})`).join('\n') || '  (No items in this module)')
    ).join('\n\n');

    try {
      // 2. Call the Groq API
      const generatedContent = await generateStudyGuide(course.name, courseContentText);
      setStudyGuideContent(generatedContent);
    } catch (error) {
      console.error("Error generating study guide:", error);
      setAiError("Sorry, there was an issue generating the study guide. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!course) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader className="w-12 h-12 text-soft-lavender animate-spin" />
        </div>
    );
  }
  
  return (
    <div className="animate-fadeIn">
      <Link to="/" className="flex items-center text-soft-lavender hover:text-violet-300 mb-6 group">
        <ChevronLeft className="w-5 h-5 mr-1 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">{course.name}</h1>
            <p className="text-neutral-300 mt-1">Instructor: {course.instructor?.name ?? 'N/A'}</p>
        </div>
        <button
            onClick={handleGenerateStudyGuide}
            disabled={isGenerating || isLoading}
            className="
            mt-4 md:mt-0 flex items-center justify-center px-5 py-3 font-semibold text-white rounded-lg transition-all duration-300
            bg-linear-to-r from-violet-500 to-pink-500
            hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-2px]
            focus:ring-4 focus:ring-violet-500/40
            disabled:bg-moonstone disabled:from-moonstone disabled:to-moonstone disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0
            "
        >
            {isGenerating ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {isGenerating ? 'Generating...' : 'Generate Study Guide'}
        </button>
      </div>

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

        {/* AI Results Section */}
        {isGenerating && <AILoadingIndicator />}
        {aiError && <ErrorDisplay message={aiError} />}
        {studyGuideContent && <StudyGuideDisplay content={studyGuideContent} />}

      </div>
    </div>
  );
};

export default CourseDetail;