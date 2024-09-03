<template>
  <div class="main">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: var(--main-h);
  padding: calc(var(--header-h) + 30px) 2em 0;
  overflow: auto;
}
</style>
