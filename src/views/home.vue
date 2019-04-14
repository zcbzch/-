<template>
    <div id="home">
       <div class="test-header">
           <p class="header">危机指数</p>
           <el-progress 
                type="circle" 
                :width='160' 
                :stroke-width='10' 
                :color="circleColor" 
                :percentage="animatedNumber">
            </el-progress>
           <!-- <div class="data-box">
               <div class="box-item"><div class="status-circle"></div>血糖</div>
               <div class="box-item"><div class="status-circle"></div>血压</div>
           </div> -->
       </div>
       <div class="test-container">
           <div class="test-item">
               <el-progress 
                    type="circle" 
                    :width='60' 
                    :stroke-width='6' 
                    :color="circleColor" 
                    :percentage="85">
                </el-progress>
                <div class="item-text">
                    <div class="header">血糖危机指数</div>
                    <!-- <div class="line"></div> -->
                    <div class="footer">7777777777777777777777777777777777777</div>
                </div>
           </div>
           <div class="test-item">
               <el-progress 
                    type="circle" 
                    :width='60' 
                    :stroke-width='6' 
                    :color="circleColor" 
                    :percentage="66">
                </el-progress>
                <div class="item-text">
                    <div class="header">血压危机指数</div>
                    <!-- <div class="line"></div> -->
                    <div class="footer">7777777777777777777777777777777777777</div>
                </div>
           </div>
       </div>
       
    </div>
</template>

<script>
// import { parse } from 'path';
    // var Color = net.brehaut.Color
    export default {
        name: 'home',
        data() {
            return {
                number: 0,
                tweenedNumber: 0,
            }
        },
        created: function () {
            // this.tweenedColor = Object.assign({}, this.color)
        },
        computed: {
            animatedNumber() {
                return parseInt(this.tweenedNumber.toFixed())
            },
            circleColor() {
                let x = this.number
                switch(true) {
                    case x < 30: return 'green'
                    case x < 70 && x >= 30: return 'yellow'
                    case x >= 70: return 'red'
                }
            }
            // tweenedCSSColor: function () {
            //     return new Color({
            //         red: this.tweenedColor.red,
            //         green: this.tweenedColor.green,
            //         blue: this.tweenedColor.blue,
            //         yellow: this.tweenedColor.yellow,
            //     }).toCSS()
            // }
        },
        watch: {
            number(newVal) {
               TweenLite.to(this.$data, 2, { tweenedNumber: newVal });
            },
            // color: function () {
            //     function animate () {
            //         if (TWEEN.update()) {
            //         requestAnimationFrame(animate)
            //         }
            //     }

            //     new TWEEN.Tween(this.tweenedColor)
            //         .to(this.color, 1000)
            //         .start()

            //     animate()
            // }
        },
        methods: {
            // updateColor: function (theColor) {
            //     this.color = new Color(theColor).toRGB()
            //     this.colorQuery = ''
            // }
        },
        mounted() {
            this.number = 80
            // if(this.number<30) {this.updateColor('green')}
            // else if(this.number>=30 && this.number<70) {this.updateColor('yellow')}
            // else {this.updateColor('red')}
            // this.updateColor('red')
        }
    }
</script>

<style lang="less">
    #home {
        
        .test-header {
            display: flex;
            align-items: center;
            flex-direction: column;
            height: 400px;
            // padding: 60px 0;
            background-color: rgb(171, 224, 248);
            // animation: circleColor 3s;
            // .circle {
            //     width: 200px;
            //     height: 200px;
            //     border-radius: 50%;
            //     background-color: #fff;
            // }
            .header {
                font-weight: 600;
                font-size: 22px;
            }
            .data-box {
                margin-top: 20px;
                // background-color: #fff;
                display: flex;
                .box-item {
                    width: 80px;
                    display: flex;
                    .status-circle {
                        width: 20px;
                        height: 20px;
                        margin-right: 5px;
                        border-radius: 50%;
                        background-color: red;
                    }
                }
            }
        }
        .test-container {
            // height: calc(100% - 400px);
            padding: 10px;
            background-color: #eee;
            .test-item {
                height: 120px;
                display: flex;
                align-items: center;
                padding: 0 40px;
                background-color: #fff;
                margin-top: 10px;
                border-radius: 4px;
                .item-text {
                    width: calc(100% - 80px);
                    height: 100%;
                    padding: 20px;
                    text-align: left;
                    // border: 1px solid #000;
                    margin-left: 20px;
                    // .line {
                    //     width: 100%;
                    //     height: 1px;
                    //     margin-bottom: 5px;
                    //     background-color: rgba(0, 0, 0, 0.5);
                    // }
                    .header {
                        height:50%;
                        font-size: 20px;
                        font-weight: 600;
                    }
                    .footer {
                        word-wrap: break-word;
                    }
                }
                &:first-child {
                    margin-top: 0px;
                }
            }
        }
        // @keyframes circleColor {
        //     from {background-color: yellow;}
        //     to {background-color: red;}
        // }
    }
</style>