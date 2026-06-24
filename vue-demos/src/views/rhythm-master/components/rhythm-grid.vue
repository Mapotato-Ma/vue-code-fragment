<template>
  <div class="rhythm-grid">
    <div
      v-for="(track, ti) in measure.tracks"
      :key="ti"
      class="track-row"
      :class="`track-row--${track.sample}`"
    >
      <div class="track-label">{{ track.name }}</div>
      <div class="steps">
        <template v-for="beat in measure.beatsPerMeasure" :key="beat">
          <div
            v-for="sub in measure.subdivision"
            :key="sub"
            class="step"
            :class="[
              `step--${track.steps[(beat - 1) * measure.subdivision + (sub - 1)]}`,
              { 'step--active': currentStep === (beat - 1) * measure.subdivision + (sub - 1) },
            ]"
            @contextmenu.prevent
            @mousedown.prevent="onMouseDown(ti, (beat - 1) * measure.subdivision + (sub - 1), $event)"
            @mouseenter.prevent="onMouseEnter(ti, (beat - 1) * measure.subdivision + (sub - 1))"
          ></div>
          <div v-if="beat < measure.beatsPerMeasure" class="beat-gap"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue';
import type { Measure, StepState } from '../types';
import { triggerNow } from '../hooks/useAudioEngine';

const props = defineProps<{
  measure: Measure;
  currentStep: number;
}>();

const emit = defineEmits<{
  (e: 'step-change', trackIdx: number, stepIdx: number, state: StepState): void;
}>();

let isDragging = false;
let dragTargetState: StepState = 1;

function cycleState(s: StepState): StepState {
  return ((s + 1) % 3) as StepState;
}

function onMouseDown(ti: number, si: number, e: MouseEvent) {
  isDragging = true;
  const cur = props.measure.tracks[ti].steps[si];

  if (e.shiftKey) {
    dragTargetState = cur === 2 ? 0 : 2;
    emit('step-change', ti, si, dragTargetState);
    if (dragTargetState > 0) triggerNow(props.measure.tracks[ti].sample, true);
    return;
  }

  const next = cycleState(cur);
  dragTargetState = cur === 0 ? 1 : 0;
  emit('step-change', ti, si, next);
  if (next > 0) triggerNow(props.measure.tracks[ti].sample, next === 2);
}

function onMouseEnter(ti: number, si: number) {
  if (!isDragging) return;
  const cur = props.measure.tracks[ti].steps[si];
  if (cur === dragTargetState) return;
  emit('step-change', ti, si, dragTargetState);
  if (dragTargetState > 0) triggerNow(props.measure.tracks[ti].sample, dragTargetState === 2);
}

function onMouseUp() {
  isDragging = false;
}

onMounted(() => window.addEventListener('mouseup', onMouseUp));
onUnmounted(() => window.removeEventListener('mouseup', onMouseUp));
</script>

<style lang="scss" scoped>
.rhythm-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 0 8px;
  box-sizing: border-box;
}

.track-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.track-label {
  width: 40px;
  flex-shrink: 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--apple-music-default);
  text-align: right;
  letter-spacing: 0.02em;
}

.steps {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.beat-gap {
  width: 10px;
  flex-shrink: 0;
}

.step {
  flex: 1;
  min-height: 44px;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease;
  user-select: none;
  background-color: #2a2a2e;
  border: 1px solid #3a3a3e;

  &--0:hover {
    background-color: #323236;
  }

  &--active {
    border-color: rgba(255, 255, 255, 0.45);
  }

  &--0.step--active {
    background-color: #3a3a3e;
  }
}

.track-row--snare {
  .step--1 {
    background-color: #b8b8bc;
    border-color: #b8b8bc;
  }

  .step--2 {
    background-color: #ececef;
    border-color: #ececef;
    transform: scaleY(1.08);
  }
}

.track-row--kick {
  .step--1 {
    background-color: var(--apple-music-primary);
    border-color: var(--apple-music-primary);
  }

  .step--2 {
    background-color: #ff6b7a;
    border-color: #ff8a96;
    transform: scaleY(1.08);
  }
}

.track-row--crash {
  .step--1 {
    background-color: #c99200;
    border-color: #c99200;
  }

  .step--2 {
    background-color: #e6b422;
    border-color: #e6b422;
    transform: scaleY(1.08);
  }
}

.track-row--hihat {
  .step--1 {
    background-color: #4ecdc4;
    border-color: #4ecdc4;
  }

  .step--2 {
    background-color: #6ee7de;
    border-color: #6ee7de;
    transform: scaleY(1.08);
  }
}

.track-row--hihat_open {
  .step--1 {
    background-color: #7fdbda;
    border-color: #7fdbda;
  }

  .step--2 {
    background-color: #a0e8e7;
    border-color: #a0e8e7;
    transform: scaleY(1.08);
  }
}
</style>
