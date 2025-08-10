<template>
  <div class="earth-model">
    <Suspense>
      <template #default>
        <tres-model-loader
          :loop-callback="modelLoopAnimate"
          :load-callback="modelLoadCallback"
          model-name="earth.gltf"
          :bloom-options="{ showBloom: true, bloomProps: { intensity: 4 } }"
        ></tres-model-loader>
      </template>
      <template #fallback>
        <span class="em-loading">Loading</span>
      </template>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
import { TresModelLoader } from '@/common/components';
import { useModelUtil } from '@/common/hooks/useModelUtil';
import type { Scene } from 'three';

const { rotateList, rotateIndex } = useModelUtil();

const modelLoopAnimate = (model: Scene) => {
  rotateIndex.value = (rotateIndex.value + 1) % rotateList.length;
  const scaleQuanta = rotateList[rotateIndex.value];
  model.rotation.set(-0.25 * Math.PI, scaleQuanta, -0.25 * Math.PI);
};

const modelLoadCallback = (model: Scene) => {
  model.scale.set(0.8, 0.8, 0.8);
};
</script>

<style lang="scss" scoped>
.earth-model {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  .em-loading {
    font-size: 5vw;
    font-weight: bolder;
    width: 25vw;
    &::after {
      content: '';
      animation: loadingContentDot 1s steps(3) infinite;
    }
  }
}
</style>
