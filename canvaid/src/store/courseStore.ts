// src/store/courseStore.ts
import { create } from 'zustand';
import { type CanvasCourse, type CanvasAssignment, type CanvasUser, type CanvasAnnouncement } from '../types/canvas';

interface ApiKeys {
  canvas: string | null;
  groq: string | null;
}

interface Credentials extends ApiKeys {
  institutionUrl: string | null;
}

interface CourseState {
  user: CanvasUser | null;
  courses: CanvasCourse[];
  assignments: CanvasAssignment[];
  announcements: CanvasAnnouncement[]; // Add announcements
  searchQuery: string;
  apiKeys: ApiKeys;
  institutionUrl: string | null;
  
  setUser: (user: CanvasUser) => void;
  setCourses: (courses: CanvasCourse[]) => void;
  setAssignments: (assignments: CanvasAssignment[]) => void;
  setAnnouncements: (announcements: CanvasAnnouncement[]) => void; // Add setter
  setSearchQuery: (query: string) => void;
  saveCredentials: (credentials: Credentials) => void;
  logout: () => void;
}

const useCourseStore = create<CourseState>((set) => ({
  user: null,
  courses: [],
  assignments: [],
  announcements: [], // Default to empty array
  searchQuery: '',
  apiKeys: {
    canvas: localStorage.getItem('canvaid_canvas_api_key'),
    groq: localStorage.getItem('canvaid_groq_api_key'),
  },
  institutionUrl: localStorage.getItem('canvaid_institution_url'),
  setUser: (user) => set({ user }),
  setCourses: (courses) => set({ courses }),
  setAssignments: (assignments) => set({ assignments }),
  setAnnouncements: (announcements) => set({ announcements }), // Implement setter
  setSearchQuery: (query) => set({ searchQuery: query }),
  saveCredentials: (credentials) => {
    if (credentials.canvas) localStorage.setItem('canvaid_canvas_api_key', credentials.canvas);
    if (credentials.groq) localStorage.setItem('canvaid_groq_api_key', credentials.groq);
    if (credentials.institutionUrl) localStorage.setItem('canvaid_institution_url', credentials.institutionUrl);
    set({ 
      apiKeys: { canvas: credentials.canvas, groq: credentials.groq },
      institutionUrl: credentials.institutionUrl 
    });
  },
  logout: () => {
    localStorage.removeItem('canvaid_canvas_api_key');
    localStorage.removeItem('canvaid_groq_api_key');
    localStorage.removeItem('canvaid_institution_url');
    set({ 
      apiKeys: { canvas: null, groq: null },
      institutionUrl: null,
      user: null,
      courses: [],
      assignments: [],
      announcements: []
    });
    window.location.href = '/';
  }
}));

export default useCourseStore;