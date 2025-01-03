<script setup>
defineOptions({
  name: 'NotFoundPage'
})

const back = () => {
  window.history.back();
}
</script>

<template>
  <a-result style="width: 100%;margin-top: 20vh" status="404" subtitle="页面好像不存在噢">
    <template #extra>
      <a-space>
        <a-button type="primary" @click="back">Back</a-button>
      </a-space>
    </template>
  </a-result>
</template>

<!--<template>-->
<!--  <div class="not-found">-->
<!--    <h1 style="color:red;">404 - 页面不存在</h1>-->
<!--    <p>你输入了一个错误的网址哦.</p>-->
<!--    <router-link to="/">返回主页</router-link>-->
<!--  </div>-->
<!--</template>-->

<style scoped>
.not-found {
  text-align: center;
  padding: 20px;
}
</style>