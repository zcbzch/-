<template>
    <div id="user">
       <div class="user-header">
           <div class="top">我</div>
           <div class="middle">
               <div class="icon">
                   <i class="iconfont icon-icon_zhanghao icon-layout"></i>
                </div>
           </div>
           <div class="bottom" @click="$_routeToLogin">立即登录</div>
       </div>
    </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            return {

            }
        },
        methods: {
            $_routeToLogin() {
                this.$router.push({ name: 'login' })
            },
        }
    }
</script>

<style lang="less">
    #user{
        .user-header {
            height: 240px;
            color:#fff;
            background: linear-gradient(rgb(97, 118, 236),rgb(64, 202, 236));
            .top {
                height: 60px;
                line-height: 60px;
            }
            .middle {
                height: 100px;
                // padding: 10px;
                .icon {
                    width: 100px;
                    height: 100px;
                    line-height: 100px;
                    margin: auto;
                    border-radius: 50%;
                    border: 1px solid #fff;
                    background-color: rgb(34, 90, 209);
                    .icon-layout {
                        font-size: 60px;
                        // color: #fff;
                    }
                }
            }
            .bottom {
                height: 80px;
                line-height: 80px;
            }
        }
    }
</style>