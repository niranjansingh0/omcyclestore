import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          motion: ['framer-motion'],
          swiper: ['swiper', 'swiper/react', 'swiper/modules'],
          icons: ['lucide-react', 'react-icons/fa'],
        },
      },
    },
  },
});
