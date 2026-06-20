<template>
  <vue-draggable
    v-if="isArray"
    v-model="data as Array<any>"
    :animation="500"
    class="nest-view array"
    group="json-view"
  >
    <div v-for="(item, index) in data" :key="item" class="array-item">
      <collapse-panel v-if="isSimpleData(item)" :title="`index: ${index}`">
        <div>type: {{ typeof item }}</div>
        <div>value: {{ item }}</div>
      </collapse-panel>
      <nest-view v-else v-model:data="(data as Array<any>)[Number(index)]" />
    </div>
  </vue-draggable>
  <div v-else class="nest-view">
    <collapse-panel
      v-for="(item, index) in Object.entries(data)"
      :key="index"
      :title="`key: ${item[0]}`"
    >
      <span>value:</span>
      <span v-if="isSimpleData(item[1])">
        {{ item[1] }}
      </span>
      <nest-view v-else v-model:data="(data as Record<string, any>)[item[0]]" />
    </collapse-panel>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { CollapsePanel, NestView } from '@/common/components';
import { VueDraggable } from 'vue-draggable-plus';
import { isSimpleData } from '@/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = defineModel<Array<any> | Record<string, any>>('data', { default: [] });

const isArray = computed(() => Array.isArray(data.value));
</script>

<style lang="scss" scoped>
.nest-view {
  position: relative;
  width: 100%;
  max-height: 100%;
  overflow: auto;
  padding: 0.5em;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  align-items: flex-start;
  align-content: flex-start;
  .array-item {
    .simple-value {
      display: flex;
      flex-direction: column;
      gap: 0.5em;
    }
  }
}
.array {
  padding: 1em;
}

fieldset {
  padding: 1em 0.5em;
}
</style>
