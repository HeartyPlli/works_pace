// vite.config.js
// Settings for Vite. Vite is the tool that runs the React app on your computer
// while you work on it, and builds the final files when you are done.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The React plugin lets Vite understand .jsx files.
  plugins: [react()],

  // The React app will open at http://localhost:5173
  server: {
    port: 5173,
  },
});
