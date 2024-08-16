<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <iframe
    :height="height"
    :min-height="300"
    :width="width"
    scrolling="no"
    :src="src"
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
    class="codepen"
    v-if="src"
  >
    See the
    <a :href="`https://codepen.io/mapotato-ma/pen/${penId}`">Pen</a>
    by Mapotato-Ma (
    <a href="https://codepen.io/mapotato-ma">@mapotato-ma</a>
    ) on
    <a href="https://codepen.io">CodePen</a>
    .
  </iframe>
  <button block v-else @click="loadPen">点击加载</button>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

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
  }
});

const src = ref();
const loadPen = () => {
  const params = new URLSearchParams({
    defaultTab: props.defaultTab,
    height: props.height,
    preview: 'true',
    user: 'mapotato-ma',
    zoom: props.zoom.toString()
  });
  src.value = `https://codepen.io/mapotato-ma/embed/${props.penId}?${params.toString()}`;
};
</script>

<style scoped>
.codepen {
  min-height: 300px;
}
button{
  margin: auto;
}
</style>
