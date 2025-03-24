<template>
  <div class="index-notes">
    <div
      class="in-x"
      v-for="{ component, size, name } in components"
      :style="{
        gridColumn: `${size.columnStart} / span ${size.columnSpan}`,
        gridRow: `${size.rowStart} / span ${size.rowSpan}`
      }"
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
  NeonBall
} from './components';

const components = [
  {
    name: '有向图组件',
    component: DirectedGraphImprove,
    size: { columnStart: 1, columnSpan: 3, rowStart: 1, rowSpan: 2 }
  },
  {
    name: '双边连线组件',
    component: LineGraph,
    size: { columnStart: 4, columnSpan: 2, rowStart: 1, rowSpan: 0.5 }
  },
  // // { name: '冻结行列表格', component: ScrollDemo, size: { w: 0.1*total, h: 0.1*total } },
  {
    name: '选择器组件',
    component: SelectBox,
    size: { columnStart: 4, columnSpan: 2, rowStart: 1.5, rowSpan: 1.5 }
  },
  {
    name: '可拖拽布局组件',
    component: FlexibleLayouts,
    size: { columnStart: 1, columnSpan: 5, rowStart: 3, rowSpan: 3 }
  },
  {
    name: '贪吃蛇组件',
    component: LovelySnake,
    size: { columnStart: 1, columnSpan: 5, rowStart: 6, rowSpan: 4 }
  },
  {
    name: '霓虹灯',
    component: NeonBall,
    size: { columnStart: 3, columnSpan: 3, rowStart: 10, rowSpan: 2 }
  },
  {
    name: '随机梯形svg组件',
    component: SvgDemo,
    size: { columnStart: 1, columnSpan: 2, rowStart: 10, rowSpan: 2 }
  }
];
</script>
<style lang="scss" scoped>
.index-notes {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(5, minmax(400px, 1fr));
  grid-auto-rows: minmax(400px, auto);
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
