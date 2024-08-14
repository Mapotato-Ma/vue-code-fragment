<template>
  <div class="collapse-panel" :class="{ collapse }">
    <div class="header" @click="collapse = !collapse">
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
  padding: 0.5em;
  overflow: hidden;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  .header {
    position: relative;
    align-content: center;
    padding: 0 0.5em 0 2em;
    cursor: pointer;
    transition: background-color 0.2s ease;
    background-color: #006aff60;
    &:hover {
      background-color: #006affca;
    }

    &::before {
      font-family: cursive;
      content: '';
      position: absolute;
      top: 50%;
      translate: 0 -50%;
      width: 1em;
      height: 1em;
      clip-path: polygon(2px 0, 85% 50%, 2px 100%, 0 calc(100% - 2px), 50% 50%, 0 2px);
      left: 0.5em;
      rotate: 90deg;
      transition: rotate 0.2s ease;
      background: #fff;
    }
  }

  .body {
    max-height: v-bind(bodyMaxHeight);
    padding: 0.5em;
    min-height: 0;
    border-top: 1px solid var(--color-border);
    transition: all 0.2s ease;
    box-shadow: inset 20px 0 50px -10px rgb(34, 54, 238);
  }

  &.collapse {
    grid-template-rows: 30px 0fr;
    .header {
      &::before {
        rotate: 0deg;
      }
    }
    .body {
      opacity: 0;
      margin-top: -1em;
    }
  }
}
</style>
