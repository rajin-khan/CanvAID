// src/services/apiClient.ts
import useCourseStore from "../store/courseStore";
import toast from 'react-hot-toast';

async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // --- MODIFIED: No longer need institutionUrl from the store ---
  const { apiKeys } = useCourseStore.getState();
  const API_TOKEN = apiKeys.canvas;

  if (!API_TOKEN) {
    console.error("No Canvas API token found. User might be logged out.");
    useCourseStore.getState().logout();
    throw new Error("Authentication token is missing.");
  }
  
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${API_TOKEN}`);
  
  // --- REMOVED: No longer need to send the custom X-Canvas-Host header ---

  const proxiedEndpoint = `/api-proxy${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(proxiedEndpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      toast.error("Canvas API Key is invalid or expired. Please check your settings.");
    }
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      const errorMessage = errorJson.errors?.[0]?.message || 'An unknown API error occurred.';
      throw new Error(`API call failed: ${errorMessage}`);
    } catch (e) {
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }
  }

  return response.json();
}

export default apiClient;