<template>
  <div class="neon-ball">
    <div class="ball-center ball"></div>
    <div
      class="x"
      v-for="i in 30"
      :key="i"
      :style="{
        rotate: `${Math.random()} ${Math.random()} 1 ${Math.random() * 720}deg`,
        '--shadow-color': `lch(60% ${Math.random() * 100} ${Math.random() * 270 + 100}deg / 0.5)`
      }"
    >
      <div
        class="ball"
        :style="{
          'animation-delay': `${Math.random() * -150}s`
        }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.neon-ball {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  perspective: 1000px;
  transform-style: preserve-3d;
  animation: animationBox 20s linear alternate;
  .x {
    position: absolute;
    inset: 0;
    perspective: 1000px;
    transform-style: preserve-3d;
  }
  .ball {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    transform: translateZ(0);
    translate: -50% -50% 0px;
    scale: 1.3;
    box-shadow: inset 0 0 10px 10px var(--shadow-color);
    animation: animationBall 3s cubic-bezier(0.55, 0.66, 0, 1) infinite alternate;
  }
  .ball-center {
    scale: 1;
    animation: unset;
    box-shadow: unset;
    background: gold;
  }

  @keyframes animationBox {
    0% {
      rotate: 0deg;
    }
    100% {
      rotate: 360deg;
    }
  }
  @keyframes animationBall {
    0% {
      translate: -50% -50% -700px;
      rotate: 1 1 1 0deg;
    }
    30% {
      translate: -50% -50% 0px;
      rotate: 1 1 1 180deg;
    }
    70% {
      translate: -50% -50% 0px;
      rotate: 1 1 1 360deg;
    }
    100% {
      translate: -50% -50% 300px;
      rotate: 1 1 1 360deg;
    }
  }
}
</style>
