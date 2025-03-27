<template>
  <div class="demo-com">
    <child-com :id />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ChildCom } from './components';

const id = ref(1);
// setInterval(() => {
//   id.value++;
//   id.value++;
// }, 2000);
</script>

<style lang="scss" scoped></style>
