// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser } from '../types/canvas';

interface ApiKeys {
  canvas: string | null;
  groq: string | null;
}

interface CourseState {
  user: CanvasUser | null;
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  searchQuery: string;
  apiKeys: ApiKeys;
  
  setUser: (user: CanvasUser) => void;
  setCourses: (courses: CanvasCourse[]) => void;
  setAssignments: (assignments: CanvasAssignment[]) => void;
  setSearchQuery: (query: string) => void;
  setApiKeys: (keys: ApiKeys) => void;
  logout: () => void;
}

const useCourseStore = create<CourseState>((set) => ({
  user: null,
  courses: [],
  assignments: [],
  searchQuery: '',
  apiKeys: {
    canvas: localStorage.getItem('canvaid_canvas_api_key'),
    groq: localStorage.getItem('canvaid_groq_api_key'),
  },
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setApiKeys: (keys) => {
    if (keys.canvas) localStorage.setItem('canvaid_canvas_api_key', keys.canvas);
    if (keys.groq) localStorage.setItem('canvaid_groq_api_key', keys.groq);
    set({ apiKeys: { ...keys } });
  },
  logout: () => {
    localStorage.removeItem('canvaid_canvas_api_key');
    localStorage.removeItem('canvaid_groq_api_key');
    set({ 
      apiKeys: { canvas: null, groq: null },
      user: null,
      courses: [],
      assignments: []
    });
    // Force a reload to ensure the protected route re-evaluates
    window.location.href = '/';
  }
}));

export default useCourseStore;