<template>
  <div class="codepen-notes">
    <div class="cn-container">
      <fieldset class="cn-x" v-for="{ penId, name, zoom } in currentComponents" :key="penId">
        <div class="cn-pen" :id="`cn${penId}`">
          <codepen :pen-id default-tab="result" :zoom></codepen>
        </div>
        <div class="cn-bottom">
          <div class="cn-name">{{ name }}</div>
          <div class="cn-fullscreen" @click="fullScreenArticle(`cn${penId}`)">⌜⌝</div>
        </div>
      </fieldset>
    </div>
    <div class="cn-pagination">
      <button v-if="currentPage > 1" @click="currentPage--">&lt;&nbsp;Prev</button>
      <button @click="currentPage++" v-if="currentPage < Math.ceil(components.length / 6)">
        Next&nbsp;&gt;
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Codepen } from '@/common/components';
import { computed, onMounted, ref } from 'vue';
import { useFullscreen } from '@vueuse/core';
import { message } from '@/common/plugins/message';

onMounted(async () => {
  try {
    const res = await (await fetch('/api/getPens', { method: 'POST' })).json();
    if (typeof res === 'object') {
      components.value = res;
    } else {
      message.message('获取组件失败！');
    }
  } catch (error) {
    message.message('获取组件失败！');
  }
});

const components = ref<
  {
    penId: string;
    name: string;
    zoom?: number;
  }[]
>([]);

const currentPage = ref(1);

const currentComponents = computed(() => {
  return components.value.slice((currentPage.value - 1) * 6, (currentPage.value - 1) * 6 + 6);
});
const fullScreenArticle = (id: string) => {
  const element = document.getElementById(id);
  useFullscreen(element).toggle();
};
</script>

<style lang="scss" scoped>
.codepen-notes {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 3em;
  .cn-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    height: 100%;
    flex: 1;
    align-content: center;
    gap: 2em;
    .cn-x {
      padding: 10px;
      background: #292929;
      border: none;
      display: flex;
      flex-direction: column;
      gap: 1em;
      .cn-pen {
        height: calc(100% - 3em);
      }
      .cn-bottom {
        height: 2em;
        line-height: 2em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cn-fullscreen {
          position: relative;
          font-weight: bolder;
          zoom: 0.6;
          margin-top: -1em;
          cursor: pointer;
          &:hover {
            color: #1083ef;
          }
          &::after {
            content: '⌞⌟';
            position: absolute;
            top: 1em;
            left: 0;
          }
        }
      }
    }
  }
  .cn-pagination {
    display: flex;
    justify-content: center;
    gap: 1em;
    margin-top: auto;
    button {
      zoom: 2;
    }
  }
}
</style>
