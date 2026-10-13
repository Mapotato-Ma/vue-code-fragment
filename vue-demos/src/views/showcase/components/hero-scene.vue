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
  type Material,
  type MeshStandardMaterial,
  type Object3D,
} from 'three';
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';

/**
 * 首屏 3D：TresJS 5
 * - 主模型 mapotato-v1.glb，加载完按包围盒自动取景
 * - 装饰全程序化生成（星尘贴图也是运行时画的），不引入任何额外文件
 * - 交互：OrbitControls 只开「拖动旋转」，关掉缩放/平移 —— 否则满屏场景会抢走滚轮
 * - 微动画：入场回弹 + 呼吸浮动 + 轻微摇摆 + 鼠标视差 + 滚动联动 + 材质呼吸发光
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

/* ---------------- 微动画状态 ---------------- */
const startedAt = performance.now();
let lastFrameAt = startedAt;
// 用对象持有：TS 不跟踪回调里的赋值，写成 let 会被收窄成 never
const model = { node: null as Object3D | null, baseY: 0, enterAt: 0 };

/** 阻尼跟随的鼠标位置，取值 -1..1 */
const pointer = { x: 0, y: 0 };
const smooth = { x: 0, y: 0 };

/** 需要做呼吸发光的材质 */
const glowMaterials: MeshStandardMaterial[] = [];

const easeOutBack = (p: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
};

const onPointerMove = (e: PointerEvent) => {
  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
};

/* ---------------- 模型加载 ---------------- */
const draco = new DRACOLoader();
draco.setDecoderPath(`${BASE}models/`);

const { state, isReady } = useLoader(GLTFLoader, MODEL, {
  extensions: loader => {
    if (loader instanceof GLTFLoader) loader.setDRACOLoader(draco);
  },
});

/* ---------------- 每帧动画 ---------------- */
const onLoop = () => {
  const now = performance.now();
  const dt = Math.min((now - lastFrameAt) / 1000, 0.05);
  lastFrameAt = now;
  const time = (now - startedAt) / 1000;

  // 装饰层：匀速自转（用 dt 保证不同帧率下速度一致）
  stars.rotation.y += dt * 0.045;
  ringA.rotation.z += dt * 0.1;
  ringB.rotation.z -= dt * 0.07;
  shell.rotation.y -= dt * 0.022;

  // 鼠标阻尼跟随
  const k = Math.min(1, dt * 3.2);
  smooth.x += (pointer.x - smooth.x) * k;
  smooth.y += (pointer.y - smooth.y) * k;

  const wordmark = model.node;
  if (!wordmark) return;

  const scrollP = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
  const enterP = Math.min(1, Math.max(0, (now - model.enterAt) / 900));
  const enter = easeOutBack(enterP);

  // 自转：平时很慢，往下滚的时候加速转走
  wordmark.rotation.y += dt * (0.16 + scrollP * 0.55);
  // 低频摇摆 + 朝鼠标方向轻微倾斜
  wordmark.rotation.x = Math.sin(time * 0.55) * 0.045 + smooth.y * 0.14;
  wordmark.rotation.z = Math.cos(time * 0.42) * 0.03 - smooth.x * 0.045;
  // 左右跟随鼠标 + 上下呼吸 + 滚动时上移
  wordmark.position.x = smooth.x * 0.2;
  wordmark.position.y = model.baseY + Math.sin(time * 1.05) * 0.055 + scrollP * 0.85;

  const breath = 1 + Math.sin(time * 0.85) * 0.012;
  const s = enter * breath * (1 - scrollP * 0.2);
  if (Number.isFinite(s) && s > 0.001) wordmark.scale.setScalar(s);

  // 材质呼吸发光
  const intensity = 0.08 + (Math.sin(time * 1.5) * 0.5 + 0.5) * 0.3;
  for (const mat of glowMaterials) mat.emissiveIntensity = intensity;
};

onMounted(() => {
  window.addEventListener('pointermove', onPointerMove, { passive: true });

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
    // 按竖直视角算距离；1.02 让它几乎顶满画面
    const dist = (maxDim / 2 / Math.tan(((45 * Math.PI) / 180) / 2)) * 1.02;
    camPos.value = [0, 0, +dist.toFixed(2)];

    // 收集可发光的材质：把自身颜色当作自发光色，才能「亮起来」而不是整片糊白
    root.traverse(obj => {
      const mesh = obj as Mesh;
      if (!mesh.isMesh) return;
      const mats: Material[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) {
        const std = mat as MeshStandardMaterial;
        if (std && (std as { emissive?: unknown }).emissive) {
          std.emissive = std.color.clone();
          std.emissiveIntensity = 0.1;
          glowMaterials.push(std);
        }
      }
    });

    model.baseY = root.position.y;
    model.node = root;
    model.enterAt = performance.now();
    scene.value = root;
  }, 100);

  setTimeout(() => {
    if (!isReady.value) error.value = '3D 加载超时';
  }, 20000);
});

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove);
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
