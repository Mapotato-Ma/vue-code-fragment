<script setup lang="ts">
// import useClass from './components/use-class.vue';
// import concurrentRequest from './components/concurrent-request.vue';
// import selectBox from './components/select-box.vue';
import lineGraph from './components/line-graph.vue';
</script>

<template>
  <!-- <use-class></use-class>
  <select-box></select-box>
  <select-box></select-box>
  <select-box></select-box>
  <concurrent-request></concurrent-request> -->
  <line-graph></line-graph>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
