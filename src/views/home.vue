<template>
    <div id="home">
        <div class="test-header" v-loading.fullscreen.lock="loading">
           <p class="header">危机指数</p>
           <el-progress 
                type="circle" 
                :width='200' 
                :stroke-width='10' 
                :color="riskNumSet.mutiple.color" 
                :percentage="riskNum"
                status="text">
                <div class="circle-text">
                    <div class="circle-text-container">
                        <p class="num">{{ riskNum }}</p>
                        <p class="tip">{{ healthStatus(riskNumSet.mutiple.number).tip }}</p>
                        <el-button size="mini" round @click="$_getRiskNum">健康检测</el-button>
                    </div>
                </div>
            </el-progress>
        </div>

        <div class="swipe">
            <mt-swipe :auto="3000">
                <mt-swipe-item>
                    <img style="width:100%; height:100%"
                        src="../assets/swipe1.png" 
                        @click="() => {
                            
                        }"/>
                </mt-swipe-item>
                <mt-swipe-item>
                    <img style="width:100%; height:100%" 
                        src="../assets/swipe2.png" 
                        @click="() => {
                            this.$router.push({name: 'blood-sugar-introduction'})
                        }"/>
                </mt-swipe-item>
                <mt-swipe-item>
                    <img style="width:100%; height:100%" 
                        src="../assets/swipe3.png"
                        @click="() => {
                            this.$router.push({name: 'blood-pressure-introduction'})
                        }"/>
                </mt-swipe-item>
            </mt-swipe>
        </div>

        <div class="test-container">
           <div class="test-item">
               <el-progress 
                    type="circle" 
                    :width='60' 
                    :stroke-width='6' 
                    :color="riskNumSet.bloodSugar.color" 
                    :percentage="riskNum_sugar"
                    status="text">
                    <p style="font-size: 20px">
                        {{ riskNum_sugar }}
                    </p>
                </el-progress>
                <div class="item-text">
                    <div class="header">血糖危机指数</div>
                    <div class="footer">{{ riskNumSet.bloodSugar.tip }}</div>
                </div>
            </div>
            <div class="test-item">
               <el-progress 
                    type="circle" 
                    :width='60' 
                    :stroke-width='6' 
                    :color="riskNumSet.bloodPressure.color" 
                    :percentage="riskNum_pressure"
                    status="text">
                    <p style="font-size: 20px">
                        {{ riskNum_pressure }}
                    </p>
                </el-progress>
                <div class="item-text">
                    <div class="header">血压危机指数</div>
                    <!-- <div class="line"></div> -->
                    <div class="footer">{{ riskNumSet.bloodPressure.tip }}</div>
                </div>
            </div>
        </div>
       
    </div>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {
                riskNumSet: {
                    mutiple: {
                        number: 0,
                        tweenedNumber: 0,
                        color: '#67c23a'
                    },
                    bloodSugar: {
                        number: 0,
                        tweenedNumber: 0,
                        color: '#67c23a',
                        tip: '（请先进行健康检测）',
                    },
                    bloodPressure: {
                        number: 0,
                        tweenedNumber: 0,
                        color: '#67c23a',
                        tip: '（请先进行健康检测）',
                    },
                },
                chartData: [],
                highData: [],
                lowData: [],
                loading: false,
            }
        },
        created: function () {
            // this.tweenedColor = Object.assign({}, this.color)
        },
        computed: {
            riskNum() {
                return parseInt(this.riskNumSet.mutiple.tweenedNumber.toFixed())
            },
            riskNum_sugar() {
                return parseInt(this.riskNumSet.bloodSugar.tweenedNumber.toFixed())
            },
            riskNum_pressure() {
                return parseInt(this.riskNumSet.bloodPressure.tweenedNumber.toFixed())
            }
        },
        watch: {
            'riskNumSet.mutiple.number'(newVal) {
               TweenLite.to(this.$data.riskNumSet.mutiple, 2, { tweenedNumber: newVal });
            },
            'riskNumSet.bloodSugar.number'(newVal) {
               TweenLite.to(this.$data.riskNumSet.bloodSugar, 2, { tweenedNumber: newVal });
            },
            'riskNumSet.bloodPressure.number'(newVal) {
               TweenLite.to(this.$data.riskNumSet.bloodPressure, 2, { tweenedNumber: newVal });
            },

        },
        methods: {
            healthStatus(num) {
                let x = num
                switch(true) {
                    case x < 40: return {color: 'green', tip: '身体健康，继续保持'}
                    case x < 70 && x >= 40: return {color: 'yellow', tip: '健康预警，注意身体'}
                    case x >= 70: return {color: 'red', tip: '身体危险，请就医'}
                }
            },
            $_getRiskNum: async function() {
                this.loading = true
                await this.axios.get('/detail/blood-sugar/week')
                    .then((res) => {
                        let data = res.data.data
                        let arrData = []
                        let arrColor = []
                        let obj = {}
                        for(let item in data) {
                            let arr = data[item]
                            let result = 0
                            for(let i of arr) {
                                result += getStatus(i).sugar
                                this.riskNumSet.bloodSugar.tip = getStatus(i).tip
                            }
                            // console.log(this.riskNumSet.bloodSugar.tip)
                            result /= arr.length
                            obj[item] = result
                        }
                        arrData = [obj.beforeDawn, obj.morning, obj.noon, obj.dusk]
                        this.chartData = arrData

                        if(this.chartData.length) {
                            let m = 0
                            for(let item of this.chartData) {
                                m += item
                            }
                            m /= this.chartData.length
    
                            this.riskNumSet.bloodSugar.number = caculateRiskNum(m)
                            this.riskNumSet.bloodSugar.color = getColor(m)
                        }
                        
                        this.$_getPressureRisk()
                        this.loading = false
                        
                    })
                    .catch((error) => {  
                        console.log(error)
                        if(error.response.status = 401) {
                            MessageBox('提示', '登录过期，请重新登录')
                            .then(action => {
                                this.$router.push({name: 'login'})
                            })
                        }
                    })
                //危险度计算
                function caculateRiskNum(m) {
                    if(m > 6.1 && m <= 8.4) {
                        m = (m - 5) / 1.7
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                    } else if(m > 3.9 && m <= 6.1) {
                        m = Math.pow(m - 5, 4)
                        m = 0.2 * m
                    } else if(m <= 3.9) {
                        m = (5 - m) / 1.7
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                    }
                    // console.log(m)
                    return Math.round(m * 100)
                }
                //解密
                function getStatus(str) {
                    //最后一位忽略
                    if(!str) return { sugar: 0, color: '#000' }
                    const one = str.slice(0,1)
                    const two = str.slice(1,2)
                    const three = str.slice(2,3)
                    const four = str.slice(3,4)
                    // const five = str.slice(4,5)
                    //高血糖区域
                    if(two == 'h') {
                        if(three == 'h') {
                            switch(four){
                                case 'm': return { sugar: 7.0, color: '#e6a23c', tip: '已达到高血糖指标，建议提高健康意识' }
                                case 'a': return { sugar: 6.8, color: '#e6a23c', tip: '已达到高血糖指标，建议提高健康意识' }
                                case 'b': return { sugar: 6.5, color: '#e6a23c', tip: '已达到高血糖指标，建议提高健康意识' }
                                case 'c': return { sugar: 6.3, color: '#e6a23c', tip: '已达到高血糖指标，建议提高健康意识' }
                            }
                        } else if(three == 'l') {
                            switch(four){
                                case 'm': return { sugar: 8.4, color: '#f56c6c', tip: '血糖较高，可能存在轻度糖尿病，请就医' }
                                case 'a': return { sugar: 8.1, color: '#f56c6c', tip: '血糖较高，可能存在轻度糖尿病，请就医' }
                                case 'b': return { sugar: 7.7, color: '#f56c6c', tip: '血糖较高，可能存在轻度糖尿病，请就医' }
                                case 'c': return { sugar: 7.3, color: '#f56c6c', tip: '血糖较高，可能存在轻度糖尿病，请就医' }
                            }
                        } else if(three == 'm') {
                            switch(four){
                                case 'm': return { sugar: 11.1, color: '#ff0000', tip: '血糖高，存在中度糖尿病，请及时就医' }
                                case 'a': return { sugar: 10.5, color: '#ff0000', tip: '血糖高，存在中度糖尿病，请及时就医' }
                                case 'b': return { sugar: 9.8, color: '#ff0000', tip: '血糖高，存在中度糖尿病，请及时就医' }
                                case 'c': return { sugar: 9.1, color: '#ff0000', tip: '血糖高，存在中度糖尿病，请及时就医' }
                            }
                        } else if(three == 's') {
                            return { sugar: 13.0, color: '#A52A2A', tip: '患有重度糖尿病，请立即就医' }
                        } 
                    } 
                    //正常区域
                    else if(two == 'n') {
                        if(three == 'l') {
                            switch(four){
                                case 'm': return { sugar: 3.9, color: '#6666ff' }
                                case 'a': return { sugar: 3.7, color: '#6666ff' }
                                case 'b': return { sugar: 3.4, color: '#6666ff' }
                                case 'c': return { sugar: 3.1, color: '#6666ff' }
                            }
                        } else if(three == 'n') {
                            switch(four){
                                case 'm': return { sugar: 5.5, color: '#67c23a' }
                                case 'a': return { sugar: 5.3, color: '#67c23a' }
                                case 'b': return { sugar: 4.7, color: '#67c23a' }
                                case 'c': return { sugar: 4.1, color: '#67c23a' }
                            }
                        } else if(three == 'h') {
                            switch(four){
                                case 'm': return { sugar: 6.0, color: '#ffff37' }
                                case 'a': return { sugar: 5.9, color: '#ffff37' }
                                case 'b': return { sugar: 5.8, color: '#ffff37' }
                                case 'c': return { sugar: 5.7, color: '#ffff37' }
                            }
                        }
                    }
                    //低压区域
                    else if(two == 'l') {
                        return { sugar: 2.4, color: '#ff1493' }
                    }
                }
                function getColor(num) {
                    if(num <= 2.9) {
                        return '#ff1493'
                    } else if(num <= 3.9 && num > 2.9) {
                        return '#6666ff'
                    } else if(num <= 5.5 && num > 3.9) {
                        return '#67c23a'
                    } else if(num <= 6.0 && num > 5.5) {
                        return '#ffff37'
                    } else if(num <= 7.0 && num > 6.0) {
                        return '#e6a23c'
                    } else if(num <= 8.4 && num > 7.0) {
                        return '#f56c6c'
                    } else if(num <= 11.1 && num > 8.4) {
                        return '#ff0000'
                    } else if(num > 11.1) {
                        return '#A52A2A'
                    }
                }
            },
            $_getPressureRisk: async function() {
                
                await this.axios.get('/detail/blood-pressure/week')
                    .then((res) => {
                        let data = res.data.data
                        let highData = []
                        let lowData = []
                        let highColor = []
                        let lowColor = []

                        let highObj = {}
                        let lowObj = {}
                        for(let item in data) {
                            let arr = data[item]
                            let resultHigh = 0
                            let resultLow = 0
                            for(let i of arr) {
                                resultHigh += getStatusHigh(i.pressureHigh).pressure
                                resultLow += getStatusLow(i.pressureLow).pressure
                                this.riskNumSet.bloodPressure.tip = getStatusHigh(i.pressureHigh).tip
                            }
                            if(arr.length) {
                                resultHigh /= arr.length
                                resultLow /= arr.length
                            }
                            if(resultHigh > 0) {
                                highObj[item] = resultHigh
                                highData.push(resultHigh)
                            }
                            if(resultLow > 0) {
                                lowObj[item] = resultLow
                                lowData.push(resultLow)
                            }
                        }
                        
                        this.highData = highData
                        this.lowData = lowData

                        // console.log(this.highData)
                        if(this.highData.length || this.lowData.length) {
                            let m = 0
                            let n = 0
                            let riskNum = 0
                            let color = ''
                            // console.log(n)
                            for(let item of this.highData) {
                                m += item
                            }
                            m /= this.highData.length

                            for(let item of this.lowData) {
                                n += item
                            }
                            n /= this.lowData.length

                            //单纯收缩期
                            
                            let highRisk = caculateRiskNumHigh(m)
                            let lowRisk = caculateRiskNumLow(n)
                            // console.log(m)
                            // console.log(n)
                            if(highRisk > lowRisk) {
                                riskNum = highRisk
                                color = getColorHigh(m)
                            } else {
                                riskNum = lowRisk
                                color = getColorLow(n)
                            }

                            this.riskNumSet.bloodPressure.number = riskNum
                            this.riskNumSet.bloodPressure.color = color
                            // console.log(riskNum)
                            if(n < 90 && m >= 140) {
                                let risk = caculateRiskNumSimple(m)
                            }
                        }
                        
                        if(this.riskNumSet.bloodSugar.number > this.riskNumSet.bloodPressure.number) {
                            this.riskNumSet.mutiple.number = this.riskNumSet.bloodSugar.number
                            this.riskNumSet.mutiple.color = this.riskNumSet.bloodSugar.color

                        } else {
                            this.riskNumSet.mutiple.number = this.riskNumSet.bloodPressure.number
                            this.riskNumSet.mutiple.color = this.riskNumSet.bloodPressure.color
                        }
                            
                    })
                    .catch((error) => { 
                        console.log(error)
                        if(error.response.status = 401) {
                            MessageBox('提示', '登录过期，请重新登录')
                            .then(action => {
                                this.$router.push({name: 'login'})
                            })
                        }
                    })
                //危险度计算
                function caculateRiskNumHigh(m) {
                    
                    if(m >= 140) {
                        m = (m - 120) / 20
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                    } else if(m >= 90 && m < 110) {
                        m = Math.pow(110 - m, 3)
                        let n = Math.pow(10, -5)
                        m = 6.25 * n * m
                    } else if(m >= 110 && m < 140) {
                        m = Math.pow(m - 110, 4)
                        let n = Math.pow(10, -7)
                        m = 6.17 * n * m
                    } else if(m < 90) {
                        m = (100 - m) / 10
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                    }
                    console.log('高压危险度: ' + m)
                    return Math.round(m * 100)
                }
                function caculateRiskNumLow(m) {
                    if(m >= 90) {
                        m = (m - 80) / 10
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                        // console.log(m)
                    } else if(m >= 60 && m < 80) {
                        m = Math.pow(80 - m, 3)
                        let n = Math.pow(10, -5)
                        m = 6.25 * n * m
                    } else if(m >= 80 && m < 90) {
                        m = Math.pow(m - 80, 3)
                        let n = Math.pow(10, -4)
                        m = 5 * n * m
                    } else if(m < 60) {
                        m = (70 - m) / 10
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                    }
                    console.log('低压危险度: ' + m)
                    return Math.round(m * 100)
                }
                function caculateRiskNumSimple(m) {
                    console.log(m)
                    if(m > 160) {
                        m = (m - 150) / 10
                        m = Math.pow(m, -2) + 1
                        m = 1 / m
                        this.riskNumSet.bloodPressure.tip = '临界单纯收缩期高血压，请提高注意并就医检查'
                        this.riskNumSet.bloodPressure.color = '#ff1493'
                    } else if(m > 140 && m <= 160) {
                        m = Math.pow(m - 140, 3)
                        let n = Math.pow(10, -5)
                        m = 6.25 * n * m
                        this.riskNumSet.bloodPressure.tip = '存在单纯收缩期高血压，请立即就医治疗'
                        this.riskNumSet.bloodPressure.color = '#6666ff'
                    }
                    console.log('单期危险度: ' + m)
                    
                    return Math.round(m * 100)
                }
                //解密 -- 高
                function getStatusHigh(str) {
                    console.log(str)
                    //最后一位忽略
                    if(!str) return { pressure: 0, color: '#000' }
                    const one = str.slice(0,1)
                    const two = str.slice(1,2)
                    const three = str.slice(2,3)
                    const four = str.slice(3,4)
                    // const five = str.slice(4,5)
                    //高血压区域
                    if(two == 'h') {
                        if(three == 'l') {
                            switch(four){
                                case 'm': return { pressure: 160, color: '#e6a23c', tip: '存在轻度高血压，请关注自身健康' }
                                case 'a': return { pressure: 155, color: '#e6a23c', tip: '存在轻度高血压，请关注自身健康' }
                                case 'b': return { pressure: 150, color: '#e6a23c', tip: '存在轻度高血压，请关注自身健康' }
                                case 'c': return { pressure: 145, color: '#e6a23c', tip: '存在轻度高血压，请关注自身健康' }
                            }
                        } else if(three == 'm') {
                            switch(four){
                                case 'm': return { pressure: 180, color: '#f56c6c', tip: '中度高血压，存在较大风险，请及早就医治疗' }
                                case 'a': return { pressure: 175, color: '#f56c6c', tip: '中度高血压，存在较大风险，请及早就医治疗' }
                                case 'b': return { pressure: 170, color: '#f56c6c', tip: '中度高血压，存在较大风险，请及早就医治疗' }
                                case 'c': return { pressure: 165, color: '#f56c6c', tip: '中度高血压，存在较大风险，请及早就医治疗' }
                            }
                        } else if(three == 's') {
                            return { pressure: 190, color: '#ff0000', tip: '重度高血压，危险！请立即就医' }
                        } 
                    } 
                    //正常区域
                    else if(two == 'n') {
                        if(three == 'n') {
                            switch(four){
                                case 'm': return { pressure: 120, color: '#67c23a', tip: '血压处于正常范围，身体健康' }
                                case 'a': return { pressure: 112, color: '#67c23a', tip: '血压处于正常范围，身体健康' }
                                case 'b': return { pressure: 105, color: '#67c23a', tip: '血压处于正常范围，身体健康' }
                                case 'c': return { pressure: 97, color: '#67c23a', tip: '血压处于正常范围，身体健康' }
                            }
                        } else if(three == 'h') {
                            switch(four){
                                case 'm': return { pressure: 140, color: '#ffff37', tip: '血压处于正常范围内偏高，建议多加关注身体健康' }
                                case 'a': return { pressure: 135, color: '#ffff37', tip: '血压处于正常范围内偏高，建议多加关注身体健康' }
                                case 'b': return { pressure: 130, color: '#ffff37', tip: '血压处于正常范围内偏高，建议多加关注身体健康' }
                                case 'c': return { pressure: 125, color: '#ffff37', tip: '血压处于正常范围内偏高，建议多加关注身体健康' }
                            }
                        }
                    }
                    //低压区域
                    else if(two == 'l') {
                        return { pressure: 80, color: '#663399', tip: '当前处于低血压，切勿忽视，尽快就医' }
                    }
                }
                //解密 -- 低
                function getStatusLow(str) {
                    //最后一位忽略
                    if(!str) return { pressure: 0, color: '#000' }
                    const one = str.slice(0,1)
                    const two = str.slice(1,2)
                    const three = str.slice(2,3)
                    const four = str.slice(3,4)
                    // const five = str.slice(4,5)
                    //高血压区域
                    if(two == 'h') {
                        if(three == 'l') {
                            switch(four){
                                case 'm': return { pressure: 100, color: '#e6a23c' }
                                case 'a': return { pressure: 97, color: '#e6a23c' }
                                case 'b': return { pressure: 95, color: '#e6a23c' }
                                case 'c': return { pressure: 92, color: '#e6a23c' }
                            }
                        } else if(three == 'm') {
                            switch(four){
                                case 'm': return { pressure: 110, color: '#f56c6c' }
                                case 'a': return { pressure: 107, color: '#f56c6c' }
                                case 'b': return { pressure: 105, color: '#f56c6c' }
                                case 'c': return { pressure: 102, color: '#f56c6c' }
                            }
                        } else if(three == 's') {
                            return { pressure: 115, color: '#ff0000' }
                        } 
                    } 
                    //正常区域
                    else if(two == 'n') {
                        if(three == 'n') {
                            switch(four){
                                case 'm': return { pressure: 80, color: '#67c23a' }
                                case 'a': return { pressure: 75, color: '#67c23a' }
                                case 'b': return { pressure: 70, color: '#67c23a' }
                                case 'c': return { pressure: 65, color: '#67c23a' }
                            }
                        } else if(three == 'h') {
                            switch(four){
                                case 'm': return { pressure: 90, color: '#ffff37' }
                                case 'a': return { pressure: 87, color: '#ffff37' }
                                case 'b': return { pressure: 85, color: '#ffff37' }
                                case 'c': return { pressure: 82, color: '#ffff37' }
                            }
                        }
                    }
                    //低压区域
                    else if(two == 'l') {
                        return { pressure: 80, color: '#663399' }
                    }
                }
                //颜色 -- 高
                function getColorHigh(num) {
                    console.log(num)
                    if(num <= 90) {
                        return '#663399'
                    } else if(num <= 120 && num > 90) {
                        return '#67c23a'
                    } else if(num <= 140 && num > 120) {
                        return '#ffff37'
                    } else if(num <= 160 && num > 140) {
                        return '#e6a23c'
                    } else if(num <= 180 && num > 160) {
                        return '#f56c6c'
                    } else if(num > 180) {
                        return '#ff0000'
                    }
                }

                //颜色 -- 低
                function getColorLow(num) {
                    if(num <= 60) {
                        return '#663399'
                    } else if(num <= 80 && num > 60) {
                        return '#67c23a'
                    } else if(num <= 90 && num > 80) {
                        return '#ffff37'
                    } else if(num <= 100 && num > 90) {
                        return '#e6a23c'
                    } else if(num <= 110 && num > 100) {
                        return '#f56c6c'
                    } else if(num > 110) {
                        return '#ff0000'
                    }
                }
            }
        },
        mounted() {
            // this.$_getRiskNum()
            // for(let item in this.riskNumSet) {
            //     this.riskNumSet[item].number = this.$store.state.riskNum[item]
            // }
        }
    }
</script>

<style lang="less">
    #home {
        height: 100%;
        overflow: scroll;
        .test-header {
            display: flex;
            align-items: center;
            flex-direction: column;
            height: 350px;
            background: linear-gradient(rgb(118, 218, 243),rgb(97, 236, 160));
            .header {
                font-weight: 600;
                font-size: 22px;
            }
            .circle-text {
                width: 120px;
                height: 100px;
                margin: auto;
                // .circle-text-container {
                //     animation: movedown 1s;
                // }
                p {
                    margin: 0;
                }
                .num {
                    font-size: 40px;
                    font-weight: 600;
                }
                .tip {
                    margin: 6px;
                    font-size: 12px;
                }
            }
        }

        .swipe {
            margin-bottom: 10px;
            width: 100%;
            height: 31%;
            // background-color: red;
        }

        .test-container {
            margin: 10px 0;
            // background-color: #eee;
            .test-item {
                height: 120px;
                display: flex;
                align-items: center;
                padding: 0 40px;
                background-color:#fff;
                border-top: 1px solid #409EFF;
                border-bottom: 1px solid #409EFF;
                margin-top: 10px;
                border-radius: 4px;
                .item-text {
                    width: calc(100% - 80px);
                    height: 100%;
                    padding: 20px;
                    text-align: left;
                    margin-left: 20px;
                    .header {
                        height:50%;
                        font-size: 20px;
                        font-weight: 600;
                    }
                    .footer {
                        word-wrap: break-word;
                    }
                    .el-progress {
                        background-color: #fff;
                    }
                }
                &:first-child {
                    margin-top: 0px;
                }
            }
        }
        @keyframes movedown {
            from { transform: translateY(0) }
            to {  transform: translateY(20%) }
        }
    }
</style>