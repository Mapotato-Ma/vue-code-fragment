// eslint.config.js
import vueParser from 'vue-eslint-parser';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginVue from 'eslint-plugin-vue';

export default [
  // Prettier 集成  // ...existing code...
  {
    ignores: [
      '**/node_modules/**',
      '**/*.d.ts',
      'dist/**',
      'coverage/**',
      'public/',
      '*.log',
      '*.md',
      '*.svg',
      '*.png',
      'src/worker/share.worker.js',
      'src/assets/**',
    ],
  },

  // 修复后的 TypeScript 推荐配置
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      ...typescriptEslintPlugin.configs.recommended.rules,
    },
  },

  // Vue 3 官方规则
  ...pluginVue.configs['flat/recommended'],

  // Vue 文件专属配置
  {
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          ts: typescriptEslintParser,
          js: '@babel/eslint-parser',
        },
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'no-undef': 'off',
    },
  },

  // 通用规则
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      'vue/no-multiple-template-root': 'off',
      'vue/require-default-prop': 'off',
    },
  },

  // ...existing code...
  eslintConfigPrettier,
];
