<script setup lang="ts">
import { ref } from 'vue';

const data = ref([
  {
    id: 1,
    title: 'Vue 3.0 正式发布',
    content: '橘子',
    author: 'Jeffrey'
  },
  {
    id: 2,
    title: 'Vue 3.0 正式发布',
    content: '香蕉',
    author: 'Jeffrey'
  },
  {
    id: 3,
    title: 'Vue 3.0 正式发布',
    content: '苹果',
    author: 'Jeffrey'
  },
  {
    id: 4,
    title: 'Vue 3.0 正式发布',
    content: '橙子',
    author: 'Jeffrey'
  },
  {
    id: 5,
    title: 'Vue 3.0 正式发布',
    content: '下一个是什么',
    author: 'Jeffrey'
  },
  {
    id: 6,
    title: 'Vue 3.0 正式发布'
  }
]);
</script>

<template>
  <div class="hello-world">
    <div class="hello-world-list">
      <div
        v-for="({ title, content, author, id }, index) in data"
        :key="id"
        :data-title="content"
        :class="[
          'hello-world-item',
          `hello-world-item-row${(index + 1) % 2 === 0 ? (index + 1) / 2 : (index + 1 + 1) / 2}`,
          `hello-world-item-col${index % 2 === 0 ? '1' : '2'}`
        ]"
      >
        <h2>{{ title }}</h2>
        <p>{{ content }}</p>
        <p>作者：{{ author }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.hello-world {
  width: 800px;
  padding: 10px;
}

.hello-world-list {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  .hello-world-item {
    width: 300px;
    padding: 10px;
    border: 1px solid #ccc;
    &-row1 {
      background-color: #d11d1d;
    }
    &-row2 {
      color: rgb(193, 11, 11);
      background-color: rgb(9, 22, 44);
    }
    &-row3 {
      p {
        display: none;
      }
    }
  }
}
.hello-world-item {
  &-row1&-col2 {
    background-color: #1d2cd1;
  }
}
</style>
