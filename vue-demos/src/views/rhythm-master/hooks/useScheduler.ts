import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import type { Pattern } from '../types';
import { scheduleNote, getAudioTime } from './useAudioEngine';

const LOOKAHEAD = 0.1; // 提前调度窗口（秒）
const SCHEDULE_INTERVAL = 25; // 调度器轮询间隔（毫秒）

type ViewMode = 'edit' | 'overview';

export function useScheduler(
  pattern: Ref<Pattern>,
  bpm: Ref<number>,
  viewMode: Ref<ViewMode>,
  editMeasureIndex: Ref<number>,
) {
  const currentStep = ref(-1);
  const playingMeasureIndex = ref(0);
  const isPlaying = ref(false);

  let nextNoteTime = 0;
  let nextStep = 0;
  let timerId: ReturnType<typeof setInterval> | null = null;
  let rafId: number | null = null;

  function currentMeasure() {
    return pattern.value.measures[playingMeasureIndex.value];
  }

  function stepsPerMeasure() {
    const m = currentMeasure();
    return m.beatsPerMeasure * m.subdivision;
  }

  function secondsPerStep() {
    return 60 / bpm.value / currentMeasure().subdivision;
  }

  function advanceStep() {
    nextStep++;
    const total = stepsPerMeasure();
    if (nextStep >= total) {
      nextStep = 0;
      if (viewMode.value === 'edit') return;
      playingMeasureIndex.value++;
      if (playingMeasureIndex.value >= pattern.value.measures.length) {
        playingMeasureIndex.value = 0;
      }
    }
  }

  function schedule() {
    const now = getAudioTime();
    while (nextNoteTime < now + LOOKAHEAD) {
      const measure = currentMeasure();
      const step = nextStep;
      const when = nextNoteTime;
      for (const track of measure.tracks) {
        const state = track.steps[step];
        if (state > 0) {
          scheduleNote(track.sample, when, state === 2);
        }
      }
      nextNoteTime += secondsPerStep();
      advanceStep();
    }
  }

  function tick() {
    if (!isPlaying.value) return;
    schedule();
    const total = stepsPerMeasure();
    currentStep.value =
      (nextStep - 1 + total) % total;
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (isPlaying.value) return;
    isPlaying.value = true;
    playingMeasureIndex.value =
      viewMode.value === 'edit' ? editMeasureIndex.value : 0;
    nextStep = 0;
    nextNoteTime = getAudioTime();
    timerId = setInterval(schedule, SCHEDULE_INTERVAL);
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!isPlaying.value) return;
    isPlaying.value = false;
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    currentStep.value = -1;
    playingMeasureIndex.value = 0;
    nextStep = 0;
  }

  function toggle() {
    if (isPlaying.value) stop();
    else start();
  }

  onUnmounted(stop);

  return { currentStep, playingMeasureIndex, isPlaying, toggle, start, stop };
}
