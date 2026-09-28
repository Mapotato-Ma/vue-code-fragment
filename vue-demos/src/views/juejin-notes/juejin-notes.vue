<template>
  <div class="juejin-notes">
    <div class="jn-directory">
      <div class="jn-container">
        <template v-for="group in topicGroups" :key="group.topicId">
          <a
            class="jn-topic-title"
            :class="{ collapsed: collapsedGroups.has(group.topicId) }"
            :href="`${BASE_URL}/juejin-notes#${group.articles[0].slug}`"
            @click.prevent="
              collapsedGroups.has(group.topicId)
                ? collapsedGroups.delete(group.topicId)
                : (collapsedGroups = new Set([...collapsedGroups, group.topicId]))
            "
          >
            {{ group.topicLabel }}
            <span class="jn-topic-count">({{ group.articles.length }})</span>
          </a>
          <a
            v-for="article in group.articles"
            v-show="!collapsedGroups.has(group.topicId)"
            :key="article.slug"
            class="jn-article-title"
            :href="`${BASE_URL}/juejin-notes#${article.slug}`"
            :class="{ active: `#${article.slug}` === hash }"
            :title="article.title"
          >
            {{ article.title }}
          </a>
        </template>
      </div>
    </div>
    <div class="jn-content">
      <div class="jn-container">
        <use-fullscreen
          v-for="article in articles"
          :id="article.slug"
          v-slot="{ isFullscreen, toggle }"
          :key="article.slug"
          class="jn-article"
          :class="{ active: `#${article.slug}` === hash }"
        >
          <vue-showdown :markdown="article.content" flavor="allOn" :title="article.title"></vue-showdown>
          <bs-fullscreen-exit
            v-if="isFullscreen"
            class="jn-icon"
            @click="toggle"
          ></bs-fullscreen-exit>
          <ep-full-screen v-else class="jn-icon" @click="toggle"></ep-full-screen>
        </use-fullscreen>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { VueShowdown } from 'vue-showdown';
import { useRoute } from 'vue-router';
import { UseFullscreen } from '@vueuse/components';
import { EpFullScreen } from 'vue-icons-plus/ep';
import { BsFullscreenExit } from 'vue-icons-plus/bs';
import { BASE_URL } from '@/config';
import { TOPICS, TOPIC_BY_FILE, getTopicOrFallback } from './categories';
import type { TopicId } from './categories';

interface Article {
  slug: string;
  topicId: TopicId | string;
  topicLabel: string;
  title: string;
  content: string;
}

const route = useRoute();
const hash = computed(() => route.hash);

const rawByFile = import.meta.glob<true, string, { markdown: string }>('./articles/*.md', {
  eager: true,
});

const articles: readonly Article[] = Object.freeze(
  Object.entries(rawByFile).map(([path, file]) => {
    const filename = path.split('/').pop()!;
    const topic = getTopicOrFallback(TOPIC_BY_FILE[filename] ?? '');
    const title = file.markdown.split('\n')[0]?.replace('#', '').trim() ?? '';
    return {
      slug: `${topic.id}-${filename.replace('.md', '')}`,
      topicId: topic.id,
      topicLabel: topic.label,
      title,
      content: file.markdown,
    };
  }),
);

const topicGroups = computed(() => {
  const groups: { topicId: string; topicLabel: string; articles: Article[] }[] = [];
  const seen = new Set<string>();

  for (const t of TOPICS) {
    const groupArticles = articles.filter(a => a.topicId === t.id);
    if (groupArticles.length) {
      groups.push({ topicId: t.id, topicLabel: t.label, articles: groupArticles });
    }
    seen.add(t.id);
  }

  const ungrouped = articles.filter(a => !seen.has(a.topicId as string));
  if (ungrouped.length) {
    groups.push({ topicId: '_uncategorized', topicLabel: '未分类', articles: ungrouped });
  }

  return groups;
});

const collapsedGroups = ref(new Set<string>());
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

    .jn-topic-title {
      cursor: pointer;
      font-weight: bold;
      font-size: 18px;
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex-shrink: 0;
      padding: 0.3em 10px;
      margin-top: 0.5em;
      color: var(--apple-music-primary);
      text-decoration: none;
      border-bottom: 1px solid lch(from var(--apple-music-primary) l c h / calc(alpha - 0.4));
      transition: all 233ms ease;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .jn-topic-count {
        font-size: 14px;
        opacity: 0.5;
      }

      &.collapsed {
        border-bottom-color: transparent;
      }

      &:first-child {
        margin-top: 0;
      }
    }

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
      padding-left: 1.2em;
      color: var(--apple-music-default);
      filter: brightness(1);
      border-right: 2px solid transparent;
      border-top: 2px solid transparent;
      text-decoration: none;
      transition: all 233ms ease;
      background: #292929;

      &:hover {
        filter: brightness(1.6);
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
