// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Add this server configuration block
  server: {
    proxy: {
      // Proxy requests from /api to the Canvas API
      '/api': {
        target: 'https://northsouth.instructure.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})