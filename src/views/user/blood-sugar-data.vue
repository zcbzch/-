<template>
    <div id="blood-sugar-data" v-loading.fullscreen.lock="loading">
        <div class="header">
            <div class="left" @click="() => {this.$router.back()}"><i class="el-icon-arrow-left"></i></div>
            {{ `血糖记录` }}
        </div>

        <div class="chart-title">
            <div class="item">
                <div class="block-color" style="background-color:#663399"></div>
                <p>低血糖</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#6666ff"></div>
                <p>血糖偏低</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#67c23a"></div>
                <p>非常正常</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#ffff37"></div>
                <p>血压偏高</p>
            </div>
        </div>
        <div class="chart-title">
            <div class="item">
                <div class="block-color" style="background-color:#e6a23c"></div>
                <p>高血糖</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#f56c6c"></div>
                <p>轻度糖尿病</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#ff0000"></div>
                <p>中度糖尿病</p>
            </div>
            <div class="item">
                <div class="block-color" style="background-color:#A52A2A"></div>
                <p>重度糖尿病</p>
            </div>
        </div>
        <div class="row">
            <div class="dateTime">日期</div>
            <div class="dayTime">时间</div>
            <div class="data">血糖安全度</div>
        </div>

        <div class="row" v-for="(item, index) in chartData" :key="index">
            <div class="dateTime">{{ $_formDate(item.date) }}</div>
            <div class="dayTime">{{ $_formDay(item.date) }}</div>
            <div class="data">
                <div class="colorBlock" :style="`background-color:${item.blood_sugar.color}`"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'blood-sugar-data',
    data() {
        return {
            chartData: {},
            loading: false
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
            if(time >= 0 && time < 6) {
                return '凌晨'
            } else if(time >= 6 && time < 10) {
                return '早晨'
            } else if(time >= 11 && time < 15) {
                return '中午'
            } else if(time >= 16 && time < 20) {
                return '黄昏'
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
            this.axios.get('/api/detail/blood-sugar/list')
                .then((res) => {
                    let data = res.data.data
                    data = this.sortBobble(data)
                    for(let item in data) {
                        data[item].blood_sugar = getStatus(data[item].blood_sugar)
                    }
                    this.chartData = data
                })
                .catch((error) => {
                    if(error.response.status == 401) {
                        MessageBox('提示', '登录过期，请重新登录')
                        .then(action => {
                            this.$router.push({name: 'login'})
                        })
                    }
                })
                function getStatus(str) {
                    //最后一位忽略
                    if(!str) return { sugar: 0, color: '#000' }
                    const one = str.slice(0,1)
                    const two = str.slice(1,2)
                    const three = str.slice(2,3)
                    const four = str.slice(3,4)
                    // const five = str.slice(4,5)
                    //高血压区域
                    if(two == 'h') {
                        if(three == 'h') {
                            switch(four){
                                case 'm': return { sugar: 7.0, color: '#e6a23c' }
                                case 'a': return { sugar: 6.8, color: '#e6a23c' }
                                case 'b': return { sugar: 6.5, color: '#e6a23c' }
                                case 'c': return { sugar: 6.3, color: '#e6a23c' }
                            }
                        } else if(three == 'l') {
                            switch(four){
                                case 'm': return { sugar: 8.4, color: '#f56c6c' }
                                case 'a': return { sugar: 8.1, color: '#f56c6c' }
                                case 'b': return { sugar: 7.7, color: '#f56c6c' }
                                case 'c': return { sugar: 7.3, color: '#f56c6c' }
                            }
                        } else if(three == 'm') {
                            switch(four){
                                case 'm': return { sugar: 11.1, color: '#ff0000' }
                                case 'a': return { sugar: 10.5, color: '#ff0000' }
                                case 'b': return { sugar: 9.8, color: '#ff0000' }
                                case 'c': return { sugar: 9.1, color: '#ff0000' }
                            }
                        } else if(three == 's') {
                            return { sugar: 13.0, color: '#A52A2A' }
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
                        return { sugar: 2.4, color: '#663399' }
                    }
                }
            this.loading = false
        }        
    },
    mounted() {
        // this.rowData = this.$store.state.sugarData
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
    #blood-sugar-data {
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
            }
            .dayTime {
                @flex-center();
                width: 25%;
                height: 40px;
                padding: 5px;
                border-top: 1px solid #DCDFE6;
            }
            .data {
                @flex-center();
                width: 50%;
                height: 40px;
                border-top: 1px solid #DCDFE6;
                background-color: #F2F6FC;
                padding: 5px;
                .colorBlock {
                    width: 100%;
                    height: 100%;
                    border-radius: 4px;
                }
            }
        }
    }
</style>