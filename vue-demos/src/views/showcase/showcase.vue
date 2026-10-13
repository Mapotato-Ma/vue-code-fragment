<template>
  <div class="showcase">
    <!-- 顶栏：只有站名和锚点 -->
    <header class="sc-top">
      <span class="sc-brand"><span class="sc-dot"></span>mapotato</span>
      <nav class="sc-nav">
        <a v-for="item in navItems" :key="item.id" @click="go(item.id)">{{ item.label }}</a>
      </nav>
    </header>

    <!-- 首屏：只放 3D -->
    <section id="hero" class="sc-hero">
      <hero-scene />
    </section>

    <!-- 效果墙 -->
    <section id="works" class="sc-section">
      <h2 class="sc-sec-title">怀旧demo</h2>
      <div class="sc-grid">
        <work-card v-for="(pen, i) in pens" :key="pen.id" :pen="pen" :index="i" @open="openPen" />
      </div>
    </section>

    <!-- 技术栈 -->
    <section id="stack" class="sc-section">
      <h2 class="sc-sec-title">技术栈</h2>
      <ul class="sc-pills">
        <li v-for="t in stack" :key="t">{{ t }}</li>
      </ul>
    </section>

    <!-- 内容入口 -->
    <section id="content" class="sc-section">
      <h2 class="sc-sec-title">内容</h2>
      <a class="sc-entry" :href="KB_URL" target="_blank" rel="noreferrer noopener">
        <span class="sc-entry-label">探索档案</span>
        <span class="sc-entry-go">→</span>
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
  'TresJS',
  'Three.js',
  'WebGL',
  'Node.js',
  'Alpine / iSH',
  'Nginx',
  'Git',
];

const navItems = [
  { id: 'works', label: '怀旧demo' },
  { id: 'stack', label: '技术' },
  { id: 'content', label: '内容' },
];

/**
 * 页内跳转自己来，不用 href：
 * 页面里有 <base href="/mapotato">，#works 会被解析成 /mapotato#works，
 * 变成整页跳转，点上去就像「没反应」。
 */
const go = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

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

/* ---------- 顶栏 ---------- */
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

/* ---------- 首屏：一块 3D ---------- */
.sc-hero {
  position: relative;
  height: 100vh;
  min-height: 620px;

  /* 整屏 3D：不要边框和留白，只留极细的扫描线做质感 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.022) 0px,
      rgba(255, 255, 255, 0.022) 1px,
      transparent 1px,
      transparent 3px
    );
    pointer-events: none;
  }
}


/* ---------- 分区 ---------- */
.sc-section {
  padding: 8vh var(--page-pad);
  scroll-margin-top: var(--header-h);
}

.sc-sec-title {
  margin: 0 0 26px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--line);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0;
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
  padding: 22px 26px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--glass);
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

.sc-entry-label {
  font-size: 15px;
}

.sc-entry-go {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--ink-dim);
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
