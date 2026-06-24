<template>
  <div class="rhythm-toolbar">
    <div class="toolbar-left">
      <button class="btn-play-pill" :class="{ playing: isPlaying }" @click="emit('toggle-play')">
        <span v-if="!isPlaying" class="play-icon">▶</span>
        <span v-else class="stop-icon">■</span>
        <span>{{ isPlaying ? '停止' : '播放' }}</span>
      </button>

      <div class="bpm-chip">
        <button class="bpm-step-btn" @click="stepBpm(-1, $event)">−</button>
        <input
          v-if="bpmEditing"
          ref="bpmInputRef"
          class="bpm-input"
          type="number"
          min="40"
          max="240"
          :value="bpm"
          @blur="onBpmInputBlur"
          @keydown="onBpmInputKeydown"
        />
        <span v-else class="bpm-value" @dblclick="startBpmEdit">{{ bpm }}</span>
        <span class="bpm-unit">BPM</span>
        <button class="bpm-step-btn" @click="stepBpm(1, $event)">+</button>
      </div>

      <div class="measure-nav">
        <div class="view-mode-toggle">
          <button
            class="view-mode-btn"
            :class="{ active: viewMode === 'edit' }"
            @click="emit('view-mode-change', 'edit')"
          >
            编辑
          </button>
          <button
            class="view-mode-btn"
            :class="{ active: viewMode === 'overview' }"
            @click="emit('view-mode-change', 'overview')"
          >
            总览
          </button>
        </div>
        <template v-if="viewMode === 'edit'">
          <button class="measure-btn" :disabled="isPlaying" @click="emit('measure-prev')">◀</button>
          <span class="measure-indicator">{{ measureIndex + 1 }} / {{ measureCount }}</span>
          <button class="measure-btn" :disabled="isPlaying" @click="emit('measure-next')">▶</button>
        </template>
        <button class="measure-btn measure-btn--text" :disabled="isPlaying" @click="emit('measure-add')">
          +小节
        </button>
        <button
          class="measure-btn measure-btn--text"
          :disabled="isPlaying || measureCount <= 1"
          @click="emit('measure-delete')"
        >
          删小节
        </button>
      </div>

      <button class="btn-clear-ghost" @click="onClear">清空</button>
    </div>

    <div class="toolbar-right">
      <div ref="menuRef" class="pattern-menu" :class="{ open: menuOpen }">
        <button class="btn-pattern" @click="menuOpen = !menuOpen">
          <span class="pattern-name">{{ currentName }}</span>
          <span class="chevron">▾</span>
        </button>
        <div v-if="menuOpen" class="pattern-dropdown" @click.stop>
          <div class="pattern-name-row">
            <input
              class="pattern-name-input"
              :value="currentName"
              maxlength="24"
              placeholder="谱子名称"
              @change="emit('rename', ($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="pattern-list">
            <div
              v-for="p in patterns"
              :key="p.id"
              class="pattern-item"
              :class="{ active: p.id === currentId }"
              @click="onSwitchPattern(p.id)"
            >
              <span>{{ p.name }}</span>
              <button
                v-if="patterns.length > 1"
                class="btn-delete"
                @click.stop="emit('delete', p.id)"
              >
                ×
              </button>
            </div>
          </div>
          <div class="pattern-actions">
            <button class="btn-action" @click="emit('new')">+ 新建</button>
            <button class="btn-action" @click="emit('export')">导出</button>
            <label class="btn-action btn-import">
              导入
              <input type="file" accept=".json" style="display: none" @change="onImport" />
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import type { Pattern } from '../types';

const props = defineProps<{
  isPlaying: boolean;
  bpm: number;
  viewMode: 'edit' | 'overview';
  measureIndex: number;
  measureCount: number;
  patterns: Pattern[];
  currentId: string;
  currentName: string;
}>();

const emit = defineEmits<{
  (e: 'toggle-play'): void;
  (e: 'bpm-change', v: number): void;
  (e: 'clear'): void;
  (e: 'rename', name: string): void;
  (e: 'new'): void;
  (e: 'switch', id: string): void;
  (e: 'delete', id: string): void;
  (e: 'export'): void;
  (e: 'import', file: File): void;
  (e: 'view-mode-change', mode: 'edit' | 'overview'): void;
  (e: 'measure-prev'): void;
  (e: 'measure-next'): void;
  (e: 'measure-add'): void;
  (e: 'measure-delete'): void;
}>();

const menuOpen = ref(false);
const bpmEditing = ref(false);
const bpmInputRef = ref<HTMLInputElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

function clamp(v: number) {
  return Math.min(240, Math.max(40, v));
}

function stepBpm(delta: number, e: MouseEvent) {
  const step = e.shiftKey ? 5 : 1;
  emit('bpm-change', clamp(props.bpm + delta * step));
}

async function startBpmEdit() {
  bpmEditing.value = true;
  await nextTick();
  bpmInputRef.value?.focus();
  bpmInputRef.value?.select();
}

function commitBpmInput(raw: string) {
  const v = clamp(Number(raw) || props.bpm);
  emit('bpm-change', v);
  bpmEditing.value = false;
}

function onBpmInputBlur(e: FocusEvent) {
  commitBpmInput((e.target as HTMLInputElement).value);
}

function onBpmInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter') {
    commitBpmInput((e.target as HTMLInputElement).value);
  } else if (e.key === 'Escape') {
    bpmEditing.value = false;
  }
}

function onClear() {
  if (confirm('确定清空当前谱子？')) emit('clear');
}

function onSwitchPattern(id: string) {
  emit('switch', id);
  menuOpen.value = false;
}

function onImport(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) {
    emit('import', file);
    menuOpen.value = false;
  }
}

function onDocumentClick(e: MouseEvent) {
  if (!menuOpen.value) return;
  const el = menuRef.value;
  if (el && !el.contains(e.target as Node)) menuOpen.value = false;
}

function onDocumentKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) menuOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick);
  document.addEventListener('keydown', onDocumentKeydown);
});

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick);
  document.removeEventListener('keydown', onDocumentKeydown);
});
</script>

<style lang="scss" scoped>
.rhythm-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  padding: 8px;
  background: var(--apple-music-bg-lighten);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  gap: 16px;
  flex-shrink: 0;
  box-sizing: border-box;
  border-radius: 28px;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-play-pill {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 40px;
  min-width: 88px;
  padding: 0 20px;
  border: none;
  border-radius: 20px;
  background: var(--apple-music-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 120ms ease;

  &:hover {
    background: #e0273f;
  }

  &.playing {
    background: #3a3a3e;

    &:hover {
      background: #454549;
    }
  }

  .play-icon {
    font-size: 11px;
    line-height: 1;
  }

  .stop-icon {
    font-size: 10px;
    line-height: 1;
  }
}

.bpm-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 6px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bpm-step-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #ccc;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 120ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }
}

.bpm-value {
  font-size: 20px;
  font-weight: 600;
  color: #f0f0f0;
  min-width: 36px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.bpm-input {
  width: 48px;
  height: 28px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #f0f0f0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  outline: none;
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border-color: var(--apple-music-primary);
  }
}

.bpm-unit {
  font-size: 11px;
  color: var(--apple-music-default);
  letter-spacing: 0.04em;
  margin-right: 2px;
}

.measure-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 8px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.view-mode-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}

.view-mode-btn {
  height: 26px;
  padding: 0 10px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #999;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 120ms ease,
    color 120ms ease;

  &.active {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }

  &:hover:not(.active) {
    color: #ccc;
  }
}

.measure-btn {
  height: 28px;
  min-width: 28px;
  padding: 0 6px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &--text {
    padding: 0 10px;
    font-size: 12px;
  }
}

.measure-indicator {
  font-size: 13px;
  font-weight: 600;
  color: #e0e0e0;
  min-width: 44px;
  text-align: center;
  user-select: none;
}

.btn-clear-ghost {
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  color: var(--apple-music-default);
  cursor: pointer;
  transition:
    color 120ms ease,
    text-decoration 120ms ease;

  &:hover {
    color: #fff;
    text-decoration: underline;
  }
}

.toolbar-right {
  position: relative;
}

.pattern-menu {
  position: relative;
}

.btn-pattern {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  max-width: 180px;
  padding: 0 16px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.06);
  color: #ddd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .pattern-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chevron {
    font-size: 10px;
    opacity: 0.6;
    flex-shrink: 0;
  }
}

.pattern-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 260px;
  background: #2a2a2e;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
  z-index: 100;
  overflow: hidden;
}

.pattern-name-row {
  padding: 12px 12px 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.pattern-name-input {
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 0 12px;
  color: #eee;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: var(--apple-music-primary);
  }
}

.pattern-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
}

.pattern-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px 0 16px;
  font-size: 14px;
  color: #bbb;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }

  &.active {
    color: var(--apple-music-primary);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 8px;
      bottom: 8px;
      width: 3px;
      border-radius: 2px;
      background: var(--apple-music-primary);
    }
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.btn-delete {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-size: 16px;
  padding: 0 4px;
  flex-shrink: 0;

  &:hover {
    color: var(--apple-music-primary);
  }
}

.pattern-actions {
  display: flex;
  gap: 8px;
  padding: 10px 12px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-action {
  flex: 1;
  height: 36px;
  font-size: 13px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: transparent;
  color: #aaa;
  cursor: pointer;
  text-align: center;
  transition:
    background 120ms ease,
    color 120ms ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #fff;
  }
}

.btn-import {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
