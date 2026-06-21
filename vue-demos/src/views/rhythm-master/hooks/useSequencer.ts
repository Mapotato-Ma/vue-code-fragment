import { ref, watch } from 'vue';
import { createPattern } from '../types';
import { normalizeSample } from '../samples';
import type { Pattern, StepState } from '../types';

const LS_PATTERNS = 'rhythm-master:patterns';
const LS_CURRENT = 'rhythm-master:current';

function normalizePattern(p: Pattern): Pattern {
  for (const measure of p.measures) {
    for (const track of measure.tracks) {
      track.sample = normalizeSample(track.sample);
    }
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

export function useSequencer() {
  const { patterns: stored, currentId: storedId } = loadFromStorage();
  const patterns = ref<Pattern[]>(stored.length ? stored : [createPattern('默认谱子')]);
  const currentId = ref(storedId || patterns.value[0].id);

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

  function switchPattern(id: string) {
    const found = patterns.value.find(p => p.id === id);
    if (!found) return;
    currentId.value = id;
    current.value = found;
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

  function setStep(trackIdx: number, stepIdx: number, state: StepState) {
    current.value.measures[0].tracks[trackIdx].steps[stepIdx] = state;
  }

  function clearSteps() {
    for (const track of current.value.measures[0].tracks) {
      track.steps = track.steps.map(() => 0);
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
    switchPattern,
    saveCurrentName,
    newPattern,
    deletePattern,
    setStep,
    clearSteps,
    exportJSON,
    importJSON,
  };
}
