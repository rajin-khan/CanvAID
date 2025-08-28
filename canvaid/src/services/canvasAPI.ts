// canvaid/src/services/canvasAPI.ts

import apiClient from './apiClient';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser, type CanvasAnnouncement } from '../types/canvas';

// --- API Endpoints ---
// This endpoint correctly fetches all active courses. We will NOT filter by favorites.
const COURSES_ENDPOINT = '/api/v1/courses?enrollment_state=active';
const SELF_ENDPOINT = '/api/v1/users/self/profile';


// --- NO CHANGES NEEDED HERE ---
// This function is working correctly and fetches the user's profile.
export const getSelf = (): Promise<CanvasUser> => {
  console.log("Fetching user profile from Canvas API...");
  return apiClient<any>(SELF_ENDPOINT).then(profile => ({
    id: profile.id,
    name: profile.name,
    sortable_name: profile.sortable_name,
    short_name: profile.short_name,
    avatar_url: profile.avatar_url,
  }));
};

// --- NO CHANGES NEEDED HERE ---
// This function is working correctly and fetches ALL active courses.
export const getCourses = (): Promise<CanvasCourse[]> => {
  console.log("Fetching all active courses from Canvas API...");
  return apiClient<any[]>(COURSES_ENDPOINT).then(courses =>
    courses.map(course => ({
      ...course,
      instructor: course.teachers?.[0] ? {
        id: course.teachers[0].id,
        name: course.teachers[0].display_name,
        sortable_name: course.teachers[0].sortable_name,
        avatar_url: course.teachers[0].avatar_image_url,
        short_name: course.teachers[0].short_name,
      } : undefined,
    }))
  );
};

// --- UPDATED AND FINAL VERSION ---
// This function fetches assignments for all courses but is resilient to failures.
export const getAssignments = async (): Promise<CanvasAssignment[]> => {
  console.log("Fetching assignments for ALL active courses...");
  
  const courses = await getCourses();
  if (!courses || courses.length === 0) return [];

  const courseMap = new Map(courses.map(c => [c.id, c.course_code]));

  // We request assignments for each course in parallel.
  const assignmentPromises = courses.map(course => {
    const endpoint = `/api/v1/courses/${course.id}/assignments?bucket=upcoming&per_page=50`;
    // The .catch() block is CRITICAL. It prevents a single failed course request
    // from crashing the entire operation. If a course is locked, we log a
    // warning and return an empty array for that course.
    return apiClient<CanvasAssignment[]>(endpoint).catch(err => {
        console.warn(`Could not fetch assignments for course ${course.id} (likely due to permissions):`, err.message);
        return []; 
    });
  });

  // Promise.all waits for all requests to either succeed or fail gracefully.
  const assignmentsByCourse = await Promise.all(assignmentPromises);
  
  // We flatten the array of arrays into a single list of assignments.
  const allAssignments = assignmentsByCourse.flat().map(assignment => ({
      ...assignment,
      course_code: courseMap.get(assignment.course_id) || 'Unknown Course',
  }));

  // Finally, we sort all the successfully fetched assignments by their due date.
  allAssignments.sort((a, b) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  });

  console.log('All available upcoming assignments fetched and combined:', allAssignments);
  return allAssignments;
};

// --- UPDATED AND FINAL VERSION ---
// This function fetches announcements in smaller batches to avoid the "400 Bad Request" error.
export const getAnnouncements = async (courses: CanvasCourse[]): Promise<CanvasAnnouncement[]> => {
  console.log("Fetching announcements from Canvas API in batches...");
  if (!courses || courses.length === 0) {
    return [];
  }
  
  const allAnnouncements: CanvasAnnouncement[] = [];
  const CHUNK_SIZE = 5; // We'll request announcements for 5 courses at a time.

  for (let i = 0; i < courses.length; i += CHUNK_SIZE) {
    const courseChunk = courses.slice(i, i + CHUNK_SIZE);
    
    const contextCodes = courseChunk.map(course => `course_${course.id}`);
    const params = new URLSearchParams();
    contextCodes.forEach(code => params.append('context_codes[]', code));
    params.append('active_only', 'true');
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    params.append('start_date', twoWeeksAgo.toISOString());

    const ANNOUNCEMENTS_ENDPOINT = `/api/v1/announcements?${params.toString()}`;

    try {
      const announcementsChunk = await apiClient<CanvasAnnouncement[]>(ANNOUNCEMENTS_ENDPOINT);
      allAnnouncements.push(...announcementsChunk);
    } catch (error) {
        console.warn(`Failed to fetch announcement chunk (courses ${i} to ${i + CHUNK_SIZE}):`, error);
    }
  }

  console.log('All available announcements fetched and combined:', allAnnouncements);
  return allAnnouncements;
};