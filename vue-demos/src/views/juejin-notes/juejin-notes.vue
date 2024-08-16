<template>
  <div class="juejin-notes">
    <VueShowdown
      class="jn-article scale-in-out"
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
  columns: 5;
  column-gap: 1em;
  .jn-article {
    margin-bottom: 1em;
    height: max-content;
    padding: 10px;
    overflow: auto;
    max-height: 60vh;
    color: #e0e0e0;
    background-color: #342a45;
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
    background-color: #6464649c;
    margin-right: 0.5em;
  }
  p {
    margin: 0;
  }
  img {
    /* 图片加载不出来，不如去掉省的碍眼 */
    display: none;
  }
}
</style>
