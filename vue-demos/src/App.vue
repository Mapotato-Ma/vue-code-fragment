<template>
  <div class="layout">
    <!-- header -->
    <LHeader />
    <!-- main -->
    <LMain />
    <!-- footer -->
    <LFooter />
    <!-- dialog -->
    <LPopover />
  </div>
</template>
<script setup lang="ts">
import { LFooter, LHeader, LMain,LPopover } from './layout';
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  color: #fff;
}
</style>
