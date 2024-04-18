<template>
  <div class="directed-graph" :draggable="false" ref="elDrawContainer">
    <svg class="dg-draw-container">
      <defs>
        <!-- 用作箭头的 marker -->
        <marker
          id="arrow"
          viewBox="0 0 30 30"
          refX="30"
          refY="15"
          markerWidth="30"
          markerHeight="30"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 30 15 L 0 30 Q 30 15 0 0 z" fill="rgb(27, 63, 206)" />
        </marker>
      </defs>
    </svg>
    <!-- Points -->
    <div
      class="dg-point"
      v-for="point in points"
      :key="point.value.pointId"
      :draggable="false"
      :style="{
        top: numberToPx(point.value.top),
        left: numberToPx(point.value.left),
        width: numberToPx(point.value.radius * 2),
        height: numberToPx(point.value.radius * 2)
      }"
      @mousedown="draggingPoint = point.value"
      :title="`Point${point.value.pointName}`"
    >
      <span>{{ point.value.pointName }}</span>
      <!-- Link Lines -->
      <teleport to=".dg-draw-container">
        <line
          v-for="endPoint in point.value.endPoints"
          :key="endPoint.pointId"
          class="dg-line"
          marker-end="url(#arrow)"
          v-bind="getLineStyle(point, endPoint)"
        ></line>
      </teleport>
    </div>
    <!-- 右侧卡片面板 -->
    <t-card
      class="dg-point-manage-card"
      title="Point-Manage"
      header-bordered
      :style="{ width: '500px', height: '100%' }"
    >
      <template #actions>
        <t-button shape="circle" theme="primary" @click="showData">
          <template #icon>
            <CodeIcon />
          </template>
        </t-button>
      </template>
      <!-- Points面板 -->
      <t-card title="Points" header-bordered>
        <div class="dg-point-manage-card-points">
          <div
            class="dg-point-manage-card-point"
            :span="3"
            v-for="point in points"
            :key="point.value.pointId"
            @click="removePoint(point.value)"
          >
            Point {{ point.value.pointName }}
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
            :key="item.startPoint.pointName + '-' + item.endPoint.pointName"
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
import {
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  type ComponentInternalInstance,
  type Ref,
  toRef
} from 'vue';
import { Point, type IPoint, type IConnection } from './usePoint';
import { numberToPx } from '@/utils';
import { CutIcon, CodeIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin, type HTMLElementAttributes } from 'tdesign-vue-next';
const points = ref<Array<Ref<IPoint>>>([]);
const connections = ref<Array<IConnection>>([]);
const draggingPoint = ref<IPoint>();
const elDrawContainer = ref<HTMLElement>();

const pointSelectStartValue = ref('1');
const pointSelectEndValue = ref('1');
const pointSelectStart = computed(() =>
  points.value.find((point) => point.value.pointName === pointSelectStartValue.value)
);
const pointSelectEnd = computed(() =>
  points.value.find((point) => point.value.pointName === pointSelectEndValue.value)
);
const pointSelectOptions = computed(() =>
  points.value.map((point) => ({
    value: point.value.pointName,
    label: `Point ${point.value.pointName}`
  }))
);

let currentInstance: ComponentInternalInstance | null;

const addPoint = () => {
  const { width, height } = elDrawContainer.value!.getBoundingClientRect();
  let findIndex = points.value.length + 1;
  const indexSet = new Set();
  points.value.forEach((point) => {
    indexSet.add(Number(point.value.pointName));
  });
  for (let i = 1; i <= points.value.length + 1; i++) {
    if (!indexSet.has(i)) {
      findIndex = i;
      break;
    }
  }
  points.value.push(
    toRef(
      new Point(
        Math.floor(Math.abs(Math.random() * (width - 500))),
        Math.floor(Math.abs(Math.random() * height - 100)),
        `${findIndex}`
      )
    )
  );
};

const confirmConnect = () => {
  if (pointSelectStart.value?.value && pointSelectEnd.value?.value) {
    addConnection(pointSelectStart.value.value, pointSelectEnd.value.value);
    currentInstance?.proxy?.$forceUpdate();
  }
};

const removeConnection = (connection: IConnection, index: number) => {
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

const addConnection = (startPoint: IPoint, endPoint: IPoint) => {
  if (startPoint.pointId === endPoint.pointId) {
    MessagePlugin.warning('不能连接自身！');
    return;
  }
  if (startPoint.endPoints.includes(endPoint)) {
    MessagePlugin.warning('连接已存在！');
    return;
  }
  connections.value.push({ startPoint, endPoint });
  startPoint.addConnection(endPoint);
};

const removePoint = (point: IPoint) => {
  // 移除点
  connections.value = connections.value.filter(
    (connect) =>
      !(connect.startPoint.pointId === point.pointId || connect.endPoint.pointId === point.pointId)
  );
  const index = points.value.findIndex((p) => p.value.pointId === point.pointId);
  points.value.splice(index, 1);
  // 断开连线
  point.dispose();
  if (pointSelectStartValue.value === point.pointName) {
    pointSelectStartValue.value = points.value?.[0].value.pointName;
  }
  if (pointSelectEndValue.value === point.pointName) {
    pointSelectEndValue.value = points.value?.[0].value.pointName;
  }
};

onMounted(() => {
  const point1 = new Point(500, 690, '1');
  const point2 = new Point(200, 390, '2');
  const point3 = new Point(500, 90, '3');
  const point4 = new Point(810, 390, '4');
  points.value = [toRef(point1), toRef(point2), toRef(point3), toRef(point4)];
  addConnection(point1, point2);
  addConnection(point1, point3);
  addConnection(point1, point4);
  addConnection(point2, point1);
  addConnection(point2, point3);
  addConnection(point2, point4);
  addConnection(point3, point1);
  addConnection(point3, point2);
  addConnection(point3, point4);
  addConnection(point4, point1);
  addConnection(point4, point2);
  addConnection(point4, point3);
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
const getLineStyle = (startPoint: Ref<IPoint>, endPoint: IPoint): HTMLElementAttributes => {
  const { top: y1, left: x1 } = startPoint.value.getCenterPosition;
  const { top: y2, left: x2 } = endPoint.getCenterPosition;
  const { M, N } = findPointsOnLine({ x: x1, y: y1 }, { x: x2, y: y2 }, 50);
  return {
    x1: String(M.x),
    x2: String(N.x),
    y1: String(M.y),
    y2: String(N.y)
  };
};

const findPointsOnLine = (
  A: { x: number; y: number },
  B: { x: number; y: number },
  k: number
): { M: { x: number; y: number }; N: { x: number; y: number } } => {
  // 计算AB向量的x和y分量
  const dx = B.x - A.x;
  const dy = B.y - A.y;

  // 计算AB向量的长度
  const ABLength = Math.sqrt(dx * dx + dy * dy);

  // 检查k是否大于AB的长度，如果是，则无法找到这样的M和N点
  if (k > ABLength) {
    // throw new Error('k is greater than the distance between A and B, cannot find points M and N.');
    return { M: { x: 0, y: 0 }, N: { x: 0, y: 0 } };
  }

  // 计算M和N点到A和B点的比例因子
  const ratio = k / ABLength;

  // 使用线性插值计算M和N点的坐标
  const M = {
    x: A.x + dx * ratio,
    y: A.y + dy * ratio
  };

  const N = {
    x: B.x - dx * ratio,
    y: B.y - dy * ratio
  };

  return { M, N };
};

const showData = () => {
  console.log('🚀 ~ Points ~ 246行', points.value);
  console.log('🚀 ~ Connections ~ 247行', connections.value);
};
</script>

<style lang="scss" scoped>
.directed-graph {
  position: relative;
  width: 100%;
  height: 100%;
  .dg-draw-container {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    .dg-line {
      stroke: rgb(27, 63, 206);
    }
  }
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
  :deep(.t-card.dg-point-manage-card) {
    > .t-card__title {
      user-select: none;
    }
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
