<template>
  <div class="layout" v-if="!isPhone">
    <!-- header -->
    <LHeader />
    <!-- main -->
    <LMain />
    <!-- footer -->
    <LFooter />
    <!-- dialog -->
    <LPopover />
  </div>
  <div v-else class="no-support">请前往chrome桌面浏览器</div>
</template>
<script setup lang="ts">
import { LFooter, LHeader, LMain, LPopover } from './layout';
const isPhone = navigator.userAgent.match(
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
);
</script>

<style lang="scss" scoped>
.layout {
  position: relative;
  height: 100%;
  color: #fff;
}
.no-support {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
}
</style>
