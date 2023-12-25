<template>
  <button @click="send({ type: 'TOGGLE' })">{{ snapshot.value }}</button>
</template>

<script setup lang="ts">
import { useMachine } from '@xstate/vue';
import { createMachine } from 'xstate';
import { myRequest } from '../immediate/request';
console.log('🚀 ~  ~ 9行', myRequest);

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  context: {
    count: 0
  },
  states: {
    inactive: {
      on: { TOGGLE: 'active' }
    },
    active: {
      on: { TOGGLE: 'hello' },
      always: {
        target: 'hello',
        actions: () => {
          console.log('say hello');
        }
      }
    },
    hello: {
      on: { TOGGLE: 'inactive' }
    }
  }
});

const { actorRef, send, snapshot } = useMachine(toggleMachine);
actorRef.subscribe((v) => {
  console.log('🚀 ~ stateChange ~ 25行', v.value);
});
</script>

<style lang="less" scoped></style>
