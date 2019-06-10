<template>
    <div id="index">
        <div class="container">
            <router-view></router-view>
        </div>

        <div class="bottom-block">
            <mt-tabbar v-model="active">
                <mt-tab-item v-for="(item, index) in tabItem" :key="index" :id="item.name">
                    <i class="icon iconfont icon-layout" :class="item.icon"></i>
                </mt-tab-item>
            </mt-tabbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                active: 'home',
                tabItem: [
                    {
                        name: 'home',
                        label: '主页',
                        icon: 'icon-icon_wangye',
                    },
                    {
                        name: 'detail',
                        label: '详细',
                        icon: 'icon-shujukanban'
                    },
                    {
                        name: 'user',
                        label: '用户',
                        icon: 'icon-icon_zhanghao',
                    },
                ]
            }
        },
        methods: {
            $_isLogin() {
                if(Boolean(sessionStorage.getItem('username'))) return
                else {
                    this.$router.push({name: 'login'})
                }
            },
        },
        watch: {
            active: {
                handler(newVal, oldVal) { this.$router.push({ name:newVal })},
                immediate: true
            }
        },
        mounted() {
            this.$_isLogin()
            this.axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('userID')}`
        }
    }
</script>

<style lang="less">
    #index{
        height: 100%;
        font-family: 'iconfont';
        .container {
            height: calc(100% - 56px);
            overflow: scroll;
        }
        .bottom-block {
            width: 100%;
            height: 56px;
            .is-selected {
                background-color: #fff;
            }
            .mint-tab-item {
                padding: 16px;
                background-color: #fff;
            }
            .icon-layout {
                font-size: 24px;
            }
        }
        .mint-tabbar {
            // border-top: 1px solid rgba(97, 118, 236, .5)
        }
    }
</style>
