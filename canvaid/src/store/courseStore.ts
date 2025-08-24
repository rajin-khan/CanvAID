// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser } from '../types/canvas';

interface CourseState {
  user: CanvasUser | null;
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  searchQuery: string; // <-- Add search query state
  setUser: (user: CanvasUser) => void;
  setCourses: (courses: CanvasCourse[]) => void;
  setAssignments: (assignments: CanvasAssignment[]) => void;
  setSearchQuery: (query: string) => void; // <-- Add action for search
}

const useCourseStore = create<CourseState>((set) => ({
  user: null,
  courses: [],
  assignments: [],
  searchQuery: '', // <-- Initialize as empty
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
  setSearchQuery: (query) => set({ searchQuery: query }), // <-- Define action
}));

export default useCourseStore;