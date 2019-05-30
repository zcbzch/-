import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'index',
            component: () => import('@/views/index.vue'),
            redirect: to => {
                return { name: 'home' }
            },
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
                        
                    ]
                },
                {
                    path: '/user',
                    name: 'user',
                    component: () => import('@/views/user.vue'),
                },
                {
                    path: 'blood-sugar-data',
                    name: 'blood-sugar-data',
                    component: () => import('@/views/user/blood-sugar-data.vue'),
                },
                {
                    path: 'blood-pressure-data',
                    name: 'blood-pressure-data',
                    component: () => import('@/views/user/blood-pressure-data.vue'),
                },
                {
                    path: 'blood-sugar-introduction',
                    name: 'blood-sugar-introduction',
                    component: () => import('@/views/introduction/blood-sugar-introduction.vue'),
                },
                {
                    path: 'blood-pressure-introduction',
                    name: 'blood-pressure-introduction',
                    component: () => import('@/views/introduction/blood-pressure-introduction.vue'),
                },
                {
                    path: 'health',
                    name: 'health',
                    component: () => import('@/views/introduction/health.vue'),
                },
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login.vue')
        }
    ]
})