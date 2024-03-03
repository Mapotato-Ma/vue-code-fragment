<template>
  <VueDraggable ref="el" v-model="list" class="flexible-layouts" :animation="500" @sort="onSort">
    <div v-for="(item, index) in list" :key="item.id" class="fl-box">
      <div class="fl-text" :style="{ animationDelay: `${Math.random() * -5}s` }" :class="[`fl-text-${index}`]">
        {{ item.name }}
      </div>
    </div>
  </VueDraggable>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

const randomEmojis = [
  '😓',
  '😯',
  '😪',
  '😐',
  '😗',
  '😫',
  '😖',
  '😜',
  '😢',
  '😄',
  '😪',
  '😠',
  '😘',
  '😄',
  '😐',
  '😞',
  '😈',
  '😃',
  '😯',
  '😩',
  '😫',
  '😊',
  '😝',
  '😙',
  '😙',
  '😓',
  '😴',
  '😬',
  '😴',
  '😁',
  '😠',
  '😇',
  '😊',
  '😘',
  '😳',
  '😈',
  '😣',
  '😠',
  '😲',
  '😆',
  '😠',
  '😨',
  '😣',
  '😋',
  '😮',
  '😳',
  '😂',
  '😗',
  '😛',
  '😍',
  '😠',
  '😯',
  '😟',
  '😑',
  '😃',
  '😬',
  '😜',
  '😊',
  '😭',
  '😢'
];
const list = ref<{ id: number; name: string }[]>(
  new Array(60).fill(0).map((_, i) => ({
    id: i,
    name: String(randomEmojis[i])
  }))
);

const onSort = () => {
  console.log('🚀 ~ 最新序号 ~ 46行', list.value.map((item) => item.name).join('-'));
};
</script>

<style lang="less" scoped>
.flexible-layouts {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(10, 1fr);
  padding: 10px;
  gap: 10px;
  &:hover {
    .fl-box {
      background-color: rgba(165, 42, 42, 0.761);
    }
  }
  .fl-box {
    cursor: move;
    display: grid;
    place-content: center;
    transition: background-color 0.3s ease-in;
    background-color: rgba(165, 42, 42, 0.309);
    border-radius: 4px;
  }

  .fl-text {
    display: grid;
    place-content: center;
    width: 5vh;
    height: 5vh;
    font-size: 5vh;
    transform-origin: center bottom;
    animation: danceText 3s infinite;
  }
}
</style>

<style>
@keyframes danceText {
  0% {
    text-shadow: 0 0 13px rgba(236, 227, 203, 0.6);
    transform: scale(1, 1) rotateZ(0deg);
  }

  25% {
    text-shadow: 0 0 13px rgba(236, 227, 203, 1);
    transform: scale(1.2, 1.5) rotateZ(-15deg);
  }

  50% {
    text-shadow: 0 0 13px rgba(236, 227, 203, 0.6);
    transform: scale(1, 0.8) rotateZ(0deg);
  }

  75% {
    text-shadow: 0 0 13px rgba(236, 227, 203, 1);
    transform: scale(1.2, 1.5) rotateZ(15deg);
  }

  100% {
    text-shadow: 0 0 13px rgba(236, 227, 203, 0.6);
    transform: scale(1, 1) rotateZ(0deg);
  }
}
</style>
