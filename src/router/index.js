import {createRouter, createWebHistory} from 'vue-router'

const NotFound = () => import('@/views/NotFound/index.vue');
const Home = () => import('@/views/Home/index.vue');
const Explore = () => import('@/views/Explore/index.vue');
const Message = () => import('@/views/Message/index.vue');
const UserIndex = () => import('@/views/UserIndex/index.vue');
const UserFrameControl = () => import('@/views/UserFrameControl/index.vue');
const Agreement = () => import('@/views/Doc/agreement.vue');
const Privacy = () => import('@/views/Doc/privacy.vue');
const SocietyRule = () => import('@/views/Doc/society-rule.vue');
const Robots = () => import('@/views/Robots/index.vue')
const Ads = () => import('@/views/Ads/index.vue')

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', name: '首页',
            component: Home,
            meta: {
                title: '关键帧丨每一秒都是关键帧'
            },
            children: [
                {
                    path: '',
                    name: 'index',
                    component: Explore,
                    meta: {
                        title: '关键帧丨每一秒都是关键帧',
                    },
                },
                {
                    path: 'user/message',
                    component: Message,
                    meta: {
                        title: '消息中心丨关键帧'
                    }
                },
                {
                    path: 'user/index/:id',
                    component: UserIndex,
                    meta: {
                        title: '用户中心丨关键帧'
                    },

                },
                {
                    path: 'user/control',
                    component: UserFrameControl,
                    meta: {
                        title: '创作中心丨关键帧'
                    },

                }]
        },
        {
            path: '/doc/', name: '协议',
            meta: {
                title: '协议丨关键帧'
            },
            children: [{
                path: 'agreement',
                component: Agreement,
                meta: {
                    title: '用户协议丨关键帧'
                },
            }, {
                path: 'privacy',
                component: Privacy,
                meta: {
                    title: '隐私政策丨关键帧'
                },
            }, {
                path: 'societyrule',
                component: SocietyRule,
                meta: {
                    title: '隐私政策丨关键帧'
                },
            }]
        },
        {
            path: '/:catchAll(.*)', name: '404',
            component: NotFound,
            meta: {
                title: '信号已丢失',
            },
        }, {
            path: '/robots.txt',
            name: 'robots',
            component: Robots,
            meta: {
                title: 'robots.txt',
            },
        }, {
            path: '/ads.txt',
            name: 'ads',
            component: Ads,
            meta: {
                title: 'ads.txt',
            },
        }],
})

router.beforeEach((to, from, next) => {
    const title = to.meta.title || '默认标题'; // 如果路由没有提供标题，则使用默认标题
    document.title = title;
    next();
});

export default router
