<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: var(--main-h);
  padding: 2em;
}
</style>
