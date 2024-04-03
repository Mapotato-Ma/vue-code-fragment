<template>
  <div class="home-show">WELCOME</div>
</template>

<style lang="scss" scoped>
.home-show {
  position: relative;
  font-size: 200px;
  font-weight: lighter;
  transform: skew(0deg, 0deg);
  transition: transform 0.5s;
  user-select: none;

  @starting-style {
    transform: skew(-45deg, 0deg);
  }

  &::after {
    position: absolute;
    content: '';
    background: var(--td-bg-color-page);
    inset: 12px;
    transition: inset 0.5s;

    @starting-style {
      inset: -100px 0;
    }
  }
}
</style>
