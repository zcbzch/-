<template>
    <div id="health">
        <mt-header title="向健康出发" fixed>
            <router-link to="/" slot="left">
                <mt-button 
                    icon="back"
                    @click="() => {
                        this.$router.back()
                    }"
                    >返回</mt-button>
            </router-link>
        </mt-header>
        <div class="header-block"></div>
        <div style="padding: 20px">
            <img style="width: 100%;  object-fit= contain"
                src="../../assets/swipe1.png"/>
        </div>

        <div class="title">欢迎使用健康监测系统</div>
        <div class="context">
            <el-card class="box-card">
                <p>
                本系统监测人体身体数据，并通过软件分析用户健康情况，
                给出相应的建议，使自己在家就可以了解自己身体的情况，
                并且出色的隐私保护能让用户倍感舒适。
                </p>
                <p>
                祝愿您身体健康。
                </p>
            </el-card>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'health',
        data() {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style lang="less">
    #health {
        width: 100%;
        .mint-header {
            height: 60px;
            font-size: 20px;
            font-weight: 500;
            color: #fff;
            letter-spacing: 2px;
            .is-left {
                font-size: 18px;
            }
        }
        .header {
            position: fixed;
            width: 100%;
            height: 60px;
            line-height: 60px;
            font-size: 24px;
            font-weight: 500;
            color: #fff;
            background-color: #409EFF;
        }
        .header-block {
            width: 100%;
            height: 70px;
            background-color: rgba(0, 0, 0, 0);
        }
        .title {
            margin: 0 auto;
            font-size: 26px;
            font-weight: bold;
        }
        .context {
            text-align: left;
            padding: 5%;
            margin: auto;
            font-size: 16px;
            letter-spacing: 2px;
            p {
                text-indent: 40px;
                padding: 0;
                margin: 10px;
                line-height: 26px;
            }
            strong {
                font-size: 18px;
                margin: 10px;
                color: #409EFF;
            }
        }
    }
</style>
