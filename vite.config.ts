import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/data': path.resolve(__dirname, './src/data'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // Organize assets by type
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name!.split('.')
          const extType = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/css/i.test(extType)) {
            return `assets/css/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
      },
    },
  },
  // Optimize for canvas and image handling
  optimizeDeps: {
    include: ['jspdf', 'html2canvas'],
  },
  // Configure asset handling for templates and images
  assetsInclude: ['**/*.json', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp'],
  server: {
    port: 3000,
    open: true,
  },
})
