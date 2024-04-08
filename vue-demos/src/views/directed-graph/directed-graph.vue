<template>
  <div class="directed-graph" :draggable="false" ref="elDrawContainer">
    <!-- Points -->
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
      <!-- Link Lines -->
      <teleport to=".directed-graph">
        <div
          v-for="endPoint in point.endPoints"
          :key="endPoint.id"
          class="dg-line"
          :style="getLineStyle(point.getCenterPosition, endPoint.getCenterPosition)"
        ></div>
      </teleport>
    </div>
    <!-- 右侧卡片面板 -->
    <t-card
      class="dg-point-manage-card"
      title="Point-Manage"
      header-bordered
      :style="{ width: '500px', height: '100%' }"
    >
      <!-- Points面板 -->
      <t-card title="Points" header-bordered>
        <div class="dg-point-manage-card-points">
          <div
            class="dg-point-manage-card-point"
            :span="3"
            v-for="point in points"
            :key="point.pointId"
            @click="removePoint(point)"
          >
            Point {{ point.pointName }}
          </div>
        </div>
        <template #actions>
          <t-link theme="primary" hover="color" @click="addPoint">New Point</t-link>
        </template>
      </t-card>
      <!-- 分割线 -->
      <t-divider></t-divider>
      <!-- Lines面板 -->
      <t-card title="Lines" header-bordered>
        <div class="dg-point-manage-card-lines">
          <div
            class="dg-point-manage-card-line"
            :span="3"
            v-for="(item, index) in connections"
            :key="item.startPoint.pointId"
          >
            <div class="dg-cs">Point {{ item.startPoint.pointName }}</div>
            <div class="dg-card-line"><CutIcon @click="removeConnection(item, index)" /></div>
            <div class="dg-cn">Point {{ item.endPoint.pointName }}</div>
          </div>
        </div>
        <template #actions>
          <t-popconfirm
            :popupProps="{ overlayInnerClassName: 'dg-popconfirm-content' }"
            @confirm="confirmConnect"
          >
            <template #content>
              <div class="dg-popconfirm">
                <div class="dg-popconfirm-start-list">
                  <t-select
                    v-model="pointSelectStartValue"
                    :options="pointSelectOptions"
                    label="Start:"
                  ></t-select>
                </div>
                <div class="dg-popconfirm-end-list">
                  <t-select
                    v-model="pointSelectEndValue"
                    :options="pointSelectOptions"
                    label="End:"
                  ></t-select>
                </div>
              </div>
            </template>
            <t-link theme="primary" hover="color">New Connect</t-link>
          </t-popconfirm>
        </template>
      </t-card>
    </t-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, ref, type ComponentInternalInstance } from 'vue';
import { usePoint, type IPoint } from './usePoint';
import { numberToPx } from '@/utils';
import { CutIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
const points = ref<any>([]);
const connections = ref<
  Array<{
    startPoint: IPoint;
    endPoint: IPoint;
  }>
>([]);
const draggingPoint = ref();
const elDrawContainer = ref<HTMLElement>();

const pointSelectStartValue = ref('1');
const pointSelectEndValue = ref('1');
const pointSelectStart = computed(() =>
  points.value.find((point: IPoint) => point.pointName === pointSelectStartValue.value)
);
const pointSelectEnd = computed(() =>
  points.value.find((point: IPoint) => point.pointName === pointSelectEndValue.value)
);
const pointSelectOptions = computed(() =>
  points.value.map((point: { pointName: string }) => ({
    value: point.pointName,
    label: `Point ${point.pointName}`
  }))
);

let currentInstance: ComponentInternalInstance | null;

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

const confirmConnect = () => {
  addConnection(pointSelectStart.value, pointSelectEnd.value);
  currentInstance?.proxy?.$forceUpdate();
};

const removeConnection = (connection: any, index: number) => {
  const endPointIndex = connection.startPoint.endPoints.findIndex(
    (point: IPoint) => point.pointName === connection.endPoint.pointName
  );
  const startPointIndex = connection.endPoint.startPoints.findIndex(
    (point: IPoint) => point.pointName === connection.startPoint.pointName
  );
  connection.startPoint.endPoints.splice(endPointIndex, 1);
  connection.endPoint.startPoints.splice(startPointIndex, 1);
  connections.value.splice(index, 1);
};

onMounted(() => {
  currentInstance = getCurrentInstance();
});

const addConnection = (startPoint: any, endPoint: any) => {
  if (startPoint.pointId === endPoint.pointId) {
    MessagePlugin.warning('不能连接自身！');
    return;
  }
  if (startPoint.endPoints.includes(endPoint) || startPoint.startPoints.includes(endPoint)) {
    MessagePlugin.warning('连接已存在！');
    return;
  }
  connections.value.push({ startPoint, endPoint });
  startPoint.addConnection(endPoint);
};

const removePoint = (point: IPoint) => {
  // 移除点
  const index = points.value.findIndex((p: IPoint) => p.pointId === point.pointId);
  points.value.splice(index, 1);
  // 移除连接（双向移除）
  point.startPoints.forEach((p) => {
    const index = connections.value.findIndex(
      (connect) =>
        connect.startPoint.pointId === p.pointId && connect.endPoint.pointId === point.pointId
    );
    connections.value.splice(index, 1);
  });
  point.endPoints.forEach((p) => {
    const index = connections.value.findIndex(
      (connect) =>
        connect.startPoint.pointId === point.pointId && connect.endPoint.pointId === p.pointId
    );
    connections.value.splice(index, 1);
  });
  // 断开连线
  point.dispose();
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
  addConnection(point2, point4);
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
      height: calc(100% - 57px);
      overflow: auto;
    }
    .t-link {
      user-select: none;
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
    }
    &-lines {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &-point,
    &-line {
      position: relative;
      text-align: center;
      padding: 10px;
      font-weight: bolder;
      -webkit-user-drag: none;
      border-radius: 9999999em;
      background-color: blueviolet;
    }
    &-point {
      &::after {
        cursor: pointer;
        content: '删除';
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 9999999em;
        transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        opacity: 0;
        backdrop-filter: blur(8px) grayscale(0.7);
      }
    }
    &-point:hover {
      &::after {
        opacity: 1;
      }
    }
    &-line {
      background-color: rgba(137, 43, 226, 0.28);
      display: flex;
      align-items: center;
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
      &:hover {
        .dg-card-line .t-icon {
          scale: 2;
        }
      }
      .dg-card-line {
        width: 100%;
        flex: auto;
        height: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: blueviolet;
        .t-icon {
          cursor: pointer;
          scale: 0;
          transition: scale 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
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

<style lang="scss">
.dg-popconfirm-content {
  .t-icon {
    display: none;
  }
}
.dg-popconfirm {
  display: flex;
  gap: 10px;
  &-start-list {
    grid-area: start-list;
    display: flex;
    flex-direction: column;
    max-height: 200px;
    overflow: auto;
  }
  &-end-list {
    display: flex;
    flex-direction: column;
    grid-area: end-list;
    max-height: 200px;
    overflow: auto;
  }
}
</style>
