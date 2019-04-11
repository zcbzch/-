import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/index.vue'),
            redirect: { name: 'home' },
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/home.vue'),
                },
                {
                    path: '/detail',
                    name: 'detail',
                    component: () => import('@/views/detail.vue'),
                    redirect: { name: 'blood-sugar' },
                    children: [
                        {
                            path: 'blood-sugar',
                            name: 'blood-sugar',
                            component: () => import('@/views/detail/blood-sugar.vue'),
                        },
                        {
                            path: 'blood-pressure',
                            name: 'blood-pressure',
                            component: () => import('@/views/detail/blood-pressure.vue'),
                        },
                        {
                            path: 'heart-rate',
                            name: 'heart-rate',
                            component: () => import('@/views/detail/heart-rate.vue'),
                        },
                    ]
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/user.vue'),
                },
            ]
        }
    ]
})