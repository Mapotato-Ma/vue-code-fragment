<template>
  <div class="juejin-notes">
    <div class="jn-directory">
      <div class="jn-container">
        <a
          class="jn-article-title"
          :href="`${BASE_URL}/juejin-notes#${titleList[index]}`"
          :class="{ active: `#${titleList[index]}` === hash }"
          v-for="(_, index) in articles"
          :key="titleList[index]"
          :title="titleList[index]"
        >
          {{ titleList[index] }}
        </a>
      </div>
    </div>
    <div class="jn-content">
      <div class="jn-container">
        <use-fullscreen
          class="jn-article"
          :class="{ active: `#${titleList[index]}` === hash }"
          v-slot="{ isFullscreen, toggle }"
          v-for="(article, index) in articles"
          :key="index"
          :id="titleList[index]"
        >
          <vue-showdown :markdown="article" flavor="allOn" :title="titleList[index]"></vue-showdown>
          <bs-fullscreen-exit
            class="jn-icon"
            @click="toggle"
            v-if="isFullscreen"
          ></bs-fullscreen-exit>
          <ep-full-screen class="jn-icon" @click="toggle" v-else></ep-full-screen>
        </use-fullscreen>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { VueShowdown } from 'vue-showdown';
import { useRoute } from 'vue-router';
import { UseFullscreen } from '@vueuse/components';
import { EpFullScreen } from 'vue-icons-plus/ep';
import { BsFullscreenExit } from 'vue-icons-plus/bs';
import { BASE_URL } from '@/config';

const route = useRoute();
const hash = computed(() => route.hash);
const articles = Object.freeze(
  Object.values(
    import.meta.glob<true, string, { markdown: string }>('./articles/*.md', { eager: true })
  ).map((file) => file.markdown)
);
const titleList = Object.freeze(
  articles.map((article) => article.split('\n')[0]?.replace('#', '').trim())
);
</script>

<style lang="scss" scoped>
.juejin-notes {
  height: 100%;
  overflow: hidden;
  display: flex;
  gap: 1em;

  .jn-directory {
    max-width: 15%;
    height: 100%;
    padding: 20px;
    padding-right: 0px;
    padding-bottom: 0px;
    border-top: 2px solid var(--apple-music-primary);
    border-left: 2px solid var(--apple-music-primary);

    .jn-article-title {
      cursor: pointer;
      font-weight: bold;
      font-size: 20px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      padding: 0.2em 10px;
      color: var(--apple-music-default);
      filter: brightness(1);
      border-right: 2px solid transparent;
      border-top: 2px solid transparent;
      text-decoration: none;
      transition: all 233ms ease;
      background: #292929;

      &:hover {
        filter: brightness(0.6);
      }

      &.active {
        filter: brightness(1);
        border-color: currentColor;
        color: var(--apple-music-primary);
      }
    }
  }

  .jn-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
    padding-bottom: 0px;
    border: 2px solid var(--apple-music-primary);
    border-bottom: none;

    .jn-article {
      position: relative;
      flex-shrink: 0;
      margin-bottom: 1em;
      padding: 1.5em;
      overflow: hidden;
      color: #e0e0e0;
      background-color: #292929;

      .jn-icon {
        cursor: pointer;
        position: absolute;
        right: 1em;
        top: 1em;
        transition: color 233ms ease;
        &:hover {
          color: var(--apple-music-primary);
        }
      }

      & > div {
        height: 100%;
      }
    }
  }

  .jn-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1em;
    overflow: auto;
    scroll-behavior: smooth;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
<style lang="scss">
.juejin-notes {
  .jn-article {
    &.active h1:nth-of-type(1) {
      text-decoration: underline;
      color: var(--apple-music-primary);
      text-underline-offset: 15px;
    }
    h1:nth-of-type(1) {
      margin-top: 0;
    }
  }
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
