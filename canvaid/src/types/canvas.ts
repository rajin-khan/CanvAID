// src/types/canvas.ts

// Based on the User object, simplified for our needs (e.g., instructor)
export interface CanvasUser {
  id: number;
  name: string;
  sortable_name: string;
  short_name: string | null;
  avatar_url: string;
}

// Based on the Course object
export interface CanvasCourse {
  id: number;
  sis_course_id: string | null;
  uuid: string;
  integration_id: string | null;
  sis_import_id: number | null;
  name: string;
  course_code: string;
  workflow_state: 'unpublished' | 'available' | 'completed' | 'deleted';
  account_id: number;
  root_account_id: number;
  enrollment_term_id: number;
  grading_standard_id: number | null;
  created_at: string;
  start_at: string | null;
  end_at: string | null;
  locale: string | null;
  total_students?: number;
  course_progress?: {
    requirement_count: number;
    requirement_completed_count: number;
    next_requirement_url: string | null;
    completed_at: string | null;
  };
  // We'll add a simplified instructor field for our UI
  instructor?: CanvasUser;
}

// Based on the Assignment object
export interface CanvasAssignment {
  id: number;
  name: string;
  description: string;
  due_at: string | null;
  unlock_at: string | null;
  lock_at: string | null;
  points_possible: number;
  grading_type: 'pass_fail' | 'percent' | 'letter_grade' | 'gpa_scale' | 'points';
  assignment_group_id: number;
  course_id: number;
  position: number;
  published: boolean;
  html_url: string;
  // We'll add a course_code for easy display in the UI
  course_code?: string;
}