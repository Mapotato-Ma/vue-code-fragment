<template>
  <div class="line-graph">
    <div class="select">
      <span v-for="left in selectList" :key="left" @click="selectLeft(left)" :class="{ active: left === currentLeft }">
        <span
          v-for="right in selectedList"
          :key="right"
          :style="{ rotate: getRotate(left, right), width: getWidth(left, right) }"
          :class="[getStateClass(left, right)]"
          @click.stop="disConnect(left, right)"
        ></span>
        <b>{{ left }}</b>
      </span>
    </div>
    <div class="selected">
      <span v-for="right in selectedList" :key="right" @click="selectRight(right)">
        <b>{{ right }}</b>
      </span>
    </div>
    <div class="data-show">
      <div class="data-row data-row-head">
        <div class="data-col"></div>
        <div v-for="(_, j) in map" :key="j" class="data-col">{{ j }}</div>
      </div>
      <div v-for="(row, i) in map" :key="i" class="data-row">
        <div class="data-col data-col-head">{{ i }}</div>
        <div v-for="(item, j) in row" :key="j" class="data-col">{{ item }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
const selectList = reactive([1, 2, 3, 4, 5, 6]);
const selectedList = reactive([1, 2, 3, 4, 5, 6]);
const stateClassSet = ref<Set<string>>(new Set());
const currentLeft = ref<number | undefined>(undefined);
const map = ref<string[][]>(new Array(6).fill('').map((_) => new Array(6).fill('')));

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
  map.value[currentLeft.value - 1][right - 1] = '1';
  console.log(JSON.stringify(map.value, undefined, 2));
  currentLeft.value = undefined;
}

function disConnect(left: number, right: number) {
  stateClassSet.value.delete(`${left}-${right}`);
  map.value[left - 1][right - 1] = '';
}

function getStateClass(left: number, right: number) {
  if (stateClassSet.value.has(`${left}-${right}`)) {
    return 'activated';
  } else {
    return 'inactivated';
  }
}

// 弧度转为角度
function angle(radian: number) {
  return (radian * 180) / Math.PI;
}

// 横向距离
const xDistance = 200;
const yDistance = 60;

const margin = `${xDistance - 40}px`;
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
  const deg = angle(Math.atan((abs * yDistance) / xDistance));
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

  .select,
  .selected {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    & > span {
      position: relative;
      cursor: pointer;
      width: 40px;
      height: 40px;
      background-color: #904cbc;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      border-radius: 50%;
      transition: all 0.3s;

      span {
        position: absolute;
        top: 50%;
        left: 50%;
        height: 4px;
        background-color: #904cbc;
        transform-origin: top left;
        scale: 0;
        opacity: 0;
        transition: all 0.3s;

        :hover {
          filter: brightness(1.5);
        }

        &:hover {
          filter: brightness(2);
        }

        &.activated {
          opacity: 1;
          scale: 1;
        }
      }

      b {
        position: relative;
        z-index: 1;
      }
    }

    .active {
      box-shadow: 0 0 10px 5px #904cbc;
    }
  }

  .select {
    margin-right: v-bind(margin);
  }

  .selected {
    margin-right: 60px;
  }

  .selected span:active {
    box-shadow: 0 0 10px 5px #904cbc;
  }

  .data-show {
    width: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    .data-row {
      width: 100%;
      flex: 1;
      display: flex;
      align-items: center;
      gap: 20px;

      .data-col {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        border: 1px solid #ccc;
        &-head {
          border: none;
        }
      }

      &-head {
        .data-col {
          border: none;
        }
      }
    }
  }
}
</style>
