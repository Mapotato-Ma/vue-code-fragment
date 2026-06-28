import { createId, type Measure, type Pattern, type StepState } from './types';

const EMPTY_8 = '........';

/** 将 o/O/. 字符串解析为步进状态（o=普通 O=重音 .=静音） */
function steps(s: string, len: number): StepState[] {
  if (s.length !== len) {
    throw new Error(`步数必须为 ${len}，实际 ${s.length}：${s}`);
  }
  return s.split('').map(c => (c === 'O' ? 2 : c === 'o' ? 1 : 0) as StepState);
}

type TrackDef = [crash: string, open: string, hat: string, snare: string, kick: string];

function measureAt(
  beatsPerMeasure: number,
  subdivision: number,
  [crash, open, hat, snare, kick]: TrackDef,
): Measure {
  const stepLen = beatsPerMeasure * subdivision;
  return {
    id: createId(),
    beatsPerMeasure,
    subdivision,
    tracks: [
      { name: '大镲', sample: 'crash', steps: steps(crash, stepLen) },
      { name: '开镲', sample: 'hihat_open', steps: steps(open, stepLen) },
      { name: '闭镲', sample: 'hihat', steps: steps(hat, stepLen) },
      { name: '军鼓', sample: 'snare', steps: steps(snare, stepLen) },
      { name: '大鼓', sample: 'kick', steps: steps(kick, stepLen) },
    ],
  };
}

function measure(def: TrackDef): Measure {
  return measureAt(4, 4, def);
}

function measure2_4(def: TrackDef): Measure {
  return measureAt(2, 4, def);
}

function preset(id: string, name: string, bpm: number, defs: TrackDef[]): Pattern {
  return { id, name, bpm, measures: defs.map(d => measure(d)) };
}

/** 内置示例谱（首次进入或无本地缓存时使用） */
export const PRESET_PATTERNS: Pattern[] = [
  // ── 碎拍：6 小节，Amen 变体 → 军鼓机关枪 → 底鼓断裂 ──
  preset('preset-breakbeat', '碎拍 Break', 170, [
    [
      'O...............',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....O.o.....O.o.',
      'O.....o...o..o..',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....O.o.o...O.o.',
      'O.o...o...o..o..',
    ],
    [
      '................',
      '....o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....O.o.o...O...',
      'O.....o.o.o..o..',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O...ooooO...',
      'O.....o...o..o..',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      'o.o.O.o.o.o.O.o.',
      'O.o.o.o...o.o.o.',
    ],
    [
      'O...............',
      '....o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....O...ooooO...',
      'O.o...o.o.o..O..',
    ],
  ]),

  // ── 经典摇滚：6 小节，从稳 groove → 军鼓加花 → 大镲收尾 ──
  preset('preset-rock', '经典摇滚', 120, [
    [
      'O...............',
      '........o.......',
      'o.o.o.o.o.o.o.o.',
      '....O.......O...',
      'O.......O.......',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O...o....O..',
      'O.......O...o...',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....O...o....O..',
      'O.o.....O.......',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O...oooO....',
      'O.......O...o.o.',
    ],
    [
      '................',
      'o.......o.......',
      'o.o.o.o.o.o.o.o.',
      '....O...o.o.O...',
      'O.o.o...o.o..o..',
    ],
    [
      'O...........O...',
      '........o.......',
      'o.o.o.o.o.o.o.o.',
      '....O...ooooO...',
      'O.......O....o.o',
    ],
  ]),

  // ── 放克：6 小节，切分递进 + 军鼓对话 + 开镲爆发 ──
  preset('preset-funk', '放克律动', 100, [
    [
      '................',
      '.......o....o...',
      'o.o.o.o.o.o.o.o.',
      '....O...o....O..',
      'O.o...O....o.o..',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....O.o.o...O...',
      'O..o..O....o...o',
    ],
    [
      '................',
      'o...o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....O...oo..O...',
      'O.o...O..o..o.o.',
    ],
    [
      '................',
      '.......o....o...',
      'o.o.o.o.o.o.o.o.',
      '....O...oooo....',
      'O...o.O....o.o..',
    ],
    [
      '................',
      'o.o...o...o.o...',
      'o.o.o.o.o.o.o.o.',
      'o.o.O...o.o.O...',
      'O.o.o.O...o.o.o.',
    ],
    [
      'O...............',
      'o...o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....O...ooooO...',
      'O.o...O....o.O..',
    ],
  ]),

  // ── House：5 小节，四踩 → 军鼓滚奏 → 落镲 ──
  preset('preset-house', 'House 四踩', 128, [
    [
      'O...............',
      '................',
      '..o...o...o...o.',
      '....o.......o...',
      'O...o...o...o...',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....o...o...o...',
      'O...o...o...o...',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....o.......O...',
      'O...o...o...o...',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....o...oooo....',
      'O...o...o...o...',
    ],
    [
      'O...............',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....o...ooooO...',
      'O...o...o...O...',
    ],
  ]),

  // ── Boom Bap：5 小节，慵懒 → 底鼓切分 → 军鼓碎拍 fill ──
  preset('preset-hiphop', 'Boom Bap', 90, [
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O.......O...',
      'O.........o.....',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O.......O...',
      'O...o.....o.o...',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O...o....O..',
      'O.........o..o..',
    ],
    [
      '................',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O...oooO....',
      'O...o.....o.....',
    ],
    [
      'O...............',
      '................',
      'o.o.o.o.o.o.o.o.',
      '....O...ooooO...',
      'O.........o..O..',
    ],
  ]),

  // ── 雷鬼：5 小节，One Drop → dub 空间感 → 落镲 ──
  preset('preset-reggae', '雷鬼 One Drop', 78, [
    [
      '................',
      'o.......o.......',
      '..o...o...o...o.',
      '........O.......',
      'O...............',
    ],
    [
      '................',
      'o.......o.......',
      '..o...o...o...o.',
      '........O...o...',
      'O...........o...',
    ],
    [
      '................',
      'o...o...o...o...',
      '..o...o...o...o.',
      '....o...O.......',
      'O.......o.......',
    ],
    [
      '................',
      'o.......o.......',
      'o.o.o.o.o.o.o.o.',
      '....o...oooo....',
      'O...........o...',
    ],
    [
      'O...............',
      'o...o...o...o...',
      '..o...o...o...o.',
      '........O...o...',
      'O.......o...O...',
    ],
  ]),

  // ── 迪斯科：6 小节，四踩反拍 → 军鼓切分 → 高潮落镲 ──
  preset('preset-disco', '迪斯科', 118, [
    [
      'O...............',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....O.......O...',
      'O...o...o...o...',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....O...o....O..',
      'O...o...o...o...',
    ],
    [
      '................',
      'o...o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....o...O...o...',
      'O...o...o...o...',
    ],
    [
      '................',
      '....o.......o...',
      'o.o.o.o.o.o.o.o.',
      '....o...oooo....',
      'O...o...o...o...',
    ],
    [
      '................',
      'o...o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....O...o.o.O...',
      'O.o.o...o.o.o.o.',
    ],
    [
      'O...............',
      'o...o...o...o...',
      'o.o.o.o.o.o.o.o.',
      '....O...ooooO...',
      'O...o...o...O...',
    ],
  ]),
];

export const PRESET_IDS = new Set(PRESET_PATTERNS.map(p => p.id));

export function isBuiltinPattern(id: string): boolean {
  return PRESET_IDS.has(id);
}
