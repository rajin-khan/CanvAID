// src/types/canvas.ts

// Based on the User object, simplified for our needs (e.g., instructor and self)
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
  course_code?: string;
}

// Based on the Module and ModuleItem objects
export interface CanvasModuleItem {
  id: number;
  module_id: number;
  position: number;
  title: string;
  indent: number;
  type: 'File' | 'Page' | 'Discussion' | 'Assignment' | 'Quiz' | 'SubHeader' | 'ExternalUrl' | 'ExternalTool';
  content_id?: number;
  html_url: string;
  page_url?: string;
  external_url?: string;
  new_tab?: boolean;
  published: boolean;
}

export interface CanvasModule {
  id: number;
  workflow_state: 'active' | 'deleted';
  position: number;
  name: string;
  unlock_at: string | null;
  require_sequential_progress: boolean;
  prerequisite_module_ids: number[];
  items_count: number;
  items_url: string;
  items?: CanvasModuleItem[];
  published: boolean;
}

// MODIFIED: Based on the Announcements API (DiscussionTopic object)
export interface CanvasAnnouncement {
    id: number;
    title: string;
    message: string; // This is an HTML string
    html_url: string;
    posted_at: string;
    context_code: string; // e.g., "course_123"
}