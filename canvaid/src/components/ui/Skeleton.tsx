// src/components/ui/Skeleton.tsx
import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = ({ className, ...props }: SkeletonProps) => {
  return (
    <div
      className={`
        relative overflow-hidden rounded-md bg-moonstone/80
        before:absolute before:inset-0 before:-translate-x-full
        before:animate-[shimmer_2s_infinite]
        before:bg-linear-to-r before:from-transparent before:via-neutral-700/50 before:to-transparent
        ${className}
      `}
      {...props}
    />
  );
};