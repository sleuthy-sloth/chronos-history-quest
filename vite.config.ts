import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Prioritize system env (GitHub Secrets) over .env file
  // Default to '' to ensure JSON.stringify never returns undefined
  const apiKey = process.env.VITE_API_KEY || env.VITE_API_KEY || '';

  return {
    plugins: [react()],
    base: './', // Relative base for GitHub Pages
    build: {
      outDir: 'dist',
    },
    define: {
      // Securely inject the API key as a string literal during build.
      // We define the specific key first to ensure it takes precedence
      'process.env.API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
      
      // Then we polyfill the rest of process.env to prevent crashes
      // Note: We avoid overwriting the entire process.env object to keep API_KEY accessible
      'process.env': `({ API_KEY: ${JSON.stringify(apiKey)} })`,
      'process.version': JSON.stringify(''),
    },
  };
});