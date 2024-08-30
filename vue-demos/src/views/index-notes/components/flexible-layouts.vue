<template>
  <VueDraggable ref="el" v-model="list" class="flexible-layouts" :animation="500" @sort="onSort">
    <div v-for="(item, index) in list" :key="item.id" class="fl-box scale-in-out">
      <div
        class="fl-text"
        :style="{ animationDelay: `${Math.random() * -2}s` }"
        :class="[`fl-text-${index}`]"
      >
        {{ item.name }}
      </div>
    </div>
  </VueDraggable>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
defineOptions({ name: 'flexible-layouts' });

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
  new Array(36).fill(0).map((_, i) => ({
    id: i,
    name: String(randomEmojis[i])
  }))
);

const onSort = () => {
  console.log('🚀 ~ 最新序号 ~ 46行', list.value.map((item) => item.name).join('-'));
};
</script>

<style lang="scss" scoped>
.flexible-layouts {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(6, 1fr);
  padding: 10px;
  gap: 10px;
  .fl-box {
    cursor: move;
    display: grid;
    place-content: center;
    border-radius: 4px;
    user-select: none;
    padding: 2em 0;
    background: var(--color-brand-fill);
  }

  .fl-text {
    display: grid;
    place-content: center;
    font-size: 2cqi;
    transform-origin: center bottom;
    animation: danceTextRun 1s infinite alternate;
  }
}
</style>

<style>
@keyframes danceTextShake {
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
@keyframes danceTextRun {
  0% {
    transform: translateY(-5px);
  }

  100% {
    transform: translateY(5px);
  }
}
</style>
