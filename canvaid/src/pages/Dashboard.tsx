// src/pages/Dashboard.tsx
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import useCourseStore from '../store/courseStore';
import { getCourses, getAssignments, getAnnouncements } from '../services/canvasAPI';
import { type CanvasAnnouncement, type CanvasCourse } from '../types/canvas';

import CourseCard from '../components/ui/CourseCard';
import AssignmentCard from '../components/ui/AssignmentCard';
import StatsCard from '../components/ui/StatsCard';
import { DashboardSkeleton } from './DashboardSkeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { BookCopy, Calendar, Glasses, Megaphone, Sparkles } from 'lucide-react';
import { AnnouncementModal } from '../components/modals/AnnouncementModal';
import { Skeleton } from '../components/ui/Skeleton';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const AnnouncementItem = ({ announcement, course, onClick }: { announcement: CanvasAnnouncement, course?: CanvasCourse, onClick: () => void }) => (
    <motion.div variants={itemVariants}>
        <button 
            onClick={onClick}
            className="w-full text-left p-4 bg-rich-slate/60 border border-moonstone/50 rounded-xl transition-all duration-300 group hover:bg-moonstone/60 hover:border-soft-lavender/50"
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-100 line-clamp-2">{announcement.title}</p>
                    <p className="text-xs text-neutral-400 mt-1">{course?.course_code || 'General'}</p>
                </div>
                <Sparkles className="w-4 h-4 text-neutral-500 flex-shrink-0 ml-4 transition-colors group-hover:text-gentle-peach" />
            </div>
            <p className="text-xs text-neutral-500 mt-3 text-right">{formatDistanceToNow(new Date(announcement.posted_at), { addSuffix: true })}</p>
        </button>
    </motion.div>
);


const Dashboard = () => {
  const { 
    user, 
    courses, 
    assignments, 
    announcements, 
    searchQuery, 
    setCourses, 
    setAssignments,
    setAnnouncements 
  } = useCourseStore();
  
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<CanvasAnnouncement | null>(null);

  const { data: coursesData, isLoading: coursesLoading, isError: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const { data: assignmentsData, isLoading: assignmentsLoading, isError: assignmentsError } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  const { data: announcementsData, isLoading: announcementsLoading } = useQuery({
    queryKey: ['announcements', coursesData],
    queryFn: () => getAnnouncements(coursesData!),
    enabled: !!coursesData && coursesData.length > 0,
  });

  useEffect(() => {
    if (coursesData) setCourses(coursesData);
  }, [coursesData, setCourses]);

  useEffect(() => {
    if (assignmentsData) setAssignments(assignmentsData);
  }, [assignmentsData, setAssignments]);

  useEffect(() => {
    if (announcementsData) {
      const sorted = announcementsData.sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());
      setAnnouncements(sorted);
    }
  }, [announcementsData, setAnnouncements]);
  
  const firstName = user?.name.split(' ')[0] || 'there';
  
  const filteredCourses = useMemo(() => {
    if (!searchQuery) return courses;
    return courses.filter(course =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  const isLoading = coursesLoading || assignmentsLoading;
  const isError = coursesError || assignmentsError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay message="Could not load your Canvas data. Please check your API Keys and Institution URL in Settings." />;
  }

  const assignmentsDueSoon = assignments.filter(a => a.due_at && new Date(a.due_at) > new Date()).length;

  return (
    <>
      <AnimatePresence>
        {selectedAnnouncement && (
          <AnnouncementModal
            announcement={selectedAnnouncement}
            onClose={() => setSelectedAnnouncement(null)}
          />
        )}
      </AnimatePresence>
      <div className="space-y-8 animate-fadeIn">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
            Hello, <span className="bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">{firstName}</span>!
          </h1>
          <p className="text-neutral-300 mt-1">Ready to turn chaos into clarity? Let's get started.</p>
        </motion.div>
        
        <div className="space-y-4">
            <motion.h2 className="flex items-center text-xl font-medium text-neutral-100" variants={itemVariants} initial="hidden" animate="visible">
                <Glasses className="w-5 h-5 mr-3 text-neutral-400"/>
                At a Glance
            </motion.h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div variants={itemVariants}><StatsCard title="Active Courses" value={courses.length.toString()} icon={BookCopy} trend="Ready to synthesize" color="lavender" /></motion.div>
              <motion.div variants={itemVariants}><StatsCard title="Assignments Due" value={assignmentsDueSoon.toString()} icon={Calendar} trend="Upcoming deadlines" color="peach" /></motion.div>
              <motion.div variants={itemVariants}><StatsCard title="Recent Announcements" value={announcements.length.toString()} icon={Megaphone} trend="Stay up to date" color="mint" /></motion.div>
            </motion.div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.h2 className="flex items-center text-xl font-medium text-neutral-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <BookCopy className="w-5 h-5 mr-3 text-neutral-400"/>
                Your Courses
            </motion.h2>
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="visible" transition={{ delayChildren: 0.4, staggerChildren: 0.1 }}>
              {filteredCourses.map((course) => {
                // FIX: Replaced Math.random() with a deterministic calculation based on course ID.
                // This ensures the progress bar value is stable and consistent for each course
                // across page loads and re-renders.
                const progress = (course.id % 61) + 30; // Generates a stable number between 30 and 90

                return (
                  <motion.div variants={itemVariants} key={course.id}>
                    <CourseCard 
                      id={course.id} 
                      title={course.name} 
                      instructor={course.instructor?.name ?? 'N/A'} 
                      progress={progress} 
                    />
                  </motion.div>
                );
              })}
            </motion.div>
            {filteredCourses.length === 0 && (
              <div className="text-center py-10 bg-rich-slate/50 rounded-lg">
                <p className="text-neutral-300">No courses match your search.</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col space-y-6">
            <div className="flex-shrink-0">
              <motion.h2 className="flex items-center text-xl font-medium text-neutral-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <Calendar className="w-5 h-5 mr-3 text-neutral-400"/>
                Up Next
              </motion.h2>
              <motion.div className="space-y-4 mt-4" variants={containerVariants} initial="hidden" animate="visible" transition={{ delayChildren: 0.6, staggerChildren: 0.1 }}>
                {assignments.slice(0, 5).map(assignment => (
                  <motion.div variants={itemVariants} key={assignment.id}>
                    <AssignmentCard title={assignment.name} course={assignment.course_code ?? 'Course'} dueDate={assignment.due_at ? `Due ${formatDistanceToNow(new Date(assignment.due_at), { addSuffix: true })}` : 'No due date'} priority={assignment.points_possible > 75 ? 'high' : assignment.points_possible > 30 ? 'medium' : 'low'} />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">
              <motion.h2 className="flex items-center text-xl font-medium text-neutral-100 flex-shrink-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <Megaphone className="w-5 h-5 mr-3 text-neutral-400"/>
                Recent Announcements
              </motion.h2>
              <div className="flex-1 overflow-y-auto mt-4 pr-2 -mr-2 space-y-4 scrollbar-thin scrollbar-thumb-moonstone scrollbar-track-rich-slate">
                {announcementsLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-[92px] w-full" />
                    <Skeleton className="h-[92px] w-full" />
                    <Skeleton className="h-[92px] w-full" />
                  </div>
                ) : announcements.length > 0 ? (
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {announcements.map(ann => (
                      <AnnouncementItem 
                        key={ann.id}
                        announcement={ann}
                        course={courses.find(c => `course_${c.id}` === ann.context_code)}
                        onClick={() => setSelectedAnnouncement(ann)}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-10 bg-rich-slate/50 rounded-lg h-full flex items-center justify-center">
                    <p className="text-sm text-neutral-400">No recent announcements.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;