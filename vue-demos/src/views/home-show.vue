<template>
  <div class="home-show">
    <suspense>
      <template #default>
        <model-loader :loop-callback="modelInitAnimate" :load-callback="onModelLoaded" />
      </template>
    </suspense>
    <div class="hs-text" :class="{ 'is-ready': isTextReady }">WELCOME</div>
  </div>
</template>

<script setup lang="ts">
import { TresModelLoader as ModelLoader } from '@/common/components';
import { useModelUtil } from '@/common/hooks/useModelUtil';
import type { Scene } from 'three';
import { ref } from 'vue';

const isTextReady = ref(false);

/** 模型加载完成后触发 WELCOME 文字位移动画（略等入场 skew 结束，避免两段动画打架） */
const onModelLoaded = () => {
  window.setTimeout(() => {
    isTextReady.value = true;
  }, 220);
};

const { loopScaleList, loopScaleIndex } = useModelUtil();

const modelInitAnimate = (model: Scene) => {
  loopScaleIndex.value = (loopScaleIndex.value + 1) % loopScaleList.length;
  const scaleQuanta = loopScaleList[loopScaleIndex.value];
  model.scale.set(scaleQuanta, 1, 1);
};
</script>

<style lang="scss" scoped>
.home-show {
  width: 100%;
  height: 100%;
  position: relative;
  container-type: size;

  .hs-iframe {
    width: 100%;
    height: 100%;
  }

  .hs-text {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 200px;
    font-weight: lighter;
    transform-origin: 100% 100%;
    /* 锚定在右下角，用 transform 拉到视觉中心 */
    transform: translate(calc(-50cqw + 50%), calc(-50cqh + 50%)) scale(1) skew(0deg, 0deg);
    opacity: 1;
    transition:
      transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1) 0.08s,
      color 0.85s cubic-bezier(0.22, 1, 0.36, 1);
    user-select: none;
    color: var(--apple-music-primary);

    @starting-style {
      transform: translate(calc(-50cqw + 50%), calc(-50cqh + 50%)) scale(1) skew(-45deg, 0deg);
    }

    &.is-ready {
      transform: translate(-2.5vw, 0) scale(0.5) skew(0deg, 0deg);
      opacity: 1;
      color: #fff;
    }

    &::after {
      position: absolute;
      content: '';
      background-color: var(--bg-page);
      inset: 1em;
      transition: inset 0.65s cubic-bezier(0.22, 1, 0.36, 1);

      @starting-style {
        inset: 0 0;
      }
    }
  }
}
</style>
