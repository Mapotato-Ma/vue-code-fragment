import { ref, watch } from 'vue';
import {
  createPattern,
  createDefaultMeasure,
  ensureMeasureTracks,
  ensureMeasureId,
  cloneMeasure,
} from '../types';
import { normalizeSample } from '../samples';
import type { Measure, Pattern, StepState } from '../types';

const LS_PATTERNS = 'rhythm-master:patterns';
const LS_CURRENT = 'rhythm-master:current';

function normalizePattern(p: Pattern): Pattern {
  for (const measure of p.measures) {
    ensureMeasureId(measure);
    ensureMeasureTracks(measure);
    for (const track of measure.tracks) {
      track.sample = normalizeSample(track.sample);
    }
  }
  if (!p.measures.length) {
    p.measures.push(createDefaultMeasure());
  }
  return p;
}

function loadFromStorage(): { patterns: Pattern[]; currentId: string } {
  try {
    const raw = localStorage.getItem(LS_PATTERNS);
    const patterns: Pattern[] = raw ? JSON.parse(raw).map(normalizePattern) : [];
    const currentId = localStorage.getItem(LS_CURRENT) ?? '';
    return { patterns, currentId };
  } catch {
    return { patterns: [], currentId: '' };
  }
}

function findMeasureIndexById(measures: Measure[], id: string): number {
  return measures.findIndex(m => m.id === id);
}

export function useSequencer() {
  const { patterns: stored, currentId: storedId } = loadFromStorage();
  const patterns = ref<Pattern[]>(stored.length ? stored : [createPattern('默认谱子')]);
  const currentId = ref(storedId || patterns.value[0].id);
  const currentMeasureIndex = ref(0);
  const activeMeasureIndex = ref(0);
  const measureClipboard = ref<Measure | null>(null);

  const current = ref<Pattern>(
    patterns.value.find(p => p.id === currentId.value) ?? patterns.value[0],
  );

  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(LS_PATTERNS, JSON.stringify(patterns.value));
      localStorage.setItem(LS_CURRENT, currentId.value);
    }, 400);
  }

  watch([patterns, currentId], debouncedSave, { deep: true });

  function clampMeasureIndex(idx: number) {
    const max = current.value.measures.length - 1;
    return Math.min(max, Math.max(0, idx));
  }

  function switchPattern(id: string) {
    const found = patterns.value.find(p => p.id === id);
    if (!found) return;
    currentId.value = id;
    current.value = found;
    currentMeasureIndex.value = 0;
    activeMeasureIndex.value = 0;
    measureClipboard.value = null;
  }

  function saveCurrentName(name: string) {
    current.value.name = name.trim() || '未命名';
  }

  function newPattern() {
    const p = createPattern();
    patterns.value.push(p);
    switchPattern(p.id);
  }

  function deletePattern(id: string) {
    if (patterns.value.length <= 1) return;
    const idx = patterns.value.findIndex(p => p.id === id);
    patterns.value.splice(idx, 1);
    if (currentId.value === id) {
      switchPattern(patterns.value[Math.max(0, idx - 1)].id);
    }
  }

  function setMeasureIndex(idx: number) {
    currentMeasureIndex.value = clampMeasureIndex(idx);
  }

  function setActiveMeasureIndex(idx: number) {
    activeMeasureIndex.value = clampMeasureIndex(idx);
  }

  function syncActiveToCurrent() {
    activeMeasureIndex.value = currentMeasureIndex.value;
  }

  function addMeasure() {
    current.value.measures.push(createDefaultMeasure());
    const last = current.value.measures.length - 1;
    currentMeasureIndex.value = last;
    activeMeasureIndex.value = last;
  }

  function resolveTargetMeasureIndex(viewMode: 'edit' | 'overview') {
    return viewMode === 'edit' ? currentMeasureIndex.value : activeMeasureIndex.value;
  }

  function deleteMeasure(viewMode: 'edit' | 'overview') {
    if (current.value.measures.length <= 1) return -1;
    const idx = resolveTargetMeasureIndex(viewMode);
    current.value.measures.splice(idx, 1);
    currentMeasureIndex.value = clampMeasureIndex(idx);
    activeMeasureIndex.value = clampMeasureIndex(activeMeasureIndex.value);
    return idx;
  }

  function restoreMeasure(measure: Measure, index: number) {
    const insertAt = Math.min(index, current.value.measures.length);
    current.value.measures.splice(insertAt, 0, cloneMeasure(measure));
    currentMeasureIndex.value = clampMeasureIndex(insertAt);
    activeMeasureIndex.value = clampMeasureIndex(insertAt);
  }

  function copyActiveMeasure() {
    const m = current.value.measures[activeMeasureIndex.value];
    if (!m) return;
    measureClipboard.value = cloneMeasure(m);
  }

  function pasteMeasure() {
    if (!measureClipboard.value) return;
    const insertAt = activeMeasureIndex.value + 1;
    current.value.measures.splice(insertAt, 0, cloneMeasure(measureClipboard.value));
    activeMeasureIndex.value = insertAt;
    currentMeasureIndex.value = insertAt;
  }

  function reorderMeasures(newMeasures: Measure[]) {
    const activeId = current.value.measures[activeMeasureIndex.value]?.id;
    const currentId_ = current.value.measures[currentMeasureIndex.value]?.id;
    current.value.measures = newMeasures;
    if (activeId) {
      const idx = findMeasureIndexById(newMeasures, activeId);
      if (idx >= 0) activeMeasureIndex.value = idx;
    }
    if (currentId_) {
      const idx = findMeasureIndexById(newMeasures, currentId_);
      if (idx >= 0) currentMeasureIndex.value = idx;
    }
  }

  function setStep(trackIdx: number, stepIdx: number, state: StepState) {
    const measure = current.value.measures[currentMeasureIndex.value];
    measure.tracks[trackIdx].steps[stepIdx] = state;
  }

  function clearSteps() {
    for (const measure of current.value.measures) {
      for (const track of measure.tracks) {
        track.steps = track.steps.map(() => 0);
      }
    }
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(current.value, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${current.value.name}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJSON(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const p: Pattern = normalizePattern(JSON.parse(e.target?.result as string));
        p.id = crypto.randomUUID();
        patterns.value.push(p);
        switchPattern(p.id);
      } catch {
        // 格式错误直接忽略
      }
    };
    reader.readAsText(file);
  }

  return {
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
  };
}
