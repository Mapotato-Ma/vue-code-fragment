<template>
  <t-layout>
    <t-header>
      <t-head-menu v-model="activeMenu" height="120px">
        <template #logo>
          <router-link to="/home">Mapotato</router-link>
        </template>
        <t-menu-item :value="String(menu.name)" :to="{ path: menu.path }" v-for="menu in menus" :key="menu.name">
          {{ menu.name }}
        </t-menu-item>
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
import { useRouter } from 'vue-router';
const activeMenu = ref();
const menus = useRouter()
  .getRoutes()
  .filter((item) => !item.redirect);
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
    width: 100%;
    height: calc(100% - 56px - 70px);
  }
  &__footer {
    text-align: center;
    box-shadow: inset 0 0 0 1px var(--td-component-border);
  }
}
</style>
