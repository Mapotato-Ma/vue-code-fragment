<script setup lang="ts">
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { VueUiXy } from 'vue-data-ui';
import { VueUiVerticalBar } from 'vue-data-ui';
import { VueUiDonut } from 'vue-data-ui';

interface ChartItem {
  name: string;
  w: number;
  h: number;
  type: 'line' | 'bar' | 'pie';
  id: string;
}

const isEditMode = ref(false);
const cellSize = 350

const charts = ref<ChartItem[]>([
  { name: '销售趋势', w: 2, h: 1, type: 'line', id: 'chart-1' },
  { name: '收入统计', w: 2, h: 1, type: 'bar', id: 'chart-2' },
  { name: '市场份额', w: 2, h: 1, type: 'pie', id: 'chart-3' },
  { name: '用户增长', w: 2, h: 1, type: 'line', id: 'chart-4' },
  { name: '产品分类', w: 2, h: 1, type: 'pie', id: 'chart-5' },
  { name: '月度业绩', w: 2, h: 1, type: 'bar', id: 'chart-6' },
]);

const chartLibrary = [
  { type: 'line', label: '折线图', icon: '📈' },
  { type: 'bar', label: '柱状图', icon: '📊' },
  { type: 'pie', label: '饼图', icon: '🥧' },
];

let isResizing = false;
let resizingChartId: string | null = null;
let resizeStartX = 0;
let resizeStartY = 0;
let resizeStartW = 0;
let resizeStartH = 0;

function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
  if (!isEditMode.value) {
    saveLayout();
  }
}

function saveLayout() {
  const layoutData = charts.value.map(chart => ({
    name: chart.name,
    w: chart.w,
    h: chart.h,
    type: chart.type,
  }));
  console.log('保存的布局数据:', JSON.stringify(layoutData, null, 2));
}

function deleteChart(id: string) {
  const index = charts.value.findIndex(c => c.id === id);
  if (index > -1) {
    charts.value.splice(index, 1);
  }
}

function addChart(type: string) {
  const typeLabels: Record<string, string> = {
    line: '折线图',
    bar: '柱状图',
    pie: '饼图',
  };
  const newChart: ChartItem = {
    name: typeLabels[type] || '新图表',
    w: 1,
    h: 1,
    type: type as 'line' | 'bar' | 'pie',
    id: `chart-${Date.now()}`,
  };
  charts.value.push(newChart);
}

function startResize(event: MouseEvent, chart: ChartItem) {
  event.preventDefault();
  isResizing = true;
  resizingChartId = chart.id;
  resizeStartX = event.clientX;
  resizeStartY = event.clientY;
  resizeStartW = chart.w;
  resizeStartH = chart.h;

  document.addEventListener('mousemove', onResize);
  document.addEventListener('mouseup', stopResize);
}

function onResize(event: MouseEvent) {
  if (!isResizing || !resizingChartId) return;

  const chart = charts.value.find(c => c.id === resizingChartId);
  if (!chart) return;

  const deltaX = event.clientX - resizeStartX;
  const deltaY = event.clientY - resizeStartY;

  const newW = Math.max(1, Math.round(deltaX / cellSize) + resizeStartW);
  const newH = Math.max(1, Math.round(deltaY / cellSize) + resizeStartH);

  chart.w = Math.min(newW, 3);
  chart.h = Math.min(newH, 3);
}

function stopResize() {
  isResizing = false;
  resizingChartId = null;
  document.removeEventListener('mousemove', onResize);
  document.removeEventListener('mouseup', stopResize);
}

function getLineData() {
  return [{ name: '数据', series: [120, 200, 150, 80, 70, 110, 130], type: 'line' as const }];
}

function getBarData() {
  return [
    { name: '销量', value: 400 },
    { name: '销量', value: 430 },
    { name: '销量', value: 448 },
    { name: '销量', value: 470 },
    { name: '销量', value: 540 },
    { name: '销量', value: 580 },
    { name: '销量', value: 690 },
  ];
}

function getPieData() {
  return [
    { name: '苹果', values: [44], color: '#f59e0b' },
    { name: '香蕉', values: [55], color: '#3b82f6' },
    { name: '橙子', values: [13], color: '#ef4444' },
    { name: '葡萄', values: [43], color: '#8b5cf6' },
    { name: '西瓜', values: [22], color: '#ec4899' },
  ];
}
</script>

<template>
  <div class="easy-chart-builder">
    <header class="header">
      <h1>📊 EasyChart Builder</h1>
      <button class="edit-btn" @click="toggleEditMode">
        {{ isEditMode ? '👁️ 预览模式' : '✏️ 编辑布局' }}
      </button>
    </header>

    <div class="main-content">
      <aside v-if="isEditMode" class="sidebar">
        <h3>组件库</h3>
        <p class="tip">点击添加图表</p>
        <div class="chart-library">
          <div
            v-for="item in chartLibrary"
            :key="item.type"
            class="library-item"
            @click="addChart(item.type)"
          >
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.label }}</span>
          </div>
        </div>
      </aside>

      <div class="grid-container" :class="{ 'edit-mode': isEditMode }">
        <div class="chart-grid-wrapper">
          <VueDraggable
            v-model="charts"
            class="chart-grid"
            :animation="500"
            :disabled="!isEditMode"
          >
            <div
              v-for="chart in charts"
              :key="chart.id"
              class="chart-card"
              :class="{ 'edit-mode': isEditMode }"
              :style="{
                gridColumn: `span ${chart.w}`,
                gridRow: `span ${chart.h}`,
              }"
            >
              <div v-if="isEditMode" class="card-controls">
                <button class="delete-btn" @click.stop="deleteChart(chart.id)">✕</button>
                <div class="resize-handle" @mousedown="startResize($event, chart)">⋮⋮</div>
              </div>
              <div class="card-header">
                <span>{{ chart.name }}</span>
              </div>
              <div class="card-content">
                <VueUiXy v-if="chart.type === 'line'" :dataset="getLineData()" />
                <VueUiVerticalBar v-else-if="chart.type === 'bar'" :dataset="getBarData()" />
                <VueUiDonut v-else :dataset="getPieData()" />
              </div>
            </div>
          </VueDraggable>
        </div>
      </div>
    </div>

    <footer v-if="!isEditMode" class="footer">
      <span>切换到编辑模式后，拖拽卡片调整位置，拖拽右下角调整大小</span>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.easy-chart-builder {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);
  color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  h1 {
    font-size: 24px;
    font-weight: 600;
    margin: 0;
    background: linear-gradient(90deg, #00d9ff, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .edit-btn {
    padding: 10px 24px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
    color: #fff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
    }
  }
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 120px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid rgba(255, 255, 255, 0.06);

  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }

  .tip {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 20px;
  }
}

.chart-library {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.library-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  cursor: grab;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(99, 102, 241, 0.4);
    transform: translateX(6px);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  .icon {
    font-size: 22px;
  }

  .label {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.85);
  }
}

.grid-container {
  flex: 1;
  padding: 32px;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &.edit-mode {
    background: rgba(255, 255, 255, 0.01);
  }
}

.chart-grid-wrapper {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.chart-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 350px);
  grid-auto-rows: 320px;
}

.chart-card {
  position: relative;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  }

  &.edit-mode {
    cursor: move;
    border: 1px dashed rgba(99, 102, 241, 0.4);

    &:hover {
      border-color: rgba(99, 102, 241, 0.7);
      box-shadow: 0 12px 40px rgba(99, 102, 241, 0.25);
    }
  }

  &.dragging {
    opacity: 0.5;
    transform: scale(0.95);
  }
}

.card-controls {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s;

  .chart-card.edit-mode:hover & {
    opacity: 1;
  }
}

.delete-btn {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.85);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ef4444;
    transform: scale(1.1);
  }
}

.resize-handle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(99, 102, 241, 0.8);
  border-radius: 6px;
  color: #fff;
  font-size: 10px;
  cursor: se-resize;
  user-select: none;
  letter-spacing: -1px;

  &:hover {
    background: #6366f1;
    transform: scale(1.1);
  }
}

.card-header {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.card-content {
  padding: 10px;
  height: calc(100% - 45px);
  min-height: 140px;
}

.footer {
  padding: 14px 32px;
  text-align: center;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.02);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}
</style>
