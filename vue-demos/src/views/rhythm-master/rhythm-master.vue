<template>
  <div class="rhythm-master" @click.capture="onFirstInteraction">
    <rhythm-toolbar
      :is-playing="isPlaying"
      :bpm="current.bpm"
      :view-mode="viewMode"
      :measure-index="currentMeasureIndex"
      :measure-count="current.measures.length"
      :patterns="patterns"
      :current-id="currentId"
      :current-name="current.name"
      @toggle-play="onTogglePlay"
      @bpm-change="v => (current.bpm = v)"
      @clear="clearSteps"
      @rename="saveCurrentName"
      @new="newPattern"
      @switch="switchPattern"
      @delete="deletePattern"
      @export="exportJSON"
      @import="importJSON"
      @view-mode-change="onViewModeChange"
      @measure-prev="onMeasurePrev"
      @measure-next="onMeasureNext"
      @measure-add="addMeasure"
      @measure-delete="onDeleteMeasure"
    />
    <div class="grid-wrapper" :class="{ 'grid-wrapper--overview': viewMode === 'overview' }">
      <rhythm-grid
        v-if="viewMode === 'edit'"
        :measure="displayMeasure"
        :current-step="currentStep"
        @step-change="setStep"
      />
      <rhythm-overview
        v-else
        :measures="current.measures"
        :active-measure-index="activeMeasureIndex"
        :playing-measure-index="playingMeasureIndex"
        :current-step="currentStep"
        :is-playing="isPlaying"
        @update-measures="reorderMeasures"
        @activate-measure="onActivateMeasure"
        @edit-measure="onEditMeasure"
      />
    </div>
    <transition name="undo">
      <button
        v-if="pendingUndo"
        type="button"
        class="undo-bar"
        @click="onUndoDelete"
      >
        已删除小节 {{ pendingUndo.label }} · 撤销
      </button>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import RhythmToolbar from './components/rhythm-toolbar.vue';
import RhythmGrid from './components/rhythm-grid.vue';
import RhythmOverview from './components/rhythm-overview.vue';
import { useSequencer } from './hooks/useSequencer';
import { useScheduler } from './hooks/useScheduler';
import { initAudio, resumeCtx } from './hooks/useAudioEngine';
import { cloneMeasure } from './types';
import type { Measure } from './types';

const viewMode = ref<'edit' | 'overview'>('edit');

interface PendingUndo {
  measure: Measure;
  index: number;
  label: number;
}

const pendingUndo = ref<PendingUndo | null>(null);
let undoTimer: ReturnType<typeof setTimeout> | null = null;

const {
  patterns,
  currentId,
  current,
  currentMeasureIndex,
  activeMeasureIndex,
  switchPattern,
  saveCurrentName,
  newPattern,
  deletePattern,
  setMeasureIndex,
  setActiveMeasureIndex,
  syncActiveToCurrent,
  addMeasure,
  deleteMeasure,
  restoreMeasure,
  copyActiveMeasure,
  pasteMeasure,
  reorderMeasures,
  setStep,
  clearSteps,
  exportJSON,
  importJSON,
} = useSequencer();

const bpm = computed(() => current.value.bpm);

const { currentStep, playingMeasureIndex, isPlaying, toggle, stop } = useScheduler(
  current,
  bpm,
  viewMode,
  currentMeasureIndex,
);

const displayMeasureIndex = computed(() =>
  isPlaying.value ? playingMeasureIndex.value : currentMeasureIndex.value,
);

const displayMeasure = computed(() => current.value.measures[displayMeasureIndex.value]);

let audioReady = false;

function collectAllSamples(): string[] {
  const set = new Set<string>();
  for (const measure of current.value.measures) {
    for (const track of measure.tracks) {
      set.add(track.sample);
    }
  }
  return [...set];
}

async function onFirstInteraction() {
  if (audioReady) return;
  audioReady = true;
  await resumeCtx();
  await initAudio(collectAllSamples());
}

async function onTogglePlay() {
  await onFirstInteraction();
  toggle();
}

function clearPendingUndo() {
  if (undoTimer !== null) {
    clearTimeout(undoTimer);
    undoTimer = null;
  }
  pendingUndo.value = null;
}

function showUndoBar(measure: Measure, index: number) {
  clearPendingUndo();
  pendingUndo.value = { measure, index, label: index + 1 };
  undoTimer = setTimeout(clearPendingUndo, 3000);
}

function onUndoDelete() {
  if (!pendingUndo.value) return;
  const { measure, index } = pendingUndo.value;
  clearPendingUndo();
  restoreMeasure(measure, index);
}

function onDeleteMeasure() {
  if (current.value.measures.length <= 1 || isPlaying.value) return;
  const idx =
    viewMode.value === 'edit' ? currentMeasureIndex.value : activeMeasureIndex.value;
  const snapshot = cloneMeasure(current.value.measures[idx]);
  const deletedAt = deleteMeasure(viewMode.value);
  if (deletedAt < 0) return;
  showUndoBar(snapshot, deletedAt);
}

function onViewModeChange(mode: 'edit' | 'overview') {
  viewMode.value = mode;
  if (mode === 'overview') {
    syncActiveToCurrent();
  } else {
    setMeasureIndex(activeMeasureIndex.value);
  }
}

function onMeasurePrev() {
  if (isPlaying.value) return;
  const next = currentMeasureIndex.value - 1;
  setMeasureIndex(next);
  setActiveMeasureIndex(next);
}

function onMeasureNext() {
  if (isPlaying.value) return;
  const next = currentMeasureIndex.value + 1;
  setMeasureIndex(next);
  setActiveMeasureIndex(next);
}

function onActivateMeasure(idx: number) {
  if (isPlaying.value) return;
  setActiveMeasureIndex(idx);
}

function onEditMeasure(idx: number) {
  if (isPlaying.value) return;
  setMeasureIndex(idx);
  setActiveMeasureIndex(idx);
  viewMode.value = 'edit';
}

function onKeydown(e: KeyboardEvent) {
  if (e.code === 'Space') {
    if (document.activeElement?.tagName === 'INPUT') return;
    e.preventDefault();
    onTogglePlay();
    return;
  }

  if (document.activeElement?.tagName === 'INPUT') return;

  if (e.code === 'Delete') {
    if (isPlaying.value) return;
    e.preventDefault();
    onDeleteMeasure();
    return;
  }

  if (viewMode.value !== 'overview' || isPlaying.value) return;

  if (e.ctrlKey && e.key === 'c') {
    e.preventDefault();
    copyActiveMeasure();
  } else if (e.ctrlKey && e.key === 'v') {
    e.preventDefault();
    pasteMeasure();
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown);
  clearPendingUndo();
  stop();
});
</script>

<style lang="scss" scoped>
.rhythm-master {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--bg-page);
  position: relative;
}

.grid-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  overflow: hidden;

  &--overview {
    align-items: flex-start;
    overflow-x: auto;
    overflow-y: auto;
  }
}

.undo-bar {
  position: absolute;
  left: 50%;
  bottom: 1.5em;
  transform: translateX(-50%);
  padding: 0.5em 1.4em;
  border: none;
  border-radius: 4px;
  background: linear-gradient(to right, #818181, transparent);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 14px;
  line-height: 1.2em;
  cursor: pointer;
  z-index: 10;
  max-width: 50vw;
  white-space: nowrap;

  &:hover {
    filter: brightness(1.1);
  }
}

.undo-enter-active {
  transition: all 233ms ease-out;
}

.undo-leave-active {
  transition: all 233ms ease-in;
}

.undo-enter-from,
.undo-leave-to {
  transform: translateX(-50%) translateY(20px);
  opacity: 0;
}
</style>
