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
      'process.env.API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
      
      // Polyfill process.env using JSON.stringify to ensure valid syntax
      // This fixes the "Invalid define value" error
      'process.env': JSON.stringify({ API_KEY: apiKey }),
      'process.version': JSON.stringify(''),
    },
  };
});