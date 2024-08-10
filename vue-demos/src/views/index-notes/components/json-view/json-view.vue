<template>
  <div class="json-view">
    <div class="left">
      <Editor :data="jsonStr" @update:data="updateData"></Editor>
    </div>
    <div class="right" tabindex="0">
      <NestView :data="data" is-root @update-modelValue="dataChange"></NestView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor, NestView } from '@/common/components';
import { computed, ref } from 'vue';
const data = ref({
  name: '张无忌',
  age: 21,
  sex: '男',
  isDied: false,
  address: {
    province: '北京',
    city: '北京',
    friends: [
      {
        name: '周芷若',
        age: 20,
        sex: '女'
      }
    ],
    friends33: [
      {
        name: '周芷若',
        age: 20,
        sex: '女'
      }
    ]
  },
  hobbies: ['吃饭', '睡觉', '九阳真经'],
  friends: [
    {
      name: '周芷若',
      age: 20,
      sex: '女'
    }
  ],
  friends33: [
    {
      name: '周芷若',
      age: 20,
      sex: '女'
    }
  ],
  hobbies7: ['吃饭', '睡觉', '九阳真经']
});

const jsonStr = computed(() => {
  return JSON.stringify(data.value, null, 2);
});

const updateData = (value: string) => {
  try {
    data.value = JSON.parse(value);
  } catch (error) {
    console.log('🚀 ~ error ~ 39行', error);
  }
};

const dataChange = (value: any) => {
  // data.value = value;
  console.log('🚀 ~ value ~ 69行', value);
};
</script>

<style lang="scss" scoped>
.json-view {
  width: 100%;
  height: 100%;
  display: flex;
  .left {
    min-width: 30cqw;
    border: 3px solid #2068ed;
  }
  .right {
    display: flex;
    flex-basis: 70cqw;
    border: 3px solid #2068ed;
    & > div {
      border: none;
    }
  }
}
</style>
