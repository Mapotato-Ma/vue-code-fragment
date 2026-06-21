import { ACCENT_GAIN, NORMAL_GAIN } from '../types';
import { getSampleArrayBuffer, resolveSampleId, type SampleId } from '../samples';

let ctx: AudioContext | null = null;
const buffers = new Map<SampleId, AudioBuffer>();

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

async function loadBuffer(rawSample: string): Promise<AudioBuffer> {
  const id = resolveSampleId(rawSample);
  if (!id) throw new Error(`未知采样: ${rawSample}`);
  if (buffers.has(id)) return buffers.get(id)!;
  const arr = getSampleArrayBuffer(id);
  const buf = await getCtx().decodeAudioData(arr.slice(0));
  buffers.set(id, buf);
  return buf;
}

export async function initAudio(samples: string[]): Promise<void> {
  await Promise.all(samples.map(loadBuffer));
}

export async function resumeCtx(): Promise<void> {
  const c = getCtx();
  if (c.state === 'suspended') await c.resume();
}

export function scheduleNote(sample: string, when: number, isAccent: boolean): void {
  const id = resolveSampleId(sample);
  const buf = id ? buffers.get(id) : undefined;
  if (!buf) return;
  const c = getCtx();
  const gain = c.createGain();
  gain.gain.value = isAccent ? ACCENT_GAIN : NORMAL_GAIN;
  gain.connect(c.destination);
  const src = c.createBufferSource();
  src.buffer = buf;
  src.connect(gain);
  src.start(when);
}

export function triggerNow(sample: string, isAccent: boolean): void {
  const c = getCtx();
  scheduleNote(sample, c.currentTime, isAccent);
}

export function getAudioTime(): number {
  return getCtx().currentTime;
}
