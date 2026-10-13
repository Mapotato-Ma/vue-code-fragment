<template>
  <div class="showcase">
    <!-- 顶部：极简，只有身份 + 锚点 -->
    <header class="sc-top">
      <span class="sc-brand">
        <span class="sc-dot"></span>
        mapotato
        <span class="sc-brand-sub">/ front-end · 3d · automation</span>
      </span>
      <nav class="sc-nav">
        <a href="#works">作品</a>
        <a href="#stack">技术</a>
        <a href="#content">内容</a>
      </nav>
    </header>

    <!-- 首屏 -->
    <section id="hero" class="sc-hero">
      <div class="sc-hero-canvas">
        <hero-scene />
      </div>
      <div class="sc-hero-meta">
        <p class="sc-kicker">// 个人作品集 · 2026</p>
        <h1 class="sc-title">
          把想法做成<br />
          <span class="sc-title-em">能跑的东西</span>
        </h1>
        <p class="sc-lead">
          前端 / 三维 / 自动化。这里放着这些年做过的效果与实验 ——
          全部代码内联在本站，不依赖任何第三方嵌入。
        </p>
        <div class="sc-hero-stat">
          <div><b>{{ pens.length }}</b><span>个效果可交互</span></div>
          <div><b>0</b><span>个外部嵌入</span></div>
          <div><b>1</b><span>页面</span></div>
        </div>
        <a class="sc-scroll" href="#works">向下滚动 <span>↓</span></a>
      </div>
    </section>

    <!-- 作品墙 -->
    <section id="works" class="sc-section">
      <div class="sc-sec-head">
        <span class="sc-idx">01</span>
        <h2>作品</h2>
        <span class="sc-sec-note">{{ pens.length }} 个可交互效果 · 进入视野才启动</span>
      </div>
      <div class="sc-grid">
        <work-card
          v-for="(pen, i) in pens"
          :key="pen.id"
          :pen="pen"
          :index="i"
          @open="openPen"
        />
      </div>
    </section>

    <!-- 技术栈 -->
    <section id="stack" class="sc-section">
      <div class="sc-sec-head">
        <span class="sc-idx">02</span>
        <h2>技术栈</h2>
        <span class="sc-sec-note">日常在用的</span>
      </div>
      <ul class="sc-pills">
        <li v-for="t in stack" :key="t">{{ t }}</li>
      </ul>
    </section>

    <!-- 内容入口 -->
    <section id="content" class="sc-section">
      <div class="sc-sec-head">
        <span class="sc-idx">03</span>
        <h2>内容</h2>
        <span class="sc-sec-note">踩过的坑与记录都放在知识库</span>
      </div>
      <a class="sc-entry" :href="KB_URL" target="_blank" rel="noreferrer noopener">
        <div class="sc-entry-main">
          <span class="sc-entry-label">探索档案</span>
          <span class="sc-entry-desc">前端踩坑、设备折腾、自建服务的完整记录</span>
        </div>
        <span class="sc-entry-go">进入 →</span>
      </a>
    </section>

    <footer class="sc-foot">
      <span>© 2024–2026 Mapotato</span>
      <span class="sc-foot-beian">
        <img src="@/assets/beian.png" alt="" />
        苏ICP备2024113879号-1 · 苏公网安备32011402011730号
      </span>
    </footer>

    <!-- 详情：点开卡片后的放大预览 + 源码 -->
    <div v-if="activePen" class="sc-lightbox" @click.self="activePen = null">
      <div class="sc-lb-panel">
        <div class="sc-lb-head">
          <span class="sc-lb-title">{{ activePen.title }}</span>
          <span class="sc-lb-id">{{ activePen.id }}</span>
          <button class="sc-lb-close" @click="activePen = null">✕</button>
        </div>
        <div class="sc-lb-stage">
          <pen-frame
            :html="activePen.html"
            :css="activePen.css"
            :js="activePen.js"
            :active="true"
            scroll
          />
        </div>
        <div class="sc-lb-tabs">
          <button
            v-for="t in ['html', 'css', 'js'] as const"
            :key="t"
            :class="{ 'is-on': tab === t }"
            @click="tab = t"
          >
            {{ t.toUpperCase() }}
          </button>
          <span class="sc-lb-len">{{ activePen[tab].length }} 字符</span>
        </div>
        <pre class="sc-lb-code"><code>{{ activePen[tab] }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

// 3D 场景懒加载：three.js 单独成 chunk，首屏 JS 不被它拖慢
const HeroScene = defineAsyncComponent(() => import('./components/hero-scene.vue'));
import PenFrame from './components/pen-frame.vue';
import WorkCard from './components/work-card.vue';
import { pens, type Pen } from './data/pens';

/** 知识库地址：要换目标只改这一行 */
const KB_URL = 'https://mapotato.fun/exp/';

const stack = [
  'Vue 3',
  'Vite',
  'TypeScript',
  'Sass',
  'Three.js',
  'WebGL',
  'Monaco',
  'RxJS',
  'Node.js',
  'Alpine / iSH',
  'Git',
  'Nginx',
];

const activePen = ref<Pen | null>(null);
const tab = ref<'html' | 'css' | 'js'>('css');

const openPen = (pen: Pen) => {
  activePen.value = pen;
  tab.value = pen.css ? 'css' : 'html';
};

</script>

<style lang="scss" scoped>
.showcase {
  position: relative;
  min-height: 100vh;
  color: var(--ink);
  overflow-x: hidden;
}

/* ---------- 顶部 ---------- */
.sc-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-h);
  padding: 0 var(--page-pad);
  font-family: var(--font-mono);
  font-size: 12px;
  background: linear-gradient(180deg, rgba(6, 7, 11, 0.92), rgba(6, 7, 11, 0));
  backdrop-filter: blur(6px);
}

.sc-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--ink);
  letter-spacing: 0.04em;
}

.sc-brand-sub {
  color: var(--ink-faint);
}

.sc-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px var(--accent);
  animation: pulse 2.6s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.sc-nav {
  display: flex;
  gap: 18px;

  a {
    color: var(--ink-dim);
    text-decoration: none;
    transition: color 0.25s var(--ease-out);

    &:hover {
      color: var(--accent);
    }
  }
}

/* ---------- 首屏 ---------- */
.sc-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  align-items: center;
  min-height: 100vh;
  padding: calc(var(--header-h) + 4vh) var(--page-pad) 8vh;
  gap: 4vw;
}

.sc-hero-canvas {
  position: relative;
  height: 66vh;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    radial-gradient(80% 60% at 50% 40%, rgba(110, 231, 255, 0.08), transparent 70%),
    var(--bg-sunken);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.028) 0px,
      rgba(255, 255, 255, 0.028) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }
}

.sc-kicker {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
  margin: 0 0 18px;
}

.sc-title {
  margin: 0;
  font-size: clamp(38px, 5.2vw, 76px);
  line-height: 1.06;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.sc-title-em {
  background: linear-gradient(96deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.sc-lead {
  max-width: 34em;
  margin: 22px 0 30px;
  color: var(--ink-dim);
  line-height: 1.85;
}

.sc-hero-stat {
  display: flex;
  gap: 34px;
  padding: 18px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  b {
    font-size: 24px;
    font-family: var(--font-mono);
    color: var(--accent);
  }

  span {
    font-size: 12px;
    color: var(--ink-faint);
  }
}

.sc-scroll {
  display: inline-block;
  margin-top: 26px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-faint);
  text-decoration: none;

  span {
    display: inline-block;
    animation: bob 1.8s ease-in-out infinite;
  }

  &:hover {
    color: var(--accent);
  }
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(5px);
  }
}

/* ---------- 分区 ---------- */
.sc-section {
  padding: 9vh var(--page-pad);
  scroll-margin-top: var(--header-h);
}

.sc-sec-head {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding-bottom: 16px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--line);

  h2 {
    margin: 0;
    font-size: 22px;
    letter-spacing: 0.02em;
  }
}

.sc-idx {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
}

.sc-sec-note {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-faint);
}

.sc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 18px;
}

.sc-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 8px 14px;
    border: 1px solid var(--line);
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--ink-dim);
    background: var(--glass);
    transition: all 0.3s var(--ease-out);

    &:hover {
      color: var(--ink);
      border-color: rgba(110, 231, 255, 0.4);
      transform: translateY(-2px);
    }
  }
}

.sc-entry {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background:
    radial-gradient(120% 160% at 0% 0%, rgba(167, 139, 250, 0.1), transparent 60%),
    var(--glass);
  text-decoration: none;
  color: inherit;
  transition: all 0.35s var(--ease-out);

  &:hover {
    border-color: rgba(167, 139, 250, 0.45);
    transform: translateY(-3px);
    box-shadow: 0 16px 50px rgba(167, 139, 250, 0.12);

    .sc-entry-go {
      transform: translateX(4px);
    }
  }
}

.sc-entry-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sc-entry-label {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent-2);
}

.sc-entry-desc {
  color: var(--ink-dim);
}

.sc-entry-go {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink);
  transition: transform 0.3s var(--ease-out);
}

/* ---------- 页脚 ---------- */
.sc-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 26px var(--page-pad) 34px;
  border-top: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-faint);
}

.sc-foot-beian {
  display: flex;
  align-items: center;
  gap: 6px;

  img {
    height: 14px;
    opacity: 0.6;
  }
}

/* ---------- 放大预览 ---------- */
.sc-lightbox {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 4vh 3vw;
  background: rgba(3, 4, 7, 0.82);
  backdrop-filter: blur(8px);
  animation: fade 0.25s var(--ease-out);
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

.sc-lb-panel {
  display: flex;
  flex-direction: column;
  width: min(1100px, 100%);
  max-height: 92vh;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  background: var(--bg-raise);
  overflow: hidden;
  animation: rise 0.35s var(--ease-out);
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
}

.sc-lb-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-mono);
  font-size: 12px;
}

.sc-lb-title {
  color: var(--ink);
  font-size: 14px;
}

.sc-lb-id {
  color: var(--ink-faint);
}

.sc-lb-close {
  margin-left: auto;
  padding: 2px 8px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: transparent;
  color: var(--ink-dim);
  cursor: pointer;

  &:hover {
    color: var(--ink);
    border-color: var(--line-strong);
  }
}

.sc-lb-stage {
  height: 44vh;
  min-height: 260px;
  background: var(--bg-sunken);
}

.sc-lb-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);

  button {
    padding: 5px 12px;
    border: 1px solid var(--line);
    border-radius: 6px;
    background: transparent;
    color: var(--ink-dim);
    font-family: var(--font-mono);
    font-size: 11px;
    cursor: pointer;

    &.is-on {
      color: var(--bg-page);
      background: var(--accent);
      border-color: var(--accent);
    }
  }
}

.sc-lb-len {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-faint);
}

.sc-lb-code {
  margin: 0;
  padding: 16px 18px;
  max-height: 26vh;
  overflow: auto;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.65;
  color: var(--ink-dim);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
