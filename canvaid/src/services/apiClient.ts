// src/services/apiClient.ts
import useCourseStore from "../store/courseStore";
import toast from 'react-hot-toast';

async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const CANVAS_API_URL = import.meta.env.VITE_CANVAS_API_URL;
  // Get the token from the Zustand store AT THE TIME OF THE REQUEST
  const API_TOKEN = useCourseStore.getState().apiKeys.canvas;
  
  if (!CANVAS_API_URL) {
    throw new Error("VITE_CANVAS_API_URL must be set in your .env.local file.");
  }
  
  if (!API_TOKEN) {
    console.error("No Canvas API token found. User might be logged out.");
    useCourseStore.getState().logout(); // Log out if token is missing
    throw new Error("Authentication token is missing.");
  }
  
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${API_TOKEN}`);

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      toast.error("Canvas API Key is invalid. Logging you out.");
      useCourseStore.getState().logout();
    }
    const errorText = await response.text();
    throw new Error(`API call failed with status ${response.status}: ${errorText}`);
  }

  return response.json();
}

export default apiClient;