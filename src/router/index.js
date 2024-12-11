import {createRouter, createWebHistory} from 'vue-router'

const NotFound = () => import('@/views/NotFound/index.vue');
const Home = () => import('@/views/Home/index.vue');
const Explore = () => import('@/views/Explore/index.vue');
const Message = () => import('@/views/Message/index.vue');
const UserIndex = () => import('@/views/User/index.vue');
const UserFrameControl = () => import('@/views/UserFrameControl/index.vue');
const Agreement = () => import('@/views/Doc/agreement.vue');
const Privacy = () => import('@/views/Doc/privacy.vue');
const SocietyRule = () => import('@/views/Doc/society-rule.vue');
const Robots = () => import('@/views/Robots/index.vue')
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', name: '首页',
            component: Home,
            meta: {
                title: '关键帧|生活学习关键的一帧'
            },
            children: [
                {
                    path: '',
                    component: Explore,
                    meta: {
                        title: '关键帧|生活学习关键的一帧',
                    },
                },
                {
                    path: 'user/message',
                    component: Message,
                    meta: {
                        title: '消息中心|关键帧'
                    }
                },
                {
                    path: 'user/index/:id',
                    component: UserIndex,
                    meta: {
                        title: '用户中心|关键帧'
                    },

                },
                {
                    path: 'user/control',
                    component: UserFrameControl,
                    meta: {
                        title: '创作中心|关键帧'
                    },

                }]
        },
        {
            path: '/doc/', name: '协议',
            meta: {
                title: '协议|关键帧'
            },
            children: [{
                path: 'agreement',
                component: Agreement,
                meta: {
                    title: '协议|关键帧'
                },
            }, {
                path: 'privacy',
                component: Privacy,
                meta: {
                    title: '隐私政策|关键帧'
                },
            }, {
                path: 'societyrule',
                component: SocietyRule,
                meta: {
                    title: '隐私政策|关键帧'
                },
            }]
        },
        {
            path: '/:catchAll(.*)', name: '404', component: NotFound, meta: {
                title: '信号已丢失',
            },
        }, {
            path: '/robots.txt',
            name: 'robots',
            component: Robots,
        }],
})

export default router
