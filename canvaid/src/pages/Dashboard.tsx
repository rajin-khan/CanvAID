// src/pages/Dashboard.tsx
import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import useCourseStore from '../store/courseStore';
import CourseCard from '../components/ui/CourseCard';
import AssignmentCard from '../components/ui/AssignmentCard';
import StatsCard from '../components/ui/StatsCard';
import { BookCopy, CheckCircle, Clock, Loader } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const Dashboard = () => {
  // Get state and actions from the Zustand store
  const { courses, assignments, loading, fetchData } = useCourseStore();

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Calculate stats based on fetched data
  const assignmentsDueSoon = assignments.filter(a => a.due_at && new Date(a.due_at) > new Date()).length;
  
  // Create a simple loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
      <Loader className="w-12 h-12 text-soft-lavender animate-spin" />
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
          Hello, <span className="bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">Emma</span>!
        </h1>
        <p className="text-neutral-300 mt-1">Ready to turn chaos into clarity? Let's get started.</p>
      </motion.div>

      {/* Stat Cards - Now with dynamic data */}
      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div variants={itemVariants}><StatsCard title="Active Courses" value={courses.length.toString()} icon={BookCopy} trend="+1 this semester" color="lavender" /></motion.div>
        <motion.div variants={itemVariants}><StatsCard title="Assignments Due" value={assignmentsDueSoon.toString()} icon={Clock} trend="1 due today!" color="peach" /></motion.div>
        <motion.div variants={itemVariants}><StatsCard title="Study Aids Ready" value="27" icon={CheckCircle} trend="+5 this week" color="mint" /></motion.div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Your Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          <motion.h2 className="text-xl font-medium text-neutral-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Your Courses
          </motion.h2>
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={containerVariants} initial="hidden" animate="visible" transition={{ delayChildren: 0.4, staggerChildren: 0.1 }}>
            {/* Map over courses from the store */}
            {courses.map((course, index) => (
              <motion.div variants={itemVariants} key={course.id}>
                <CourseCard 
                  title={course.name} 
                  instructor={course.instructor?.name ?? 'N/A'} 
                  progress={(index + 1) * 20} // Using mock progress for now
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Upcoming Assignments Section */}
        <div className="space-y-6">
          <motion.h2 className="text-xl font-medium text-neutral-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            Up Next
          </motion.h2>
          <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible" transition={{ delayChildren: 0.6, staggerChildren: 0.1 }}>
            {/* Map over assignments from the store */}
            {assignments.map(assignment => (
              <motion.div variants={itemVariants} key={assignment.id}>
                <AssignmentCard 
                  title={assignment.name} 
                  course={assignment.course_code ?? 'Course'} 
                  dueDate={assignment.due_at ? `Due in ${formatDistanceToNow(new Date(assignment.due_at))}` : 'No due date'}
                  priority={assignment.points_possible > 75 ? 'high' : assignment.points_possible > 30 ? 'medium' : 'low'}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;