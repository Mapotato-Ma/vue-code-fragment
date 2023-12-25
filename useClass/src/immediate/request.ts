//需求背景：并发多个异步操作，如果有失败的，则重试失败，直到所有请求成功，或者超出最大次数，就返回
//异步请求1

import { createMachine } from 'xstate';

export const myRequest = (requests: Array<() => Promise<unknown>>, retryCount = 3) => {
  requests.forEach((fn) => {
    const machine = createMachine({
      // 初始 state
      initial: 'callFn',
      context: {
        retryCount,
        successList: [],
        failureList: [],
      },
      // States
      states: {
        callFn: {
          invoke: {
            src: 'fn',
            onDone: {
              target: 'success',
              actions: (context) => {
                // 成功
                console.log('success', context.context.successList);
              },
            },
            onError: {
              target: 'failure',
              actions: (context) => {
                // 失败
                console.log('failure', context.context.failureList);
              },
            },
          },
        },
        success: {
          type: 'final',
        },
        failure: {
          on: {
            RETRY: { target: 'finished' },
          },
        },
        finished: {},
      },
    });
  });
};
