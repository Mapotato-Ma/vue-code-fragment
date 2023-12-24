<template>
  <div class="line-graph">
    <div class="select">
      <span v-for="left in selectList" :key="left" ref="selectDomList" @click="selectLeft(left)"
        :class="{ active: left === currentLeft }">
        {{ left }}
        <span v-for="(right) in selectedList" :key="right"
          :style="{ rotate: getRotate(left, right), width: getWidth(left, right) }"
          :class="[getStateClass(left, right)]"></span>
      </span>
    </div>
    <div class="selected">
      <span v-for="right in selectedList" :key="right" ref="selectedDomList" @click="selectRight(right)">
        {{ right }}
      </span>
    </div>
    <div class="selected">
      <i v-for="item in stateClassSet" :key="item">{{ item }}</i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const selectList = reactive([1, 2, 3, 4, 5, 6]);
const selectedList = reactive([1, 2, 3, 4, 5, 6]);
const selectDomList = ref<HTMLElement>();
const selectedDomList = ref<HTMLElement>();
const stateClassSet = ref<Set<string>>(new Set());
const currentLeft = ref<number | undefined>(undefined);

function selectLeft(num: number) {
  if (currentLeft.value === num) {
    currentLeft.value = undefined;
    return;
  }
  currentLeft.value = num;
}

function selectRight(right: number) {
  if (currentLeft.value === undefined) {
    return;
  }
  stateClassSet.value.add(`${currentLeft.value}-${right}`);
  currentLeft.value = undefined;
}

function getStateClass(left: number, right: number) {
  if (stateClassSet.value.has(`${left}-${right}`)) {
    return 'activated';
  } else {
    return 'inactivated'
  }
}

// 弧度转为角度
function angle(radian: number) {
  return radian * 180 / Math.PI;
}

// 横向距离
const xDistance = 140;
const yDistance = 60;

const gap = `${xDistance - 40}px`;
// 获取旋转角度
function getRotate(left: number, right: number) {
  let turn = 1; // 旋转方向，顺时针
  if (right - left < 0) {
    turn = -1;
  }
  if (right - left === 0) {
    turn = 0;
  }
  const abs = Math.abs(right - left);
  const deg = angle(Math.atan((abs * yDistance / xDistance)));
  return `${deg * turn}deg`;
}

// 获取宽度
function getWidth(left: number, right: number) {
  const abs = Math.abs(right - left);
  return `${Math.hypot(abs * yDistance, xDistance)}px`;
}

</script>

<style lang="less" scoped>
.line-graph {
  display: flex;
  gap: v-bind(gap);

  .select,
  .selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;


    &>span {
      position: relative;
      cursor: pointer;
      width: 40px;
      height: 40px;
      background-color: #904cbc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFF;
      border-radius: 50%;
      transition: all .3s;

      span {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: -1;
        height: 2px;
        background-color: #904cbc;
        transform-origin: top left;
        scale: 0;
        opacity: 0;
        transition: all 0.3s;

        :hover {
          filter: brightness(1.5);
        }

        &.activated {
          opacity: 1;
          scale: 1;
        }
      }
    }

    .active {
      box-shadow: 0 0 10px 5px #904cbc;
    }
  }

  .selected span:active {
    box-shadow: 0 0 10px 5px #904cbc;
  }
}
</style>