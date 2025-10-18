import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ Optional server config (safe, no TS error)
  server: {
    port: 5173, // or any preferred port
    open: true, // auto-open in browser on `npm run dev`
  },

  // ✅ Build optimizations (for Vercel)
  build: {
    outDir: 'dist',
    sourcemap: false,
  },

  // ✅ Alias for cleaner imports
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
