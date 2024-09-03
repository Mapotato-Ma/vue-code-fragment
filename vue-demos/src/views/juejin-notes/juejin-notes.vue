<template>
  <div class="juejin-notes">
    <CollapsePanel
      class="jn-article fade-in-out"
      :title="titleList[index]"
      v-for="(article, index) in articles"
      :key="titleList[index]"
      ref="articleRefs"
    >
      <VueShowdown
        :markdown="article"
        :key="index"
        :flavor="'allOn'"
        @dblclick="fullScreenArticle(index)"
      ></VueShowdown>
    </CollapsePanel>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VueShowdown } from 'vue-showdown';
import { useFullscreen } from '@vueuse/core';
import { CollapsePanel } from '@/common/components';

const articles = Object.values(
  import.meta.glob<true, string, { markdown: string }>('./articles/*.md', { eager: true })
).map((file) => file.markdown);
const articleRefs = ref<HTMLElement[]>([]);
const titleList = articles.map((article) => article.split('\n')[0]?.replace('#', '').trim());

const fullScreenArticle = (index: number) => {
  useFullscreen(articleRefs.value[index]!).toggle();
};
</script>

<style lang="scss" scoped>
.juejin-notes {
  width: 100%;
  columns: 4;
  column-gap: 1em;

  .jn-article {
    margin-bottom: 1em;
    height: max-content;
    padding: 10px;
    overflow: auto;
    max-height: 60vh;
    color: #e0e0e0;
    background-color: #292929;
  }
}
</style>
<style>
.juejin-notes {
  blockquote,
  q {
    quotes: none;
    border-left: 0.2em solid #b0a1a1;
    margin: 0.5em 0;
    padding: 0.5em 0.5em 0.5em 1em;
    background: #00000029;
  }

  code {
    margin-right: 0.5em;
  }

  p {
    margin: 0;
  }

  img {
    border: 5px dashed var(--color-border);
    margin: 1em 5%;
    padding: 0.5em;
    max-width: 90%;
  }

  a {
    color: rgb(100, 173, 255);
    text-decoration: underline;

    &:hover {
      color: rgba(100, 172, 255, 0.728);
    }
  }

  pre {
    position: relative;
    margin: 1.5em 2em;
    padding: 1.5em 0.5em;
    background-color: #6464649c;
    overflow: auto;
    border: 2px solid #eee;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      color: #ffffff7c;
      font-style: italic;
      font-size: 12px;
      padding: 0.1em 0.5em;
    }

    &:has(.js)::before {
      content: 'js';
    }

    &:has(.ts)::before {
      content: 'ts';
    }

    &:has(.json)::before {
      content: 'json';
    }

    &:has(.ps1)::before {
      content: 'ps1';
    }

    &:has(.typescript)::before {
      content: 'typescript';
    }

    &:has(.shell)::before {
      content: 'shell';
    }

    &:has(.toml)::before {
      content: 'toml';
    }

    &:has(.text)::before {
      content: 'text';
    }
  }
}
</style>
