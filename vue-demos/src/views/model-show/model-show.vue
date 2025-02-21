<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera :position="[0, 0, 3]" :look-at="[0, 2, 1]" />
    <OrbitControls />
    <Suspense>
      <primitive :position="[0, 0, 0]" :object="model" />
    </Suspense>
    <TresDirectionalLight color="#a5a5a5" :position="[10, 10, 3]" :intensity="5" />
    <TresAmbientLight :intensity="2" />
  </TresCanvas>
</template>

<script lang="ts" setup>
import { TresCanvas, useRenderLoop } from '@tresjs/core';
import { OrbitControls, useGLTF } from '@tresjs/cientos';
import { BasicShadowMap, SRGBColorSpace, LinearToneMapping } from 'three';
import { ref } from 'vue';
import Big from 'big.js';

const { scene: model } = await useGLTF('mapotato/models/mapotato-v1.glb', {
  draco: true,
  decoderPath: 'mapotato/models/'
});

const { onLoop } = useRenderLoop();

const createRotateList = (count: number, start: number, end: number): number[] => {
  const interval = new Big(end).minus(start).div(count);
  const forward = Array(count)
    .fill(0)
    .map((_, i) => new Big(start).plus(new Big(interval).times(i)).toNumber());

  const backward = forward.slice().reverse();

  return [...forward, ...backward];
};

const loopScaleList = createRotateList(300, 0.75, 1);
// const loopRotateList = createRotateList(500, -0.6, 0.6);

const loopIndex = ref(0);

onLoop(() => {
  loopIndex.value = (loopIndex.value + 1) % loopScaleList.length;
  const scaleQuanta = loopScaleList[loopIndex.value];
  model.scale.set(scaleQuanta, 1, 1);
  // const rotateQuanta = loopRotateList[loopIndex.value];
  // model.rotation.set(0, rotateQuanta, 0);
});

const gl = {
  clearColor: '#292929',
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: LinearToneMapping,
  windowSize: true
};
</script>

<style lang="scss" scoped>
body {
  color: #a5a5a5;
}
</style>
