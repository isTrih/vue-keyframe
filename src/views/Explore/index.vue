<script setup>
import {useRoute} from "vue-router";
import FeedCard from "@/components/feedCard.vue";
import {resizeWaterFall, waterFallInit, waterFallMore} from "@/utils/waterFall";
import {queryPost} from "@/apis/main";
import {onClickOutside} from '@vueuse/core';

import {onMounted, ref} from "vue";
import {feedDetail} from "@/stores/feedDetail.js";
import {Message} from "@arco-design/web-vue";
import { h } from 'vue';
import {IconFaceSmileFill} from "@arco-design/web-vue/es/icon";

//获取查询参数
const query = useRoute().query.query
const Details = feedDetail()


// 主页卡片 //////////////////////////////////////////////////////////////////
const cards = ref([]);
const disabled = ref(true); // 初始禁用滚动加载

const isload = ref(true);// 初始加载中

const columns = ref(0)
const card_columns = ref({})
const arrHeight = ref([])

// 主页获取帖子
const doQuery = async (offset, query) => {
  const res = await queryPost(offset, query);
  cards.value = res.data.feeds;
  waterFallInit(columns, card_columns, arrHeight, cards)
  disabled.value = false; // 启用滚动加载
};

// 无限滚动
const load = async () => {
  disabled.value = true;
  const offset = cards.value.length;
  const res = await queryPost(offset, query);
  const more = res.data.feeds;
  if (more == null) {
    disabled.value = true;
    Message.info({
      content: '到底啦',
      duration: 2000,
      position: 'bottom',
      icon: () => h(IconFaceSmileFill)
    })// 没有更多数据，禁用滚动加载
    isload.value = false;
  } else {
    cards.value = [...cards.value, ...more];
    waterFallMore(arrHeight, card_columns, more)
    disabled.value = false;
  }
};
// 主页卡片结束////////////////////////////////////////////////////////////////
// 卡片详情 //////////////////////////////////////////////////////////////////
const detail = Details.detail;
const show = ref(false);
const overlayX = ref(0); // 覆盖层的水平位置
const overlayY = ref(0); // 覆盖层的垂直位置
const overlay = ref(null)

const getDetails = async (id) => Details.getDetail(id)
const showMessage = async (id, left, top) => {
  window.history.pushState({}, "", `/explore/${id}`);
  overlayX.value = left;
  overlayY.value = top;
  await getDetails(id);
  show.value = true;
};
const afterDoComment = (comment) => Details.afterDoComment(comment)
const close = () => {
  window.history.pushState({}, "", "/");
  show.value = false;
  document.title = '欢迎来到关键帧!'
};
onClickOutside(overlay, () => {
  window.history.pushState({}, "", "/");
  show.value = false;
  document.title = '欢迎来到关键帧!'
});

let style = null;
const onBeforeEnter = () => {
  style = document.createElement('style')
  style.innerHTML =
      `@keyframes scale-up-center {
          0% {
            transform: scale(0.5);
            transform-origin: ${overlayX.value}px ${overlayY.value}px;
          }
          10% {
            transform: scale(0.5);
          }
          100% {
            transform: scale(1);
          }
       }`
  document.head.appendChild(style);
}

const onAfterEnter = (el) => {
  el.style = 'background-color: #fff'
  const button = el.querySelector('.backPage')
  button.style.display = ''
}
const onBeforeLeave = (el) => {
  const button = el.querySelector('.backPage')
  button.style.display = 'none'
  el.style = 'background-color: transparent'
}

const onAfterLeave = () => {
  if (style) {
    document.head.removeChild(style);
    style = null;
  }
}

onMounted(async () => {
  await doQuery(0);
  resizeWaterFall(columns, card_columns, arrHeight, cards)
});
// 卡片详情结束 //////////////////////////////////////////////////////////////////
</script>

<template>
  <div class="Empty" v-if="cards.length === 0">
    <a-empty>
      <template #image>
        <icon-empty/>
      </template>
      没有帖子
    </a-empty>
  </div>
  <div v-else>
    <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-distance="100">
      <feed-card :card_columns="card_columns" @show-detail="showMessage" ref="homeCardRef"></feed-card>

    </div>
    <div style="margin-bottom: 5vh" v-if="disabled">
      <a-spin v-if="isload"/>
    </div>
    <transition
        name="fade"
        @before-enter="onBeforeEnter"
        @after-enter="onAfterEnter"
        @before-leave="onBeforeLeave"
        @after-leave="onAfterLeave"
    >
      <div class="overlay" v-if="show">
        <a-button style="display:none;" class="backPage" @click="close">
          <icon-left />
        </a-button>
        <card-detail :detail="detail" @afterDoComment="afterDoComment" ref="overlay"/>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.Empty {
  margin-top: 10%;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.backPage {
  position: fixed;
  top: 5%;
  left: 3%;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all .3s;
}

.fade-enter-active {
  animation: scale-up-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
}

.fade-leave-active {
  animation: scale-up-center 0.3s ease-out both reverse;
}
</style>