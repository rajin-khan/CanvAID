// src/pages/WelcomePage.tsx
import { motion, type Variants } from 'framer-motion';
import { KeyRound, Sparkles, FileText, ClipboardCheck, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { type: 'spring', damping: 10, stiffness: 100, duration: 0.5 } 
  },
};

const Feature = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-rich-slate border border-moonstone/50 mb-4">
      {/* FIX 2: Changed icon color from text-soft-lavender to text-gentle-peach */}
      <Icon className="h-6 w-6 text-gentle-peach" />
    </div>
    <h3 className="font-semibold text-neutral-100">{title}</h3>
    <p className="text-sm text-neutral-400 mt-1">{description}</p>
  </motion.div>
);

const WelcomePage = () => {
  return (
    // This container ensures true vertical and horizontal centering within the MainLayout
    <div className="flex items-center justify-center min-h-[calc(100vh-theme(spacing.20))] px-4 py-12 sm:py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-3xl mx-auto"
      >
        <motion.img 
          src="/logo.png" 
          alt="CanvAID Logo" 
          variants={logoVariants}
          className="h-20 w-20 mb-6 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]"
        />

        <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-extrabold tracking-tighter text-neutral-50 mb-4">
          Turn Chaos into <span className="inline-block py-2 px-1 bg-linear-to-r from-soft-lavender to-gentle-peach bg-clip-text text-transparent">Clarity</span>.
          {/* FIX 1: Added padding (py-2 px-1) and inline-block to prevent the 'y' from being cut off */}
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg text-neutral-300 mb-10 max-w-xl">
          Your personal AI study partner. CanvAID synthesizes your scattered Canvas files into organized, actionable study materials so you can learn smarter.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <Link
            to="/settings"
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 font-semibold text-white rounded-full transition-all duration-300 bg-linear-to-r from-violet-500 to-pink-500 hover:shadow-2xl hover:shadow-violet-500/30 hover:scale-105 focus:ring-4 focus:ring-violet-500/40"
          >
            <KeyRound className="w-5 h-5 mr-3" />
            Connect Your Keys to Begin
          </Link>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16 w-full"
        >
          <Feature 
            icon={Sparkles} 
            title="AI-Powered Study Guides" 
            description="Get comprehensive summaries and key concepts from all your course materials." 
          />
          <Feature 
            icon={FileText} 
            title="Smart Flashcards" 
            description="Instantly generate flashcards for important terms and definitions." 
          />
          <Feature 
            icon={ClipboardCheck} 
            title="Assignment Clarity" 
            description="Understand what's required for upcoming assignments and feel prepared." 
          />
        </motion.div>

        {/* Security Note */}
        <motion.div variants={itemVariants} className="mt-16 flex items-center text-neutral-500">
          <Lock className="w-4 h-4 mr-2" />
          <p className="text-xs">Your API keys are stored securely in your browser and never leave your machine.</p>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default WelcomePage;