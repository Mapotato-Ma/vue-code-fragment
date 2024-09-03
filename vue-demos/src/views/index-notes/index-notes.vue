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
  SelectBox,
  DirectedGraphImprove,
  SvgDemo,
  LovelySnake,
  JSONView
} from './components';

const total = 100;
const components = [
  { name: 'JSON可视化', component: JSONView, size: { w: 0.3 * total, h: 0.2 * total } },
  { name: '贪吃蛇组件', component: LovelySnake, size: { w: 0.2 * total, h: 0.2 * total } },
  { name: '双边连线组件', component: LineGraph, size: { w: 0.1 * total, h: 0.1 * total } },
  // { name: '冻结行列表格', component: ScrollDemo, size: { w: 0.1*total, h: 0.1*total } },
  { name: '选择器组件', component: SelectBox, size: { w: 0.1 * total, h: 0.1 * total } },
  { name: '可拖拽布局组件', component: FlexibleLayouts, size: { w: 0.15 * total, h: 0.1 * total } },
  { name: '随机梯形svg组件', component: SvgDemo, size: { w: 0.15 * total, h: 0.1 * total } },
  { name: '有向图组件', component: DirectedGraphImprove, size: { w: 0.3 * total, h: 0.2 * total } }
];
</script>
<style lang="scss" scoped>
.index-notes {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(1, minmax(400px, 1fr));
  grid-template-rows: repeat(auto-fill, minmax(400px, 50vh));
  gap: 2em;
  .in-x {
    width: 100%;
    height: 100%;
    padding: 10px;
    align-content: center;
    overflow: hidden;
    background: var(--apple-music-bg-lighten);
  }
}
</style>
