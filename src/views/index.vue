<template>
    <div id="index">
        <router-view></router-view>
        <mt-tabbar v-model="active" fixed>
            <mt-tab-item v-for="(item, index) in tabItem" :key="index" :id="item">
                <img slot="icon" src="@/assets/logo.png">{{ item }}
            </mt-tab-item>
        </mt-tabbar>
    </div>
</template>

<script>
    export default {
        name: 'index',
        data() {
            return {
                active: 'home',
                tabItem: ['home','detail','user']
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
        width: 100%;
        height: 100%;
    }
</style>
