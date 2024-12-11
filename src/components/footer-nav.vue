<script setup>
import {ref} from "vue";
import Login from '@/views/Login/index.vue'

//测试登录使用
const isLogin = ref(false);
isLogin.value = true;

//路由
import router from "@/router/index.js";

//全局导航栏管理
import {useNavStore} from "@/stores/nav";
const navStore = useNavStore();

//全局用户数据
import {useUserStore} from "@/stores/user";
import {Message} from "@arco-design/web-vue";
const userStore = useUserStore()

//登录页面
const show = ref(false)
const changeShow = () => {
  if (show.value === false) {
    Message.info({
      content: '点击灰色区域关闭登录界面',
      duration: 1200,
    })
  }
  show.value = !show.value;
}

function navClick(key) {
  navStore.setActiveNavbar([key]);
  if (key === '1') {
    router.push({path: '/'});
  } else if (key === '2') {
    router.push({path: '/user/control'});
  } else if (key === '3') {
    router.push({path: '/user/message'});
  } else if (key === '4') {
    router.push({path: '/user/index/1'});
  }
}
</script>

<template>

  <div class="menu-demo">
    <a-menu mode="horizontal" style="width: 100%;  align-self: center;
  text-align: center;" :selected-keys="navStore.activeNavbar" @menuItemClick="navClick">
      <a-menu-item id="menu" class="menu" key="1">
        <template #icon>
          <icon-home/>
        </template>
      </a-menu-item>
      <a-menu-item id="menu" class="menu" key="2">
        <template #icon>
          <icon-folder-add/>
        </template>
      </a-menu-item>
      <a-menu-item id="menu" class="menu" key="3">
        <icon-notification/>
      </a-menu-item>
      <a-menu-item id="menu" class="menu" key="4" >
        <template #icon>
          <a-avatar v-show="!userStore.userInfo.id" id="avatar" :size="32" :style="{ backgroundColor: '#194D95' }"
                    @click="changeShow">
            登录
          </a-avatar>
          <a-avatar v-show="userStore.userInfo.id" id="avatar" :size="32"
                    image-url="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp">
          </a-avatar>
        </template>
      </a-menu-item>
    </a-menu>
  </div>

  <div v-if="show">
    <login @changeShow="changeShow"/>
  </div>
</template>

<style scoped>
#avatar{
  margin-bottom: 8px;
}

.arco-icon {
  font-size: 32px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 5;
}

#menu {
  font-size: 16px;
  width: 18%;
  align-self: center;
  text-align: center;
}

.menu-demo {
  position: fixed;
  bottom: 2px;
  left: 0;
  width: 100%;
  background-color: #292929;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>