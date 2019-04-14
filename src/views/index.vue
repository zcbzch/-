<template>
    <div id="index">
        <router-view></router-view>
        <mt-tabbar v-model="active" fixed>
            <mt-tab-item v-for="(item, index) in tabItem" :key="index" :id="item.name">
                <span class="iconfont">&#xeb66;</span>
                <!-- <img slot="icon" :src="require(`@/assets/iconfont1/${item.name}.svg`)">{{ item.label }} -->
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
                    },
                    {
                        name: 'detail',
                        label: '详细',
                    },
                    {
                        name: 'user',
                        label: '用户',
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
            background-color: #fff;
        }
        .bottom-block {
            width: 100%;
            height: 55px;
        }
    }
</style>
