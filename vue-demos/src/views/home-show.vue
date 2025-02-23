<template>
  <div class="home-show">
    <Suspense @resolve="onResolve">
      <template #default>
        <ModelShow />
      </template>
    </Suspense>
    <div class="hs-text" ref="welcomeRef">WELCOME</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModelShow from './model-show/model-show.vue';

const welcomeRef = ref<HTMLElement>();

const onResolve = () => {
  const propertyValue = [
    ['transform', 'skew(0deg, 0deg)'],
    ['translate', 'unset'],
    ['top', 'unset'],
    ['bottom', '0'],
    ['left', 'unset'],
    ['right', '0'],
    ['scale', '0.5'],
    ['opacity', '0.7']
  ];
  propertyValue.forEach(([property, value]) => {
    welcomeRef.value?.style.setProperty(property, value);
  });
};
</script>

<style lang="scss" scoped>
.home-show {
  width: 100%;
  height: 100%;
  position: relative;
  .hs-iframe {
    width: 100%;
    height: 100%;
  }

  .hs-text {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    font-size: 200px;
    font-weight: lighter;
    transform: skew(0deg, 0deg);
    transition: all 0.5s;
    user-select: none;
    color: var(--apple-music-primary);
    @starting-style {
      transform: skew(-45deg, 0deg);
    }

    &::after {
      position: absolute;
      content: '';
      background-color: var(--bg-page);
      inset: 1em;
      transition: inset 0.5s;

      @starting-style {
        inset: 0 0;
      }
    }
  }
}
</style>
