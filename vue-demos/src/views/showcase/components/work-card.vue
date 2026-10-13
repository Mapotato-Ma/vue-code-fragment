<template>
  <article
    ref="rootEl"
    class="work-card"
    :class="{ 'is-live': live, 'is-in': inView }"
    @mouseenter="hover = true; sync()"
    @mouseleave="hover = false; sync()"
    @click="emit('open', pen)"
  >
    <div class="wc-frame">
      <pen-frame :html="pen.html" :css="pen.css" :js="pen.js" :active="live" />
    </div>
    <div class="wc-meta">
      <span class="wc-idx">{{ String(index + 1).padStart(2, '0') }}</span>
      <span class="wc-title">{{ pen.title }}</span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import PenFrame from './pen-frame.vue';
import type { Pen } from '../data/pens';

const props = defineProps<{ pen: Pen; index: number }>();
const emit = defineEmits<{ open: [pen: Pen] }>();

const rootEl = ref<HTMLElement>();
const inView = ref(false);
const hover = ref(false);
let io: IntersectionObserver | undefined;

/** 进入视野才真的挂 iframe；滚动离开就停（同一屏最多跑几个，省 CPU） */
const live = ref(false);
const sync = () => {
  live.value = inView.value || hover.value;
};

onMounted(() => {
  if (typeof IntersectionObserver === 'undefined') {
    inView.value = true;
    sync();
    return;
  }
  io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        inView.value = e.isIntersecting;
        sync();
      });
    },
    { rootMargin: '160px 0px', threshold: 0.01 },
  );
  if (rootEl.value) io.observe(rootEl.value);
});

onBeforeUnmount(() => io?.disconnect());
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

</style>
