import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    // Use relative base path so the app works in any subdirectory (essential for GitHub Pages)
    base: './',
    build: {
      outDir: 'dist',
    },
    define: {
      // Safely replace process.env.API_KEY in the client code with the environment variable from the build
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY)
    }
  };
});