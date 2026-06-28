export type StepState = 0 | 1 | 2; // 0=灭 1=普通 2=重音

/** 生成唯一 id（兼容非安全上下文等缺少 crypto.randomUUID 的环境） */
export function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface Track {
  name: string;
  sample: string;
  steps: StepState[];
}

export interface Measure {
  id: string;
  beatsPerMeasure: number;
  subdivision: number;
  tracks: Track[];
}

export interface Pattern {
  id: string;
  name: string;
  bpm: number;
  measures: Measure[];
}

export const STEP_COUNT = 16;
export const DEFAULT_BPM = 120;
export const ACCENT_GAIN = 1.4;
export const NORMAL_GAIN = 0.8;

const DEFAULT_TRACK_DEFS: { name: string; sample: string }[] = [
  { name: '大镲', sample: 'crash' },
  { name: '开镲', sample: 'hihat_open' },
  { name: '闭镲', sample: 'hihat' },
  { name: '军鼓', sample: 'snare' },
  { name: '大鼓', sample: 'kick' },
];

function hasTrack(tracks: Track[], sample: string, namePattern?: RegExp): boolean {
  return tracks.some(t => t.sample === sample || (namePattern?.test(t.name) ?? false));
}

function resizeSteps(steps: StepState[], targetLen: number): StepState[] {
  if (steps.length === targetLen) return steps;
  if (steps.length > targetLen) return steps.slice(0, targetLen);
  return [...steps, ...Array(targetLen - steps.length).fill(0 as StepState)];
}

function createEmptyTrack(def: { name: string; sample: string }, stepCount: number): Track {
  return { name: def.name, sample: def.sample, steps: Array(stepCount).fill(0) };
}

/** 补齐默认音轨、校正 steps 长度（加载旧谱时调用） */
export function ensureMeasureTracks(measure: Measure): void {
  const stepLen = measure.beatsPerMeasure * measure.subdivision;

  for (const track of measure.tracks) {
    track.steps = resizeSteps(track.steps, stepLen);
  }

  const namePatterns: Record<string, RegExp> = {
    crash: /crash|大镲/i,
    hihat_open: /hihat_open|开镲/i,
    hihat: /hihat|闭镲/i,
    snare: /snare|军鼓/i,
    kick: /kick|大鼓/i,
  };

  for (let i = 0; i < DEFAULT_TRACK_DEFS.length; i++) {
    const def = DEFAULT_TRACK_DEFS[i];
    if (hasTrack(measure.tracks, def.sample, namePatterns[def.sample])) continue;
    measure.tracks.splice(i, 0, createEmptyTrack(def, stepLen));
  }
}

/** 确保 measure 有 id（旧数据迁移） */
export function ensureMeasureId(measure: Measure): void {
  if (!measure.id) {
    measure.id = createId();
  }
}

export function cloneMeasure(m: Measure): Measure {
  return {
    id: createId(),
    beatsPerMeasure: m.beatsPerMeasure,
    subdivision: m.subdivision,
    tracks: m.tracks.map(t => ({
      name: t.name,
      sample: t.sample,
      steps: [...t.steps] as StepState[],
    })),
  };
}

export function createDefaultMeasure(): Measure {
  return {
    id: createId(),
    beatsPerMeasure: 4,
    subdivision: 4,
    tracks: DEFAULT_TRACK_DEFS.map(def => ({
      name: def.name,
      sample: def.sample,
      steps: Array(STEP_COUNT).fill(0),
    })),
  };
}

export function createPattern(name = '新建谱子'): Pattern {
  return {
    id: createId(),
    name,
    bpm: DEFAULT_BPM,
    measures: [createDefaultMeasure()],
  };
}

export function clonePattern(p: Pattern, name?: string): Pattern {
  return {
    id: createId(),
    name: name ?? p.name,
    bpm: p.bpm,
    measures: p.measures.map(m => cloneMeasure(m)),
  };
}
