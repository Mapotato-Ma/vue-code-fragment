<template>
  <div class="rhythm-master" @click.capture="onFirstInteraction">
    <rhythm-toolbar
      :is-playing="isPlaying"
      :bpm="current.bpm"
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
    />
    <div class="grid-wrapper">
      <rhythm-grid
        :measure="current.measures[0]"
        :current-step="currentStep"
        @step-change="setStep"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue';
import RhythmToolbar from './components/rhythm-toolbar.vue';
import RhythmGrid from './components/rhythm-grid.vue';
import { useSequencer } from './hooks/useSequencer';
import { useScheduler } from './hooks/useScheduler';
import { initAudio, resumeCtx } from './hooks/useAudioEngine';

const { patterns, currentId, current, switchPattern, saveCurrentName, newPattern, deletePattern, setStep, clearSteps, exportJSON, importJSON } =
  useSequencer();

const measure = computed(() => current.value.measures[0]);
const bpm = computed(() => current.value.bpm);

const { currentStep, isPlaying, toggle, stop } = useScheduler(measure, bpm);

let audioReady = false;

async function onFirstInteraction() {
  if (audioReady) return;
  audioReady = true;
  await resumeCtx();
  const samples = [...new Set(measure.value.tracks.map(t => t.sample))];
  await initAudio(samples);
}

async function onTogglePlay() {
  await onFirstInteraction();
  toggle();
}

function onKeydown(e: KeyboardEvent) {
  if (e.code !== 'Space') return;
  if (document.activeElement?.tagName === 'INPUT') return;
  e.preventDefault();
  onTogglePlay();
}

onMounted(() => window.addEventListener('keydown', onKeydown));
onUnmounted(() => { window.removeEventListener('keydown', onKeydown); stop(); });
</script>

<style lang="scss" scoped>
.rhythm-master {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: var(--bg-page);
}

.grid-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
  overflow: hidden;
}
</style>
