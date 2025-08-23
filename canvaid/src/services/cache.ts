// src/services/cache.ts

// A simple key-value store using localStorage

// The key will be structured like: `canvaid_cache_${type}_${courseId}`
// e.g., 'canvaid_cache_guide_123'

export const getCachedData = <T>(type: 'guide' | 'flashcards', courseId: string): T | null => {
  try {
    const key = `canvaid_cache_${type}_${courseId}`;
    const cachedItem = localStorage.getItem(key);
    if (cachedItem) {
      console.log(`Cache HIT for ${key}`);
      return JSON.parse(cachedItem) as T;
    }
    console.log(`Cache MISS for ${key}`);
    return null;
  } catch (error) {
    console.error("Failed to read from cache:", error);
    return null;
  }
};

export const setCachedData = <T>(type: 'guide' | 'flashcards', courseId: string, data: T): void => {
  try {
    const key = `canvaid_cache_${type}_${courseId}`;
    const dataToStore = JSON.stringify(data);
    localStorage.setItem(key, dataToStore);
    console.log(`Cached data for ${key}`);
  } catch (error) {
    console.error("Failed to write to cache:", error);
  }
};