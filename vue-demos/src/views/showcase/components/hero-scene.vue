<template>
  <div class="hero-scene">
    <TresCanvas
      :clear-color="'#06070b'"
      :alpha="true"
      :antialias="true"
      :window-size="false"
      @loop="onLoop"
    >
      <TresPerspectiveCamera :position="camPos" :fov="45" :look-at="[0, 0, 0]" />
      <TresAmbientLight :intensity="1.4" />
      <TresDirectionalLight color="#bcd6ff" :position="[4, 6, 4]" :intensity="3.2" />
      <TresPointLight color="#6ee7ff" :position="[-3, -1.5, 2.5]" :intensity="6" />
      <TresPointLight color="#a78bfa" :position="[3, -2, 1.5]" :intensity="4" />
      <primitive v-if="scene" :object="scene" />
    </TresCanvas>
    <span v-if="error" class="hero-scene__err">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas, useLoader } from '@tresjs/core';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Box3, Vector3, type Object3D } from 'three';
import { onMounted, ref, shallowRef } from 'vue';

/**
 * 首屏 3D：TresJS 5（Vue 风格的 three.js）
 * - BASE_URL 统一补结尾斜杠，避开 <base href> 的相对路径坑
 * - 加载完按包围盒自动取景，模型换尺寸也不用改代码
 * - 不加 OrbitControls：它会抢滚轮，影响整页滚动
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const MODEL = `${BASE}models/mapotato-v1.glb`;

const scene = shallowRef<Object3D>();
const camPos = ref<[number, number, number]>([0, 0, 6]);
const error = ref('');

const draco = new DRACOLoader();
draco.setDecoderPath(`${BASE}models/`);

const { state, isReady } = useLoader(GLTFLoader, MODEL, {
  extensions: loader => {
    if (loader instanceof GLTFLoader) loader.setDRACOLoader(draco);
  },
});

/** 画布一帧循环：轻微自转 */
const onLoop = () => {
  if (scene.value) scene.value.rotation.y += 0.0026;
};

onMounted(() => {
  // useLoader 是异步的，加载完再挂到场景里并调整机位
  const stop = setInterval(() => {
    if (!isReady.value) return;
    clearInterval(stop);
    const root = state.value?.scene;
    if (!root) return;
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    root.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const dist = (maxDim / 2 / Math.tan(((45 * Math.PI) / 180) / 2)) * 1.25;
    camPos.value = [0, 0, +dist.toFixed(2)];
    scene.value = root;
  }, 100);
  setTimeout(() => {
    if (!isReady.value) error.value = '3D 加载超时';
  }, 20000);
});
</script>

<style lang="scss" scoped>
.hero-scene {
  position: absolute;
  inset: 0;

  :deep(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.hero-scene__err {
  position: absolute;
  left: 16px;
  bottom: 14px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-faint);
}
</style>
