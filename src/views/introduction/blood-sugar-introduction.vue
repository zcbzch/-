<template>
    <div id="blood-sugar-introduction">
        <mt-header title="血糖测量攻略" fixed>
            <router-link to="/" slot="left">
                <mt-button 
                    icon="back"
                    @click="() => {
                        this.$router.back()
                    }"
                    >返回</mt-button>
            </router-link>
            <!-- <mt-button icon="more" slot="right"></mt-button> -->
        </mt-header>
        <div class="header-block"></div>


        <div style="padding: 20px">
            <img style="width: 100%;  object-fit= contain"
                src="../../assets/sugar.png"/>
        </div>

        <div class="title">测量血糖的时间</div>
        <div class="context">
            <el-card class="box-card">
                <p>
                通常情况下，测量血糖最好的时间，就是在早上6点到8点之间，
                过了8点之后，身体里面的血糖的值会越来越高，就可能会无法
                准确的反映血糖的真实情况。而身体里面的血糖变化也是有规
                律性的，而一般人的胰岛素能够正常分泌，是可以把血糖控制
                在一定范围；但是糖尿病患者身体里面的胰岛素的水平较低，
                往往血糖也是可能会受到胰岛素的抗激素影响，就可能会出现
                明显上升的现象。所以说，早晨6点到8点之间空腹测量血糖值
                最为准确。

                </p>
            </el-card>
        </div>

        <div class="title">测量血糖的方法</div>
        <div class="context">
            <el-card class="box-card">
            <p>
                首先我们需要一个血糖仪，将血糖仪的代码调整好，跟你所使用的
                试纸的代码一样，代码在试纸里都会有的，插入血糖仪中进行校正
                就可以了。
            </p>
            <p>
                然后，我们需要给血糖笔按上针头，并且调整好采血针的刻度。这
                个时候我们要注意将手洗干净，并且最好用酒精消一下毒。
            </p>
            <p>
                消完毒后最好让手臂自然下垂等待1分钟左右，因为这样的话会让
                血液充分流到手指上，这样的话血液更充足，采血也没那么费劲。
            </p>
            <p>
                最后，待手臂静置过后，就可以用之前安装好的针头来刺破手指采
                血了。等到手指流出血液的时候，将血液滴在血糖试纸上面。之后
                将血糖试纸插入血糖仪中，再等待十几秒钟，这个时候就可以在血
                糖仪上看到你的血糖值了。
            </p>
            
            </el-card>
        </div>

        <div class="title">注意事项</div>
        <div class="context">
            <el-card class="box-card">

                <strong>不要刻意的减少饮食</strong>
                <p>
                许多患者可能会为了血糖监测结果更加的准确，就下意识的
                在监测血糖前节食，而这样往往测得的空腹血糖结果可能比
                较理想，但是却不是日常状态下的真实血糖水平。
                </p>

                <strong>测量血糖的时间不宜太晚</strong>
                <p>
                倘若是超过 12 小时的超空腹状态以及午餐前、晚餐前的血糖，
                都不可以把它称作空腹血糖的，这样结果往往就是因空腹时间
                太久而偏低，或者也可能偏高，出现苏木杰反应。
                </p>

                <strong>消毒液选择</strong>
                <p>
                使用碘酒或碘伏，碘具有氧化作用，残留在皮肤上易与葡萄糖氧
                化酶发生反应，影响血糖准确值，另外碘酒或碘伏易着色。
                </p>
                <p>
                建议用75%酒精消毒，易挥发且无着色。有研究表明在临床工作中
                葡萄糖酸氯己定的消毒法更趋于规范、安全和科学，用于血糖监
                测的消毒, 消毒效果明确, 安全无害, 对血糖值无影响。
                </p>

            </el-card>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'blood-sugar-introduction',
        data() {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style lang="less">
    #blood-sugar-introduction {
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
