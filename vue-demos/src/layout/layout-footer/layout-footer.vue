<template>
  <footer class="footer">
    <!-- copyright -->
    <span class="f-copy-right">
      Copyright @ 2024-{{ new Date().getFullYear() }} Mapotato. All Rights Reserved
    </span>
    <!-- ICP备案 -->
    <a class="f-beian-num" href="https://beian.miit.gov.cn/" target="_blank">
      苏ICP备2024113879号-1
    </a>
    <!-- 公安备案 -->
    <a
      class="f-beian-num"
      href="https://beian.mps.gov.cn/#/query/webSearch?code=32011402011730"
      rel="noreferrer"
      target="_blank"
    >
      <img class="f-beian-img" src="@/assets/beian.png" alt="" srcset="" />
      苏公网安备32011402011730
    </a>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  margin-top: auto;
  height: var(--footer-h);
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  .f-beian-num {
    margin-left: 4px;
    text-decoration: none;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 0.5em;
    &:hover {
      color: var(--apple-music-primary);
    }
  }
  .f-beian-img {
    width: 1em;
    height: 1em;
  }
}
</style>
