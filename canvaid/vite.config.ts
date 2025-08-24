// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { URL } from 'url'; // Node.js URL module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // This is a custom proxy rule for development to handle dynamic Canvas API URLs
      // and avoid CORS issues.
      // It proxies requests from '/api-proxy' to the Canvas instance specified
      // in the 'X-Canvas-Host' header.
      //
      // IMPORTANT: This is a DEVELOPMENT-ONLY solution.
      // For a production build, you MUST implement a server-side proxy
      // that forwards requests from your application server to the Canvas API.
      '/api-proxy': {
        // The target is just a placeholder and will be overridden for each request.
        target: 'https://northsouth.instructure.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api-proxy/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const canvasHost = req.headers['x-canvas-host'] as string;
            if (canvasHost) {
              // Dynamically set the target for this specific request
              options.target = canvasHost;
              const targetUrl = new URL(canvasHost);
              // The `Host` header must match the target's hostname
              proxyReq.setHeader('Host', targetUrl.hostname);
            }
          });
          proxy.on('error', (err) => {
            console.error('Proxy Error:', err);
          });
        },
      },
    },
  },
})