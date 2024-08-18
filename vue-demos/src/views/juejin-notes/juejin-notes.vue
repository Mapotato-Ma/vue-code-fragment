<template>
  <div class="juejin-notes">
    <VueShowdown
      class="jn-article"
      :markdown="article"
      v-for="(article, index) in articles"
      :key="index"
      :flavor="'allOn'"
      ref="articleRefs"
      @dblclick="fullScreenArticle(index)"
    ></VueShowdown>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getArticles } from './articles';
import { VueShowdown } from 'vue-showdown';
import { useFullscreen } from '@vueuse/core';
const articles = ref<string[]>();
const articleRefs = ref<HTMLElement[]>([]);
onMounted(async () => {
  articles.value = await getArticles();
});

const fullScreenArticle = (index: number) => {
  useFullscreen(articleRefs.value[index]!).toggle();
};
</script>

<style lang="scss" scoped>
.juejin-notes {
  width: 100%;
  columns: 3;
  column-gap: 1em;
  .jn-article {
    margin-bottom: 1em;
    height: max-content;
    padding: 10px;
    overflow: auto;
    max-height: 60vh;
    color: #e0e0e0;
    background-color: #292929;
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
    --tw-shadow-colored: inset 0 2px 4px 0 var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
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
    width: 90%;
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
