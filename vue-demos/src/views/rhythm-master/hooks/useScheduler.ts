import { ref, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import type { Measure } from '../types';
import { scheduleNote, getAudioTime } from './useAudioEngine';

const LOOKAHEAD = 0.1; // 提前调度窗口（秒）
const SCHEDULE_INTERVAL = 25; // 调度器轮询间隔（毫秒）

export function useScheduler(measure: Ref<Measure>, bpm: Ref<number>) {
  const currentStep = ref(-1);
  const isPlaying = ref(false);

  let nextNoteTime = 0;
  let nextStep = 0;
  let timerId: ReturnType<typeof setInterval> | null = null;
  let rafId: number | null = null;

  function secondsPerStep() {
    return 60 / bpm.value / measure.value.subdivision;
  }

  function schedule() {
    const now = getAudioTime();
    while (nextNoteTime < now + LOOKAHEAD) {
      const step = nextStep;
      const when = nextNoteTime;
      for (const track of measure.value.tracks) {
        const state = track.steps[step];
        if (state > 0) {
          scheduleNote(track.sample, when, state === 2);
        }
      }
      nextNoteTime += secondsPerStep();
      nextStep = (nextStep + 1) % (measure.value.beatsPerMeasure * measure.value.subdivision);
    }
  }

  function tick() {
    if (!isPlaying.value) return;
    schedule();
    // rAF 用于同步视觉高亮（比 setInterval 更流畅）
    const now = getAudioTime();
    const elapsed = now - (nextNoteTime - secondsPerStep() * nextStep);
    const visualStep = Math.floor(elapsed / secondsPerStep()) % (measure.value.beatsPerMeasure * measure.value.subdivision);
    currentStep.value = (nextStep - 1 + measure.value.beatsPerMeasure * measure.value.subdivision) % (measure.value.beatsPerMeasure * measure.value.subdivision);
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (isPlaying.value) return;
    isPlaying.value = true;
    nextStep = 0;
    nextNoteTime = getAudioTime();
    timerId = setInterval(schedule, SCHEDULE_INTERVAL);
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (!isPlaying.value) return;
    isPlaying.value = false;
    if (timerId !== null) { clearInterval(timerId); timerId = null; }
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    currentStep.value = -1;
    nextStep = 0;
  }

  function toggle() {
    isPlaying.value ? stop() : start();
  }

  onUnmounted(stop);

  return { currentStep, isPlaying, toggle, start, stop };
}
