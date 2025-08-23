// src/pages/CourseDetail.tsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, FileText, BookOpen, Sparkles, Loader } from 'lucide-react';

import useCourseStore from '../store/courseStore';
import apiClient from '../services/apiClient';
import { generateStudyGuide, generateFlashcards, type Flashcard as FlashcardType } from '../services/groqAPI';
import { type CanvasModule } from '../types/canvas';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { StudyGuideDisplay } from '../components/StudyGuideDisplay';
import { Flashcard } from '../components/Flashcard';

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
        <p className="text-sm text-neutral-400">Crafting your personalized study materials.</p>
    </div>
);


const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { courses } = useCourseStore();
  const course = courses.find(c => c.id.toString() === courseId);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState<'guide' | 'flashcards' | null>(null);
  const [studyGuideContent, setStudyGuideContent] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardType[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const { data: modules, isLoading, isError } = useQuery({
    queryKey: ['courseModules', courseId],
    queryFn: () => getCourseModules(courseId!),
    enabled: !!courseId,
  });

  const handleGenerate = async (type: 'guide' | 'flashcards') => {
    if (!modules || !course) return;

    setIsGenerating(true);
    setGenerationType(type);
    setAiError(null);
    setStudyGuideContent(null);
    setFlashcards(null);

    const courseContentText = modules
      .filter(module => module.items_count > 0 && module.items) // Ensure items exist before mapping
      .map(module => 
      `Module: ${module.name}\n` + 
      (module.items?.map(item => `  - ${item.title} (Type: ${item.type})`).join('\n') || '')
    ).join('\n\n');

    if (!courseContentText.trim()) {
        setAiError("This course doesn't have any materials to generate a study aid from.");
        setIsGenerating(false);
        return;
    }

    try {
      if (type === 'guide') {
        const generatedContent = await generateStudyGuide(course.name, courseContentText);
        setStudyGuideContent(generatedContent);
      } else if (type === 'flashcards') {
        const generatedFlashcards = await generateFlashcards(course.name, courseContentText);
        setFlashcards(generatedFlashcards);
      }
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      setAiError(`Sorry, there was an issue generating the ${type}. Please try again.`);
    } finally {
      setIsGenerating(false);
      setGenerationType(null);
    }
  };

  if (isLoading && !course) {
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
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">{course?.name || <Skeleton className="h-9 w-80" />}</h1>
            <p className="text-neutral-300 mt-1">Instructor: {course?.instructor?.name ?? 'N/A'}</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
            <button
                onClick={() => handleGenerate('guide')}
                disabled={isGenerating || isLoading}
                className="flex items-center justify-center px-4 py-2 font-semibold text-white rounded-lg transition-all duration-300 bg-linear-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-1px] focus:ring-4 focus:ring-violet-500/40 disabled:bg-moonstone disabled:from-moonstone disabled:to-moonstone disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
            >
                {isGenerating && generationType === 'guide' ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isGenerating && generationType === 'guide' ? 'Generating...' : 'Study Guide'}
            </button>
            <button
                onClick={() => handleGenerate('flashcards')}
                disabled={isGenerating || isLoading}
                className="flex items-center justify-center px-4 py-2 font-semibold text-neutral-200 rounded-lg transition-all duration-300 bg-rich-slate border border-moonstone/50 hover:bg-moonstone hover:text-white hover:border-soft-lavender/50 disabled:bg-moonstone disabled:cursor-not-allowed"
            >
                {isGenerating && generationType === 'flashcards' ? <Loader className="w-5 h-5 mr-2 animate-spin" /> : <Sparkles className="w-5 h-5 mr-2" />}
                {isGenerating && generationType === 'flashcards' ? 'Generating...' : 'Flashcards'}
            </button>
        </div>
      </div>
      
      <div className="mt-8">
        {isGenerating && <AILoadingIndicator />}
        {aiError && <ErrorDisplay message={aiError} />}
        {studyGuideContent && <StudyGuideDisplay content={studyGuideContent} />}
        {flashcards && flashcards.length > 0 && (
            <div className="mt-6">
                <h3 className="text-2xl font-bold text-neutral-100 mb-4">Key Concepts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {flashcards.map((card, index) => (
                        <Flashcard key={index} card={card} />
                    ))}
                </div>
            </div>
        )}
        {flashcards && flashcards.length === 0 && !isGenerating && (
          <ErrorDisplay message="The AI couldn't identify any key concepts to create flashcards from." />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-medium text-neutral-100 mb-4">Course Modules & Materials</h2>
        {isLoading && <CourseDetailSkeleton />}
        {isError && <ErrorDisplay message="Could not load course modules." />}
        
        <div className="space-y-4">
          {modules?.map(module => (
            <div key={module.id} className="bg-rich-slate/70 border border-moonstone/50 rounded-xl p-4">
              <h3 className="font-semibold text-neutral-100">{module.name}</h3>
              {/* --- THIS IS THE CORRECTED LOGIC --- */}
              {module.items && module.items.length > 0 ? (
                <ul className="mt-2 space-y-2">
                  {module.items.map(item => (
                    <li key={item.id} className="flex items-center text-neutral-300 pl-4 py-1 border-l-2 border-moonstone">
                      {item.type === 'File' ? <FileText className="w-4 h-4 mr-3 text-gentle-peach" /> : <BookOpen className="w-4 h-4 mr-3 text-fresh-mint" />}
                      <a href={item.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-soft-lavender hover:underline">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400 mt-2 pl-4">No items in this module.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;