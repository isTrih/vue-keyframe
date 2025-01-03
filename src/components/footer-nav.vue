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
    router.push({path: '/user/index/' + userStore.userInfo.user_id});

  }
}
</script>

<template>

  <div class="menu-demo">
    <a-menu mode="horizontal" style="width: 100%;  align-self: center;
  text-align: center;" :selected-keys="navStore.activeNavbar" @menuItemClick="navClick">
      <a-menu-item id="menu" class="menu" key="1">
        <template #icon>
          <div class="footbutton">
            <icon-home/>
          </div>
        </template>
      </a-menu-item>
      <a-menu-item id="menu" class="menu" key="2">
        <template #icon>
          <div class="footbutton">
            <icon-folder-add/>
          </div>
        </template>
      </a-menu-item>
      <a-menu-item id="menu" class="menu" key="3">
        <template #icon>
          <div class="footbutton">
            <icon-notification/>
          </div>
        </template>
      </a-menu-item>
      <a-menu-item v-if="userStore.userInfo.user_id" id="menu" class="menu" key="4">
        <template #icon>
          <div class="footbutton">
            <a-avatar id="avatar" :size="32"
                      :image-url="userStore.userInfo.avatar">
            </a-avatar>
          </div>
        </template>
      </a-menu-item>
      <a-menu-item v-if="!userStore.userInfo.user_id" id="menu" class="menu" key="5">
        <template #icon>
          <div class="footbutton">
            <a-avatar id="avatar" :size="32" :style="{ backgroundColor: '#194D95' }"
                      @click="changeShow">
              登录
            </a-avatar>
          </div>

        </template>

      </a-menu-item>
    </a-menu>
  </div>

  <div v-if="show">
    <login @changeShow="changeShow"/>
  </div>
</template>

<style scoped>
#avatar {
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

.footbutton {
  width: 100%;
  display: flex;
  justify-content: center; /* 水平居中 */
  text-align: center;
  height: 0.2rem;
}

.menu-demo {
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 100%;
  display: flex;
  text-align: center;
}
</style>