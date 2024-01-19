<template>
  <t-layout>
    <t-header>
      <t-head-menu value="item1" height="120px">
        <template #logo>
          <div>Mapotato</div>
        </template>
        <t-menu-item value="item1">首页</t-menu-item>
        <t-menu-item value="item2">菜单内容一</t-menu-item>
        <t-menu-item value="item3">菜单内容二</t-menu-item>
        <t-menu-item value="item4" :disabled="true">菜单内容三</t-menu-item>
        <template #operations>
          <a href="javascript:;"><t-icon class="t-menu__operations-icon" name="home" /></a>
        </template>
      </t-head-menu>
    </t-header>
    <t-content>
      <router-view></router-view>
    </t-content>
    <t-footer>Copyright @ 2019-{{ new Date().getFullYear() }} Tencent. All Rights Reserved</t-footer>
  </t-layout>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  // 设置暗色模式
  document.documentElement.setAttribute('theme-mode', 'dark');
});
</script>

<style lang="less" scoped>
.t-layout {
  width: 100%;
  height: 100%;
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__footer {
    text-align: center;
  }
}
</style>
