import { computed, ref, watch } from 'vue';
import {
  createId,
  createPattern,
  createDefaultMeasure,
  ensureMeasureTracks,
  ensureMeasureId,
  cloneMeasure,
  clonePattern,
} from '../types';
import { normalizeSample } from '../samples';
import { PRESET_PATTERNS, isBuiltinPattern } from '../presets';
import type { Measure, Pattern, StepState } from '../types';

const LS_PATTERNS = 'rhythm-master:patterns';
const LS_CURRENT = 'rhythm-master:current';
const LS_PRESET_VERSION = 'rhythm-master:preset-version';
/** 预置谱版本：升级多小节 solo 时递增，刷新内置谱内容 */
const PRESET_VERSION = 3;

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

function loadBuiltinPatterns(): Pattern[] {
  return PRESET_PATTERNS.map(p => normalizePattern(structuredClone(p)));
}

/** 从 localStorage 加载用户谱，过滤历史混入的内置谱 */
function loadUserPatterns(): Pattern[] {
  try {
    const raw = localStorage.getItem(LS_PATTERNS);
    if (!raw) return [];
    const patterns: Pattern[] = JSON.parse(raw).map(normalizePattern);
    return patterns.filter(p => !isBuiltinPattern(p.id));
  } catch {
    return [];
  }
}

function ensurePresetVersion(): boolean {
  const saved = Number(localStorage.getItem(LS_PRESET_VERSION) || 0);
  if (saved < PRESET_VERSION) {
    localStorage.setItem(LS_PRESET_VERSION, String(PRESET_VERSION));
    return true;
  }
  return false;
}

function findMeasureIndexById(measures: Measure[], id: string): number {
  return measures.findIndex(m => m.id === id);
}

function uniqueCopyName(baseName: string, names: string[]): string {
  const first = `${baseName} 副本`;
  if (!names.includes(first)) return first;
  let n = 2;
  while (names.includes(`${baseName} 副本 ${n}`)) n++;
  return `${baseName} 副本 ${n}`;
}

export function useSequencer() {
  const presetUpgraded = ensurePresetVersion();
  const storedUser = loadUserPatterns();
  const storedId = localStorage.getItem(LS_CURRENT) ?? '';

  const userPatterns = ref<Pattern[]>(storedUser);
  const builtinPatterns = ref<Pattern[]>(loadBuiltinPatterns());
  if (presetUpgraded) {
    builtinPatterns.value = loadBuiltinPatterns();
  }
  const patterns = computed(() => [...userPatterns.value, ...builtinPatterns.value]);

  const allOnInit = [...storedUser, ...builtinPatterns.value];
  const currentId = ref(
    storedId && allOnInit.some(p => p.id === storedId) ? storedId : (allOnInit[0]?.id ?? ''),
  );
  const currentMeasureIndex = ref(0);
  const activeMeasureIndex = ref(0);
  const measureClipboard = ref<Measure | null>(null);

  const isCurrentBuiltin = computed(() => isBuiltinPattern(currentId.value));
  const current = computed(
    () => patterns.value.find(p => p.id === currentId.value) ?? patterns.value[0],
  );

  let saveTimer: ReturnType<typeof setTimeout> | null = null;

  function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem(LS_PATTERNS, JSON.stringify(userPatterns.value));
      localStorage.setItem(LS_CURRENT, currentId.value);
    }, 400);
  }

  watch([userPatterns, currentId], debouncedSave, { deep: true });

  function clampMeasureIndex(idx: number) {
    const max = current.value.measures.length - 1;
    return Math.min(max, Math.max(0, idx));
  }

  function switchPattern(id: string) {
    const found = patterns.value.find(p => p.id === id);
    if (!found) return;
    currentId.value = id;
    currentMeasureIndex.value = 0;
    activeMeasureIndex.value = 0;
    measureClipboard.value = null;
  }

  function saveCurrentName(name: string) {
    if (isCurrentBuiltin.value) return;
    const p = userPatterns.value.find(item => item.id === currentId.value);
    if (p) p.name = name.trim() || '未命名';
  }

  function newPattern() {
    const p = createPattern();
    userPatterns.value.unshift(p);
    switchPattern(p.id);
  }

  function deletePattern(id: string) {
    if (isBuiltinPattern(id)) return;
    const idx = userPatterns.value.findIndex(p => p.id === id);
    if (idx < 0) return;
    userPatterns.value.splice(idx, 1);
    if (currentId.value === id) {
      const merged = patterns.value;
      switchPattern(merged[Math.max(0, idx - 1)]?.id ?? merged[0]?.id);
    }
  }

  function copyPattern(id: string) {
    const merged = patterns.value;
    const srcIdx = merged.findIndex(p => p.id === id);
    if (srcIdx < 0) return;
    const source = merged[srcIdx];
    const names = userPatterns.value.map(p => p.name);
    const copy = clonePattern(source, uniqueCopyName(source.name, names));
    if (isBuiltinPattern(id)) {
      userPatterns.value.push(copy);
    } else {
      userPatterns.value.splice(srcIdx, 0, copy);
    }
    switchPattern(copy.id);
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
    if (isCurrentBuiltin.value) return;
    current.value.measures.push(createDefaultMeasure());
    const last = current.value.measures.length - 1;
    currentMeasureIndex.value = last;
    activeMeasureIndex.value = last;
  }

  function resolveTargetMeasureIndex(viewMode: 'edit' | 'overview') {
    return viewMode === 'edit' ? currentMeasureIndex.value : activeMeasureIndex.value;
  }

  function deleteMeasure(viewMode: 'edit' | 'overview') {
    if (isCurrentBuiltin.value) return -1;
    if (current.value.measures.length <= 1) return -1;
    const idx = resolveTargetMeasureIndex(viewMode);
    current.value.measures.splice(idx, 1);
    currentMeasureIndex.value = clampMeasureIndex(idx);
    activeMeasureIndex.value = clampMeasureIndex(activeMeasureIndex.value);
    return idx;
  }

  function restoreMeasure(measure: Measure, index: number) {
    if (isCurrentBuiltin.value) return;
    const insertAt = Math.min(index, current.value.measures.length);
    current.value.measures.splice(insertAt, 0, cloneMeasure(measure));
    currentMeasureIndex.value = clampMeasureIndex(insertAt);
    activeMeasureIndex.value = clampMeasureIndex(insertAt);
  }

  function copyActiveMeasure() {
    if (isCurrentBuiltin.value) return;
    const m = current.value.measures[activeMeasureIndex.value];
    if (!m) return;
    measureClipboard.value = cloneMeasure(m);
  }

  function pasteMeasure() {
    if (isCurrentBuiltin.value) return;
    if (!measureClipboard.value) return;
    const insertAt = activeMeasureIndex.value + 1;
    current.value.measures.splice(insertAt, 0, cloneMeasure(measureClipboard.value));
    activeMeasureIndex.value = insertAt;
    currentMeasureIndex.value = insertAt;
  }

  function reorderMeasures(newMeasures: Measure[]) {
    if (isCurrentBuiltin.value) return;
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
    if (isCurrentBuiltin.value) return;
    const measure = current.value.measures[currentMeasureIndex.value];
    measure.tracks[trackIdx].steps[stepIdx] = state;
  }

  function clearSteps() {
    if (isCurrentBuiltin.value) return;
    for (const measure of current.value.measures) {
      for (const track of measure.tracks) {
        track.steps = track.steps.map(() => 0);
      }
    }
  }

  function setBpm(v: number) {
    if (isCurrentBuiltin.value) return;
    const p = userPatterns.value.find(item => item.id === currentId.value);
    if (p) p.bpm = v;
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
        p.id = createId();
        userPatterns.value.unshift(p);
        switchPattern(p.id);
      } catch {
        // 格式错误直接忽略
      }
    };
    reader.readAsText(file);
  }

  return {
    patterns,
    userPatterns,
    currentId,
    current,
    isCurrentBuiltin,
    currentMeasureIndex,
    activeMeasureIndex,
    switchPattern,
    saveCurrentName,
    newPattern,
    deletePattern,
    copyPattern,
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
    setBpm,
    exportJSON,
    importJSON,
  };
}
