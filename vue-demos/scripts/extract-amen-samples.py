#!/usr/bin/env python3
"""从 Amen break 提取闭镲/开镲/大镲 one-shot，合并 legacy 大鼓/军鼓，生成 samples.data.ts。"""

from __future__ import annotations

import base64
import io
import wave
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE_WAV = ROOT / "src/assets/audio/819633__fax_drummer__amen-vreak-180-bpm-cut2.wav"
LEGACY_KICK = ROOT / "src/views/rhythm-master/assets/kick.bin"
LEGACY_SNARE = ROOT / "src/views/rhythm-master/assets/snare.bin"
OUTPUT_TS = ROOT / "src/views/rhythm-master/samples.data.ts"
PREVIEW_DIR = ROOT / "scripts/output"

AMEN_ONLY = ["hihat", "hihat_open", "crash"]

# onset（秒）、高通截止（Hz）、时长约束
SLICE_CONFIG: dict[str, dict[str, float | int]] = {
  # 0.6618s：前后干净、高频占比最高的闭镲
  "hihat": {"onset": 0.6618, "hp_hz": 600, "max_ms": 75, "min_ms": 22},
  # 0.4992s：中高频混合，开镲质感
  "hihat_open": {"onset": 0.4992, "hp_hz": 450, "max_ms": 180, "min_ms": 65},
  # 0.9985s：ride 镲片；高通去鼓身，避免鼓镲和音
  "crash": {"onset": 0.9985, "hp_hz": 2800, "max_ms": 300, "min_ms": 0, "env_ratio": 0.03},
}

CONST_NAMES: dict[str, str] = {
    "kick": "KICK_B64",
    "snare": "SNARE_B64",
    "hihat": "HIHAT_B64",
    "hihat_open": "HIHAT_OPEN_B64",
    "crash": "CRASH_B64",
}


def load_mono(path: Path) -> tuple[np.ndarray, int]:
    with wave.open(str(path)) as w:
        rate = w.getframerate()
        ch = w.getnchannels()
        raw = w.readframes(w.getnframes())
    arr = np.frombuffer(raw, dtype=np.int16).reshape(-1, ch).mean(axis=1).astype(np.float32) / 32768.0
    return arr, rate


def detect_onsets(samples: np.ndarray, rate: int, hop: int = 512, win: int = 1024, threshold: float = 0.002) -> list[float]:
    peaks: list[tuple[float, float]] = []
    for i in range(0, len(samples) - win, hop):
        seg = samples[i : i + win]
        energy = float(np.mean(seg * seg))
        peaks.append((i / rate, energy))

    hits: list[float] = []
    for i in range(1, len(peaks) - 1):
        t, e = peaks[i]
        if e > threshold and e > peaks[i - 1][1] and e > peaks[i + 1][1]:
            hits.append(t)

    dedup: list[float] = []
    for t in hits:
        if not dedup or t - dedup[-1] > 0.04:
            dedup.append(t)
    return dedup


def next_onset_after(onsets: list[float], t: float) -> float | None:
    for o in onsets:
        if o > t + 0.001:
            return o
    return None


def highpass(seg: np.ndarray, rate: int, cutoff_hz: float) -> np.ndarray:
    if len(seg) < 8 or cutoff_hz <= 0:
        return seg
    spec = np.fft.rfft(seg)
    freqs = np.fft.rfftfreq(len(seg), 1 / rate)
    spec[freqs < cutoff_hz] = 0
    return np.fft.irfft(spec, n=len(seg)).astype(np.float32)


def envelope_end_index(seg: np.ndarray, rate: int, peak_ratio: float = 0.15) -> int:
    if len(seg) < 4:
        return len(seg)
    abs_seg = np.abs(seg)
    peak = float(np.max(abs_seg))
    if peak < 1e-6:
        return len(seg)

    win = max(1, int(rate * 0.003))
    kernel = np.ones(win, dtype=np.float32) / win
    env = np.convolve(abs_seg, kernel, mode="same")
    threshold = peak * peak_ratio

    hold = int(rate * 0.012)
    for i in range(hold, len(env)):
        if env[i] < threshold:
            return i
    return len(seg)


def slice_hybrid(
    samples: np.ndarray,
    rate: int,
    onset: float,
    next_onset: float | None,
    max_ms: int,
    min_ms: int = 0,
    hp_hz: float = 0,
    env_ratio: float = 0.15,
    preroll_ms: int = 2,
    next_gap_ms: int = 10,
) -> np.ndarray:
    start = max(0, int((onset - preroll_ms / 1000) * rate))
    end_max = min(len(samples), start + int(rate * max_ms / 1000))

    end_bounds = [end_max]
    if next_onset is not None:
        end_bounds.append(int((next_onset - next_gap_ms / 1000) * rate))
    end_cap = min(end_bounds)

    candidate = samples[start:end_cap].copy()
    filtered = highpass(candidate, rate, hp_hz) if hp_hz > 0 else candidate
    end_env = start + envelope_end_index(filtered, rate, peak_ratio=env_ratio)
    end = min(end_cap, end_env)

    min_end = start + int(rate * min_ms / 1000)
    end = max(end, min(min_end, end_cap))

    seg = samples[start:end].copy()
    if hp_hz > 0:
        seg = highpass(seg, rate, hp_hz)

    fade_ms = 5
    fade_len = min(len(seg), int(rate * fade_ms / 1000))
    if fade_len > 0:
        seg[-fade_len:] *= np.linspace(1.0, 0.0, fade_len, dtype=np.float32)

    peak = np.max(np.abs(seg))
    if peak > 1e-6:
        seg = seg / peak * 0.95
    return seg


def to_wav_bytes(seg: np.ndarray, rate: int) -> bytes:
    pcm = np.clip(seg, -1.0, 1.0)
    pcm16 = (pcm * 32767).astype(np.int16)
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(rate)
        w.writeframes(pcm16.tobytes())
    return buf.getvalue()


def write_wav_file(seg: np.ndarray, rate: int, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(to_wav_bytes(seg, rate))


def load_legacy_b64(path: Path) -> str:
    return base64.b64encode(path.read_bytes()).decode("ascii")


def write_samples_ts(b64_map: dict[str, str]) -> None:
    lines = [
        "// 内联采样数据，避免 IDM 劫持 HTTP 请求",
        "// kick/snare: legacy MP3（assets/kick.bin · snare.bin）",
        "// hihat/hihat_open/crash: Amen break 提取（scripts/extract-amen-samples.py）",
        "",
    ]
    order = ["kick", "snare", "hihat", "hihat_open", "crash"]
    for key in order:
        name = CONST_NAMES[key]
        lines.append(f'export const {name} = "{b64_map[key]}";')
    lines.append("")
    OUTPUT_TS.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    samples, rate = load_mono(SOURCE_WAV)
    onsets = detect_onsets(samples, rate)

    b64_map: dict[str, str] = {
        "kick": load_legacy_b64(LEGACY_KICK),
        "snare": load_legacy_b64(LEGACY_SNARE),
    }
    print("legacy MP3:")
    print(f"  kick:  {LEGACY_KICK.name} ({len(b64_map['kick'])} b64 chars)")
    print(f"  snare: {LEGACY_SNARE.name} ({len(b64_map['snare'])} b64 chars)")

    print("\nAmen 混合截断 + 高通去鼓身:")
    for key in AMEN_ONLY:
        cfg = SLICE_CONFIG[key]
        onset = float(cfg["onset"])
        hp_hz = float(cfg["hp_hz"])
        max_ms = int(cfg["max_ms"])
        min_ms = int(cfg["min_ms"])
        env_ratio = float(cfg.get("env_ratio", 0.15))

        nxt = next_onset_after(onsets, onset)
        seg = slice_hybrid(samples, rate, onset, nxt, max_ms, min_ms, hp_hz, env_ratio=env_ratio)
        dur_ms = len(seg) / rate * 1000

        preview_path = PREVIEW_DIR / f"{key}.wav"
        write_wav_file(seg, rate, preview_path)

        wav_bytes = to_wav_bytes(seg, rate)
        b64_map[key] = base64.b64encode(wav_bytes).decode("ascii")

        next_str = f"{nxt:.4f}s" if nxt is not None else "EOF"
        print(
            f"  {key}: onset={onset:.4f}s hp={hp_hz:.0f}Hz next={next_str} "
            f"dur={dur_ms:.1f}ms -> {preview_path.name}"
        )

    write_samples_ts(b64_map)
    print(f"\n已写入 {OUTPUT_TS}")


if __name__ == "__main__":
    main()
