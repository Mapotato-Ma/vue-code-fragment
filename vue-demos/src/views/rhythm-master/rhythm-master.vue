<template>
  <div class="rhythm-master">
    <audio ref="ding" preload="auto">
      <source src="/audios/da.mp3" type="audio/mpeg" />
    </audio>
    <audio ref="dong" preload="auto">
      <source src="/audios/dong.mp3" type="audio/mpeg" />
    </audio>
    <div class="sidebar">
      <div
        class="beat"
        v-for="beat in 4"
        :key="beat"
        :class="{ active: beat === currentRhythmIndex + 1 }"
      ></div>
    </div>
    <div class="content">
      <div
        :class="['rhythm', `rhythm-${index + 1}`, { active: index === currentRhythmIndex }]"
        :style="{
          gridArea: `rhythm-${index + 1}`
        }"
        v-for="(rhythm, index) in rhythms"
        :key="index"
      >
        <div class="rhythm-beat" v-for="beat in rhythm.beatsPerMeasure" :key="beat"></div>
      </div>
      <div class="play" @click="play" :class="{ pause: disabled }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter, Subscription, take, timer } from 'rxjs';
import { computed, ref, useTemplateRef } from 'vue';

const dong = useTemplateRef<HTMLAudioElement>('dong');
const ding = useTemplateRef<HTMLAudioElement>('ding');

const rhythms = [
  {
    name: '八分音符',
    beatsPerMeasure: 2
  },
  {
    name: '三连音',
    beatsPerMeasure: 3
  },
  {
    name: '八分音符',
    beatsPerMeasure: 2
  },
  {
    name: '十六分音符',
    beatsPerMeasure: 4
  }
];
const currentRhythmIndex = ref(0);

const currentRhythm = computed(() => rhythms[currentRhythmIndex.value]);

let subscription: Subscription | undefined;

let disabled = ref(false);

const play = () => {
  disabled.value = !disabled.value;
  if (!subscription) {
    subscription = timer(0, 500)
      .pipe(filter(() => disabled.value))
      .subscribe(() => {
        currentRhythmIndex.value = (currentRhythmIndex.value + 1) % rhythms.length;
        dong.value?.pause();
        dong.value!.currentTime = 0;
        dong.value?.play();
        const interval = 500 / currentRhythm.value.beatsPerMeasure;
        timer(0, interval)
          .pipe(take(currentRhythm.value.beatsPerMeasure))
          .subscribe((v) => {
            console.log(`~🚀~ ${currentRhythm.value.name}$第${v + 1}拍`);
            ding.value?.pause();
            ding.value!.currentTime = 0;
            ding.value?.play();
          });
      });
  }
};
</script>

<style lang="scss" scoped>
.rhythm-master {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  --block-size: 200px;
  --stroke-width: 1em;
  .sidebar {
    width: 200px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    .beat {
      width: 100%;
      height: 24%;
      background-color: #e05d5d;
      transition: background-color 100ms ease-in-out;
      &.active {
        background-color: #fdfdfd;
      }
    }
  }
  .content {
    flex: 1;
    display: grid;
    gap: 10px;
    align-items: center;
    justify-content: center;
    align-content: center;
    grid-template-areas:
      '. rhythm-1 .'
      'rhythm-2 play rhythm-4'
      '. rhythm-3 .';
    .rhythm {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: var(--block-size);
      background-color: #e05d5d90;
      border: var(--stroke-width) solid #e05d5d;
      border-radius: 10px;
      overflow: hidden;
      transition: background-color 100ms ease-in-out;
      &.active {
        background-color: #f0781d90;
        border: var(--stroke-width) solid #f0781d;
      }
      &-1,
      &-3 {
        flex-direction: column;
        aspect-ratio: 0.5;
        .rhythm-beat {
          width: 80%;
          height: 20%;
        }
      }
      &-2,
      &-4 {
        width: unset;
        height: var(--block-size);
        aspect-ratio: 2;
        .rhythm-beat {
          width: 20%;
          height: 80%;
        }
      }

      .rhythm-beat {
        background-color: #f5f5f5;
        border-radius: 9999999em;
      }
    }
    .play {
      cursor: pointer;
      position: relative;
      width: var(--block-size);
      aspect-ratio: 1;
      border-radius: 10px;
      background-color: #276af090;
      border: var(--stroke-width) solid #276af0;
      grid-area: play;
      &::after,
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 10%;
        width: 30%;
        height: 80%;
        transform: translate(0, -50%);
        border-radius: 9999999em;
        background-color: #f5f5f5;
      }
      &::after {
        opacity: 0;
      }
      &::before {
        width: 0;
        height: 0;
        left: 51%;
        transform: translate(-50%, -50%);
        border-top: 60px solid transparent;
        border-bottom: 60px solid transparent;
        border-left: 100px solid #f5f5f5;
        background: unset;
        border-radius: unset;
      }
      &.pause {
        &::after,
        &::before {
          top: 50%;
          left: 10%;
          width: 30%;
          height: 80%;
          transform: translate(0, -50%);
          border-top: unset;
          border-bottom: unset;
          border-left: unset;
          border-radius: 9999999em;
          background-color: #f5f5f5;
        }
        &::after {
          opacity: 1;
          left: unset;
          right: 10%;
        }
      }
    }
  }
}
</style>
