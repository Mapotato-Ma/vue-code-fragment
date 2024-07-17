<template>
  <transition>
    <div class="popover" v-if="message.length > 0">
      {{ message }}
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { installMessage } from '@/common/plugins/message';
import { getCurrentInstance, onMounted, ref, nextTick } from 'vue';
import type { LPopover } from '..';
const message = ref('');
let timer: number | null;
defineExpose({
  message: (msg: string, duration: number = 2000) => {
    const showMessage = () => {
      message.value = msg;
      if (timer !== null) clearTimeout(timer);
      timer = setTimeout(() => {
        message.value = '';
        timer = null;
      }, duration);
    };
    if (message.value !== '') {
      message.value = '';
      nextTick(showMessage);
    } else {
      showMessage();
    }
  }
});
onMounted(() => {
  const instance = getCurrentInstance()?.exposed!;
  installMessage(instance as InstanceType<typeof LPopover>);
});
</script>

<style lang="scss" scoped>
.popover {
  padding: 0.5em 1.4em;
  background: linear-gradient(to right, #818181, transparent);
  backdrop-filter: blur(4px);
  position: absolute;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  top: 1.5em;
  max-width: 50vw;
  max-height: 50vw;
  overflow: auto;
  line-height: 1.2em;
}

.v-enter-active {
  transition: all 233ms ease-out;
}

.v-leave-active {
  transition: all 233ms ease-in;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(-50%) translateY(-20px);
  opacity: 0;
}
</style>
