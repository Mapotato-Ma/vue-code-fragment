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
    position: relative;
    align-content: center;
    padding: 0 0.5em 0 2em;
    cursor: pointer;
    transition: background-color 0.2s ease;
    background-color: #006aff60;
    &:hover {
      background-color: #006affca;
    }

    &::after {
      font-family: cursive;
      content: '>';
      position: absolute;
      top: 50%;
      translate: 0 -50%;
      left: 0.5em;
      rotate: 90deg;
      transition: rotate 0.2s ease;
    }
  }

  .body {
    align-content: center;
    padding: 0.5em;
    min-height: 0;
    border-top: 1px solid var(--color-border);
    transition: all 0.2s ease;
    box-shadow: inset 20px 0 50px -10px rgb(34, 54, 238);
  }

  &.collapse {
    grid-template-rows: 30px 0fr;
    .header {
      &::after {
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
