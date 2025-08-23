// tailwind.config.js
/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'; // <-- Import the plugin

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography(), // <-- Add the plugin here
  ],
}