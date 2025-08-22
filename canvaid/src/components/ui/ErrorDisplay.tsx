// src/components/ui/ErrorDisplay.tsx
import { AlertTriangle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

export const ErrorDisplay = ({ message }: ErrorDisplayProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 bg-rich-slate/50 border border-moonstone/50 rounded-2xl text-center p-8">
      <AlertTriangle className="w-16 h-16 text-gentle-peach mb-4" />
      <h2 className="text-xl font-bold text-neutral-100">Oops! Something went wrong.</h2>
      <p className="text-neutral-300 mt-2">{message}</p>
    </div>
  );
};