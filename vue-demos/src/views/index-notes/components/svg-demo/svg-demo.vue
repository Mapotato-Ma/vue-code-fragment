<template>
  <svg class="svg-demo">
    <path
      v-for="{ id, pointOfTangences: { A, B, C, D, E, F, G, H }, radius, fill } in trapezoids"
      :key="id"
      :d="`
      M ${A.x} ${A.y} 
      L ${B.x} ${B.y}
      A ${radius} ${radius} 0 0 1 ${C.x} ${C.y}
      L ${D.x} ${D.y} 
      A ${radius} ${radius} 0 0 1 ${E.x} ${E.y}
      L ${F.x} ${F.y} 
      A ${radius} ${radius} 0 0 1 ${G.x} ${G.y}
      L ${H.x} ${H.y} 
      A ${radius} ${radius} 0 0 1 ${A.x} ${A.y}
      z`"
      :fill="fill"
      @click="showTips(radius)"
    ></path>
  </svg>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { generateRightTrapezoid, type IShape } from './use-right-trapezoid';
import { message } from '@/common/plugins/message';

const trapezoids = ref<Array<IShape>>([]);
onMounted(() => {
  for (let i = -5; i < 30; i++) {
    for (let j = -5; j < 15; j++) {
      trapezoids.value.push(generateRightTrapezoid(i * 100, j * 100));
    }
  }
});

const showTips = (radius: number) => {
  if (radius === 0) {
    message.message('这是一个没有圆角的直角梯形');
    return;
  }
  message.message(`这是一个圆角弧度为${radius}px的直角梯形`);
};
</script>

<style lang="scss" scoped>
.svg-demo {
  width: 100%;
  height: 100%;
  aspect-ratio: 2/1;
  path {
    cursor: pointer;
    transition: all 233ms;
    &:hover {
      filter: hue-rotate(90deg);
    }
  }
}
</style>
