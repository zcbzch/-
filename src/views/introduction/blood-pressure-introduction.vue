<template>
    <div id="blood-pressure-introduction">
        <mt-header title="血压测量攻略" fixed>
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
                src="../../assets/pressure.png"/>
        </div>

        <div class="title">测前准备工作</div>
        <div class="context">
            <el-card class="box-card">
                <p>
                患者放松，心绪平稳，坐在有靠背的椅子上，双脚在地板上放平，
                背部倚靠以获得支撑。
                </p>
                <p>
                测血压之前，应避免饮用咖啡或酒精、运动和吸烟至少30分钟，且
                应排空膀胱。
                </p>
                <p>
                休息或测量期间，患者和测量者均不应该说话
                </p>
            </el-card>
        </div>

        <div class="title">血压测量方式</div>
        <div class="context">
            <el-card class="box-card">
            <p>
                首先记录双臂血压，哪一侧血压读数较高，则后续使用该测手臂进行测量。
                每次门诊就诊时，应测量诊室血压≥2次，重复测量时要间隔1~2分钟
            </p>
            <p>
                使用听诊法测量时，在脉搏消失后继续加压20-30 mmHg进行血压测量。
                使用听诊法时，缓慢放气（2 mmHg/s），仔细听诊柯氏音
            </p>
            <p>
                心率缓慢者，放气速率应更慢些，获得舒张压读数后，快速放气至零。
            </p>
            <p>
                最后，将血压测量值准确记录。使用偶数记录收缩压和舒张压，
                尽量避免尾数偏好（尾数偏好是指将血压读数习惯性记录为末尾0或5mmHg），
                明确测量之前最近一次服用降压药物的时间。
            </p>
            
            </el-card>
        </div>

        <div class="title">身体位置对血压测量结果的影响</div>
        <div class="context">
            <el-card class="box-card">

                <strong>仰卧位测血压</strong>
                <p>
                仰卧位时，收缩压比坐位时高3-10 mmHg，舒张压约高1–5 mmHg，如果手臂
                搁在床上，它会低于心脏水平，应当使用枕头等垫高手臂进行支撑
                </p>

                <strong>坐位测血压</strong>
                <p>
                坐位测血压，若后背没有支撑，收缩压和舒张压可分别高5-15 mmHg和6 mmHg，
                若跷二郎腿，收缩压和舒张压可分别高5-8mmHg和3-5 mmHg；
                </p>

                <strong>坐位手臂位置影响</strong>
                <p>
                坐位时，右心房水平在胸骨或第四肋间隙的中点。若上臂低于右心房水平，
                例如手臂下垂时，测得的血压会升高；因此，测血压时手臂要自然放在桌上，
                与心脏保持水平；如果手臂保持抬起的姿势，测得的血压也会升高。
                </p>

            </el-card>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'blood-pressure-introduction',
        data() {
            return {

            }
        },
        methods: {

        }
    }
</script>

<style lang="less">
    #blood-pressure-introduction {
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
