<template>
  <div class="directed-graph" :draggable="false" ref="elDrawContainer">
    <div
      class="dg-point"
      v-for="point in points"
      :key="point.id"
      :draggable="false"
      :style="{
        top: numberToPx(point.top),
        left: numberToPx(point.left),
        width: numberToPx(point.radius * 2),
        height: numberToPx(point.radius * 2)
      }"
      @mousedown="draggingPoint = point"
      :title="`Point${point.pointName}`"
    >
      <span>{{ point.pointName }}</span>
      <teleport to=".directed-graph">
        <div
          v-for="endPoint in point.endPoints"
          :key="endPoint.id"
          class="dg-line"
          :style="getLineStyle(point.getCenterPosition, endPoint.getCenterPosition)"
        ></div>
      </teleport>
    </div>
    <t-card
      class="dg-point-manage-card"
      title="Point-Manage"
      header-bordered
      :style="{ width: '400px', height: '100%' }"
    >
      <t-card title="Points" header-bordered>
        <div class="dg-point-manage-card-points">
          <div
            class="dg-point-manage-card-point"
            :span="3"
            v-for="point in points"
            :key="point.pointId"
          >
            Point{{ point.pointName }}
          </div>
        </div>
        <template #actions>
          <t-link theme="primary" hover="color" @click="addPoint">New Point</t-link>
        </template>
      </t-card>
      <t-divider></t-divider>
      <t-card title="Lines" header-bordered>
        <div class="dg-point-manage-card-lines">
          <div
            class="dg-point-manage-card-line"
            :span="3"
            v-for="item in connections"
            :key="item.startPoint.pointId"
          >
            <div class="dg-cs">Point{{ item.startPoint.pointName }}</div>
            <t-divider></t-divider>
            <div class="dg-cn">Point{{ item.endPoint.pointName }}</div>
          </div>
        </div>
      </t-card>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { usePoint, type IPoint } from './usePoint';
import { numberToPx } from '@/utils';
const points = ref<any>([]);
const connections = ref<any>([]);
const draggingPoint = ref();
const elDrawContainer = ref<HTMLElement>();
const addPoint = () => {
  const { width, height } = elDrawContainer.value!.getBoundingClientRect();
  points.value.push(
    usePoint(
      Math.floor(Math.abs(Math.random() * (width - 500))),
      Math.floor(Math.abs(Math.random() * height - 100)),
      `${points.value.length + 1}`
    )
  );
};

const addConnection = (startPoint: IPoint, endPoint: IPoint) => {
  connections.value.push({ startPoint, endPoint });
  startPoint.addConnection(endPoint);
};

onMounted(() => {
  const point1 = usePoint(100, 100, `${1}`);
  const point2 = usePoint(200, 200, `${2}`);
  const point3 = usePoint(300, 300, `${3}`);
  const point4 = usePoint(400, 400, `${4}`);
  points.value = [point1, point2, point3, point4];
  addConnection(point1, point2);
  addConnection(point1, point3);
  addConnection(point2, point3);
  addConnection(point3, point4);
  addConnection(point4, point1);
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
    display: grid;
    place-content: center;
    font-size: 50px;
    font-weight: bolder;
    font-family: 'NNN';
    -webkit-user-drag: none;
    cursor: move;
    border-radius: 100%;
    position: absolute;
    z-index: 1;
    background-color: blueviolet;
    > span {
      user-select: none;
    }
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
  :deep(.t-card.dg-point-manage-card) {
    > .t-card__body {
      display: flex;
      flex-direction: column;
      padding: 16px;
    }
  }
  .dg-point-manage-card {
    position: absolute;
    z-index: 1;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    &-points {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(4, 1fr);
      grid-template-rows: repeat(4, 1fr);
      height: 195px;
      overflow: auto;
    }
    &-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;
      height: 390px;
      overflow: auto;
    }
    &-point,
    &-line {
      text-align: center;
      padding: 10px;
      font-weight: bolder;
      font-family: 'NNN';
      -webkit-user-drag: none;
      border-radius: 9999999em;
      background-color: blueviolet;
    }
    &-line {
      background-color: rgba(137, 43, 226, 0.28);
      display: flex;
      .dg-cs,
      .dg-cn {
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 8px;
        flex: 1;
        border-radius: 9999999em;
        background-color: blueviolet;
      }
      .t-divider--horizontal {
        flex: auto;
      }
    }
  }
  .dg-operation {
    position: absolute;
    z-index: 1;
    right: 2vw;
    top: 50%;
    translate: 0 -50%;
  }
}
</style>
