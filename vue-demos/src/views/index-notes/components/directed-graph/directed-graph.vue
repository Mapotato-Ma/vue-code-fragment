<template>
  <div ref="elDrawContainer" class="directed-graph" :draggable="false">
    <!-- 箭头 -->
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
          <path d="M 0 0 L 30 15 L 0 30 L 15 15 z" fill="rgba(255, 255, 255, 1)" />
        </marker>
      </defs>
    </svg>
    <!-- Points -->
    <div
      v-for="point in points"
      :key="point.value.pointId"
      class="dg-point"
      :draggable="false"
      :style="{
        top: numberToPx(point.value.top),
        left: numberToPx(point.value.left),
        width: numberToPx(point.value.radius * 2),
        height: numberToPx(point.value.radius * 2),
      }"
      :title="`Point${point.value.pointName}`"
      @mousedown="draggingPoint = point.value"
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
    <div class="dg-panel">
      <collapse-panel class="dg-panel-item dg-panel-operation" title="Operation" init-collapse>
        <fieldset>
          <legend size="small">AddLine</legend>
          <select v-model="pointSelectStartValue">
            <option v-for="option in pointSelectOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <hr />
          <select v-model="pointSelectEndValue">
            <option v-for="option in pointSelectOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <button class="dg-add-connect" @click="confirmConnect">添加连接</button>
        </fieldset>
        <fieldset>
          <legend size="small">AddPoint</legend>
          <button block @click="addPoint">+ AddPoint</button>
        </fieldset>
      </collapse-panel>
      <collapse-panel
        class="dg-panel-item"
        title="Points"
        body-class="dg-panel-points"
        init-collapse
      >
        <div
          v-for="point in points"
          :key="point.value.pointId"
          class="dg-panel-point"
          :span="3"
          @click="removePoint(point.value)"
        >
          Point {{ point.value.pointName }}
        </div>
      </collapse-panel>
      <collapse-panel class="dg-panel-item" title="Lines" init-collapse>
        <div
          v-for="(item, index) in connections"
          :key="item.startPoint.pointName + '-' + item.endPoint.pointName"
          class="dg-panel-line"
          :span="3"
        >
          <div class="dg-cs">Point {{ item.startPoint.pointName }}</div>
          <div class="dg-remove-line" @click="removeConnection(item, index)"></div>
          <div class="dg-cn">Point {{ item.endPoint.pointName }}</div>
        </div>
      </collapse-panel>
    </div>
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
  toRef,
} from 'vue';
import { Point, type IPoint, type IConnection } from './usePoint';
import { numberToPx } from '@/utils';
import { message } from '@/common/plugins/message';
import { CollapsePanel } from '@/common/components';
const points = ref<Array<Ref<IPoint>>>([]);
const connections = ref<Array<IConnection>>([]);
const draggingPoint = ref<IPoint>();
const elDrawContainer = ref<HTMLElement>();

const pointSelectStartValue = ref('1');
const pointSelectEndValue = ref('1');
const pointSelectStart = computed(() =>
  points.value.find(point => point.value.pointName === pointSelectStartValue.value),
);
const pointSelectEnd = computed(() =>
  points.value.find(point => point.value.pointName === pointSelectEndValue.value),
);
const pointSelectOptions = computed(() =>
  points.value.map(point => ({
    value: point.value.pointName,
    label: `Point ${point.value.pointName}`,
  })),
);

let currentInstance: ComponentInternalInstance | null;

const addPoint = () => {
  const { width, height } = elDrawContainer.value!.getBoundingClientRect();
  let findIndex = points.value.length + 1;
  const indexSet = new Set();
  points.value.forEach(point => {
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
        `${findIndex}`,
      ),
    ),
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
    (point: IPoint) => point.pointName === connection.endPoint.pointName,
  );
  const startPointIndex = connection.endPoint.startPoints.findIndex(
    (point: IPoint) => point.pointName === connection.startPoint.pointName,
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
    // TODO: 更改提示类型为warning
    message.message('不能连接自身！');
    return;
  }
  if (startPoint.endPoints.includes(endPoint)) {
    // TODO: 更改提示类型为warning
    message.message('连接已存在！');
    return;
  }
  connections.value.push({ startPoint, endPoint });
  startPoint.addConnection(endPoint);
};

const removePoint = (point: IPoint) => {
  // 移除点
  connections.value = connections.value.filter(
    connect =>
      !(connect.startPoint.pointId === point.pointId || connect.endPoint.pointId === point.pointId),
  );
  const index = points.value.findIndex(p => p.value.pointId === point.pointId);
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
  document.addEventListener('mousemove', event => {
    if (draggingPoint.value) {
      draggingPoint.value.top += event.movementY;
      draggingPoint.value.left += event.movementX;
    }
  });
});

// 更新连线位置
const getLineStyle = (startPoint: Ref<IPoint>, endPoint: IPoint) => {
  const { top: y1, left: x1 } = startPoint.value.getCenterPosition;
  const { top: y2, left: x2 } = endPoint.getCenterPosition;
  const { M, N } = findPointsOnLine({ x: x1, y: y1 }, { x: x2, y: y2 }, 50);
  return {
    x1: String(M.x),
    x2: String(N.x),
    y1: String(M.y),
    y2: String(N.y),
  };
};

const findPointsOnLine = (
  A: { x: number; y: number },
  B: { x: number; y: number },
  k: number,
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
    y: A.y + dy * ratio,
  };

  const N = {
    x: B.x - dx * ratio,
    y: B.y - dy * ratio,
  };

  return { M, N };
};

// const showData = () => {
//   console.log('🚀 ~ Points ~ 246行', points.value);
//   console.log('🚀 ~ Connections ~ 247行', connections.value);
// };
</script>

<style lang="scss" scoped>
.directed-graph {
  position: relative;
  width: 100%;
  min-height: 80vh;
  .dg-draw-container {
    position: absolute;
    top: 0%;
    left: 0%;
    width: 100%;
    height: 100%;
    .dg-line {
      stroke: rgb(255, 255, 255);
    }
  }
  .dg-point {
    display: grid;
    place-content: center;
    font-size: 50px;
    font-weight: bolder;
    -webkit-user-drag: none;
    cursor: move;
    position: absolute;
    z-index: 1;
    background-color: var(--color-brand-fill);
    border-radius: 100%;
    > span {
      user-select: none;
    }
  }
  .dg-panel {
    user-select: none;
    width: 500px;
    max-height: 100%;
    position: absolute;
    z-index: 1;
    left: 0;
    backdrop-filter: blur(10px);
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 1em;

    &-item {
      width: 100%;
    }
    :deep(.collapse-panel.dg-panel-operation) {
      max-height: 250px;
      .body {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      fieldset {
        text-align: left;
        width: 100%;
        display: flex;
        align-items: center;
        hr {
          flex: 1;
        }
        .dg-add-connect {
          margin-left: 1em;
        }
      }
    }
    :deep(.collapse-panel) {
      .dg-panel-points {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        max-height: 200px;
        overflow: auto;
      }
    }

    &-lines {
      display: flex;
      flex-direction: column;
      max-height: calc(100% - 450px);
      gap: 8px;
    }

    &-point,
    &-line {
      position: relative;
      padding: 0.5rem 1rem;
    }
    &-point {
      border: 1px solid transparent;
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
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        opacity: 0;
        background-color: var(--color-brand-bg);
      }
      &:hover {
        border: 1px solid var(--color-border);
        &::after {
          opacity: 1;
        }
      }
    }
    &-line {
      display: flex;
      align-items: center;
      width: 100%;
      border: 1px solid var(--color-border);
      .dg-cs,
      .dg-cn {
        display: flex;
        align-items: center;
        white-space: nowrap;
        padding: 8px;
        flex: 1;
      }
      &:hover .dg-remove-line {
        &::before {
          opacity: 1;
          rotate: 45deg;
        }
        &::after {
          opacity: 1;
          rotate: -45deg;
        }
      }
      .dg-remove-line {
        position: relative;
        width: 100%;
        height: 0.5em;
        border-radius: 9999999em;
        cursor: pointer;
        background: var(--color-border);
        &::after,
        &::before {
          content: '';
          position: absolute;
          width: 2em;
          height: 0.5em;
          border-radius: 9999999em;
          left: 50%;
          translate: -50% 0;
          background: var(--color-border);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
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
