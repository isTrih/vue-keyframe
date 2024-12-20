<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import {useNavStore} from "@/stores/nav.js";

const navStore = useNavStore()
const router = useRouter()
// searchValue
const searchInput = ref('')
// search
const searchThings = () => {
  navStore.setActiveNavbar(['1'])

  router.replace(`/?query=${searchInput.value}`)
}

</script>

<template>
  <a-row :gutter="40">
    <a-col :span="4" style="margin-top: 16px">
      <RouterLink to="/">
        <img id="logo" src="../assets/hd.svg" height="34" style="pointer-events:none;margin-left: 3vw" alt="关键帧LOGO"/>
      </RouterLink>
    </a-col>
    <a-col :span="12" style="margin-left:12vw;margin-top: 15px">
      <a-input-search  v-model="searchInput" placeholder="登陆搜索更多..." @search="searchThings" allow-clear/>
    </a-col>
  </a-row>
</template>

<style scoped>

#logo{
  position: absolute;
  left: 20px;
}
</style>