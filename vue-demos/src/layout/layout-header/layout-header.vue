<template>
  <header class="header">
    <nav class="h-menu">
      <router-link to="/home" class="logo">Mapotato</router-link>
      <router-link
        :value="String(menu.name)"
        v-for="menu in MENULIST"
        :key="menu.name"
        :to="{ path: menu.path }"
        class="h-li"
      >
        <li :class="{ active: $route.path === menu.path }">
          {{ menu.name }}
        </li>
      </router-link>
      <router-link to="/home">
        <li class="icon">
          <!-- <t-icon class="t-menu__operations-icon" name="home" /> -->
        </li>
      </router-link>
    </nav>
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
  },
  {
    path: '/codepen-notes',
    name: 'codepen'
  }
]);
</script>

<style lang="scss" scoped>
.h-menu {
  display: flex;
  align-items: stretch;
  height: var(--header-h);
  padding: 0.5em 1em;
  margin: 0;
  border-bottom: 1px solid var(--color-border);
  .logo {
    margin-right: 2rem;
    font-size: xx-large;
  }

  li {
    align-content: center;
    list-style: none;
  }
  .h-li {
    align-content: center;
    padding: 0 1em;
    border-left: 1px solid var(--color-border);
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
