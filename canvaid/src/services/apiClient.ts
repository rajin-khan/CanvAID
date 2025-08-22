// src/services/apiClient.ts

// The BASE_URL is now used by the Vite proxy, not directly in the client
const BASE_URL = import.meta.env.VITE_CANVAS_API_URL;
const API_TOKEN = import.meta.env.VITE_CANVAS_API_TOKEN;

// This check is still useful to ensure the .env.local file is set up
if (!BASE_URL || !API_TOKEN) {
  throw new Error("VITE_CANVAS_API_URL and VITE_CANVAS_API_TOKEN must be set in your .env.local file");
}

async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${API_TOKEN}`);

  // --- THIS IS THE ONLY LINE THAT CHANGES ---
  // We remove BASE_URL from the fetch call. The request will now go to our proxy.
  // OLD: const response = await fetch(`${BASE_URL}${endpoint}`, {
  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // We can add more detailed error logging here now
    console.error('API Error Response:', response);
    const errorText = await response.text();
    console.error('API Error Body:', errorText);
    try {
      const errorBody = JSON.parse(errorText);
      throw new Error(errorBody.message || `API call failed with status ${response.status}`);
    } catch {
      throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }
  }

  return response.json();
}

export default apiClient;