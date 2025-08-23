// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser } from '../types/canvas';

interface CourseState {
  user: CanvasUser | null; // <-- Add user state
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  setUser: (user: CanvasUser) => void; // <-- Add setUser action
  setCourses: (courses: CanvasCourse[]) => void;
  setAssignments: (assignments: CanvasAssignment[]) => void;
}

const useCourseStore = create<CourseState>((set) => ({
  user: null, // <-- Initialize user as null
  courses: [],
  assignments: [],
  setUser: (user) => set({ user }), // <-- Define setUser action
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
}));

export default useCourseStore;