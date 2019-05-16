<template>
    <div id="detail">
        <mt-navbar v-model="selected">
            <mt-tab-item v-for="(item, index) in navItem" :key="index" :id="item.name">{{ item.label }}</mt-tab-item>
        </mt-navbar>
        <div class="line"></div>
        <div class="card">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'detail',
        data() {
            return {
                selected: 'blood-sugar',
                navItem: [
                    {
                        name: 'blood-sugar',
                        label: '血糖',
                    },
                    {
                        name: 'blood-pressure',
                        label: '血压',
                    },
                    {
                        name: 'heart-rate',
                        label: '心率',
                    },
                ]
            }
        },
        watch: {
            selected: {
                handler(newVal, oldVal) { this.$router.push({ name:newVal }) },
                immediate: true
            }
        }
    }
</script>

<style lang='less'>
    #detail {
        width: 100%;
        .line {
            width: 100%;
            height: 1px;
            background-color: #eee;
        }
    }
</style>