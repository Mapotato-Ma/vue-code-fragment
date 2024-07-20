<template>
  <div class="codepen-notes">
    <fieldset
      class="cn-x"
      :style="{ gridColumn: `span ${size.w}`, gridRow: `span ${size.h}` }"
      v-for="{ penId, name, size } in components"
    >
      <legend>{{ name }}</legend>
      <Codepen :id="penId" default-tab="result"></Codepen>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import { Codepen } from '@/common/components';

const components = [
  { penId: 'YzbWQNV', name: '一个球', size: { w: 2, h: 2 } },
  { penId: 'VwNVOdE', name: 'Text Wall', size: { w: 1, h: 2 } },
  { penId: 'BaeyvgP', name: '自适应多列布局瀑布流', size: { w: 1, h: 1 } },
  { penId: 'WNBrVGx', name: '彩色进度条', size: { w: 1, h: 1 } },
  { penId: 'dyBGKag', name: '块级元素p与div', size: { w: 1, h: 1 } },
  { penId: 'vYMvQPO', name: 'diff算法演示', size: { w: 1, h: 2 } },
  { penId: 'BaMgLPW', name: '纹理', size: { w: 1, h: 1 } },
  { penId: 'bGyqbRX', name: '小人动画', size: { w: 1, h: 1 } },
  { penId: 'MWRdryJ', name: '3D-cards', size: { w: 2, h: 2 } },
  { penId: 'qBzBGpz', name: '单行省略', size: { w: 1, h: 1 } },
  { penId: 'poXJawe', name: 'loading', size: { w: 1, h: 1 } },
  { penId: 'gOQVXwJ', name: '无限碰撞', size: { w: 1, h: 1 } },
  { penId: 'ExJqRMr', name: 'CSS动画圆盘', size: { w: 1, h: 1 } },
  { penId: 'dyEGxog', name: '渐变色柱', size: { w: 1, h: 1 } },
  { penId: 'mdYVNVY', name: '多重边框与多重阴影云朵效果', size: { w: 1, h: 1 } },
  { penId: 'dyEGxMQ', name: '内阴影实现loading光圈', size: { w: 1, h: 1 } },
  { penId: 'WNBrVKp', name: '字母世界', size: { w: 1, h: 1 } },
  { penId: 'GRaoQMv', name: '线条动画', size: { w: 1, h: 3 } },
  { penId: 'wvNZwOw', name: 'CSS + SVG Text Smoke Effect', size: { w: 1, h: 1 } },
  { penId: 'OJGOpmv', name: 'wave', size: { w: 1, h: 1 } },
  { penId: 'JjVaNvz', name: 'SVG实现弧度圆环', size: { w: 1, h: 1 } },
  { penId: 'KKEYEaR', name: '箭头tab', size: { w: 1, h: 1 } },
  { penId: 'jOoyZaq', name: '铰链', size: { w: 1, h: 1 } },
  { penId: 'xxNXgyL', name: 'charts', size: { w: 2, h: 2 } },
  { penId: 'LYvvrNE', name: '文字描边效果', size: { w: 1, h: 1 } },
  { penId: 'dymBYNK', name: '有趣的搜索框', size: { w: 1, h: 1 } },
  { penId: 'xxePxMK', name: 'gray-dog', size: { w: 1, h: 1 } },
  { penId: 'KKLVOVN', name: '平行四边形，文字环绕效果', size: { w: 1, h: 1 } },
  { penId: 'JjqGgbB', name: '内外阴影实现相交⚪', size: { w: 1, h: 1 } },
  { penId: 'vYwLoyM', name: 'CSS3D练习', size: { w: 1, h: 1 } },
  { penId: 'JjqZyOj', name: '仿图标导航', size: { w: 1, h: 2 } },
  { penId: 'PovZMdN', name: '全景光效', size: { w: 1, h: 1 } },
  { penId: 'qBGNzjZ', name: '微软壁纸', size: { w: 3, h: 2 } },
  { penId: 'eYaBeba', name: 'Wallpaper Thoughts', size: { w: 1, h: 1 } },
  { penId: 'rNoazGG', name: '抖音旋转小球实现', size: { w: 1, h: 1 } },
  { penId: 'JjqWqob', name: 'rotate-line', size: { w: 1, h: 1 } },
  { penId: 'QWRyeEE', name: '渐变边框', size: { w: 1, h: 1 } },
  { penId: 'WNJEzYO', name: 'Icon-background', size: { w: 1, h: 1 } },
  { penId: 'BaejXBB', name: '逐帧动画-充电动画', size: { w: 1, h: 1 } },
  { penId: 'bGyEXBE', name: '混合模式', size: { w: 1, h: 1 } },
  { penId: 'MWRzYaR', name: 'CSS实现弧度圆环', size: { w: 1, h: 1 } },
  { penId: 'poBBWZY', name: 'css文本溢出', size: { w: 1, h: 1 } }
];
</script>

<style lang="scss" scoped>
.codepen-notes {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  gap: 2em;
  .cn-x {
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
