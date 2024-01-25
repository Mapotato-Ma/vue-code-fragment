<template>
  <VueDraggable ref="el" v-model="list" class="flexible-layouts" :animation="500" @sort="onSort">
    <div v-for="item in list" :key="item.id" class="fl-box">
      {{ item.name }}
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
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  overflow: auto;
  .fl-box {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: brown;
    width: 158px;
    height: 150px;
    resize: horizontal;
    overflow: auto;
    font-size: 100px;
  }
}
</style>
