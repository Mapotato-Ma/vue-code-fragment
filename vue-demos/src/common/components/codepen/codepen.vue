<template>
  <iframe
    :height="height"
    :min-height="300"
    :width="width"
    scrolling="no"
    :src="`https://codepen.io/mapotato-ma/embed/${id}?default-tab=${defaultTab}`"
    frameborder="no"
    loading="lazy"
    allowtransparency="true"
    allowfullscreen="true"
    class="codepen"
  >
    See the
    <a :href="`https://codepen.io/mapotato-ma/pen/${id}`">Pen</a>
    by Mapotato-Ma (
    <a href="https://codepen.io/mapotato-ma">@mapotato-ma</a>
    ) on
    <a href="https://codepen.io">CodePen</a>
    .
  </iframe>
</template>

<script lang="ts" setup>
defineProps({
  id: {
    type: String,
    default: ''
  },
  defaultTab: {
    type: String,
    default: 'html,result'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  }
});
</script>

<style>
.codepen{
  min-height: 300px;
}
</style>