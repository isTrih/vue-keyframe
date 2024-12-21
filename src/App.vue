<script setup>
import {RouterView} from 'vue-router'
import { onMounted } from "vue";
// 禁止web端屏幕缩放
onMounted(() => {
  window.onload = function () {
    document.addEventListener("touchstart", function (event) {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    });
    document.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    });
  };
});
</script>
<template>
  <div id="app">
    <RouterView/>
  </div>
</template>

<style>
#app {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
