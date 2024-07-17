<template>
  <div class="index-notes">
    <div
      class="in-x"
      v-for="{ component, size } in components"
      :class="[`in-${component.name}`]"
      :style="{ gridColumn: `span ${size.w}`, gridRow: `span ${size.h}` }"
      :key="component.name"
    >
      <component :is="component"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { FlexibleLayouts, LineGraph, ScrollDemo, SelectBox, UseClass,SvgDemo } from './components';
const components = [
  { component: FlexibleLayouts, size: { w: 2, h: 2 } },
  { component: LineGraph, size: { w: 1, h: 1 } },
  { component: ScrollDemo, size: { w: 1, h: 1 } },
  { component: SelectBox, size: { w: 1, h: 1 } },
  { component: SvgDemo, size: { w: 2, h: 1 } },
];
</script>

<style lang="scss" scoped>
.index-notes {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(400px, 1fr));
  gap: 2em;
  .in-x {
    width: 100%;
    height: 100%;
    border: 1px solid var(--border-color);
    padding: 10px;
    background: #000;
    align-content: center;
  }
}
</style>
