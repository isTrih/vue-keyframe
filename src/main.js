import './assets/main.css'
import {createApp} from 'vue'
// 预览组件以及样式
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
// VuePress主题以及样式（这里也可以选择github主题）
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

//隐藏滚动条
import '@/styles/common.css'

// 引入 pinia 持久化插件
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

//无限滚动
import { ElInfiniteScroll } from 'element-plus'

import App from './App.vue'
import router from './router'
import headNav from "@/components/head-nav.vue";
import sideNav from "@/components/side-nav.vue";
import footerNav from "@/components/footer-nav.vue";

const app = createApp(App)
const pinia = createPinia()
app.use(pinia).use(router)
// 注册pinia插件
pinia.use(piniaPluginPersistedstate)

//注册md插件
VMdPreview.use(vuepressTheme);
// 引入v-md-editor预览组件
app.use(VMdPreview);

//使用无限滚动
app.use(ElInfiniteScroll)
// app.use(ArcoVueIcon);

// app.use(ArcoVue, {
//     // 用于改变使用组件时的前缀名称
//     theme: '@arco-themes/vue-keyframe',
//     style: 'css',
// })

app.mount('#app')

app.component('headNav', headNav)
app.component('sideNav', sideNav)
app.component('footerNav', footerNav)
