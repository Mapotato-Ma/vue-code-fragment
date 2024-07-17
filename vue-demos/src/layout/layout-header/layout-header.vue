<template>
  <header class="header">
    <menu class="h-menu">
      <li class="logo"><router-link to="/home">Mapotato</router-link></li>
      <li
        class="h-li"
        v-for="menu in MENULIST"
        :key="menu.name"
        :class="{ active: $route.path === menu.path }"
      >
        <router-link :value="String(menu.name)" :to="{ path: menu.path }" class="h-li-a">
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
    path: '/index-notes',
    name: '杂七杂八'
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
  border-bottom: 1px solid var(--border-color);
  .logo {
    margin-right: 2em;
    a {
      font-size: xx-large;
    }
  }
  .h-li {
    padding: 0.5em 1em;
    border-left: 1px solid var(--border-color);
    &:hover {
      background-color: rgba(255, 255, 255, 0.5);
    }
    &.active {
      background-color: rgba(188, 188, 188, 0.5);
    }
  }

  .icon {
    margin-left: auto;
  }
}
</style>
