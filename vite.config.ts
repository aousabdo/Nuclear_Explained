import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/Nuclear_Explained/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('leaflet') || id.includes('react-leaflet')) return 'leaflet'
          if (id.includes('d3-')) return 'd3'
          if (id.includes('recharts')) return 'recharts'
        },
      },
    },
  },
})
