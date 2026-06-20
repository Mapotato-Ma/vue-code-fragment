<template>
  <TresCanvas v-bind="gl" @loop="handleLoop">
    <!-- 摄像机 -->
    <TresPerspectiveCamera :position="[0, 0, 3]" :look-at="[0, 2, 1]" />
    <!-- 控制器 -->
    <orbit-controls />
    <!-- 模型加载 组件 -->
    <gltf-model-loader
      :model-name="modelName"
      :texture-options="textureOptions"
      :bloom-options="bloomOptions"
      @ready="handleModelReady"
    />
    <!-- 灯光 -->
    <TresDirectionalLight color="#a5a5a5" :position="[10, 10, 3]" :intensity="5" />
    <!-- 环境光 -->
    <TresAmbientLight :intensity="2" />
  </TresCanvas>
</template>

<script lang="ts" setup>
import { TresCanvas } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { BasicShadowMap, LinearToneMapping, SRGBColorSpace, type Scene } from 'three';
import GltfModelLoader from './gltf-model-loader.vue';
import { shallowRef } from 'vue';
import type { BloomPmndrsProps, EffectComposerPmndrsProps } from '@tresjs/post-processing';
/**
 * 模型纹理配置项详见：
 * https://docs.tresjs.org/zh/api/composables.html#use-texture
 */
type TextureOptionsType = {
  [key in
    | 'map'
    | 'displacementMap'
    | 'roughnessMap'
    | 'normalMap'
    | 'aoMap'
    | 'metalnessMap'
    | 'matcap'
    | 'alphaMap']: string;
};
interface Props {
  /**
   * 模型名称，必传且组件初始化时需有，非响应式
   */
  modelName?: string;
  /**
   * 模型纹理
   */
  textureOptions?: Partial<TextureOptionsType>;
  /**
   * 辉光（自发光）配置项
   */
  bloomOptions?: {
    showBloom: boolean;
    effectComposerProps?: EffectComposerPmndrsProps;
    bloomProps?: BloomPmndrsProps;
  };
  /**
   * 场景渲染循环回调，避免做太多事情，影响渲染性能
   */
  loopCallback?: (model: Scene) => void;
  /**
   * 模型加载完成回调
   */
  loadCallback?: (model: Scene) => void;
}

const loadedModel = shallowRef<Scene>();

const props = withDefaults(defineProps<Props>(), {
  modelName: 'mapotato-v1.glb',
  textureOptions: () => ({}),
});

const handleModelReady = (model: Scene) => {
  loadedModel.value = model;
  props.loadCallback?.(model);
};

const handleLoop = () => {
  if (!loadedModel.value) return;
  props.loopCallback?.(loadedModel.value);
};

// const onClick = (e: any) => {
//   console.log('click', e);
// };

const gl = {
  clearColor: '#1a1a1a',
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: LinearToneMapping,
  windowSize: false,
};
</script>

<style lang="scss" scoped>
body {
  color: #a5a5a5;
}
</style>
