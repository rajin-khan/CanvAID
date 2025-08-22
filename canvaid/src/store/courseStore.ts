// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment } from '../types/canvas';

interface CourseState {
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  setCourses: (courses: CanvasCourse[]) => void;
  setAssignments: (assignments: CanvasAssignment[]) => void;
}

const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  assignments: [],
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
}));

export default useCourseStore;