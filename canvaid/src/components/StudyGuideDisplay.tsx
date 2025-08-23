// src/components/StudyGuideDisplay.tsx
import ReactMarkdown from 'react-markdown';

interface StudyGuideDisplayProps {
  content: string;
}

export const StudyGuideDisplay = ({ content }: StudyGuideDisplayProps) => {
  return (
    <div className="
      prose prose-invert prose-p:text-neutral-300 prose-headings:text-neutral-100 
      prose-strong:text-gentle-peach prose-a:text-soft-lavender prose-blockquote:border-l-gentle-peach
      prose-code:text-fresh-mint max-w-none bg-rich-slate/50 p-6 rounded-xl border border-moonstone/50 mt-6
    ">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};