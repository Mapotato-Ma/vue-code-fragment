<template>
  <div class="collapse-panel" :class="{ collapse }">
    <div class="header" @click="collapse = !collapse">
      <slot name="header"></slot>
    </div>
    <div class="body">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const collapse = ref(false);
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
    align-content: center;
    padding: 0 0.5em;
    cursor: pointer;
    transition: background-color 0.2s ease;
    &:hover {
      background-color: #006affca;
    }
  }

  .body {
    align-content: center;
    padding: 0 0 0.5em 0.5em;
    min-height: 0;
    border-top: 1px solid var(--color-border);
    transition: all 0.2s ease;
    box-shadow: inset 20px 0 50px -10px rgb(34, 54, 238);
  }

  &.collapse {
    grid-template-rows: 30px 0fr;
    .body {
      opacity: 0;
      margin-top: -0.5em;
    }
  }
}
</style>
