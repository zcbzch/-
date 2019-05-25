<template>
    <div id="user">
        <div class="user-header">
           <div class="top">{{ username.length > 0 ? username:'我' }}</div>
           <div class="middle">
               <div class="icon">
                   <i class="iconfont icon-icon_zhanghao icon-layout"></i>
                </div>
           </div>
           <div class="bottom" @click="$_routeToLogin">{{ username.length > 0 ? '登出':'立即登录' }}</div>
        </div>

        <div class="user-information">
            <mt-field label="性别" placeholder="请填写性别" v-model="userData.sex"></mt-field>
            <mt-field label="年龄" placeholder="请填写年龄" v-model="userData.age"></mt-field>
            <mt-field label="体重" placeholder="请填写体重" v-model="userData.weight"></mt-field>
            <mt-field label="身高" placeholder="请填写身高" v-model="userData.height"></mt-field>
        </div>
       
        <div class="user-operation">
            <div class="item" 
                @click="() => {
                    this.$router.push({name: 'blood-sugar-data'}) 
                    }">
                血糖详细数据
            </div>
            <div class="item" 
                @click="() => {
                    this.$router.push({name: 'blood-pressure-data'}) 
                    }">
                血压详细数据
            </div>
            <!-- <div class="item"><div class="item-inside">血糖数据</div></div> -->
        </div>

        <!-- <router-view></router-view> -->
    </div>
</template>

<script>
    export default {
        name: 'user',
        data() {
            return {
                userData: {
                    username: '',
                    sex: '',
                    age: '',
                    height: '',
                    weight: '',
                }
            }
        },
        computed: {
            username() {
                return sessionStorage.username
            }
        },
        methods: {
            $_getUserInformation() {
                let params = { username: this.username }
                // console.log(params)
                this.axios.get('/users/information', { params: params })
                    .then(res => {
                        console.log(res)
                        res = res.data
                        if(res.code = 200000) {
                            this.userData = res.data
                            // console.log(this.userData)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },
            $_routeToLogin() {
                console.log('click login')
                if(this.username.length > 0) {
                    sessionStorage.clear()
                    this.$router.push({ name: 'login' })
                } else {
                    this.$router.push({ name: 'login' })
                }
            },
        },
        mounted() {
            this.$_getUserInformation()
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
                margin-top: 20px;
                height: 60px;
                line-height: 60px;
                
            }
        }

        .user-information {
            .mint-field-core {
                text-align: right;
                padding-right: 30px;
            }
        }

        .user-operation {
            // display: flex;
            flex-wrap: wrap;
            padding: 10px;
            .item {
                width: 100%;
                height: 20vh;
                padding: 8px;
                margin: 10px 0;
                border-radius: 8px;
                background-color: #409EFF;
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
                font-weight: 500;
                letter-spacing: 2px;
            }
        }
    }
</style>