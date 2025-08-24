// src/services/apiClient.ts
import useCourseStore from "../store/courseStore";
import toast from 'react-hot-toast';

async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get credentials from the Zustand store AT THE TIME OF THE REQUEST
  const { apiKeys, institutionUrl } = useCourseStore.getState();
  const API_TOKEN = apiKeys.canvas;

  if (!institutionUrl) {
    console.error("No Canvas institution URL found.");
    // No need to logout, user might just be on the settings page
    throw new Error("Canvas institution URL is not configured.");
  }
  
  if (!API_TOKEN) {
    console.error("No Canvas API token found. User might be logged out.");
    useCourseStore.getState().logout(); // Log out if token is missing
    throw new Error("Authentication token is missing.");
  }
  
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${API_TOKEN}`);
  // This custom header will be used by the Vite dev proxy to set the target URL.
  // In production, your server-side proxy would read this header to know where to forward the request.
  headers.set('X-Canvas-Host', institutionUrl);

  // All requests in development now go through our '/api-proxy' path.
  const proxiedEndpoint = `/api-proxy${endpoint}`;

  const response = await fetch(proxiedEndpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      toast.error("Canvas API Key is invalid or expired. Please check your settings.");
    }
    const errorText = await response.text();
    // Try to parse error JSON from Canvas
    try {
      const errorJson = JSON.parse(errorText);
      const errorMessage = errorJson.errors?.[0]?.message || 'An unknown API error occurred.';
      throw new Error(`API call failed: ${errorMessage}`);
    } catch (e) {
      // Fallback if the error response isn't JSON
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }
  }

  return response.json();
}

export default apiClient;