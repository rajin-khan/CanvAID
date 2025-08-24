// src/services/canvasAPI.ts
import apiClient from './apiClient';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser, type CanvasAnnouncement } from '../types/canvas';

// API Endpoints based on the documentation
const COURSES_ENDPOINT = '/api/v1/courses?enrollment_state=active&include[]=teachers&include[]=total_students';
const SELF_ENDPOINT = '/api/v1/users/self/profile';

export const getSelf = (): Promise<CanvasUser> => {
  console.log("Fetching REAL user profile from Canvas API...");
  return apiClient<any>(SELF_ENDPOINT).then(profile => ({
    id: profile.id,
    name: profile.name,
    sortable_name: profile.sortable_name,
    short_name: profile.short_name,
    avatar_url: profile.avatar_url,
  }));
};

export const getCourses = (): Promise<CanvasCourse[]> => {
  console.log("Fetching REAL courses from Canvas API...");
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

export const getAssignments = async (): Promise<CanvasAssignment[]> => {
  console.log("Fetching REAL assignments from Canvas API...");
  const courses = await getCourses();
  if (!courses || courses.length === 0) return [];

  const assignmentPromises = courses.map(course => {
    const endpoint = `/api/v1/courses/${course.id}/assignments?bucket=upcoming`;
    return apiClient<CanvasAssignment[]>(endpoint).then(assignments =>
      assignments.map(assignment => ({
        ...assignment,
        course_code: course.course_code,
      }))
    );
  });

  const assignmentsByCourse = await Promise.all(assignmentPromises);
  const allAssignments = assignmentsByCourse.flat().sort((a, b) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  });

  console.log('All assignments fetched and combined:', allAssignments);
  return allAssignments;
};

// NEW: Function to fetch announcements for a list of courses
export const getAnnouncements = async (courses: CanvasCourse[]): Promise<CanvasAnnouncement[]> => {
  console.log("Fetching REAL announcements from Canvas API...");
  if (!courses || courses.length === 0) {
    return [];
  }
  
  const contextCodes = courses.map(course => `course_${course.id}`);
  const params = new URLSearchParams();
  contextCodes.forEach(code => params.append('context_codes[]', code));
  params.append('active_only', 'true');

  const ANNOUNCEMENTS_ENDPOINT = `/api/v1/announcements?${params.toString()}`;
  return apiClient<CanvasAnnouncement[]>(ANNOUNCEMENTS_ENDPOINT);
};