<script setup>
import {computed, ref} from "vue"

const props = defineProps({
  card_columns: {
    default: () => {
    }
  }
})


let len = computed(() => {

  return Object.keys(props.card_columns).length;
})

//标题转换
const titleFormat = (title) => {
  if (title.length > 16) {
    return title.substring(0, 16) + '...';
  } else {
    return title;
  }
};

//数字模糊转换
function numFormat(num) {
  if (10 < num && num <= 100) {
    return '10+';
  } else if (1000 >= num && num > 100) {
    return '100+';
  } else if (10000 >= num && num > 1000) {
    return '1千+';
  } else if (50000 >= num && num > 10000) {
    return '1万+';
  } else if (100000 >= num && num > 50000) {
    return '5万+';
  } else if (num > 100000) {
    return '10万+';
  } else if (num <= 10) {
    return num.toString();

  } else {
    return num;
  }

}

const emit = defineEmits(['show-detail'])
const details = (id, event) => {
  const target = event.target;
  const left = target.x;
  const top = target.y;
  emit('show-detail', id, left, top)
}

const heightFormat = (h, w) => {

  if (h/w > ((4 * w) / 3)) {
    return ((4 * w) / 3)
  } else {
    return h/w
  }
};

const handleLoad = (card) => {
  card.loaded = true
}
</script>

<template>
  <div class="col">
    <div :style="{width: 100/len + '%'}" v-for="col in card_columns" :key="col.id">
      <section v-for="card in col" :key="card.id">
        <div v-show="card.loaded" style=" padding: 0" class="card">
          <a :href="`/explore/${card.id}`" @click.prevent="details(card.id)">
            <img
                :src="card.media_url"
                class="image"
                :style="{width: 100 + '%'}" @load="handleLoad(card)"
                alt=""
            />
          </a>
          <div style="padding: 0.1rem">
            <div style="margin-bottom: 2px;height: 20px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
              <span id="title" @click="details(card.id)">{{ titleFormat(card.title) }}</span>
            </div>
            <div class="bottom" style="display:flex; justify-content: space-between;">
              <a-row style="align-items: center;">
                <RouterLink :to="`/user/index/${card.user.id}`">
                  <a-avatar :size="24">
                    <img style="border: #d5d5d5 thin solid; border-radius: 100%" alt="avatar" :src="card.user.avatar"/>
                  </a-avatar>
                </RouterLink>
                <RouterLink :to="`/user/index/${card.user.id}`">
                  <div class="user_name" style="float: left;">{{ card.user.user_name }}</div>
                </RouterLink>
              </a-row>
              <a-row style="align-items: center;">
                <!--//TODO:未来来这里实现外部点赞功能-->
                <div class="user_name" style="float: right;">
                  <icon-heart/>
                  {{ numFormat(card.like_num) }}
                </div>
              </a-row>
            </div>
          </div>
        </div>
        <div v-if="!card.loaded">
          <div class="card loading">
            <div class="image"
                 :style="{height: heightFormat(card.media.height,(card.media.width / 230)) + 'px',}">
            </div>
            <div style="padding: 10px">
              <div
                  style="margin-bottom: 10px;height: 20px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
                <span id="title" @click="details(card.id)">{{ titleFormat(card.title) }}</span>
              </div>
              <div class="bottom" style="display:flex; justify-content: space-between;">
                <a-row style="align-items: center;">
                  <RouterLink :to="`/user/index/${card.user.id}`">
                    <div class="avatar"></div>
                  </RouterLink>
                  <RouterLink :to="`/user/index/${card.user.id}`">
                    <div class="user_name">{{ card.user.user_name }}</div>
                  </RouterLink>

                </a-row>
                <a-row style="align-items: center;">
                  <!--//TODO:未来来这里实现外部点赞功能-->
                  <div class="user_name" style="float: right;">
                    <icon-heart/>
                    {{ numFormat(card.like_num) }}
                  </div>
                </a-row>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
#title {
  display: -webkit-box;
  text-align: start;
  margin-bottom: 0.2rem;
  word-break: break-all;
  color: black;
  font-size: 0.98rem;
  font-weight: 500;
}

.col {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.loading .image,
.loading .avatar {
  background: gainsboro linear-gradient(
      100deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, .5) 50%,
      rgba(255, 255, 255, 0) 60%
  );
  background-size: 200% 100%;
  background-position-x: 180%;
  animation: 1s loading ease-in-out infinite;
}

@keyframes loading {
  to {
    background-position-x: -20%;
  }
}

.loading .avatar {
  border-radius: 50%;
  height: 24px;
  width: 24px;
}

section {
  break-inside: avoid; /* 防止卡片被分割在两列中 */
  margin: 1rem 1rem 1rem 1rem;
}

.card {
  border-radius: 0.8rem;
  background-color: transparent;
}

.image {
  width: 250px;
  border-radius: 1rem;
  border: #d5d5d5 1px solid;
  object-fit: fill;
}

.image:hover {
  opacity: 0.7;
}

.user_name {
  color: black;
  margin-left: 10px;
  font-weight: 400;
  font-size: 0.8rem;
}

</style>