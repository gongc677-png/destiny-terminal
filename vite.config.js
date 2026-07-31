import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/destiny-terminal/',
  build: {
    rolldownOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('lunar-javascript')) return 'lunar';
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion';
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/')) return 'react';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  resolve: {
    alias: { '@': path.resolve('./src') },
  },
})
