import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { Mode, plugin } from 'vite-plugin-markdown';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { templateCompilerOptions } from '@tresjs/core';
// 分析打包大小
// import { analyzer } from 'vite-bundle-analyzer';

// https://vitejs.dev/config/
export default defineConfig({
  // 配置静态资源根路径
  base: '/mapotato',
  plugins: [
    // analyzer(),
    wasm(),
    topLevelAwait(),
    vue({
      ...templateCompilerOptions
    }),
    ViteEjsPlugin(),
    vueJsx(),
    plugin({
      mode: [Mode.MARKDOWN]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    outDir: 'mapotato'
  }
});
