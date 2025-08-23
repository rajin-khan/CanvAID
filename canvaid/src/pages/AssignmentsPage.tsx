// src/pages/AssignmentsPage.tsx
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { getAssignments } from '../services/canvasAPI';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorDisplay } from '../components/ui/ErrorDisplay';
import { Calendar, AlertCircle } from 'lucide-react';

const AssignmentsPageSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-10 w-1/3 mb-6" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
    </div>
);

const AssignmentsPage = () => {
    const { data: assignments, isLoading, isError } = useQuery({
        queryKey: ['assignments'], // This uses the cached data from the dashboard fetch
        queryFn: getAssignments,
    });

    const upcomingAssignments = assignments?.filter(a => a.due_at && new Date(a.due_at) > new Date()) || [];

    if (isLoading) {
        return <AssignmentsPageSkeleton />;
    }

    if (isError) {
        return <ErrorDisplay message="Could not load your assignments." />;
    }

    return (
        <div className="animate-fadeIn space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-50">Upcoming Assignments</h1>
            <p className="text-neutral-300">Here's everything that's on your plate across all your courses.</p>
            
            {upcomingAssignments.length > 0 ? (
                <div className="bg-rich-slate/50 border border-moonstone/50 rounded-xl">
                    <ul className="divide-y divide-moonstone/50">
                        {upcomingAssignments.map(assignment => (
                            <li key={assignment.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <a href={assignment.html_url} target="_blank" rel="noopener noreferrer" className="font-semibold text-neutral-100 hover:text-soft-lavender hover:underline">
                                        {assignment.name}
                                    </a>
                                    <p className="text-sm text-neutral-400">{assignment.course_code}</p>
                                </div>
                                <div className="flex items-center text-sm text-neutral-300 mt-2 md:mt-0">
                                    <Calendar className="w-4 h-4 mr-2 text-gentle-peach" />
                                    <span>Due: {format(new Date(assignment.due_at!), 'EEEE, MMM d \'at\' h:mm a')}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-rich-slate/50 border border-moonstone/50 rounded-2xl text-center p-8">
                    <AlertCircle className="w-16 h-16 text-fresh-mint mb-4" />
                    <h2 className="text-xl font-bold text-neutral-100">All Clear!</h2>
                    <p className="text-neutral-300 mt-2">You have no upcoming assignments due. Great work!</p>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;