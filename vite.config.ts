import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize system env (GitHub Secrets) over .env file
  // IMPORTANT: Default to '' to ensure JSON.stringify never returns undefined
  const apiKey = process.env.VITE_API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    base: './', // Relative base for GitHub Pages
    build: {
      outDir: 'dist',
    },
    define: {
      // Securely inject the API key as a string literal during build.
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Polyfill global process to prevent crashes in some libraries
      'process.env': JSON.stringify({}),
      'process.version': JSON.stringify(''),
    },
  };
});