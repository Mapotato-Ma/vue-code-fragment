<template>
  <div class="collapse-panel" :class="{ collapse }">
    <div class="header" @click="collapse = !collapse" :title="title">
      <slot name="header">{{ title }}</slot>
    </div>
    <div class="body" :class="[bodyClass]">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
const props = defineProps<{
  title?: string;
  initCollapse?: boolean;
  bodyMaxHeight?: number;
  bodyClass?: string;
}>();
const collapse = ref(props.initCollapse ?? false);

const bodyMaxHeight = computed(() => {
  if (props.bodyMaxHeight) {
    return `${props.bodyMaxHeight}px`;
  }
  return 'unset';
});
</script>

<style lang="scss" scoped>
.collapse-panel {
  display: grid;
  grid-template-rows: 30px 1fr;
  row-gap: 4px;
  padding: 6px;
  overflow: hidden;
  transition: all 0.2s ease;
  border: 2px solid #575757;
  border-radius: 12px;
  background: var(--apple-music-bg-lighten);
  .header {
    position: relative;
    align-content: center;
    padding: 0 0.5em 0 1.7em;
    cursor: pointer;
    background: #575757;
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 9px;
    border-end-start-radius: 3px;
    border-end-end-radius: 3px;

    &::before {
      font-family: cursive;
      content: '';
      position: absolute;
      top: 50%;
      translate: 0 -40%;
      width: 1em;
      height: 1em;
      clip-path: polygon(2px 0, 85% 50%, 2px 100%, 0 calc(100% - 2px), 50% 50%, 0 2px);
      left: 0.5em;
      rotate: 90deg;
      transition: rotate 0.2s ease;
      background: var(--apple-music-primary);
    }
  }

  .body {
    max-height: v-bind(bodyMaxHeight);
    padding: 0.5em;
    min-height: 0;
    transition: all 0.2s ease;
    overflow: auto;
    background: #575757;
    border-radius: 9px;
    border-start-start-radius: 3px;
    border-start-end-radius: 3px;
  }

  &.collapse {
    row-gap: 0;
    grid-template-rows: 30px 0fr;
    .header {
      border-end-start-radius: 9px;
      border-end-end-radius: 9px;
      &::before {
        rotate: 0deg;
      }
    }
    .body {
      z-index: -1;
      pointer-events: none;
      opacity: 0;
      margin-top: -2em;
    }
  }
}
</style>
