<template>
  <t-layout>
    <t-header>
      <t-head-menu v-model="activeMenu" height="120px">
        <template #logo>
          <router-link to="/home">Mapotato</router-link>
        </template>
        <t-menu-item value="home" :to="{ path: '/home' }">首页</t-menu-item>
        <t-menu-item value="scrollDemo" :to="{ path: '/scrollDemo' }">表格</t-menu-item>
        <t-menu-item value="lineGraph" :to="{ path: '/lineGraph' }">连线</t-menu-item>
        <t-menu-item value="xstateDemo" :to="{ path: '/xstateDemo' }">xstate</t-menu-item>
        <t-menu-item value="useClass" :to="{ path: '/useClass' }">useClass</t-menu-item>
        <t-menu-item value="selectBox" :to="{ path: '/selectBox' }">选择器组件</t-menu-item>
        <template #operations>
          <router-link to="/home"><t-icon class="t-menu__operations-icon" name="home" /></router-link>
        </template>
      </t-head-menu>
    </t-header>
    <t-content>
      <router-view></router-view>
    </t-content>
    <t-footer>Copyright @ 2019-{{ new Date().getFullYear() }} Mapotato. All Rights Reserved</t-footer>
  </t-layout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
const activeMenu = ref();

onMounted(() => {
  activeMenu.value = window.location.pathname?.split('/')?.pop() ?? 'home';
  // 设置暗色模式
  document.documentElement.setAttribute('theme-mode', 'dark');
});
</script>

<style lang="less" scoped>
.t-layout {
  width: 100%;
  height: 100%;
  .t-menu__logo a {
    text-decoration: none;
    color: #fff;
    font-size: x-large;
    font-weight: lighter;
  }
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
