export type StepState = 0 | 1 | 2; // 0=灭 1=普通 2=重音

export interface Track {
  name: string;
  sample: string;
  steps: StepState[];
}

export interface Measure {
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

export function createDefaultMeasure(): Measure {
  return {
    beatsPerMeasure: 4,
    subdivision: 4,
    tracks: [
      { name: '军鼓', sample: 'snare', steps: Array(STEP_COUNT).fill(0) },
      { name: '大鼓', sample: 'kick', steps: Array(STEP_COUNT).fill(0) },
    ],
  };
}

export function createPattern(name = '新建谱子'): Pattern {
  return {
    id: crypto.randomUUID(),
    name,
    bpm: DEFAULT_BPM,
    measures: [createDefaultMeasure()],
  };
}
