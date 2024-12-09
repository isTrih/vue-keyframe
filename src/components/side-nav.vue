<script setup>
import {ref} from "vue";
import Login from '@/views/Login/index.vue'

//路由管理
import router from "@/router/index.js";

//测试登录使用
const isLogin = ref(false);
// isLogin.value = true;

//全局导航栏管理
import {useNavStore} from "@/stores/nav";

const navStore = useNavStore();

//全局用户数据
import {useUserStore} from "@/stores/user";
import {Message} from "@arco-design/web-vue";

const userStore = useUserStore()

// 登出
const confirm = async () => {
  const res = await userStore.userLogout()
  Message.success({
    message: res.info,
    duration: 2000,
  })
}
// 显示登录界面
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

function toDoc(which) {
  router.push({path: '/doc/' + which});
}
</script>

<template>
  <div
      style="height: calc(100vh - 98px);position: relative; padding-right: 20px; padding-left: 12px;padding-top: 24px;">
    <div class="menu-demo">
      <a-menu :selected-keys="navStore.activeNavbar" @menuItemClick="navClick">
        <a-menu-item id="menu" class="menu" key="1">
          <template #icon>
            <icon-home/>
          </template>
          <p id="menu-t">发现</p>
        </a-menu-item>
        <a-menu-item id="menu" class="menu" key="2">
          <template #icon>
            <icon-folder-add/>
          </template>
          <p id="menu-t">创作</p>
        </a-menu-item>
        <a-menu-item id="menu" class="menu" key="3">
          <template #icon>
            <icon-notification/>
          </template>
          <p id="menu-t">通知</p>
        </a-menu-item>
        <a-menu-item id="menu" class="menu" key="4" v-show="isLogin">
          <template #icon>
            <a-avatar :size="24"
                      image-url="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp">
              Arco
            </a-avatar>
          </template>
          <p id="menu-t">我</p>
        </a-menu-item>
      </a-menu>
    </div>
    <div class="button" v-show="!isLogin">
      <a-button type="primary" shape="round" size="large" @click="changeShow" long>登录</a-button>
      <div style="border: 1px solid #b8b8b8;border-radius: 12px;margin-top: 12px;align-items: center;">
        <p class="f" style="font-weight: bold;color:black">马上登录即可享受： </p>
        <P class="g f">
          <icon-thumb-up/>
          刷到更懂你的优质内容
        </p>
        <p class="g f">
          <icon-search/>
          搜索最新热点
        </p>
        <p class="g f">
          <icon-star/>
          收藏感兴趣的Feed帧
        </p>
        <p class="g f">
          <icon-message/>
          和其他人一起互动、交流
        </p>
      </div>
    </div>

    <div style="position: absolute;bottom: 0;margin-top: 40vh">
      <a-popover title="更多" trigger="hover">
        <a-button class="button" type="text" shape="round"
                  size="large">
          <icon-experiment/>
          更多
        </a-button>
        <template #content>
          <a-popover title="关于关键帧">
            <a-button class="button" type="text" shape="round"
                      size="large">
              关于关键帧
            </a-button>
            <template #content>
              <a-button class="button left" type="text" size="large" shape="round" long>
                <template #icon>
                  <icon-home/>
                </template>
                <template #default>关于我们</template>
              </a-button>
              <div style="width: 220px;font-size: 10px">
                <a-link href="https://beian.miit.gov.cn/#/Integrated/index">皖ICP备2024039162号-1</a-link>
                <a-link href="https://beian.mps.gov.cn/#/query/webSearch">
                  <template #icon>
                    <a-avatar :size="16" image-url="https://beian.mps.gov.cn/img/logo01.dd7ff50e.png"></a-avatar>
                  </template>
                  皖公网安备34020202000696号
                </a-link>
                KeyFrame ⓒ Copyright SupraRectus 2024
              </div>
            </template>
          </a-popover>
          <a-popover title="隐私、协议">
            <a-button class="button" type="text" shape="round"
                      size="large">
              隐私、协议
            </a-button>
            <template #content>
              <div style="width: 180px">

              </div>
              <a-button @click="toDoc('agreement')" class="button left" type="text" size="large" shape="round" long>
                用户协议
              </a-button>
              <a-button @click="toDoc('privacy')" class="button left" type="text" size="large" shape="round" long>
                隐私政策
              </a-button>
              <a-button @click="toDoc('societyrule')" class="button left" type="text" size="large" shape="round" long>
                社区规范
              </a-button>

            </template>
          </a-popover>
        </template>
      </a-popover>
    </div>
  </div>
  <div v-if="show">
    <login @changeShow="changeShow"/>
  </div>
</template>

<style scoped>
.arco-icon {
  font-size: 20px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 5;
}

#menu {
  border-radius: 25px;
  font-size: 16px;
}

.menu {
  margin-bottom: 8px
}

#menu-t {
  font-weight: bold;

}

.button {
  margin-right: 10px;
  margin-left: 10px;

}

.f {
  margin-left: 12px;
  margin-top: 8px;
}

.g {
  font-size: 14px;
  color: #888888;
}

.left {
  padding-left: 0;
  margin-left: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 设置透明度的背景色 */
  z-index: 9998; /* 设置一个较大的z-index值，确保图层位于其他内容之上 */
}
</style>