<template>
  <div class="main">
    <div class="m-select" v-for="item in 5" :key="item">
      <span>{{ selected }}</span>
      <div class="m-overlay" ref="overlay" @mouseover.stop>
        <TransitionGroup name="fade">
          <span
            v-for="(item, index) in currentList"
            :key="item"
            @click="selectItem(item, index)"
            :class="{ active: index === 2 }"
          >
            {{ item }}
          </span>
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fromEvent } from 'rxjs';
import { computed, onMounted, ref } from 'vue';

defineOptions({ name: 'select-box' });

const overlay = ref<HTMLElement>();
const currentList = ref(['苹果', '香蕉', '橘子', '橙子', '甘蔗', '凑数的']);
const selected = computed(() => currentList.value[2]);
onMounted(() => {
  fromEvent<WheelEvent>(overlay.value!, 'wheel').subscribe((e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      currentList.value.unshift(currentList.value.pop()!);
    } else {
      currentList.value.push(currentList.value.shift()!);
    }
  });
});

const selectItem = (item: string, index: number) => {
  const move = () => {
    if (currentList.value.findIndex((value) => value === item) === 2) return;
    if (index < 2) {
      currentList.value.unshift(currentList.value.pop()!);
    } else {
      currentList.value.push(currentList.value.shift()!);
    }
    move();
  };
  move();
};
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1em;
  width: 100%;
  color: #fff;
  user-select: none;

  .m-select {
    position: relative;
    width: 100px;
    height: 40px;
    background-color: var(--color-brand-fill);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    .m-overlay {
      opacity: 0;
      perspective: 200px;
      transform-style: preserve-3d;
      position: absolute;
      width: 100%;
      height: 240px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      top: 50%;
      transform: translateY(-50%);
      overflow: hidden;
      transition:
        transform 0.3s ease-in-out,
        opacity 0.2s ease-in-out;
      backdrop-filter: blur(10px);

      /* 1. 声明过渡效果 */
      .fade-move,
      .fade-enter-active,
      .fade-leave-active {
        z-index: -1;
        transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
      }

      /* 2. 声明进入和离开的状态 */
      .fade-enter-from,
      .fade-leave-to {
        opacity: 0;
        transform: scaleY(0.01) translate(30px, 0);
      }

      /* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
      .fade-leave-active {
        position: absolute;
      }

      span {
        user-select: none;
        cursor: pointer;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 40px;
        background-color: var(--color-brand-fill);
        border-radius: 12px;
        transition: box-shadow 0.2s ease-in-out;
        &:active {
          box-shadow: 0 0 10px 1px rgba(255, 255, 255, 0.5);
        }
      }

      .active {
        background-color: var(--color-brand-fill);
      }
    }
    &:hover {
      .m-overlay {
        opacity: 1;
      }
    }
  }
}
</style>
