import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/RRICURA/' : '/', // Ensure correct base path for GitHub Pages


  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
