// src/components/modals/AnnouncementModal.tsx
import { useState } from 'react';
// MODIFIED: Added 'type Variants' to the import from framer-motion.
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { X, Sparkles, Loader, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

import { type CanvasAnnouncement } from '../../types/canvas';
import { generateActionPlan } from '../../services/groqAPI';
import { StudyGuideDisplay } from '../StudyGuideDisplay'; // Reusing your beautiful markdown component

interface AnnouncementModalProps {
  announcement: CanvasAnnouncement;
  onClose: () => void;
}

// Function to strip HTML for a cleaner text version for the AI
const stripHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
};

const backdropVariants: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants: Variants = {
  hidden: { y: "100vh", opacity: 0 },
  // FIX: Changed y: 0 to y: "0%" to make the type consistent.
  visible: { y: "0%", opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 200 } },
  exit: { y: "100vh", opacity: 0 },
};

export const AnnouncementModal = ({ announcement, onClose }: AnnouncementModalProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionPlan, setActionPlan] = useState<string | null>(null);

  const handleGenerateActionPlan = async () => {
    setIsGenerating(true);
    setActionPlan(null);
    try {
      const plainTextMessage = stripHtml(announcement.message);
      const plan = await generateActionPlan(announcement.title, plainTextMessage);
      setActionPlan(plan);
      toast.success("Action plan generated!");
    } catch (error) {
      console.error("Failed to generate action plan:", error);
      toast.error("Couldn't generate an action plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        className="bg-rich-slate border border-moonstone/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-moonstone/50 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-neutral-100">{announcement.title}</h2>
            <p className="text-sm text-neutral-400">{announcement.context_code.replace('_', ' ')}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-moonstone">
            <X className="w-5 h-5 text-neutral-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Announcement Body */}
          <div>
            <h3 className="text-md font-semibold text-neutral-200 mb-2">Full Announcement</h3>
            <div
              className="prose prose-invert prose-sm max-w-none text-neutral-300 prose-a:text-soft-lavender"
              dangerouslySetInnerHTML={{ __html: announcement.message }}
            />
             <a href={announcement.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-soft-lavender hover:underline mt-4">
              <LinkIcon className="w-3 h-3 mr-1.5" />
              View Original on Canvas
            </a>
          </div>

          {/* AI Action Plan Section */}
          <div className="border-t border-moonstone/50 pt-6">
            <h3 className="text-md font-semibold text-neutral-200 flex items-center mb-4">
              <Sparkles className="w-5 h-5 mr-2 text-gentle-peach" />
              Your AI Action Plan
            </h3>
            <AnimatePresence>
              {isGenerating ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center p-4 bg-moonstone/30 rounded-lg">
                  <Loader className="w-6 h-6 animate-spin text-soft-lavender" />
                  <p className="mt-2 text-sm text-neutral-300">Analyzing announcement...</p>
                </motion.div>
              ) : actionPlan ? (
                 <StudyGuideDisplay content={actionPlan} />
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={handleGenerateActionPlan}
                  className="w-full flex items-center justify-center px-4 py-2.5 font-semibold text-white rounded-lg transition-all duration-300 bg-linear-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-500/30 hover:translate-y-[-1px] focus:ring-4 focus:ring-violet-500/40"
                >
                  Generate Action Plan
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};