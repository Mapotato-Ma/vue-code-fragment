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
      <OrbitControls
        :enable-zoom="false"
        :enable-pan="false"
        :enable-damping="true"
        :rotate-speed="0.55"
        :min-polar-angle="0.35"
        :max-polar-angle="2.8"
      />

      <TresAmbientLight :intensity="1.4" />
      <TresDirectionalLight color="#bcd6ff" :position="[4, 6, 4]" :intensity="3.2" />
      <TresPointLight color="#6ee7ff" :position="[-3, -1.5, 2.5]" :intensity="6" />
      <TresPointLight color="#a78bfa" :position="[3, -2, 1.5]" :intensity="4" />

      <!-- 装饰层：圆形星尘 + 两道细环 + 远处线框球 -->
      <primitive :object="decor" />
      <primitive v-if="scene" :object="scene" />
    </TresCanvas>
    <span v-if="error" class="hero-scene__err">{{ error }}</span>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas, useLoader } from '@tresjs/core';
import { OrbitControls } from '@tresjs/cientos';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import {
  AdditiveBlending,
  BackSide,
  Box3,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  Points,
  PointsMaterial,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  Vector3,
  type Object3D,
} from 'three';
import { onMounted, ref, shallowRef } from 'vue';

/**
 * 首屏 3D：TresJS 5
 * - 主模型 mapotato-v1.glb，加载完按包围盒自动取景
 * - 装饰全程序化生成（星尘贴图也是运行时画的），不引入任何额外文件
 * - 交互：OrbitControls 只开「拖动旋转」，关掉缩放/平移 —— 否则满屏场景会抢走滚轮
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const MODEL = `${BASE}models/mapotato-v1.glb`;

const scene = shallowRef<Object3D>();
const camPos = ref<[number, number, number]>([0, 0, 6]);
const error = ref('');

/* ---------------- 星尘：运行时画一张圆形光点贴图 ---------------- */
const makeDotTexture = () => {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.28, 'rgba(196,228,255,0.9)');
    g.addColorStop(0.65, 'rgba(140,200,255,0.28)');
    g.addColorStop(1, 'rgba(120,180,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
};

const STAR_COUNT = 760;
const starPositions = new Float32Array(STAR_COUNT * 3);
for (let i = 0; i < STAR_COUNT; i++) {
  const r = 5 + Math.random() * 11;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55;
  starPositions[i * 3 + 2] = r * Math.cos(phi) * 0.6 - 2;
}
const starGeo = new BufferGeometry();
starGeo.setAttribute('position', new Float32BufferAttribute(starPositions, 3));
const stars = new Points(
  starGeo,
  new PointsMaterial({
    map: makeDotTexture(),
    size: 0.16,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
    blending: AdditiveBlending,
    depthWrite: false,
  }),
);

/* ---------------- 两道细环 ---------------- */
const ringA = new Mesh(
  new TorusGeometry(3.05, 0.007, 8, 240),
  new MeshBasicMaterial({ color: new Color('#6ee7ff'), transparent: true, opacity: 0.26 }),
);
ringA.rotation.set(Math.PI / 2.35, 0, 0.2);
const ringB = new Mesh(
  new TorusGeometry(3.7, 0.005, 8, 260),
  new MeshBasicMaterial({ color: new Color('#a78bfa'), transparent: true, opacity: 0.2 }),
);
ringB.rotation.set(-Math.PI / 3.1, 0.45, 0);

/* ---------------- 远处线框球 ---------------- */
const shell = new Mesh(
  new SphereGeometry(6.6, 20, 14),
  new MeshBasicMaterial({
    color: new Color('#38506b'),
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    side: BackSide,
  }),
);

const decor = new Group();
decor.add(stars, ringA, ringB, shell);

/* ---------------- 模型加载 ---------------- */
const draco = new DRACOLoader();
draco.setDecoderPath(`${BASE}models/`);

const { state, isReady } = useLoader(GLTFLoader, MODEL, {
  extensions: loader => {
    if (loader instanceof GLTFLoader) loader.setDRACOLoader(draco);
  },
});

const onLoop = () => {
  stars.rotation.y += 0.0007;
  ringA.rotation.z += 0.0016;
  ringB.rotation.z -= 0.0011;
  shell.rotation.y -= 0.0004;
};

onMounted(() => {
  const timer = setInterval(() => {
    if (!isReady.value) return;
    clearInterval(timer);
    const root = state.value?.scene;
    if (!root) return;
    const box = new Box3().setFromObject(root);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    root.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    // 按竖直视角算距离；1.05 让它几乎顶满画面
    const dist = (maxDim / 2 / Math.tan(((45 * Math.PI) / 180) / 2)) * 1.05;
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
