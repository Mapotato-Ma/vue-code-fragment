<template>
  <t-layout>
    <!-- header -->
    <t-header>
      <t-head-menu v-model="activeMenu" height="120px">
        <template #logo>
          <router-link to="/home">Mapotato</router-link>
        </template>
        <t-menu-item
          :value="String(menu.name)"
          :to="{ path: menu.path }"
          v-for="menu in menus"
          :key="menu.name"
        >
          {{ menu.meta.title }}
        </t-menu-item>
        <template #operations>
          <router-link to="/home">
            <t-icon class="t-menu__operations-icon" name="home" />
          </router-link>
        </template>
      </t-head-menu>
    </t-header>
    <!-- content -->
    <t-content>
      <router-view v-slot="{ Component }">
        <transition>
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </t-content>
    <!-- footer -->
    <t-footer>
      Copyright @ 2024-{{ new Date().getFullYear() }} Mapotato. All Rights Reserved
    </t-footer>
  </t-layout>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { TangHuLuToBigHump } from './utils';
const activeMenu = ref('Home');
const router = useRouter();
const menus = router.getRoutes().filter((item) => !item.redirect);
onMounted(() => {
  const pathName = window.location.pathname.split('/')[1];
  const menu = TangHuLuToBigHump(pathName, '-', true);
  if (menu) {
    activeMenu.value = menu;
  }
  // 设置暗色模式
  document.documentElement.setAttribute('theme-mode', 'dark');
});
</script>

<style lang="scss" scoped>
.t-layout {
  width: 100%;
  height: 100%;
  .t-menu__logo a {
    text-decoration: none;
    color: var(--td-text-color-brand);
    font-size: x-large;
    font-weight: lighter;
  }
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - var(--td-comp-size-xxxl) - 70px);
  }
  &__footer {
    text-align: center;
    border-top: 1px solid var(--td-brand-color-5);
  }
}
</style>
