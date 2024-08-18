<template>
  <div class="codepen-notes">
    <fieldset
      class="cn-x scale-in-out"
      :style="{ gridColumn: `span ${size.w}`, gridRow: `span ${size.h}` }"
      v-for="({ penId, name, size }, index) in components"
      :key="penId"
    >
      <legend>{{ name }}</legend>
      <Codepen
        :penId="penId"
        default-tab="result"
        :zoom="size.zoom"
        :loading-delay="index + 1"
      ></Codepen>
    </fieldset>
  </div>
</template>

<script lang="ts" setup>
import { Codepen } from '@/common/components';
import { useComponentsData } from './hooks/useComponentsData';

const { components } = useComponentsData();
</script>

<style lang="scss" scoped>
.codepen-notes {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(5, minmax(100px, 1fr));
  gap: 2em;
  .cn-x {
    width: 100%;
    height: 100%;
    border: 1px solid var(--color-border);
    padding: 10px;
    background: #000;
    align-content: center;
    overflow: hidden;
  }
}
</style>
