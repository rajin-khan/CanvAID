// src/services/canvasAPI.ts
import apiClient from './apiClient';
import { type CanvasCourse, type CanvasAssignment } from '../types/canvas';

// API Endpoints based on the documentation you provided
const COURSES_ENDPOINT = '/api/v1/courses?enrollment_state=active&include[]=teachers&include[]=total_students';

// This function fetches all active courses
export const getCourses = (): Promise<CanvasCourse[]> => {
  console.log("Fetching REAL courses from Canvas API...");
  // Note: Canvas API returns an array of teachers, we'll just use the first one.
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

// This function fetches assignments for ALL provided courses concurrently
export const getAssignments = async (): Promise<CanvasAssignment[]> => {
  console.log("Fetching REAL assignments from Canvas API...");
  
  // First, get all the active courses
  const courses = await getCourses();
  
  // Create an array of promises, one for each course's assignments
  const assignmentPromises = courses.map(course => {
    const endpoint = `/api/v1/courses/${course.id}/assignments?bucket=upcoming`;
    return apiClient<CanvasAssignment[]>(endpoint).then(assignments => 
      // Add the course_code to each assignment for easier display in the UI
      assignments.map(assignment => ({
        ...assignment,
        course_code: course.course_code,
      }))
    );
  });

  // Wait for all the assignment fetches to complete
  const assignmentsByCourse = await Promise.all(assignmentPromises);

  // Flatten the array of arrays into a single array of assignments and sort them by due date
  const allAssignments = assignmentsByCourse.flat().sort((a, b) => {
    if (!a.due_at) return 1;
    if (!b.due_at) return -1;
    return new Date(a.due_at).getTime() - new Date(b.due_at).getTime();
  });
  
  console.log('All assignments fetched and combined:', allAssignments);
  return allAssignments;
};