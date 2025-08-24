// src/pages/WelcomePage.tsx
import { motion, type Variants } from 'framer-motion'; // <-- Import Variants type
import { KeyRound, BookLock } from 'lucide-react';
import { Link } from 'react-router-dom';

// Apply the Variants type to our constants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const WelcomePage = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center text-center h-full max-w-2xl mx-auto"
    >
      <motion.div variants={itemVariants} className="mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-pink-500">
        <BookLock className="h-8 w-8 text-white" />
      </motion.div>

      <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral-50 mb-4">
        Turn Chaos into <span className="bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">Clarity</span>.
      </motion.h1>
      
      <motion.p variants={itemVariants} className="text-lg text-neutral-300 mb-8 max-w-xl">
        CanvAID is your personal AI study partner. It transforms scattered Canvas materials into organized, actionable study aids, helping you learn smarter, not harder.
      </motion.p>
      
      <motion.div variants={itemVariants}>
        <Link
          to="/settings"
          className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-semibold text-white rounded-full transition-all duration-300 bg-linear-to-r from-violet-500 to-pink-500 hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-105 focus:ring-4 focus:ring-violet-500/40"
        >
          <KeyRound className="w-5 h-5 mr-3" />
          Get Started with Your API Keys
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default WelcomePage;