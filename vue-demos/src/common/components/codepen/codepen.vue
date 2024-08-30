<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="codepen">
    <iframe
      :height="height"
      :width="width"
      :min-height="300"
      scrolling="no"
      :src="src"
      frameborder="no"
      loading="lazy"
      allowtransparency="true"
      allowfullscreen="true"
      @load="loading = false"
      v-if="startLoad"
    >
      See the
      <a :href="`https://codepen.io/mapotato-ma/pen/${penId}`">Pen</a>
      by Mapotato-Ma (
      <a href="https://codepen.io/mapotato-ma">@mapotato-ma</a>
      ) on
      <a href="https://codepen.io">CodePen</a>
      .
    </iframe>
    <div class="loading" v-if="loading"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  penId: {
    type: String,
    default: ''
  },
  defaultTab: {
    type: String,
    default: 'html,result'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  zoom: {
    type: Number,
    default: 1
  },
  loadingDelay: {
    type: Number,
    default: 1
  }
});

const src = ref();
const startLoad = ref(false);
const loading = ref(true);

onMounted(() => {
  setTimeout(() => {
    loadPen();
  }, props.loadingDelay * 1000);
});
const loadPen = () => {
  const params = new URLSearchParams({
    defaultTab: props.defaultTab,
    height: props.height,
    preview: 'true',
    user: 'mapotato-ma',
    zoom: props.zoom.toString()
  });
  src.value = `https://codepen.io/mapotato-ma/embed/${props.penId}?${params.toString()}`;
  startLoad.value = true;
};
</script>

<style scoped>
.codepen {
  position: relative;
  height: 100%;
  iframe {
    height: 100%;
  }
  .loading:empty::after {
    position: absolute;
    content: '加载中...';
    inset: 0;
    display: flex;
    align-items: center;
    place-content: center;
    background-color: rgb(97, 83, 83);
    color: #fff;
    font-size: 1.5em;
    font-weight: bold;
    z-index: 9999;
    opacity: 0.5;
    transition: opacity 0.5s;
    animation: loadingContent 1s steps(3) infinite;
  }
}
</style>
