// src/pages/WelcomePage.tsx
import { motion } from 'framer-motion';
import { KeyRound, BookLock } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center h-full"
    >
      <div className="p-8 bg-rich-slate/50 backdrop-blur-lg border border-moonstone/50 rounded-2xl shadow-2xl shadow-black/30 max-w-lg">
        <div className="mx-auto mb-6 h-16 w-16 flex items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-pink-500">
          <BookLock className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter text-neutral-50 mb-2">
          Welcome to <span className="bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">CanvAID</span>
        </h1>
        <p className="text-neutral-300 mb-8">
          To get started, you'll need to add your API keys. This allows CanvAID to access your course materials and use AI to create study aids, all within your browser.
        </p>
        <Link
          to="/settings"
          className="inline-flex items-center justify-center w-full px-5 py-3 font-semibold text-white rounded-lg transition-all duration-300 bg-linear-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-2px] focus:ring-4 focus:ring-violet-500/40"
        >
          <KeyRound className="w-5 h-5 mr-2" />
          Go to Settings
        </Link>
        <p className="text-xs text-neutral-500 mt-6">
          Your keys are stored securely in your browser and are never shared.
        </p>
      </div>
    </motion.div>
  );
};

export default WelcomePage;