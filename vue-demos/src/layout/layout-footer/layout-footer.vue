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
  align-content: center;
  text-align: center;
  .f-copy-right {
    color: #fff;
    padding: 0 1em 0 0.5em;
    background: linear-gradient(to right, #818181, transparent 10em);
  }
  .f-beian-num {
    padding: 0 1em;
    margin-left: 4px;
    color: #fff;
    text-decoration: none;
    transition: all 0.3s;
    border-left: 1.5px solid goldenrod;
    &:hover {
      color: rgba(159, 67, 244, 0.521);
    }
  }
  .f-beian-img {
    width: 1em;
    height: 1em;
    vertical-align: text-top;
  }
}
</style>
