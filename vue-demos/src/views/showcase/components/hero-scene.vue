<template>
  <div ref="hostEl" class="hero-scene">
    <span class="hero-scene__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  PointLight,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * 首屏 3D：原生 three.js 自己管渲染循环（TresJS 的循环在这个环境里不启动）。
 * - BASE_URL 拼绝对路径，避开 <base href> 的相对路径坑
 * - 自动取景：按模型包围盒算镜头距离
 * - 窗口尺寸用 ResizeObserver 跟，不用 window 监听
 */
const BASE = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;
const MODEL = `${BASE}models/mapotato-v1.glb`;

const hostEl = ref<HTMLElement>();
const hint = ref('LOADING MODEL…');

let renderer: WebGLRenderer | undefined;
let raf = 0;
let root: Group | undefined;
let observer: ResizeObserver | undefined;

const onResize = () => {
  const el = hostEl.value;
  if (!el || !renderer) return;
  const w = el.clientWidth;
  const h = el.clientHeight;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  camera.aspect = w / Math.max(h, 1);
  camera.updateProjectionMatrix();
};

const camera = new PerspectiveCamera(45, 1, 0.1, 200);
const scene = new Scene();

onMounted(async () => {
  const el = hostEl.value;
  if (!el) return;

  renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  el.appendChild(renderer.domElement);
  onResize();

  scene.add(new AmbientLight(0xffffff, 1.4));
  const key = new DirectionalLight(0xbcd6ff, 3);
  key.position.set(4, 6, 4);
  scene.add(key);
  const cyan = new PointLight(0x6ee7ff, 12, 30);
  cyan.position.set(-3, -1.5, 2.5);
  scene.add(cyan);
  const violet = new PointLight(0xa78bfa, 9, 30);
  violet.position.set(3, -2, 1.5);
  scene.add(violet);

  const draco = new DRACOLoader();
  draco.setDecoderPath(`${BASE}models/`);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  try {
    const gltf = await loader.loadAsync(MODEL);
    const loaded = gltf.scene;

    // 自动取景：按包围盒算镜头距离，模型多大都不用改代码
    const box = new Box3().setFromObject(loaded);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    loaded.position.sub(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const dist = (maxDim / 2 / Math.tan(((camera.fov * Math.PI) / 180) / 2)) * 1.25;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    scene.add(loaded);
    root = loaded;
    hint.value = '';
    // 立刻画一帧：页面在后台时 rAF 会被节流，不补这一帧就会一直空着
    renderer.render(scene, camera);
  } catch (err) {
    hint.value = `ERR: ${String((err as Error)?.message || err).slice(0, 140)}`;
    console.error('[hero-scene] 模型加载失败', err);
  }

  observer = new ResizeObserver(onResize);
  observer.observe(el);

  const tick = () => {
    if (root) root.rotation.y += 0.0026;
    renderer?.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  tick();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  observer?.disconnect();
  renderer?.dispose();
  renderer?.domElement.remove();
  renderer = undefined;
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

.hero-scene__hint {
  position: absolute;
  left: 16px;
  bottom: 14px;
  max-width: 92%;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-faint);
}
</style>
