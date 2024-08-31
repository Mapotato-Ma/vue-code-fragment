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
  padding-top: calc(var(--header-h) + 30px);
  overflow: auto;
}
</style>
