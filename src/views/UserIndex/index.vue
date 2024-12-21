<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
import HomeCard from "@/components/feedCard.vue";
import CardDetail from "@/components/cardDetail.vue";
import {doFocus, queryUserIndex, queryUserPost} from "@/apis/main";
import {controlDetail} from "@/stores/controlDetail";
import {onClickOutside} from "@vueuse/core";
import {resizeWaterFall, waterFallInit, waterFallMore} from "@/utils/waterFall";
import {useUserStore} from "@/stores/user";
import {Message} from "@arco-design/web-vue";

const route = useRoute()
const Details = controlDetail()
const userStore = useUserStore()

// 加载用户信息 //////////////////////////////////////////////////////////////
const userInfo = ref({})
const signatureFormat = (signature) => {
  if (signature === 'CHAOZJ' || signature === '') {
    return "该用户是一个慵懒动画人，还未设置简介"
  } else {
    return signature;
  }
};
const getUserInfo = async () => {
  const id = route.params.id
  const res = await queryUserIndex(id)
  userInfo.value = res.data
  document.title = res.data.user_name + '|关键帧'
}
const checkFollow = (id) => {
  if (userStore.userInfo.user_id === id) {
    return true
  }
  return userStore.userFocus.includes(id)
}
const doFocusOn = async (id) => {
  if (userStore.userInfo.user_id === id) {
    Message.warning({
      content: '不能对自己进行关注操作',
      duration: 1300,
    })
    return
  }
  const res = await doFocus({id})
  userStore.extendUserInfo(1, id)
  Message.success({
    content: res.info,
    duration: 1300,
  })
}
// 加载用户信息结束 ////////////////////////////////////////////////////////////

// 主页切换标签 //////////////////////////////////////////////////////////////
const radio = ref('帖子')
const userPost = ref([])
const userCollect = ref([])
const userFavorite = ref([])
const disabled = ref(true); // 初始禁用滚动加载

const columns = ref(0)
const card_columns_posts = ref({})
const card_columns_like = ref({})
const card_columns_collect = ref({})
const arrHeight = ref([])


const Toggle = async () => {
  const user_id = route.params.id
  const offset = 0
  const types = radio.value
  if (radio.value === '帖子' && userPost.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset})
    userPost.value = post.info
    waterFallInit(columns, card_columns_posts, arrHeight, userPost)
  } else if (radio.value === '收藏' && userCollect.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset})
    userCollect.value = post.info
    waterFallInit(columns, card_columns_collect, arrHeight, userCollect)
  } else if (radio.value === '点赞' && userFavorite.value.length === 0) {
    const post = await queryUserPost({user_id, types, offset})
    userFavorite.value = post.info
    waterFallInit(columns, card_columns_like, arrHeight, userFavorite)
  }
  disabled.value = false;
}
const load = async () => {
  disabled.value = true;
  const user_id = userInfo.value.user_id;
  const types = radio.value;
  if (types === '帖子') {
    const offset = userPost.value.length;
    const post = await queryUserPost({user_id, types, offset});
    if (post.info.length === 0) {
      disabled.value = true;
    } else {
      userPost.value = [...userPost.value, ...post.info];
      waterFallMore(arrHeight, card_columns_posts, post.info)
      disabled.value = false;
    }
  } else if (types === '点赞') {
    const offset = userFavorite.value.length;
    const like = await queryUserPost({user_id, types, offset});
    if (like.info.length === 0) {
      disabled.value = true;
    } else {
      userFavorite.value = [...userFavorite.value, ...like.info];
      waterFallMore(arrHeight, card_columns_like, like.info)
      disabled.value = false;
    }
  } else if (types === '收藏') {
    const offset = userCollect.value.length;
    const collect = await queryUserPost({user_id, types, offset});
    if (collect.info.length === 0) {
      disabled.value = true;
    } else {
      userCollect.value = [...userCollect.value, ...collect.info];
      waterFallMore(arrHeight, card_columns_collect, collect.info)
      disabled.value = false;
    }
  }
};
// 主页切换标签结束 ///////////////////////////////////////////////////////////

// 卡片详情页的内容 //////////////////////////////////////////////////////////
const detail = Details.detail
const overlayX = ref(0); // 覆盖层的水平位置
const overlayY = ref(0); // 覆盖层的垂直位置
const overlay = ref(null)
const show = ref(false)

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
  window.history.pushState({}, '', `/user/index/${userInfo.value.user_id}`);
  document.title = userInfo.value.user_name + '|关键帧'
  show.value = false
}
onClickOutside(overlay, () => {
  window.history.pushState({}, "", `/user/index/${userInfo.value.user_id}`);
  document.title = userInfo.value.user_name + '|关键帧'
  show.value = false;
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
// 卡片详情页的内容结束 //////////////////////////////////////////////////////////
const resize = () => {
  if (radio.value === '帖子') {
    resizeWaterFall(columns, card_columns_posts, arrHeight, userPost)
  } else if (radio.value === '收藏') {
    resizeWaterFall(columns, card_columns_collect, arrHeight, userCollect)
  } else if (radio.value === '点赞') {
    resizeWaterFall(columns, card_columns_like, arrHeight, userFavorite)
  }
}
onMounted(async () => {
  await getUserInfo()
  // await Toggle()
  resize()
})
</script>

<template>
  <div class="container" style="align-items: center;align-content: center;margin-top: 1rem">
    <div class="userInfo" v-if="userInfo">
      <a-row :gutter="10">
        <a-col :span="7" style="width: 250px;">
          <a-avatar :size="100" :image-url="userInfo.avatar"></a-avatar>
        </a-col>
        <a-col :span="7" style="width: 250px!important;">
          <h2>{{ userInfo.user_name }}</h2>
          <div style="font-size: 0.8rem;text-align: left">
            <p>{{ signatureFormat(userInfo.signature) }}</p>
          </div>
          <div class="tagArea">
            <div style="margin: auto">
              <a-tag class="ml-2" color="green" round>{{ userInfo.follow_count }} 关注</a-tag>
              <a-tag class="ml-2" color="orange" round>{{ userInfo.fans_count }} 粉丝</a-tag>
              <a-tag class="ml-2" color="blue" round>{{ userInfo.feed_count }} 帧数</a-tag>
            </div>
          </div>
        </a-col>
        <a-col :span="5" style="width: 100px;">
          <a-button type="primary" shape="round" class="focusOn" v-if="!checkFollow(userInfo.user_id)"
                    @click="doFocusOn(userInfo.user_id)">关注
          </a-button>
          <a-button type="info" shape="round" class="focusOn" v-if="checkFollow(userInfo.user_id)"
                    @click="doFocusOn(userInfo.user_id)">编辑资料
          </a-button>
        </a-col>
      </a-row>

    </div>
    <div class="checkBox" @change="Toggle">
      <el-radio-group v-model="radio" size="large">
        <el-radio-button class="radio" label="帖子" name="post"/>
        <el-radio-button class="radio" label="收藏" name="collect"/>
        <el-radio-button class="radio" label="点赞" name="like"/>
      </el-radio-group>
    </div>
    <div style="margin-top: 30px;" v-if="userInfo">
      <div v-if="radio === '帖子'">
        <div v-if="userPost.length === 0">
          <el-empty description="现在还没有帖子..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <home-card :card_columns="card_columns_posts" @show-detail="showMessage"></home-card>
        </div>
        <transition
            name="fade"
            @before-enter="onBeforeEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave"
            @after-leave="onAfterLeave"
        >
          <div class="overlay" v-if="show">
            <button style="display:none;" class="backPage" @click="close">
              <el-icon>
                <Back/>
              </el-icon>
            </button>
            <card-detail :detail="detail" @afterDoComment="afterDoComment" ref="overlay"/>
          </div>
        </transition>
      </div>
      <div v-else-if="radio === '收藏'">
        <div v-if="userCollect.length === 0">
          <el-empty description="现在还没有收藏..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <home-card :card_columns="card_columns_collect" ref="overlay" @show-detail="showMessage"></home-card>
        </div>
        <transition
            name="fade"
            @before-enter="onBeforeEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave"
            @after-leave="onAfterLeave"
        >
          <div class="overlay" v-if="show">
            <button style="display:none;" class="backPage" @click="close">
              <el-icon>
                <Back/>
              </el-icon>
            </button>
            <card-detail :detail="detail" @afterDoComment="afterDoComment" ref="overlay"/>
          </div>
        </transition>
      </div>
      <div v-else-if="radio === '点赞'">
        <div v-if="userFavorite.length === 0">
          <el-empty description="现在还没有点赞..."/>
        </div>
        <div v-infinite-scroll="load" :infinite-scroll-disabled="disabled" :infinite-scroll-delay="200"
             :infinite-scroll-distance="100"
             v-else>
          <home-card :card_columns="card_columns_like" @show-detail="showMessage"></home-card>
        </div>
        <transition
            name="fade"
            @before-enter="onBeforeEnter"
            @after-enter="onAfterEnter"
            @before-leave="onBeforeLeave"
            @after-leave="onAfterLeave"
        >
          <div class="overlay" v-if="show">
            <button style="display:none;" class="backPage" @click="close">
              <el-icon>
                <Back/>
              </el-icon>
            </button>
            <card-detail :detail="detail" @afterDoComment="afterDoComment" ref="overlay"/>
          </div>
        </transition>
      </div>
    </div>

  </div>
</template>

<style scoped>
.userInfo {
  display: flex;
  width: 100%;
  color: #181818;
  align-items: center;
  justify-content: center;
}

.focusOn {
  align-items: center;
  justify-content: center;
  width: 5rem;
  height: 2rem;
  line-height: 18px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  color: #fff;
  border-color: transparent;
  margin-top: 1rem;
}


.tagArea {
  width: 250px;
  align-items: center;
  justify-content: center;
  align-content: center;
  text-align: center;
}

.tagArea .ml-2 {
  margin-right: 10px;
}

.checkBox {
  margin-top: 50px;
  position: relative;
  left: 40%;
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
  animation: scale-up-center 0.5s linear both reverse;
}
</style>