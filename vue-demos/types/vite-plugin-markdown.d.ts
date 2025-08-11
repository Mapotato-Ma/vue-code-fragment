declare module 'vite-plugin-markdown' {
  import type { Options as MarkdownItOptions } from 'markdown-it';
  import type MarkdownIt from 'markdown-it';

  interface PluginOptions {
    markdownIt?: MarkdownIt | MarkdownItOptions;
  }
}
