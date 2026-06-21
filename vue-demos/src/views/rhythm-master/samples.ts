import { KICK_B64, SNARE_B64 } from './samples.data';

export type SampleId = 'kick' | 'snare';

/** 内联 base64，不发起 HTTP 请求，避免 IDM 等下载工具劫持 */
const SAMPLE_B64: Record<SampleId, string> = {
  kick: KICK_B64,
  snare: SNARE_B64,
};

function b64ToArrayBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

export function getSampleArrayBuffer(id: SampleId): ArrayBuffer {
  return b64ToArrayBuffer(SAMPLE_B64[id]);
}

/** 将任意历史 sample 字段规范为 kick / snare */
export function resolveSampleId(sample: string): SampleId | null {
  if (sample === 'kick' || sample === 'snare') return sample;
  if (/kick/i.test(sample)) return 'kick';
  if (/snare/i.test(sample)) return 'snare';
  return null;
}

export function normalizeSample(sample: string): string {
  return resolveSampleId(sample) ?? sample;
}
