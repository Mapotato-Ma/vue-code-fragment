<template>
  <div class="lovely-snake" ref="layoutRef" tabindex="0">
    <fieldset class="info">
      <legend>贪吃蛇</legend>
      <div>
        按
        <kbd>Space</kbd>
        开始，按
        <kbd>R</kbd>
        重玩
      </div>
      <label>当前得分：</label>
      <Transition name="slide-up">
        <div class="score" :key="snakeLength">{{ snakeLength }}</div>
      </Transition>
    </fieldset>
    <div v-for="(row, i) in grids" :key="i" class="row">
      <div
        v-for="(_, j) in row"
        :key="j"
        class="col"
        :class="{
          isBody: snakeJSON.includes(`[${[i, j]}]`),
          gameOver,
          isReward: `${currentRewardJSON}`.includes(`[${i},${j}]`),
          isWall: i === 0 || i === grids.length - 1 || j === 0 || j === row.length - 1
        }"
        :title="`${i},${j}`"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useGrids } from './hooks/useGrids';
import { useGame } from './hooks/useGame';
const { grids } = useGrids();
const { currentRewardJSON, snakeJSON, snakeLength, gameOver, registerEvent } = useGame();
const layoutRef = ref<HTMLElement>();
onMounted(() => {
  registerEvent(layoutRef.value!);
});
</script>

<style lang="scss" scoped>
.lovely-snake {
  display: flex;
  flex-direction: column;
  padding: 0.3em;
  width: 100%;
  background-color: var(--color-brand-bg-light);
  .info {
    display: flex;
    align-items: center;
    gap: 1em;
    .slide-up-enter-active,
    .slide-up-leave-active {
      transition: all 0.25s ease-out;
    }

    .slide-up-enter-from {
      opacity: 0;
    }

    .slide-up-leave-to {
      opacity: 0;
    }
    .score {
      color: rgb(171, 118, 221);
      scale: 1.5;
      font-size: larger;
      font-style: italic;
      font-weight: bolder;
    }
  }
  .row {
    display: flex;
    flex: 1;
    border: 0.5px dotted var(--color-border-light);
    border-left: none;
    border-right: none;
    .col {
      flex: 1;
      aspect-ratio: 1 / 1;
      border: 0.5px dotted var(--color-border-light);
      border-top: none;
      border-bottom: none;
      --snake-body-color: rgba(5, 159, 5, 0.43);
      &.isBody {
        background-color: var(--snake-body-color);
        &.gameOver {
          animation: gameOver 320ms linear infinite;
        }
      }
      &.isReward {
        background-color: aliceblue;
        border-radius: 100%;
        animation: reward 500ms infinite;
        box-shadow: 0 0 3px 2px rgba(255, 255, 255, 0.5);
      }
      &.isWall {
        background-color: rgb(180, 82, 82);
      }
    }
  }
}

@keyframes gameOver {
  to {
    background-color: rgba(240, 38, 7, 0.756);
  }
}
@keyframes reward {
  0% {
    background-color: rgba(255, 255, 255, 0);
  }
  50% {
    background-color: rgba(255, 255, 255, 0);
  }
  50% {
    background-color: rgba(255, 255, 255, 1);
  }
  100% {
    background-color: rgba(255, 255, 255, 1);
  }
}
</style>
