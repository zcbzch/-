<template>
    <div id="home">
       <div class="test-header">
           <!-- <div class="circle">

           </div> -->
           <el-progress type="circle" width="200" :percentage="30">123</el-progress>
           <div class="data-box">
               <div class="box-item"><div class="status-circle"></div>血糖</div>
               <div class="box-item"><div class="status-circle"></div>血压</div>
           </div>
       </div>
       <div class="test-container">
           <div class="test-item">
               血糖
           </div>
           <div class="test-item">
               血压
           </div>
       </div>
       
    </div>
</template>

<script>
    export default {
        name: 'home'
    }
</script>

<style lang="less">
    #home {
        height: 100%;
        .test-header {
            display: flex;
            // justify-content: center;
            align-items: center;
            flex-direction: column;
            height: 400px;
            padding: 60px 0;
            background-color: rgb(167, 193, 231);
            .circle {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background-color: #fff;
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
            height: calc(100% - 400px);
            padding: 10px;
            background-color: #eee;
            .test-item {
                height: 100px;
                background-color: #fff;
                margin-top: 10px;
                border-radius: 4px;
                &:first-child {
                    margin-top: 0px;
                }
            }
        }
    }
</style>