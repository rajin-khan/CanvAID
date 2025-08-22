// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment } from '../types/canvas';
import { getCourses, getAssignments } from '../services/canvasAPI';

interface CourseState {
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  assignments: [],
  loading: false,
  error: null,
  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch data concurrently
      const [courses, assignments] = await Promise.all([
        getCourses(),
        getAssignments()
      ]);
      set({ courses, assignments, loading: false });
    } catch (err) {
      set({ error: 'Failed to fetch data.', loading: false });
      console.error(err);
    }
  },
}));

export default useCourseStore;