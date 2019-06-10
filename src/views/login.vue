<template>
    <div id="login" v-loading.fullscreen.lock="loading">
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
            <div class="verification">
                <div class="verification-picture">
                    <div id="verify-img"></div>
                </div>

                <div class="input-layout">
                    <input class="input-style" 
                        type="text" 
                        placeholder="请输入验证码" 
                        v-model="verify">
                </div>
                
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
import { Toast } from 'mint-ui'
export default {
    name: 'login',
    data() {
        return {
            userData: {
                username: '',
                password: '',
            },
            userInformation: {
                sex: '',
                age: null,
                weight: null,
                height: null,
            },
            verify: '',
            verifyObj: {},
            loading: false,
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
        $_login: async function() {
            if(!this.verifyObj.validate(this.verify)) {
                this.$message({
                    showClose: true,
                    message: '验证码输入错误！',
                    type: 'error'
                });
                return
            }
            let passwordHash = this.sha1.hex(this.userData.password)
            let params = {
                username: this.userData.username,
                password: passwordHash,
            }
            this.loading = true
            await this.axios.post('/api/users/login', params)
                .then((res) => {
                    res = res.data
                    if (res.code == 200000) {
                        if(!res.data.username || !res.data.token) {
                            return
                        }
                        sessionStorage.setItem(`username`, res.data.username)
                        sessionStorage.setItem(`userID`, res.data.token)

                        this.axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem('userID')}`
                        this.$message({
                            showClose: true,
                            message: '登陆成功！',
                            type: 'success'
                        })
                        this.$router.replace({ name: 'user' })
                    } else {
                        this.$message({
                            showClose: true,
                            message: '用户名或密码错误！',
                            type: 'error'
                        })
                    }
                })
                // .catch((error) => {  
                //     console.log(error)
                // })
            this.loading = false
        },
        $_routerBack() {
            this.$router.push({ name: 'user' })
        },


        $_verification() {
            function GVerify(options) { //创建一个图形验证码对象，接收options对象为参数
                this.options = { //默认options参数值
                    id: "", //容器Id
                    canvasId: "verifyCanvas", //canvas的ID
                    width: "100", //默认canvas宽度
                    height: "50", //默认canvas高度
                    type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
                    code: ""
                }
            
                if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
                    for(var i in options) { //根据传入的参数，修改默认参数值
                        this.options[i] = options[i];
                    }
                }else{
                    this.options.id = options;
                }
                
                this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
                this.options.letterArr = getAllLetter();
    
                this._init();
                this.refresh();
            }
    
            GVerify.prototype = {
                /**版本号**/
                version: '1.0.0',
                
                /**初始化方法**/
                _init: function() {
                    var con = document.getElementById(this.options.id);
                    var canvas = document.createElement("canvas");
                    this.options.width = con.offsetWidth > 0 ? con.offsetWidth : "100";
                    this.options.height = con.offsetHeight > 0 ? con.offsetHeight : "30";
                    canvas.id = this.options.canvasId;
                    canvas.width = this.options.width;
                    canvas.height = this.options.height;
                    canvas.style.cursor = "pointer";
                    canvas.innerHTML = "您的浏览器版本不支持canvas";
                    con.appendChild(canvas);
                    var parent = this;
                    canvas.onclick = function(){
                        parent.refresh();
                    }
                },
                
                /**生成验证码**/
                refresh: function() {
                    this.options.code = "";
                    var canvas = document.getElementById(this.options.canvasId);
                    if(canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                    }else{
                        return;
                    }
                    
                    ctx.textBaseline = "middle";
        
                    ctx.fillStyle = randomColor(180, 240);
                    ctx.fillRect(0, 0, this.options.width, this.options.height);
        
                    if(this.options.type == "blend") { //判断验证码类型
                        var txtArr = this.options.numArr.concat(this.options.letterArr);
                    } else if(this.options.type == "number") {
                        var txtArr = this.options.numArr;
                    } else {
                        var txtArr = this.options.letterArr;
                    }
        
                    for(var i = 1; i <= 4; i++) {
                        var txt = txtArr[randomNum(0, txtArr.length)];
                        this.options.code += txt;
                        ctx.font = randomNum(this.options.height/2, this.options.height) + 'px SimHei'; //随机生成字体大小
                        ctx.fillStyle = randomColor(50, 160); //随机生成字体颜色        
                        ctx.shadowOffsetX = randomNum(-3, 3);
                        ctx.shadowOffsetY = randomNum(-3, 3);
                        ctx.shadowBlur = randomNum(-3, 3);
                        ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
                        var x = this.options.width / 5 * i;
                        var y = this.options.height / 2;
                        var deg = randomNum(-30, 30);
                        /**设置旋转角度和坐标原点**/
                        ctx.translate(x, y);
                        ctx.rotate(deg * Math.PI / 180);
                        ctx.fillText(txt, 0, 0);
                        /**恢复旋转角度和坐标原点**/
                        ctx.rotate(-deg * Math.PI / 180);
                        ctx.translate(-x, -y);
                    }
                    /**绘制干扰线**/
                    for(var i = 0; i < 4; i++) {
                        ctx.strokeStyle = randomColor(40, 180);
                        ctx.beginPath();
                        ctx.moveTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
                        ctx.lineTo(randomNum(0, this.options.width), randomNum(0, this.options.height));
                        ctx.stroke();
                    }
                    /**绘制干扰点**/
                    for(var i = 0; i < this.options.width/4; i++) {
                        ctx.fillStyle = randomColor(0, 255);
                        ctx.beginPath();
                        ctx.arc(randomNum(0, this.options.width), randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                },
                
                /**验证验证码**/
                validate: function(code){
                    var code = code.toLowerCase();
                    var v_code = this.options.code.toLowerCase();
                    if(code == v_code){
                        return true;
                    }else{
                        this.refresh();
                        return false;
                    }
                }
            }
            /**生成字母数组**/
            function getAllLetter() {
                var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
                return letterStr.split(",");
            }
            /**生成一个随机数**/
            function randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            }
            /**生成一个随机色**/
            function randomColor(min, max) {
                var r = randomNum(min, max);
                var g = randomNum(min, max);
                var b = randomNum(min, max);
                return "rgb(" + r + "," + g + "," + b + ")";
            }
            window.GVerify = GVerify
        },
        createVerify() {
            this.$_verification()
            var verifyCode = new GVerify({
                id:"verify-img",    //容器的ID
                type:"blend"    //图形验证码的类型：blend-数字字母混合类型（默认）、number-纯数字、letter-纯字母
            })
            this.verifyObj = verifyCode
        },
    },
    mounted() {
        this.createVerify()
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
            padding: 80px 30px;
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
            .verification {
                display: flex;
                flex-direction: row-reverse;
                .verification-picture {
                    margin-left: 16px;
                    margin-top: 10px;
                    #verify-img {
                        height: 50px;
                    }
                }
                .input-layout {
                    width: 100%;
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
    }
</style>
