import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { ViteEjsPlugin } from 'vite-plugin-ejs';
import { Mode, plugin } from 'vite-plugin-markdown';
import wasm from 'vite-plugin-wasm';
import { templateCompilerOptions } from '@tresjs/core';
// 分析打包大小
import { analyzer } from 'vite-bundle-analyzer';
import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // 配置静态资源根路径
  base: '/mapotato',
  plugins: [
    wasm(),
    vue({
      ...templateCompilerOptions,
    }),
    ViteEjsPlugin(),
    vueJsx(),
    plugin({
      mode: [Mode.MARKDOWN],
    }),
    mode === 'analyze' &&
      analyzer({
        analyzerMode: 'static',
        fileName: 'bundle-report.html',
        openAnalyzer: true,
      }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'mapotato',
    sourcemap: false,
  },
}));
