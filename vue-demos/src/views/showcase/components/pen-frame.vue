<template>
  <iframe
    v-if="active"
    class="pen-frame"
    :srcdoc="srcdoc"
    :scrolling="scroll ? 'auto' : 'no'"
    sandbox="allow-scripts allow-pointer-lock allow-popups"
    loading="lazy"
    title="效果预览"
  ></iframe>
  <div v-else class="pen-frame pen-frame--idle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    html: string;
    css: string;
    js: string;
    /** 是否真的跑起来（没进入视野 / 没悬停时不挂 iframe，省性能） */
    active: boolean;
    /** 内容超出时是否允许内部滚动 */
    scroll?: boolean;
  }>(),
  { scroll: false },
);

const CLOSE_SCRIPT = '<' + '/script>';

/** 把 pen 的源码拼成一个自包含页面塞进 sandbox iframe（零外部依赖） */
const srcdoc = computed(
  () =>
    '<!doctype html><html lang="zh"><head><meta charset="utf-8"><style>' +
    'html,body{margin:0;padding:0;height:100%;box-sizing:border-box;}' +
    'body{display:grid;place-items:center;overflow:' +
    (props.scroll ? 'auto' : 'hidden') +
    ';color:#e9edf6;font-family:system-ui,sans-serif;}' +
    '*{box-sizing:border-box;}' +
    props.css +
    '</style></head><body>' +
    props.html +
    '<script>' +
    props.js +
    CLOSE_SCRIPT +
    '</body></html>',
);
</script>

<style lang="scss" scoped>
.pen-frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;
  background: transparent;

  &--idle {
    background:
      radial-gradient(120% 120% at 30% 0%, rgba(110, 231, 255, 0.06), transparent 60%),
      rgba(255, 255, 255, 0.02);
  }
}
</style>
