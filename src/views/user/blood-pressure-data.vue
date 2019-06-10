<template>
    <div id="blood-pressure-data" v-loading.fullscreen.lock="loading">
        <div class="header">
            <div class="left" @click="() => {this.$router.back()}"><i class="el-icon-arrow-left"></i></div>
            {{ `血压记录` }}
        </div>

        <div class="chart-title">
            <div class="item">
                <div class="block-color" style="background-color:#663399"></div>
                <p>低血压</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#67c23a"></div>
                <p>正常血压</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#ffff37"></div>
                <p>正常偏高</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#e6a23c"></div>
                <p>轻度高血压</p>
            </div>
        </div>
        <div class="chart-title">
            <div class="item">
                <div class="block-color" style="background-color:#f56c6c"></div>
                <p>中度高血压</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#ff0000"></div>
                <p>重度高血压</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#6666ff"></div>
                <p>临界单期</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#ff1493"></div>
                <p>单纯收缩期</p>
            </div>
        </div>
        <div class="row">
            <div class="dateTime">日期</div>
            <div class="dayTime">时间</div>
            <div class="dateTime">高压</div>
            <div class="dayTime">低压</div>
        </div>

        <div class="row" v-for="(item, index) in chartData" :key="index">
            <div class="dateTime">{{ $_formDate(item.date) }}</div>
            <div class="dayTime">{{ $_formDay(item.date) }}</div>
            <div class="dateTime">
                <div class="colorBlock" :style="`background-color:${item.pressureHigh.color}`"></div>
            </div>
            <div class="dayTime">
                <div class="colorBlock" :style="`background-color:${item.pressureLow.color}`"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'blood-pressure-data',
    data() {
        return {
            chartData: {},
            loading: false,
        }
    },
    methods: {
        $_formDate(time) {
            let myDate = new Date(time)
            let month = myDate.getMonth() + 1
            let day = myDate.getDate()
            month = month < 10 ? `0${month}` : month
            day = day < 10 ? `0${day}` : day
            return `${month}/${day}`
        },
        $_formDay(timec) {
            let myDate = new Date(timec)
            let time = myDate.getHours()
            if(time >= 6 && time < 10) {
                return '早晨'
            } else if(time >= 11 && time < 15) {
                return '中午'
            } else if(time >= 16 && time < 20) {
                return '黄昏'
            } else if(time >= 21 && time < 24) {
                return '睡前'
            } else {
                return '其他时间'
            }
        },
        //按时间戳从小打到排序
        sortBobble(arr) {
            let result = []
            while(arr.length > 0){
                let tmp = arr[0].date
                let index = 0
                for(let j = 0; j < arr.length; j++) {
                    if(tmp < arr[j].date) {'s'}
                    else {
                        tmp = arr[j].date
                        index = j
                    }
                }
                result.push(arr[index])
                arr.splice(index, 1)
            }
            return result
        },
        $_getData: async function() {
            this.loading = true
            this.axios.get('/api/detail/blood-pressure/list')
                .then((res) => {
                    let data = res.data.data
                    data = this.sortBobble(data)
                    for(let item in data) {
                        data[item].pressureHigh = getStatusHigh(data[item].pressure_high)
                        data[item].pressureLow = getStatusLow(data[item].pressure_low)
                    }
                    this.chartData = data
                    console.log(this.chartData)
                })
                .catch((error) => {
                    if(error.response.status == 401) {
                        MessageBox('提示', '登录过期，请重新登录')
                        .then(action => {
                            this.$router.push({name: 'login'})
                        })
                    }
                })

            //解密 -- 高
            function getStatusHigh(str) {
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
                            case 'm': return { pressure: 160, color: '#e6a23c' }
                            case 'a': return { pressure: 155, color: '#e6a23c' }
                            case 'b': return { pressure: 150, color: '#e6a23c' }
                            case 'c': return { pressure: 145, color: '#e6a23c' }
                        }
                    } else if(three == 'm') {
                        switch(four){
                            case 'm': return { pressure: 180, color: '#f56c6c' }
                            case 'a': return { pressure: 175, color: '#f56c6c' }
                            case 'b': return { pressure: 170, color: '#f56c6c' }
                            case 'c': return { pressure: 165, color: '#f56c6c' }
                        }
                    } else if(three == 's') {
                        return { pressure: 190, color: '#ff0000' }
                    } 
                } 
                //正常区域
                else if(two == 'n') {
                    if(three == 'n') {
                        switch(four){
                            case 'm': return { pressure: 120, color: '#67c23a' }
                            case 'a': return { pressure: 112, color: '#67c23a' }
                            case 'b': return { pressure: 105, color: '#67c23a' }
                            case 'c': return { pressure: 97, color: '#67c23a' }
                        }
                    } else if(three == 'h') {
                        switch(four){
                            case 'm': return { pressure: 140, color: '#ffff37' }
                            case 'a': return { pressure: 135, color: '#ffff37' }
                            case 'b': return { pressure: 130, color: '#ffff37' }
                            case 'c': return { pressure: 125, color: '#ffff37' }
                        }
                    }
                }
                //低压区域
                else if(two == 'l') {
                    return { pressure: 80, color: '#663399' }
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

            this.loading = false
        }        
    },
    mounted() {
        this.$_getData()
    }
}
</script>

<style lang="less">
    @flex-center: {
        display: flex;
        justify-content: center;
        align-items: center;
    };
    #blood-pressure-data {
        background-color: #fff;
        .header {
            height: 60px;
            line-height: 60px;
            color:#fff;
            background: linear-gradient(rgb(97, 118, 236),rgb(64, 202, 236));
            .left {
                width: 60px;
                font-size: 28px;
                position: absolute;
                left: 0;
            }
        }

        .chart-title {
            margin: 15px 0;
            padding: 0 18px;
            height: 50px;
            display: flex;
            .item {
                width: 22%;
                height: 100%;
                margin-right: 4%;
                
                &:last-child {
                    margin-right: 0;
                }
                .block-color {
                    width: 100%;
                    height: 30px;
                    border-radius: 8%;
                }
                p {
                    margin: 0;
                    margin-top: 4px;
                    font-size: 14px;
                }
            }
        }
        
        .row {
            display: flex;
            .dateTime {
                @flex-center();
                width: 25%;
                height: 40px;
                padding: 5px;
                border-top: 1px solid #DCDFE6;
                background-color: #F2F6FC;
                .colorBlock {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
            }
            .dayTime {
                @flex-center();
                width: 25%;
                height: 40px;
                padding: 5px;
                border-top: 1px solid #DCDFE6;
                .colorBlock {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
            }
            // .data {
            //     @flex-center();
            //     width: 50%;
            //     height: 40px;
            //     border-top: 1px solid #DCDFE6;
            //     background-color: #F2F6FC;
            // }
        }
    }
</style>