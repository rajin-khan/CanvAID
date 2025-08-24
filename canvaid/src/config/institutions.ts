// src/config/institutions.ts

export interface Institution {
  name: string;
  url: string;
}

// This is where you can easily add more supported Canvas institutions in the future.
// Just add a new object to the array.
export const supportedInstitutions: Institution[] = [
  { name: 'North South University', url: 'https://northsouth.instructure.com' },
  // Example for the future:
  // { name: 'Example University', url: 'https://example.instructure.com' },
];