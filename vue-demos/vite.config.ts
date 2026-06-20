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
export default defineConfig(({ mode, command }) => {
  /** 任何非 development 的 build（含 production、analyze）都走 Vue 生产裁剪 */
  const prodLikeBuild = command === 'build' && mode !== 'development';

  return {
    // 配置静态资源根路径
    base: '/mapotato',
    define: prodLikeBuild
      ? {
        __VUE_PROD_DEVTOOLS__: false,
      }
      : {},
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
        // monaco-themes 的 package.json exports 未暴露 ./themes/*，Vite 7 严格模式下无法解析
        // 用别名直接指向实际文件绕过 exports 限制
        'monaco-themes/themes/Monokai.json': path.resolve(
          __dirname,
          './node_modules/monaco-themes/themes/Monokai.json',
        ),
      },
      // 避免多份 vue 解析到 dev/runtime 与 prod 混用，导致控制台「development build of Vue」
      dedupe: ['vue', 'vue-router'],
    },
    build: {
      outDir: 'mapotato',
      sourcemap: false,
      emptyOutDir: true,
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:3638',
          changeOrigin: true,
        },
      },
    },
  };
});
