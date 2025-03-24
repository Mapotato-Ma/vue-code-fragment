<template>
  <div class="json-view">
    <div class="left" :style="{ flex: leftDiv }">
      <Editor :data="jsonStr" @update:data="updateData"></Editor>
    </div>
    <div class="right" :style="{ flex: rightDiv }" tabindex="0">
      <div class="operation">
        <button @click="importJson">导入JSON</button>
        <button @click="exportJson">导出JSON</button>
      </div>
      <NestView v-model:data="data" is-root></NestView>
    </div>
    <div class="layout">
      <div
        class="div"
        :class="{ leftDiv: i + 1 <= leftDiv }"
        v-for="(div, i) in 24"
        @click="leftDiv = i + 1"
        :key="div"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor, NestView } from '@/common/components';
import { message } from '@/common/plugins/message';
import { computed, ref } from 'vue';
const data = ref();
const leftDiv = ref(8);
const rightDiv = computed(() => {
  return 24 - leftDiv.value;
});
(async () => {
  data.value = (await import('./json/mock.json')).default;
})();
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

const importJson = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json';
  input.click();
  input.onchange = (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      try {
        data.value = JSON.parse(e.target!.result as string);
      } catch (error) {
        message.message(`json格式错误:${error}`, 10000);
      }
    };
  };
};
const exportJson = () => {
  const jsonStr = JSON.stringify(data.value, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.json';
  a.click();
  URL.revokeObjectURL(url);
};
</script>

<style lang="scss" scoped>
.json-view {
  width: 100%;
  padding: 3em 0 0 0;
  height: 100%;
  display: flex;
  position: relative;
  .left,
  .right {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: flex 0.2s;
  }
  .left {
    border-top: 3px solid #b6770b;
  }
  .right {
    border-top: 3px solid #9232ec;
  }
  .right > .nest-view {
    border: none;
  }
  .layout {
    position: absolute;
    top: 0.5em;
    width: 100%;
    height: 2em;
    display: flex;
    background-color: #191919;
    gap: 4px;
    .div {
      cursor: pointer;
      flex: 1;
      height: 100%;
      opacity: 0.6;
      background-color: #892be2;
      transition: all 0.2s;
      &.leftDiv {
        background-color: #b6580b;
      }
      &:hover {
        background-color: #b6580b;
        opacity: 1;
      }
      &:hover ~ .div {
        opacity: 1;
        background-color: #892be2;
      }
    }
    .div:has(~ .div:hover) {
      opacity: 1;
      background-color: #b6580b;
    }
  }
  .operation {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    align-items: center;
    padding: 0.5em 1em;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
