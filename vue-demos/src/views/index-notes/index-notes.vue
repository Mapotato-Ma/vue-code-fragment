<template>
  <div class="index-notes">
    <div
      class="in-x"
      v-for="{ component, size, name } in components"
      :style="{ gridColumn: `span ${size.w}`, gridRow: `span ${size.h}` }"
      :key="name"
    >
      <component :is="component"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  FlexibleLayouts,
  LineGraph,
  ScrollDemo,
  SelectBox,
  DirectedGraphImprove,
  SvgDemo
} from './components';
const components = [
  { name: '可拖拽布局组件', component: FlexibleLayouts, size: { w: 2, h: 2 } },
  { name: '双边连线组件', component: LineGraph, size: { w: 1, h: 1 } },
  { name: '冻结行列表格', component: ScrollDemo, size: { w: 1, h: 1 } },
  { name: '选择器组件', component: SelectBox, size: { w: 1, h: 1 } },
  { name: '随机梯形svg组件', component: SvgDemo, size: { w: 2, h: 1 } },
  { name: '有向图组件', component: DirectedGraphImprove, size: { w: 3, h: 2 } }
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
    border: 1px solid var(--color-border);
    padding: 10px;
    background: #000;
    align-content: center;
    overflow: hidden;
  }
}
</style>
