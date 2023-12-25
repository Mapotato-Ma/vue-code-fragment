<script setup lang="ts">
// import helloWorld from './components/hello-world.vue';
// import selectBox from './components/select-box.vue';
import xstateDemo from "./components/xstate-demo.vue";
</script>

<template>
  <!-- <hello-world msg="Vite + Vue"></hello-world>
  <select-box></select-box>
  <select-box></select-box>
  <select-box></select-box> -->
  <xstate-demo></xstate-demo>
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
