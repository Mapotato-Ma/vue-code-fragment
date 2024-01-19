import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  root: './',
  base: '/use-class/',
  build: {
    outDir: 'use-class'
  }
});
