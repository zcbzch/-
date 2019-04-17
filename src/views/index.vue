<template>
    <div id="index">
        <router-view></router-view>
        <mt-tabbar v-model="active" fixed>
            <mt-tab-item v-for="(item, index) in tabItem" :key="index" :id="item.name">
                <i class="icon iconfont icon-size" :class="item.icon"></i>
            </mt-tab-item>
        </mt-tabbar>
        <div class="bottom-block"></div>
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
        watch: {
            active: {
                handler(newVal, oldVal) { this.$router.push({ name:newVal })},
                immediate: true
            }
        }
    }
</script>

<style lang="less">
    #index{
        font-family: 'iconfont';
        .is-selected {
            background-color: #fff;
        }
        .mint-tab-item {
            padding: 16px;
            background-color: #fff;
        }
        .icon-size {
            font-size: 24px;
        }
        .bottom-block {
            width: 100%;
            height: 56px;
        }
    }
</style>
