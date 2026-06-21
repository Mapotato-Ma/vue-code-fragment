# rhythm-master 重构计划：在线打击乐编谱器

路由：`/rhythmic`，原地替换，路由/菜单无需改动。

## 核心决策（已确认）

| 维度 | 决策 |
|------|------|
| 交互范式 | 步进音序器网格（Step Sequencer） |
| 编排长度 | 数据层 `measures[]` 建模，UI 先渲染单小节（二期加 +小节） |
| 拍号 | 固定 4/4，`beatsPerMeasure` 字段留口 |
| 细分精度 | 固定十六分，16 格/小节，`subdivision: 4` |
| 音色行 | `tracks[]` 数组建模，先渲染军鼓 + 大鼓两行 |
| 格子状态 | 三态：`0=灭 / 1=普通 / 2=重音`（存数字，留扩展口） |
| 音频引擎 | Web Audio API + 前瞻调度器，不用 `<audio>` / rxjs |
| 采样来源 | 内联 base64（`samples.ts` + `samples.data.ts`），不发 HTTP 请求 |
| BPM 控制 | 数字 + 步进 +/- + 滑块，范围 40–240 |
| 播放头 | 列高亮扫描，当前列跨两行整列高亮（`step--active`） |
| 持久化 | localStorage，防抖自动保存；多谱管理；导入/导出 JSON |
| 布局 | 顶部工具栏 + 网格；管理折进「谱子▾」下拉 |
| 编辑手感 | 单击三态循环 + 即时试听；拖拽刷（首格目标态批量刷/擦） |
| 播放行为 | 自动循环；空格键播/停（输入框聚焦时不拦截） |
| 视觉风格 | 暗色主题（`var.scss` 变量），每拍 4 格留宽间隙分组，左侧中文行标签 |

## 文件结构

```
src/views/rhythm-master/
  rhythm-master.vue              # 容器：工具栏 + 网格 + 空格键监听
  types.ts                       # StepState / Track / Measure / Pattern + 工厂函数
  samples.ts                     # SampleId / resolveSampleId / getSampleArrayBuffer
  samples.data.ts                # KICK_B64 / SNARE_B64（内联 base64 音频）
  components/
    rhythm-toolbar.vue           # 播放 · BPM · 清空 · 谱子▾下拉
    rhythm-grid.vue              # 行标签 + 16格×2行 · 拍分组 · 列高亮 · 拖拽刷
  hooks/
    useAudioEngine.ts            # AudioContext · base64 解码 · scheduleNote · triggerNow
    useScheduler.ts              # 前瞻调度(setInterval 25ms) + rAF 驱动 currentStep
    useSequencer.ts              # Pattern CRUD · localStorage · 导入导出
```

## 数据模型

```ts
type StepState = 0 | 1 | 2;  // 灭 / 普通 / 重音

interface Track   { name: string; sample: string; steps: StepState[] }
interface Measure { beatsPerMeasure: number; subdivision: number; tracks: Track[] }
interface Pattern { id: string; name: string; bpm: number; measures: Measure[] }
```

## 音频方案（关键）

`samples.data.ts` 将 `kick.mp3` / `snare.mp3` 编码为 base64 字符串直接嵌入 bundle，
`samples.ts` 提供 `getSampleArrayBuffer` 在内存解码为 `ArrayBuffer`，
`useAudioEngine.ts` 用 `decodeAudioData` 解码为 `AudioBuffer` 并缓存。
整条链路**零 HTTP 请求**，彻底避免浏览器下载工具劫持 mp3 文件。

## 配色（`var.scss` 变量）

| 状态 | 颜色 |
|------|------|
| 格子灭 | `#2a2a2e`（暗灰底） |
| 格子普通 | `--apple-music-primary`（`#fa2d48`）|
| 格子重音 | `#ff6b7a` + 发光描边 |
| 播放头列高亮 | `inset 0 0 0 2px rgba(255,255,255,0.5)` |
| 工具栏背景 | `--apple-music-bg-lighten`（`#242528`）|

## 二期（已预留，暂不做）

- `+小节 / 删小节` UI（数据层 `measures[]` 已就绪）
- 多小节顺序播放 + 小节导航
- 拍号切换下拉（`beatsPerMeasure` 字段已就绪）
- 重音拖拽刷（当前拖拽统一设普通/灭，重音只走单击）
- 真实鼓采样替换（只需换 `samples.data.ts` 中的 base64 值）
