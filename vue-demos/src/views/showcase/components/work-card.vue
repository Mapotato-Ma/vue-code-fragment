<template>
  <article
    ref="rootEl"
    class="work-card"
    :class="{ 'is-live': live, 'is-in': inView }"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
    @click="emit('open', pen)"
  >
    <div class="wc-frame">
      <pen-frame :html="pen.html" :css="pen.css" :js="pen.js" :active="live" />
      <span class="wc-badge">{{ running ? 'LIVE' : 'IDLE' }}</span>
    </div>
    <div class="wc-meta">
      <span class="wc-idx">{{ String(index + 1).padStart(2, '0') }}</span>
      <span class="wc-title">{{ pen.title }}</span>
      <span class="wc-hint">点开 &#8599;</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import PenFrame from './pen-frame.vue';
import type { Pen } from '../data/pens';

const props = defineProps<{ pen: Pen; index: number }>();
const emit = defineEmits<{ open: [pen: Pen] }>();

const rootEl = ref<HTMLElement>();
const inView = ref(false);
const hover = ref(false);
let io: IntersectionObserver | undefined;

/** 进入视野才真的挂 iframe；同一屏最多跑几个，滚动离开就停 */
const live = computed(() => inView.value && (hover.value || inView.value));

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    inView.value = true;
    return;
  }
  io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        inView.value = e.isIntersecting;
      });
    },
    { rootMargin: '160px 0px', threshold: 0.01 },
  );
  if (rootEl.value) io.observe(rootEl.value);
});

onBeforeUnmount(() => io?.disconnect());

const running = computed(() => live.value);
</script>

<style lang="scss" scoped>
.work-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: var(--glass);
  backdrop-filter: blur(10px);
  cursor: pointer;
  overflow: hidden;
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 0.5s var(--ease-out),
    transform 0.5s var(--ease-out),
    border-color 0.3s var(--ease-out),
    background 0.3s var(--ease-out);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      240px 120px at var(--mx, 50%) var(--my, 0%),
      rgba(110, 231, 255, 0.1),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s var(--ease-out);
    pointer-events: none;
  }

  &.is-in {
    opacity: 1;
    transform: none;
  }

  &:hover {
    border-color: var(--line-strong);
    background: var(--glass-strong);
    box-shadow: var(--glow);

    &::before {
      opacity: 1;
    }

    .wc-hint {
      opacity: 1;
      transform: none;
    }
  }
}

.wc-frame {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-sunken);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.wc-badge {
  position: absolute;
  right: 8px;
  bottom: 8px;
  padding: 2px 6px;
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--ink-faint);
  background: rgba(6, 7, 11, 0.72);
  border: 1px solid var(--line);
}

.is-live .wc-badge {
  color: var(--accent);
  border-color: rgba(110, 231, 255, 0.35);
}

.wc-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--ink-dim);
}

.wc-idx {
  color: var(--accent);
  opacity: 0.75;
}

.wc-title {
  color: var(--ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wc-hint {
  margin-left: auto;
  color: var(--ink-faint);
  opacity: 0;
  transform: translateX(4px);
  transition: all 0.3s var(--ease-out);
}
</style>
