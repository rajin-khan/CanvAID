// src/components/Flashcard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { type Flashcard as FlashcardType } from '../services/groqAPI';

interface FlashcardProps {
  card: FlashcardType;
}

export const Flashcard = ({ card }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-48 perspective-1000 cursor-pointer" onClick={handleClick}>
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of the card (Term) */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-rich-slate border border-moonstone/50 rounded-xl">
          <p className="text-xl font-semibold text-center text-neutral-100">{card.term}</p>
          <RefreshCw className="absolute bottom-4 right-4 w-4 h-4 text-neutral-500" />
        </div>

        {/* Back of the card (Definition) */}
        <div className="absolute w-full h-full backface-hidden flex items-center justify-center p-6 bg-moonstone border border-soft-lavender/50 rounded-xl rotate-y-180">
          <p className="text-center text-neutral-200">{card.definition}</p>
          <RefreshCw className="absolute bottom-4 right-4 w-4 h-4 text-neutral-400" />
        </div>
      </motion.div>
    </div>
  );
};