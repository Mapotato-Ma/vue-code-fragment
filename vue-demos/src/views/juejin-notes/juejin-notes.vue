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
    <div class="jn-content" @scrollsnapchange="refreshHash">
      <UseFullscreen
        class="jn-article"
        :class="{ active: `#${titleList[index]}` === hash }"
        v-slot="{ isFullscreen, toggle }"
        v-for="(article, index) in articles"
        :key="index"
        :id="titleList[index]"
      >
        <VueShowdown :markdown="article" flavor="allOn" :title="titleList[index]"></VueShowdown>
        <BsFullscreenExit class="jn-icon" @click="toggle" v-if="isFullscreen"></BsFullscreenExit>
        <EpFullScreen class="jn-icon" @click="toggle" v-else></EpFullScreen>
      </UseFullscreen>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted } from 'vue';
import { VueShowdown } from 'vue-showdown';
import { useRoute, useRouter } from 'vue-router';
import { UseFullscreen } from '@vueuse/components';
import { EpFullScreen } from 'vue-icons-plus/ep';
import { BsFullscreenExit } from 'vue-icons-plus/bs';

const baseURL = import.meta.env.BASE_URL;
const route = useRoute();
const router = useRouter();
const hash = computed(() => route.hash);
const articles = Object.values(
  import.meta.glob<true, string, { markdown: string }>('./articles/*.md', { eager: true })
).map((file) => file.markdown);
const titleList = articles.map((article) => article.split('\n')[0]?.replace('#', '').trim());

onMounted(() => {
  nextTick(() => {
    document.getElementById(route.hash.substring(1))?.scrollIntoView({
      behavior: 'smooth'
    });
  });
});
const refreshHash = (e: { snapTargetBlock: Element }) =>
  router.replace({ hash: `#${e.snapTargetBlock.id}` });
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
      padding: 0.2em 1em;
      color: var(--apple-music-default);
      filter: brightness(1);
      border-left: 1px solid;
      transition: all 233ms ease;
      text-underline-offset: 8px;

      &:hover {
        filter: brightness(0.6);
      }

      &.active {
        filter: brightness(1);
        border-width: 5px;
        color: var(--apple-music-primary);
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
    scroll-snap-type: y mandatory;

    .jn-article {
      position: relative;
      flex-shrink: 0;
      margin-bottom: 1em;
      padding: 1.5em;
      overflow: hidden;
      color: #e0e0e0;
      background-color: #292929;
      border-left: 5px solid var(--color-border-light);
      scroll-snap-align: center;
      transition: all 233ms ease;

      &.active {
        border-left: 0px;
        box-shadow: inset 0px 0px 20px 4px var(--apple-music-primary);
      }

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
}
</style>
<style lang="scss">
.juejin-notes {
  .jn-article h1:nth-of-type(1) {
    margin-top: 0;
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
