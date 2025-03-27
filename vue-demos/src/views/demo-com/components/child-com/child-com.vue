<template>
  <div>child-com</div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { useChild } from './useChild';

const props = defineProps<{
  id: number;
}>();

const { getChildId } = useChild(props);

onMounted(() => {
  getChildId();
  // setInterval(() => {
  //   console.log('🚀 ~ 子组件id ~ ', getChildId());
  // }, 2000);
});
</script>

<style lang="scss" scoped></style>
