<template>
  <header class="header">
    <nav class="h-menu">
      <router-link to="/home" class="logo">
        <img src="@/assets/img/icon/camera.png" alt="" />
      </router-link>
      <router-link
        :value="String(menu.name)"
        v-for="menu in MENULIST"
        :key="menu.name"
        :to="{ path: menu.path }"
        class="h-li"
        :class="{ active: $route.path === menu.path }"
      >
        <li>
          {{ menu.name }}
        </li>
      </router-link>
    </nav>
  </header>
</template>

<script lang="ts" setup>
const MENULIST = Object.freeze([
  {
    path: '/home',
    name: 'Home'
  },
  {
    path: '/index-notes',
    name: 'Demo'
  },
  {
    path: '/codepen-notes',
    name: 'Codepen'
  },
  {
    path: '/juejin-notes',
    name: 'Juejin'
  }
]);
</script>

<style lang="scss" scoped>
.h-menu {
  position: fixed;
  top: 1em;
  left: 1em;
  display: flex;
  gap: 1em;
  height: var(--header-h);
  padding: 12px;
  margin: 0;
  background: lch(from var(--apple-music-bg-lighten) l c h / calc(alpha - 0.8));
  border-radius: 16px;
  z-index: 1;
  box-shadow: 0 0 6px 4px rgb(0 0 0 / 50%);
  backdrop-filter: blur(6px);
  transition: background 233ms;
  &:hover {
    background: var(--apple-music-bg-lighten);
  }
  .logo {
    display: flex;
    align-items: center;
    border-radius: 10px;
    img {
      width: 2em;
    }
  }

  li {
    align-content: center;
    list-style: none;
  }
  .h-li {
    align-content: center;
    padding: 0 1em;
    border-radius: 10px;
    transition: all 233ms;
    font-weight: bold;
    &:hover {
      color: var(--apple-music-primary);
    }
    &.active {
      scale: 1.5;
      transform-origin: center 70%;
      color: var(--apple-music-primary);
    }
  }

  .icon {
    margin-left: auto;
  }
}
</style>
