<template>
  <div class="box">
    <div class="col-position">列/行</div>
    <div class="scroll-demo" @scroll.passive="onScroll" ref="container">
      <div class="row row-sticky">
        <div class="col col-sticky" :style="{ transform: calcTranslateX }"></div>
        <div class="col" v-for="(_, colIndex) in data" :key="colIndex">第{{ colIndex + 1 }}列</div>
      </div>
      <div class="row" v-for="(row, rowIndex) in data" :key="rowIndex">
        <div class="col col-sticky" :style="{ transform: calcTranslateX }">
          第{{ rowIndex + 1 }}行
        </div>
        <div class="col" v-for="(col, colIndex) in row" :key="colIndex">{{ col }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'scroll-demo'
});

const data = new Array(10)
  .fill(0)
  .map(() => new Array(10).fill(0).map(() => Math.floor(Math.random() * 10)));
const scrollX = ref(0);
const container = ref<HTMLElement>();
const containerScrollWidth = ref();
const criticalScrollWidth = computed(() => {
  return containerScrollWidth.value;
});
const calcTranslateX = computed(
  () =>
    `translateX(${
      criticalScrollWidth.value - scrollX.value > 0 ? 0 : scrollX.value - criticalScrollWidth.value
    }px)`
);
onMounted(() => {
  containerScrollWidth.value = container.value!.scrollWidth - container.value!.clientWidth;
});
const onScroll = (e: any) => {
  scrollX.value = e.target.scrollLeft;
};
</script>

<style lang="scss" scoped>
.box {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  color: #fff;
  background-color: var(--bg-page);
  display: flex;
  align-items: center;
  justify-content: center;
  .col-position {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    min-width: 100px;
    padding: 2em 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--bg-page);
    border: 1px solid #fff;
    background: rgba($color: #000000, $alpha: 1);
  }
  .scroll-demo {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 500px;
    gap: 10px;
    overflow: auto;

    .row {
      width: 100%;
      display: flex;
      gap: 10px;
      .col {
        min-width: 100px;
        padding: 2em 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #fff;
        &.col-sticky {
          position: sticky;
          left: 0;
          background: rgba($color: #000000, $alpha: 1);
        }
      }
      &.row-sticky {
        position: sticky;
        top: 0;
        .col {
          position: sticky;
          left: 0;
          background: rgba($color: #000000, $alpha: 1);
        }
      }
    }
  }
}
</style>
