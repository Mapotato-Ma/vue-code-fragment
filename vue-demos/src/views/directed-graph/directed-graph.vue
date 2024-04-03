<template>
  <div class="directed-graph">
    <div
      class="dg-point"
      v-for="point in points"
      :key="point.id"
      :style="{
        top: point.top + 'px',
        left: point.left + 'px',
        width: point.radius * 2 + 'px',
        height: point.radius * 2 + 'px'
      }"
      @mousedown="draggingPoint = point"
    >
      <teleport to=".directed-graph">
        <div
          v-for="endPoint in point.endPointIds"
          :key="endPoint.id"
          class="dg-line"
          :style="getLineStyle(point.getCenterPosition, endPoint.getCenterPosition)"
        ></div>
      </teleport>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { usePoint } from './usePoint';

const points = ref();
const draggingPoint = ref();

onMounted(() => {
  const point1 = usePoint(100, 100);
  const point2 = usePoint(200, 200);
  const point3 = usePoint(300, 300);
  const point4 = usePoint(400, 400);
  point1.addConnection(point2);
  point2.addConnection(point3);
  point3.addConnection(point1);
  point4.addConnection(point1);
  point4.addConnection(point2);
  point4.addConnection(point3);
  point4.addConnection(point4);
  points.value = [point1, point2, point3, point4];
  document.addEventListener('mouseup', () => {
    draggingPoint.value = undefined;
  });
  document.addEventListener('mousemove', (event) => {
    if (draggingPoint.value) {
      draggingPoint.value.top += event.movementY;
      draggingPoint.value.left += event.movementX;
    }
  });
});

// 更新连线位置
const getLineStyle = (
  { top: y1, left: x1 }: { top: number; left: number },
  { top: y2, left: x2 }: { top: number; left: number }
) => {
  const { x3, x4 } = {
    x3: Math.ceil(Math.abs(x1 - x2) / 2) + 1 + Math.min(x1, x2),
    x4: Math.ceil(Math.abs(y1 - y2) / 2) + Math.min(y1, y2)
  };
  return {
    clipPath: `polygon(${x1}px ${y1}px, ${x3}px ${x4}px, ${x2}px ${y2}px`
  };
};
</script>

<style lang="scss" scoped>
.directed-graph {
  position: relative;
  width: 100%;
  height: 100%;
  .dg-point {
    cursor: move;
    border-radius: 100%;
    position: absolute;
    z-index: 1;
    background-color: blueviolet;
  }
  .dg-line {
    cursor: pointer;
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    background-color: rgb(25, 126, 215);
  }
}
</style>
