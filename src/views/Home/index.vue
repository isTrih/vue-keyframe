<script setup>
import HeadNav from "@/components/head-nav.vue";
import SideNav from "@/components/side-nav.vue";
import {Message} from "@arco-design/web-vue";
import {ref} from "vue";

const showBottom = ref(false);

//全局导航栏管理
import {useNavStore} from "@/stores/nav";
import FooterNav from "@/components/footer-nav.vue";

const navStore = useNavStore();

const onCollapse = (collapsed) => {
  // collapsed 收起时为true
  showBottom.value = collapsed === true;
}

</script>

<template>
  <div class="layout-demo"
       style="width: 100vw; height: calc(100vh);position: absolute;top: 0;left: 0;right: 0;bottom: 0;">
    <a-layout style="height: 100%;">
      <a-layout>
        <a-layout-header>
          <head-nav/>
        </a-layout-header>

        <a-layout>
          <!--侧边栏-->
          <a-layout-sider :width="260" style="margin-left: 3vw" collapsed-width=0 breakpoint="lg" @breakpoint="onCollapse">
            <side-nav/>
          </a-layout-sider>
          <a-layout style="width: 100%;">
            <a-layout-content>
              <div class="maxSize" id="content">
                <RouterView :key="$route.fullPath"/>
              </div>
              <!--              <RouterView :key="$route.fullPath"/>-->
            </a-layout-content>
            <div v-show="showBottom">
              <a-layout-footer>
                <footer-nav/>
              </a-layout-footer>
            </div>
          </a-layout>

        </a-layout>


      </a-layout>

    </a-layout>
  </div>
</template>

<style scoped>

#content {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: scroll;
}
.maxSize {
  height: 100vh;
  overflow-y: scroll;
}
.layout-demo :deep(.arco-layout-sider),
.layout-demo :deep(.arco-layout-content) {
  color: var(--color-white);
  box-shadow: unset
}

.layout-demo :deep(.arco-layout-header),
.layout-demo :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}

.layout-demo :deep(.arco-layout-header) {
  height: 64px;
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  background-color: var(--color-primary-light-1);
}

.layout-demo :deep(.arco-layout-content) {
  overflow-y: auto;
}

</style>