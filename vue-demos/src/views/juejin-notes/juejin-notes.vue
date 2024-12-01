<template>
  <div class="juejin-notes">
    <div class="jn-directory">
      <a
        class="jn-article-title"
        :href="`${baseURL}/juejin-notes#${titleList[index]}`"
        :class="{ active: `#${titleList[index]}` === hash }"
        v-for="(_, index) in articles"
        :key="titleList[index]"
        :title="titleList[index]"
      >
        {{ titleList[index] }}
      </a>
    </div>
    <div class="jn-content">
      <VueShowdown
        class="jn-article"
        v-for="(article, index) in articles"
        ref="articleRefs"
        :key="index"
        :markdown="article"
        :flavor="'allOn'"
        @dblclick="fullScreenArticle(index)"
        :title="titleList[index]"
        :id="titleList[index]"
      ></VueShowdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { VueShowdown } from 'vue-showdown';
import { useFullscreen } from '@vueuse/core';
import { useRoute } from 'vue-router';

const baseURL = import.meta.env.BASE_URL;
const route = useRoute();
const hash = computed(() => route.hash);
const articles = Object.values(
  import.meta.glob<true, string, { markdown: string }>('./articles/*.md', { eager: true })
).map((file) => file.markdown);
const articleRefs = ref<HTMLElement[]>([]);
const titleList = articles.map((article) => article.split('\n')[0]?.replace('#', '').trim());

const fullScreenArticle = (index: number) => {
  useFullscreen(articleRefs.value[index]!).toggle();
};

onMounted(() => {
  nextTick(() => {
    document.getElementById(route.hash.substring(1))?.scrollIntoView({
      behavior: 'smooth'
    });
  });
});
</script>

<style lang="scss" scoped>
.juejin-notes {
  height: 100%;
  overflow: hidden;
  display: flex;
  gap: 2em;
  .jn-directory {
    max-width: 15%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 1em;
    outline: 1px;
    outline-color: var(--color-border);
    .jn-article-title {
      cursor: pointer;
      font-weight: bold;
      font-size: 20px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      color: var(--apple-music-primary);
      padding: 0.2em 1em;
      opacity: 0.6;
      border-left: 5px solid var(--color-border-light);
      &:hover {
        opacity: 1;
      }
      &.active {
        opacity: 1;
        color: var(--apple-music-default);
      }
    }
  }
  .jn-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding-right: 20px;
    scroll-behavior: smooth;
    .jn-article {
      flex-shrink: 0;
      margin-bottom: 1em;
      height: max-content;
      padding-left: 1.5em;
      overflow: auto;
      max-height: 80vh;
      color: #e0e0e0;
      background-color: #292929;
      border-left: 5px solid var(--color-border-light);
    }
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
