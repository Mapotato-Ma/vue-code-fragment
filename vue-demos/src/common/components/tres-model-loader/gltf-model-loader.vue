<script setup lang="ts">
import {
  BloomPmndrs,
  EffectComposerPmndrs,
  type BloomPmndrsProps,
  type EffectComposerPmndrsProps,
} from '@tresjs/post-processing';
import { useLoader } from '@tresjs/core';
import type { Scene } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { computed, watch } from 'vue';

interface Props {
  /**
   * 模型名称，必传且组件初始化时需有，非响应式
   */
  modelName?: string;
  /**
   * 辉光（自发光）配置项
   */
  bloomOptions?: {
    showBloom: boolean;
    effectComposerProps?: EffectComposerPmndrsProps;
    bloomProps?: BloomPmndrsProps;
  };
}

const emits = defineEmits<{
  ready: [scene: Scene];
}>();

const props = withDefaults(defineProps<Props>(), {
  modelName: 'mapotato-v1.glb',
  textureOptions: () => ({}),
});
// Setup DRACO loader for compressed GLTFs
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('mapotato/models/');

const { state: model, isReady } = useLoader(GLTFLoader, `mapotato/models/${props.modelName}`, {
  extensions: loader => {
    if (loader instanceof GLTFLoader) {
      loader.setDRACOLoader(dracoLoader);
    }
  },
});

watch(
  () => isReady.value,
  ready => {
    if (!ready || !scene.value) return;
    emits('ready', scene.value as unknown as Scene);
  },
);

// Extract the scene and graph
const scene = computed(() => model.value?.scene);
</script>

<template>
  <!-- Render the Cube node if it exists -->
  <primitive v-if="scene" :object="scene" />
  <!-- 辉光混合器 -->
  <effect-composer-pmndrs
    v-if="isReady && bloomOptions?.showBloom"
    v-bind="bloomOptions.effectComposerProps"
  >
    <!-- 辉光（自发光） -->
    <bloom-pmndrs v-bind="bloomOptions.bloomProps"></bloom-pmndrs>
  </effect-composer-pmndrs>
</template>
