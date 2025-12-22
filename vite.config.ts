import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // 允许外部访问
    port: 3000,
    open: true
  },
  optimizeDeps: {
    exclude: ['@mediapipe/tasks-vision']
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境禁用sourcemap以减小文件大小
    minify: 'terser', // 使用Terser进行更好的压缩
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
    chunkSizeWarningLimit: 1000 // 增加chunk大小警告限制
  },
  base: './', // 相对路径，适用于各种部署环境
  publicDir: 'public' // 静态资源目录
})
