<template></template>

<script lang="ts" setup>
import { forkJoin, from, retry } from 'rxjs';

const promise1 = async () => {
  const res = await fetch('data/1.json');
  const data = await res.json();
  return data;
};
const promise2 = async () => {
  const res = await fetch('data/2.json');
  const data = await res.json();
  return Promise.reject(data);
};
const promise3 = async () => {
  const res = await fetch('data/3.json');
  const data = await res.json();
  return data;
};

const concurrentRequest = async (promises: Array<() => Promise<any>>) => {
  forkJoin(promises.map((promise) => from(promise()).pipe(retry(2)))).subscribe((res) => {
    console.log('🚀 ~ res ~ 20行', res);
  });
};
concurrentRequest([promise1, promise2, promise3]);
</script>
