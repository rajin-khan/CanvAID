// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

import useCourseStore from '../store/courseStore';
import { getCourses, getAssignments } from '../services/canvasAPI';

import CourseCard from '../components/ui/CourseCard';
import AssignmentCard from '../components/ui/AssignmentCard';
import StatsCard from '../components/ui/StatsCard';
import { DashboardSkeleton } from './DashboardSkeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { BookCopy, CheckCircle, Clock } from 'lucide-react';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

const Dashboard = () => {
  const { user, courses, assignments, setCourses, setAssignments } = useCourseStore();

  const { data: coursesData, isLoading: coursesLoading, isError: coursesError } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  });

  const { data: assignmentsData, isLoading: assignmentsLoading, isError: assignmentsError } = useQuery({
    queryKey: ['assignments'],
    queryFn: getAssignments,
  });

  useEffect(() => {
    if (coursesData) setCourses(coursesData);
  }, [coursesData, setCourses]);

  useEffect(() => {
    if (assignmentsData) setAssignments(assignmentsData);
  }, [assignmentsData, setAssignments]);
  
  const firstName = user?.name.split(' ')[0] || 'there';
  
  const isLoading = coursesLoading || assignmentsLoading;
  const isError = coursesError || assignmentsError;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <ErrorDisplay message="Could not load your Canvas data. Please check your connection and try again." />;
  }

  const assignmentsDueSoon = assignments.filter(a => a.due_at && new Date(a.due_at) > new Date()).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          Hello, <span className="bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">{firstName}</span>!
        </h1>
        <p className="text-neutral-300 mt-1">Ready to turn chaos into clarity? Let's get started.</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}><StatsCard title="Active Courses" value={courses.length.toString()} icon={BookCopy} trend="+1 this semester" color="lavender" /></motion.div>
        <motion.div variants={itemVariants}><StatsCard title="Assignments Due" value={assignmentsDueSoon.toString()} icon={Clock} trend="1 due today!" color="peach" /></motion.div>
        <motion.div variants={itemVariants}><StatsCard title="Study Aids Ready" value="27" icon={CheckCircle} trend="+5 this week" color="mint" /></motion.div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.h2 className="text-xl font-medium text-neutral-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Your Courses
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="visible" transition={{ delayChildren: 0.4, staggerChildren: 0.1 }}>
            {courses.map((course) => (
              <motion.div variants={itemVariants} key={course.id}>
                <CourseCard id={course.id} title={course.name} instructor={course.instructor?.name ?? 'N/A'} progress={Math.floor(Math.random() * (85 - 45 + 1)) + 45} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.h2 className="text-xl font-medium text-neutral-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Up Next
          </motion.h2>
          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible" transition={{ delayChildren: 0.6, staggerChildren: 0.1 }}>
            {assignments.map(assignment => (
              <motion.div variants={itemVariants} key={assignment.id}>
                <AssignmentCard title={assignment.name} course={assignment.course_code ?? 'Course'} dueDate={assignment.due_at ? `Due ${formatDistanceToNow(new Date(assignment.due_at), { addSuffix: true })}` : 'No due date'} priority={assignment.points_possible > 75 ? 'high' : assignment.points_possible > 30 ? 'medium' : 'low'} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;