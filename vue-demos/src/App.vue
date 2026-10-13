<template>
  <div v-if="!isPhone" class="shell">
    <router-view />
  </div>
  <div v-else class="no-support">请前往 chrome 桌面浏览器</div>
</template>

<script setup lang="ts">
/**
 * 新站同样是「桌面专用」：移动端 UA 一律拦下，不做任何适配。
 * 判断逻辑沿用旧站，保持一致口径。
 */
const isPhone = navigator.userAgent.match(
  /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
);
</script>

<style lang="scss" scoped>
.shell {
  position: relative;
  min-height: 100vh;
  color: var(--ink);
}

.no-support {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: xx-large;
  color: var(--ink);
}
</style>
