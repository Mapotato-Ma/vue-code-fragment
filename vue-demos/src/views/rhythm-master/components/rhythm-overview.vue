<template>
  <vue-draggable
    v-model="localMeasures"
    class="rhythm-overview"
    :class="{ 'rhythm-overview--playing': isPlaying }"
    item-key="id"
    :animation="200"
    :disabled="isPlaying"
    @start="onDragStart"
    @end="onDragEnd"
  >
    <div
      v-for="(measure, mi) in localMeasures"
      :key="measure.id"
      class="measure-card"
      :class="cardClasses(mi)"
      @click="onActivate(mi)"
      @dblclick="onEdit(mi)"
    >
      <div class="measure-label">小节 {{ mi + 1 }}</div>
      <div class="measure-grid">
        <div
          v-for="(track, ti) in measure.tracks"
          :key="ti"
          class="track-row"
          :class="`track-row--${track.sample}`"
        >
          <div class="steps">
            <template v-for="beat in measure.beatsPerMeasure" :key="beat">
              <div
                v-for="sub in measure.subdivision"
                :key="sub"
                class="step"
                :class="[
                  `step--${track.steps[(beat - 1) * measure.subdivision + (sub - 1)]}`,
                  {
                    'step--active':
                      isPlaying &&
                      mi === playingMeasureIndex &&
                      currentStep === (beat - 1) * measure.subdivision + (sub - 1),
                  },
                ]"
              ></div>
              <div v-if="beat < measure.beatsPerMeasure" class="beat-gap"></div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </vue-draggable>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import type { Measure } from '../types';

const props = defineProps<{
  measures: Measure[];
  activeMeasureIndex: number;
  playingMeasureIndex: number;
  currentStep: number;
  isPlaying: boolean;
}>();

const emit = defineEmits<{
  (e: 'update-measures', measures: Measure[]): void;
  (e: 'activate-measure', index: number): void;
  (e: 'edit-measure', index: number): void;
}>();

const isDragging = ref(false);

const localMeasures = computed({
  get: () => props.measures,
  set: (val: Measure[]) => emit('update-measures', val),
});

function cardClasses(mi: number) {
  return {
    'measure-card--active': !props.isPlaying && mi === props.activeMeasureIndex,
    'measure-card--playing': props.isPlaying && mi === props.playingMeasureIndex,
  };
}

function onDragStart() {
  isDragging.value = true;
}

function onDragEnd() {
  requestAnimationFrame(() => {
    isDragging.value = false;
  });
}

function onActivate(mi: number) {
  if (props.isPlaying || isDragging.value) return;
  emit('activate-measure', mi);
}

function onEdit(mi: number) {
  if (props.isPlaying) return;
  emit('edit-measure', mi);
}
</script>

<style lang="scss" scoped>
.rhythm-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 16px;
  align-content: flex-start;
  width: 100%;
  min-width: calc(4 * 180px + 3 * 16px);
  box-sizing: border-box;

  &--playing .measure-card {
    pointer-events: none;
    cursor: default;
  }
}

.measure-card {
  width: 100%;
  min-width: 0;
  padding: 10px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  cursor: grab;
  transition:
    border-color 120ms ease,
    background 120ms ease,
    opacity 120ms ease;

  &:hover:not(.measure-card--active) {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.05);
  }

  &--active {
    border-color: var(--apple-music-primary);
  }

  &--playing {
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.06);
  }
}

:deep(.sortable-ghost) {
  opacity: 0.4;
}

:deep(.sortable-drag) {
  opacity: 0.85;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.measure-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--apple-music-default);
  margin-bottom: 8px;
  user-select: none;
}

.measure-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.track-row {
  display: flex;
  align-items: center;
}

.steps {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
}

.beat-gap {
  width: 4px;
  flex-shrink: 0;
}

.step {
  flex: 1;
  aspect-ratio: 1;
  min-width: 8px;
  border-radius: 3px;
  background-color: #2a2a2e;
  border: 1px solid #3a3a3e;
  box-sizing: border-box;

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
  }
}
</style>
