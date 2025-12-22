import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'electron/main.ts'),
        preload: resolve(__dirname, 'electron/preload.js'),
      },
      output: {
        dir: 'dist-electron',
        format: 'cjs',
        entryFileNames: '[name].js',
      },
    },
  },
});