<template>
    <div id="login">
        <div class="header">
            <div class="left" @click="$_routerBack()"><i class="el-icon-arrow-left"></i></div>
        </div>
        <div class="container">
            <p class="login-title">账号登录</p>
            <div class="input-layout">
                <input class="input-style" 
                    type="text" 
                    placeholder="请输入帐号" 
                    v-model="userData.username">
            </div>
            <div class="input-layout">
                <input class="input-style" 
                    type="password" 
                    placeholder="请输入密码" 
                    v-model="userData.password">
            </div>
            <mt-button type="primary" 
                size="large" 
                :disabled="!notEmpty"
                style="width:100%; margin-top:20px"
                @click="$_login()">
                登录
            </mt-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data() {
        return {
            userData: {
                username: '',
                password: '',
            }
        }
    },
    computed: {
        notEmpty() {
            return this.userData.username.length > 0 && this.userData.password.length > 0
        },
        username() {
            return sessionStorage.getItem('username')
        }
    },
    methods: {
        $_login() {
            let params = {
                username: this.userData.username,
                password: this.userData.password,
            }
            this.axios.post('/users/login', params)
                .then((res) => {
                    res = res.data
                    if (res.code = 200000) {
                        sessionStorage.setItem(`username`, res.data.username)
                        sessionStorage.setItem(`userID`, res.data.token)
                        this.axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('userID')}`
                        // this.$store.state.route = 'user'
                        this.$router.replace({ name: 'user' })
                    }
                })
                .catch((error) => {  
                    console.log(error)
                })
        },
        $_routerBack() {
            this.$router.push({ name: 'user' })
        }
    }
}
</script>

<style lang="less">
    #login {
        height: 100%;
        background-color: rgb(255, 255, 255);
        .header {
            height: 60px;
            line-height: 60px;
            .left {
                width: 60px;
                font-size: 28px;
                position: absolute;
                left: 0;
            }
            .right {
                position: absolute;
                right: 20px;
            }
        }
        .container {
            padding: 100px 30px;
            .login-title {
                font-size: 28px;
                font-weight: 600;
                text-align: left;
            }
            .input-layout {
                height: 50px;
                margin-top: 10px;
                font-size: 16px;
                .input-style {
                    width: 100%;
                    height: 100%;
                    font-size: 18px;
                    outline: none;
                    border: none;
                    border-bottom: 1px solid #DCDFE6;
                }
            }
        }
    }
</style>
