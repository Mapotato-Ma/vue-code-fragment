<template>
  <div class="home-show">
    <!-- 3D 模型影响页面加载速度，先去掉 -->
    <!-- <iframe
      class="hs-iframe"
      src="https://my.spline.design/rocket-8d31f46728f284f9df3e767becd8db34/"
      frameborder="0"
    ></iframe> -->
    <div class="hs-text">WELCOME</div>
  </div>
</template>

<style lang="scss" scoped>
.home-show {
  width: 100%;
  height: 100%;
  position: relative;
  .hs-iframe {
    width: 100%;
    height: 100%;
  }

  .hs-text {
    position: absolute;
    top: 50%;
    left: 50%;
    translate: -50% -50%;
    font-size: 200px;
    font-weight: lighter;
    transform: skew(0deg, 0deg);
    transition: transform 0.5s;
    user-select: none;
    color: var(--apple-music-primary);
    @starting-style {
      transform: skew(-45deg, 0deg);
    }

    &::after {
      position: absolute;
      content: '';
      background-color: var(--bg-page);
      inset: 1em;
      transition: inset 0.5s;

      @starting-style {
        inset: 0 0;
      }
    }
  }
}
</style>
