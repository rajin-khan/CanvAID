// src/pages/DashboardSkeleton.tsx
import { Skeleton } from "../components/ui/Skeleton";

export const DashboardSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div>
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </div>

      {/* NEW: "At a Glance" header skeleton */}
      <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
      </div>


      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-6 w-1/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col space-y-6">
            {/* Assignments Skeleton */}
            <div className="flex-shrink-0">
              <Skeleton className="h-6 w-1/3 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            </div>
            {/* Announcements Skeleton (now matching the new card size) */}
            <div className="flex-1 min-h-0 flex flex-col">
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="flex-1 space-y-4 pr-2">
                 <Skeleton className="h-[92px] w-full" />
                 <Skeleton className="h-[92px] w-full" />
                 <Skeleton className="h-[92px] w-full" />
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};