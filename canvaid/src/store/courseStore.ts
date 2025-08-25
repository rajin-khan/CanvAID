// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser, type CanvasAnnouncement } from '../types/canvas';

interface ApiKeys {
  canvas: string | null;
  groq: string | null;
}

// --- MODIFIED: Credentials no longer includes institutionUrl ---
interface Credentials extends ApiKeys {}

interface CourseState {
  user: CanvasUser | null;
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  announcements: CanvasAnnouncement[];
  searchQuery: string;
  apiKeys: ApiKeys;
  // --- REMOVED: institutionUrl ---
  
  setUser: (user: CanvasUser) => void;
  setCourses: (courses: CanvasCourse[]) => void;
  setAssignments: (assignments: CanvasAssignment[]) => void;
  setAnnouncements: (announcements: CanvasAnnouncement[]) => void;
  setSearchQuery: (query: string) => void;
  saveCredentials: (credentials: Credentials) => void;
  logout: () => void;
}

const useCourseStore = create<CourseState>((set) => ({
  user: null,
  courses: [],
  assignments: [],
  announcements: [],
  searchQuery: '',
  apiKeys: {
    canvas: localStorage.getItem('canvaid_canvas_api_key'),
    groq: localStorage.getItem('canvaid_groq_api_key'),
  },
  // --- REMOVED: institutionUrl initialization ---
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
  setAnnouncements: (announcements) => set({ announcements }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  saveCredentials: (credentials) => {
    if (credentials.canvas) localStorage.setItem('canvaid_canvas_api_key', credentials.canvas);
    if (credentials.groq) localStorage.setItem('canvaid_groq_api_key', credentials.groq);
    // --- REMOVED: institutionUrl saving ---
    set({ 
      apiKeys: { canvas: credentials.canvas, groq: credentials.groq },
    });
  },
  logout: () => {
    localStorage.removeItem('canvaid_canvas_api_key');
    localStorage.removeItem('canvaid_groq_api_key');
    // --- REMOVED: institutionUrl removal from localStorage ---
    localStorage.removeItem('canvaid_institution_url'); // Also remove the old item
    set({ 
      apiKeys: { canvas: null, groq: null },
      // --- REMOVED: institutionUrl from state reset ---
      user: null,
      courses: [],
      assignments: [],
      announcements: []
    });
    window.location.href = '/';
  }
}));

export default useCourseStore;