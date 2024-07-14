<template>
  <header class="header">
    <menu class="h-menu">
      <li class="logo"><router-link to="/home">Mapotato</router-link></li>
      <li v-for="menu in MENULIST" :key="menu.name" :class="{ active: $route.path === menu.path }">
        <router-link :value="String(menu.name)" :to="{ path: menu.path }" class="h-li">
          {{ menu.name }}
        </router-link>
      </li>
      <li class="icon">
        <router-link to="/home">
          <!-- <t-icon class="t-menu__operations-icon" name="home" /> -->
        </router-link>
      </li>
    </menu>
  </header>
</template>

<script lang="ts" setup>
const MENULIST = Object.freeze([
  {
    path: '/home',
    name: '首页'
  },
  {
    path: '/line-graph',
    name: 'css连线'
  },
  {
    path: '/svg-demo',
    name: 'SVG DEMO'
  },
  {
    path: '/select-box',
    name: 'SelectBox'
  },
  {
    path: '/flexible-layouts',
    name: '拖拽排序'
  }
  // {
  //   path: '/directed-graph-improve',
  //   name: '有向图'
  // }
]);
</script>

<style lang="scss" scoped>
.h-menu {
  display: flex;
  align-items: center;
  height: var(--header-h);
  padding: 0 1em;
  border-bottom: 1px dashed goldenrod;
  .logo {
    margin-right: 2em;
    a {
      font-size: xx-large;
    }
  }
  .h-li {
    padding: 0.5em 1em;
    border-left: 2px solid rgba(255, 255, 255, 0.5);
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .active {
    opacity: 0.5;
  }
  .icon {
    margin-left: auto;
  }
}
</style>
