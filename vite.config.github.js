import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        export: path.resolve(__dirname, 'index-export.html')
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
          'mediapipe': ['@mediapipe/tasks-vision']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  base: '/christmas-tree-interactive-album/', // GitHub Pages需要仓库名作为路径
  publicDir: 'public'
})