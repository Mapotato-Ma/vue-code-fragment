import { CRASH_B64, HIHAT_B64, HIHAT_OPEN_B64, KICK_B64, SNARE_B64 } from './samples.data';

export type SampleId = 'kick' | 'snare' | 'hihat' | 'hihat_open' | 'crash';

/** 内联 base64，不发起 HTTP 请求，避免 IDM 等下载工具劫持 */
const SAMPLE_B64: Record<SampleId, string> = {
  kick: KICK_B64,
  snare: SNARE_B64,
  hihat: HIHAT_B64,
  hihat_open: HIHAT_OPEN_B64,
  crash: CRASH_B64,
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

/** 将任意历史 sample 字段规范为已知采样 id */
export function resolveSampleId(sample: string): SampleId | null {
  if (
    sample === 'kick' ||
    sample === 'snare' ||
    sample === 'hihat' ||
    sample === 'hihat_open' ||
    sample === 'crash'
  ) {
    return sample;
  }
  if (/kick|大鼓/i.test(sample)) return 'kick';
  if (/snare|军鼓/i.test(sample)) return 'snare';
  if (/hihat_open|open.*hat|开镲/i.test(sample)) return 'hihat_open';
  if (/hihat|closed.*hat|闭镲/i.test(sample)) return 'hihat';
  if (/crash|cymbal|大镲/i.test(sample)) return 'crash';
  return null;
}

export function normalizeSample(sample: string): string {
  return resolveSampleId(sample) ?? sample;
}
