import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  // CRITICAL: In GitHub Actions, secrets are passed to the runner's process.env.
  // We prioritize process.env.VITE_API_KEY over the loaded .env file.
  const apiKey = process.env.VITE_API_KEY || env.VITE_API_KEY;

  return {
    plugins: [react()],
    base: './', // Relative base for GitHub Pages
    build: {
      outDir: 'dist',
    },
    define: {
      // Replaces process.env.API_KEY in client code with the string value of the key
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});