// src/services/canvasAPI.ts
import { type CanvasCourse, type CanvasAssignment } from '../types/canvas';

// --- Mock Data ---
// We'll use our previous hardcoded data and make it conform to our new types.

const mockCourses: CanvasCourse[] = [
  {
    id: 1, name: 'PSY-301: Cognitive Psychology', course_code: 'PSY-301',
    // ... other required CanvasCourse fields
    sis_course_id: null, uuid: 'abc', integration_id: null, sis_import_id: null, workflow_state: 'available', account_id: 1, root_account_id: 1, enrollment_term_id: 1, grading_standard_id: null, created_at: '', start_at: null, end_at: null, locale: null, instructor: { id: 101, name: 'Dr. Anya Sharma', sortable_name: 'Sharma, Anya', short_name: null, avatar_url: '' }
  },
  {
    id: 2, name: 'SOC-210: Social Theory', course_code: 'SOC-210',
    // ... other required CanvasCourse fields
    sis_course_id: null, uuid: 'def', integration_id: null, sis_import_id: null, workflow_state: 'available', account_id: 1, root_account_id: 1, enrollment_term_id: 1, grading_standard_id: null, created_at: '', start_at: null, end_at: null, locale: null, instructor: { id: 102, name: 'Prof. Marcus Cole', sortable_name: 'Cole, Marcus', short_name: null, avatar_url: '' }
  },
  {
    id: 3, name: 'BIO-105: Human Biology', course_code: 'BIO-105',
    // ... other required CanvasCourse fields
    sis_course_id: null, uuid: 'ghi', integration_id: null, sis_import_id: null, workflow_state: 'available', account_id: 1, root_account_id: 1, enrollment_term_id: 1, grading_standard_id: null, created_at: '', start_at: null, end_at: null, locale: null, instructor: { id: 103, name: 'Dr. Lena Hanson', sortable_name: 'Hanson, Lena', short_name: null, avatar_url: '' }
  },
  {
    id: 4, name: 'ENG-220: Modern Literature', course_code: 'ENG-220',
    // ... other required CanvasCourse fields
    sis_course_id: null, uuid: 'jkl', integration_id: null, sis_import_id: null, workflow_state: 'available', account_id: 1, root_account_id: 1, enrollment_term_id: 1, grading_standard_id: null, created_at: '', start_at: null, end_at: null, locale: null, instructor: { id: 104, name: 'Prof. David Chen', sortable_name: 'Chen, David', short_name: null, avatar_url: '' }
  },
];

const mockAssignments: CanvasAssignment[] = [
  { id: 10, name: 'Cognitive Dissonance Paper', course_id: 1, course_code: 'PSY-301', due_at: '2025-08-24T23:59:00Z', points_possible: 100, position: 1, description: '', grading_type: 'points', published: true, html_url: '', unlock_at: null, lock_at: null, assignment_group_id: 1 },
  { id: 11, name: 'Lab Report 3: Neuron Firing', course_id: 3, course_code: 'BIO-105', due_at: '2025-08-27T23:59:00Z', points_possible: 50, position: 2, description: '', grading_type: 'points', published: true, html_url: '', unlock_at: null, lock_at: null, assignment_group_id: 1 },
  { id: 12, name: 'Reading Response: Foucault', course_id: 2, course_code: 'SOC-210', due_at: '2025-08-28T23:59:00Z', points_possible: 25, position: 3, description: '', grading_type: 'points', published: true, html_url: '', unlock_at: null, lock_at: null, assignment_group_id: 1 },
  { id: 13, name: 'Final Project Proposal', course_id: 4, course_code: 'ENG-220', due_at: '2025-09-01T23:59:00Z', points_possible: 15, position: 4, description: '', grading_type: 'points', published: true, html_url: '', unlock_at: null, lock_at: null, assignment_group_id: 1 },
];


// --- Mock API Functions ---

// Simulates a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCourses = async (): Promise<CanvasCourse[]> => {
  console.log('Fetching courses...');
  await sleep(1000); // Simulate 1 second delay
  console.log('Courses fetched:', mockCourses);
  return mockCourses;
};

export const getAssignments = async (): Promise<CanvasAssignment[]> => {
  console.log('Fetching assignments...');
  await sleep(1500); // Simulate 1.5 second delay
  console.log('Assignments fetched:', mockAssignments);
  return mockAssignments;
};