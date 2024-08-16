<template>
  <div class="json-view">
    <div class="left">
      <Editor :data="jsonStr" @update:data="updateData"></Editor>
    </div>
    <div class="right" tabindex="0">
      <div class="operation">
        <button @click="importJson">导入JSON</button>
        <button @click="exportJson">导出JSON</button>
      </div>
      <NestView v-model:data="data" is-root></NestView>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Editor, NestView } from '@/common/components';
import { message } from '@/common/plugins/message';
import { computed, ref } from 'vue';
const data = ref();
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
  height: 100vh;
  display: flex;
  .left {
    display: flex;
    flex-direction: column;
    min-width: 30cqw;
  }
  .right {
    flex: auto;
    display: flex;
    flex-direction: column;
    & > .nest-view {
      border: none;
    }
  }
  .operation {
    display: flex;
    gap: 1em;
    justify-content: flex-end;
    align-items: center;
    height: 3em;
    padding-right: 1em;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
