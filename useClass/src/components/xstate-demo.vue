<template>
  <button @click="send({ type: 'TOGGLE' })">{{ snapshot.value }}</button>
</template>

<script setup lang="ts">
import { useMachine } from '@xstate/vue';
import { assign, createActor, createMachine, interpret } from 'xstate';
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
      on: { TOGGLE: 'active' },
    },
    active: {
      on: { TOGGLE: 'hello' },
      always: {
        target: 'hello',
        actions: () => {
          console.log('say hello')
        }
      }
    },
    hello: {
      on: { TOGGLE: 'inactive' },
    }
  }
});

const { actorRef, send, snapshot } = useMachine(toggleMachine);
actorRef.subscribe((v) => {
  console.log('🚀 ~ stateChange ~ 25行', v.value);
})

//f1,f2,f3为三个模拟的异步操作
function f1(params: unknown) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      console.log(1, params);
      reject(1);
    }, 1000);
  });
}
function f2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(2);
      resolve(2);
    }, 1500);
  });
}
function f3() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      console.log(3);
      reject(3);
    }, 2000);
  });
}
// Function 返回 promise
// 这个 promise 可能会 resolve，例如，
// { name: 'David', location: 'Florida' }
const fetchUser = () =>
  fetch('input').then(res => res.json())

const userMachine = createMachine({
  id: 'user',
  initial: 'idle',
  context: {
    userId: 42,
    user: undefined,
    error: undefined
  },
  states: {
    idle: {
      on: {
        FETCH: { target: 'loading' }
      }
    },
    loading: {
      invoke: {
        id: 'getUser',
        src: 'fetchUser',
        onDone: {
          target: 'success',
          actions: assign({ user: (_, event) => event })
        },
        onError: {
          target: 'failure',
          actions: assign({ error: (_, event) => event })
        }
      }
    },
    success: {},
    failure: {
      on: {
        RETRY: { target: 'loading' }
      }
    }
  }
});

const { actorRef: userActorRef, send: userSend, snapshot: userSnapshot } = useMachine(userMachine);

userActorRef.subscribe((snapshot) => {
  console.log(snapshot);
});

userSend({ type: 'FETCH' });

console.log('🚀 ~ userSnapshot ~ 117行', userSnapshot.value);

// myRequest([f1.bind(this, '1'), f2, f3]);
</script>



<style lang="less" scoped></style>