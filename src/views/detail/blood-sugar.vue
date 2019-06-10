<template>
    <div id="blood-sugar" v-loading.fullscreen.lock="loading">

        <el-radio-group style="margin-top: 15px" v-model="active">
            <el-radio-button label="chart1">今日状况</el-radio-button>
            <el-radio-button label="chart2">本周平均</el-radio-button>
            <el-radio-button label="chart3">本月平均</el-radio-button>
        </el-radio-group>

        <div class="chart">
            <div class="chart-header">血糖危险度示意图</div>
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
            <div class="chart-container">
                <mt-tab-container v-model="active">
                    <mt-tab-container-item id="chart1">
                        <canvas class="sugarChartToday" height="80%" width="80%"></canvas>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="chart2">
                        <canvas class="sugarChartWeek" height="80%" width="80%"></canvas>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="chart3">
                        <canvas class="sugarChartMonth" height="80%" width="80%"></canvas>
                    </mt-tab-container-item>
                </mt-tab-container>                
            </div>
        </div>

        <div class="chart">
            <div class="chart-header">血糖变化趋势图</div>
            <div class="chart-container">
                <canvas class="sugarChartTrend" height="80%" width="80%"></canvas>               
            </div>
        </div>
        <!-- <div style="width:100px;height:50px;background-color:#f56c6c">test</div> -->
        <mt-button type="primary" size="large" @click="() => {this.$router.push({name: 'blood-sugar-data'})}">查看详细数据</mt-button>
    </div>
</template>

<script>
    import Chart from 'chart.js'
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'blood-sugar',
        data() {
            return {
                active: 'chart1',
                chartData: {
                    today: {
                        date: ['凌晨', '清晨', '中午', '黄昏'],
                        sugar: [5.6, 6.1, 4.5, 4.6],
                        color: []
                    },
                    week: {
                        date: ['凌晨', '清晨', '中午', '黄昏'],
                        sugar: [],
                        color: []
                    },
                    month: {
                        date: ['凌晨', '清晨', '中午', '黄昏'],
                        sugar: [5.6, 6.1, 4.5, 6.2],
                        color: []
                    },
                    trend: {
                        date: [],
                        sugar: [],
                    }
                },
                data: [],
                loading: false,
            }
        },
        computed: {
            // maxData() {
            //     let max = Math.max.apply(null, this.chartData[2].data) + 1 
            //     return parseFloat(max.toFixed(1)) 
            // },
            // minData() {
            //     let min = Math.min.apply(null, this.chartData[2].data) - 1
            //     return parseFloat(min.toFixed(1)) 
            // },
            // isGetData() {
            //     return this.data.length
            // },
            
        },
        methods: {
            getMaxData(arr) {
                // console.log(arr)
                let max = Math.max.apply(null, arr) 
                return parseInt(max) 
            },
            // getMinData(day) {
            //     let min = Math.min.apply(null, this.chartData[day].data)
            //     return parseFloat(min.toFixed(1)) 
            // },
            //正常，过高，过低的次数及百分比
            // $_classify(data) {
            //     let tmp = {
            //         high: [],
            //         medium: [],
            //         low: [],
            //     }
            //     data.map((i) => {
            //         if(i >= 6.1) {
            //             tmp.high.push(i)
            //         } else if(i <= 3.9) {
            //             tmp.low.push(i)
            //         } else {
            //             tmp.medium.push(i)
            //         } 
            //     })
            //     let p = {}, time = {}, total = 0
            //     for(let i in tmp) {
            //         let d = Math.round((tmp[i].length / data.length) * 100) 
            //         d == 0 ? p[`${i}Rate`] = `00` : p[`${i}Rate`] = d
            //     }
            //     for(let i in tmp) {
            //         time[`${i}Time`] = tmp[i].length
            //         total += tmp[i].length
            //     }
            //     p = Object.assign(p, time)
            //     p["totalTime"] = total
            //     return p
            // },
            // //平均血糖，平均血氧浓度
            // $_average(data) {
            //     // console.log('data:'+data)
            //     let sum = 0
            //     data.map((i) => { sum += i })
            //     let p = parseFloat((sum / data.length).toFixed(2))
            //     // console.log('p:'+p)
            //     let tmp = {
            //         average: p.toFixed(2),
            //         imitate: ((p + 4.29) / 1.98).toFixed(2)
            //     }
            //     return tmp
            // },

            //按照时间排序
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
            $_formDate(time) {
                let myDate = new Date(time)
                let month = myDate.getMonth() + 1
                let day = myDate.getDate()
                month = month < 10 ? `0${month}` : month
                day = day < 10 ? `0${day}` : day
                return `${month}/${day}`
            },
            $_getData: async function() {
                this.loading = true
                //日
                await this.axios.get('/api/detail/blood-sugar/today')
                    .then((res) => {
                        let data = res.data.data
                        let arrData = []
                        let arrColor = []
                        let obj = {
                            beforeDawn: [],
                            morning: [],
                            noon: [],
                            dusk: [],
                        }
                        // console.log(data)
                        for(let item in data) {
                            let arr = data[item]
                            if(!arr.length) continue
                            let result = 0
                            for(let i of arr) {
                                result += getStatus(i).sugar
                            }
                            result /= arr.length
                            obj[item] = result
                        }
                        arrData = [obj.beforeDawn, obj.morning, obj.noon, obj.dusk]
                        for(let i of arrData) {
                            arrColor.push(getColor(i))
                        }
                        
                        this.chartData.today.sugar = arrData
                        this.chartData.today.color = arrColor
                        this.makeChartToday()
                        // console.log(arrData)
                        // console.log(arrColor)
                        this.loading = false
                        
                    })
                    .catch((error) => {  
                        if(error.response.status == 401) {
                            MessageBox('提示', '登录过期，请重新登录')
                            .then(action => {
                                this.$router.push({name: 'login'})
                            })
                        }
                    })

                //周
                await this.axios.get('/api/detail/blood-sugar/week')
                    .then((res) => {
                        let data = res.data.data
                        let arrData = []
                        let arrColor = []
                        let obj = {
                            beforeDawn: [],
                            morning: [],
                            noon: [],
                            dusk: [],
                        }
                        for(let item in data) {
                            let arr = data[item]
                            if(!arr.length) continue
                            let result = 0
                            // console.log(arr)
                            for(let i of arr) {
                                let obj = getStatus(i)
                                // console.log(obj)
                                // console.log(obj.sugar)
                                result += obj.sugar
                            }
                            result /= arr.length
                                // console.log(result)
                            obj[item] = result
                            // arrData.push(getStatus(data[item][i]).sugar)
                            // arrColor.push(getStatus(data[item][i]).color)
                        }
                        // console.log(obj)
                        arrData = [obj.beforeDawn, obj.morning, obj.noon, obj.dusk]
                        // console.log(arrData)
                        for(let i of arrData) {
                            arrColor.push(getColor(i))
                        }
                        // console.log(arrColor)
                        this.chartData.week.sugar = arrData
                        this.chartData.week.color = arrColor
                        this.makeChartWeek()
                        this.loading = false
                        
                    })
                    .catch((error) => {  
                        console.log(error)
                    })
                //月
                await this.axios.get('/api/detail/blood-sugar/month')
                    .then((res) => {
                        let data = res.data.data
                        let arrData = []
                        let arrColor = []
                        let obj = {
                            beforeDawn: [],
                            morning: [],
                            noon: [],
                            dusk: [],
                        }
                        for(let item in data) {
                            let arr = data[item]
                            if(!arr.length) continue
                            let result = 0
                            for(let i of arr) {
                                result += getStatus(i).sugar
                            }
                            result /= arr.length
                            obj[item] = result
                            // arrData.push(getStatus(data[item][i]).sugar)
                            // arrColor.push(getStatus(data[item][i]).color)
                        }
                        // console.log(obj)
                        arrData = [obj.beforeDawn, obj.morning, obj.noon, obj.dusk]
                        // console.log(arrData)
                        for(let i of arrData) {
                            arrColor.push(getColor(i))
                        }
                        // console.log(arrColor)
                        this.chartData.month.sugar = arrData
                        this.chartData.month.color = arrColor
                        this.makeChartMonth()
                        this.loading = false
                        
                    })
                    .catch((error) => {  
                        console.log(error)
                    })

                //趋势
                await this.axios.get('/api/detail/blood-sugar/list')
                    .then(res => {
                        let data = res.data.data
                        data = this.sortBobble(data)
                        // console.log(data)
                        let arrTime = []
                        let arrSugar = []
                        for(let i = 0; i < data.length; i++) {
                            // console.log(getStatus(data[i].blood_sugar))
                            // console.log(this.$_formDate(data[i].date))
                            arrTime.push(this.$_formDate(data[i].date))
                            arrSugar.push((getStatus(data[i].blood_sugar).sugar))
                        }
                        if(arrSugar.length > 15) {
                            for(let i = 0; i < (arrSugar.length-15); i++) {
                                // console.log('hhh')
                                arrSugar.shift()
                                arrTime.shift()
                                // console.log(arrSugar)
                                // console.log(arrTime)
                            }
                        }
                        this.chartData.trend.date = arrTime
                        this.chartData.trend.sugar = arrSugar
                        this.lineChart()
                        // console.log(arrTime)
                        
                    })
                    .catch(err => {
                        console.log(err)
                    })
                
                //解密
                this.loading = false
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
                    //低糖区域
                    else if(two == 'l') {
                        return { sugar: 2.4, color: '#663399' }
                    }
                }
                function getColor(num) {
                    if(num <= 2.9) {
                        return '#663399'
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
                function bloodArray(day) {
                    let arr = []
                    for(let i = 0; i < day; i++) {
                        arr = arr.concat(this.data[i].data)
                    }
                    arr = arr.map((i) => { return i = i - 0 })
                    return arr
                }
            },

            makeChartToday() {
                var ctx = document.getElementsByClassName("sugarChartToday");
                var data = {
                    labels: this.chartData.today.date,
                    datasets: [
                        {
                            backgroundColor: this.chartData.today.color,
                            // borderColor: this.chartData.today.color,
                            data: this.chartData.today.sugar,
                        }, 
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                suggestMax: 15.0,
                                suggestMin: 1.0,
                                max: this.getMaxData(this.chartData.today.sugar) + 1,
                                min: 0,
                            }
                        }]
                    },
                    legend: {
                        display: false,
                    }
                }
                var myChart = new Chart(ctx, {
                    type: "bar",
                    data: data,
                    options: options
                });
            },
            makeChartWeek() {
                var ctx = document.getElementsByClassName("sugarChartWeek");
                var data = {
                    labels: this.chartData.week.date,
                    datasets: [
                        {
                            backgroundColor: this.chartData.week.color,
                            data: this.chartData.week.sugar,
                        }, 
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                suggestMax: 15.0,
                                suggestMin: 1.0,
                                max: this.getMaxData(this.chartData.week.sugar) + 1,
                                min: 0,
                            }
                        }]
                    },
                    legend: {
                        display: false,
                    }
                }
                var myChart = new Chart(ctx, {
                    type: "bar",
                    data: data,
                    options: options
                });
            },
            makeChartMonth() {
                var ctx = document.getElementsByClassName("sugarChartMonth");
                var data = {
                    labels: this.chartData.month.date,
                    datasets: [
                        {
                            backgroundColor: this.chartData.month.color,
                            data: this.chartData.month.sugar,
                        }, 
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                suggestMax: 15.0,
                                suggestMin: 1.0,
                                max: this.getMaxData(this.chartData.month.sugar) + 1,
                                min: 0,
                            }
                        }]
                    },
                    legend: {
                        display: false,
                    }
                }
                var myChart = new Chart(ctx, {
                    type: "bar",
                    data: data,
                    options: options
                });
            },
            lineChart() {
                var ctx = document.getElementsByClassName("sugarChartTrend");
                var data = {
                    labels: this.chartData.trend.date,
                    datasets: [
                        {
                            label: "血糖浓度",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "#aaa",
                            pointStyle: "circle",
                            pointRadius: 0,
                            borderColor: "#aaa",
                            borderWidth: 2,
                            data: this.chartData.trend.sugar,
                        },
                        {
                            label: "高血糖线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(103, 194, 58, 0.2)",
                            borderColor: "#F56C6C",
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [5, 5],  
                            data: new Array(this.chartData.trend.sugar.length).fill(6.1),
                        },
                        {
                            label: "低血糖线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(230, 162, 60, 0.2)",
                            borderColor: "#E6A23C",
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [5, 5], 
                            data: new Array(this.chartData.trend.sugar.length).fill(3.9),
                        },
                        
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestMax: 15.0,
                                suggestMin: 3.0,
                                // max: this.maxData,
                                // min: this.minData,
                            }
                        }]
                    },
                    legend: {
                        // display: false,
                        // onClick(e, item) {
                        //     console.log(item);
                        // }
                    }
                }
                var myChart = new Chart(ctx, {
                    type: "line",
                    data: data,
                    options: options
                });
            },
            pieChart(i) {
                var ctx = document.getElementsByClassName("pieChart")[i]
                var obj = this.chartData[i].classify
                var data = {
                    datasets: [
                        {
                            backgroundColor: ["#E6A23C", "#F56C6C", "#67C23A"],
                            data: new Array(obj.lowTime, obj.highTime, obj.mediumTime)
                        }
                    ]
                }
                var options = {
                    legend: {
                        display: false,
                    }
                }
                var myPieChart = new Chart(ctx, {
                    type: 'pie',
                    data: data,
                    options: options
                });
            }
        },
        mounted() {
            this.$_getData()
            
            // console.log(this.testData[0].lunch)
            // for(let i = 0; i < 3; i++){
            //     this.pieChart(i)
            // }
        }
    }
</script>

<style lang="less">
    #blood-sugar {
        width: 100%;
        padding: 0 10px 20px 10px;
        .chart {
            margin: 20px 0px;
            padding-bottom: 10px;
            background-color: #fff;
            border-radius: 8px;
            .chart-header {
                height: 44px;
                line-height: 44px;
                margin-bottom: 15px;
                border-bottom: 1px solid #303133;
            }
            .chart-title {
                padding: 0 18px;
                height: 56px;
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
                        // background-color: red;
                    }
                    p {
                        margin: 0;
                        margin-top: 4px;
                        font-size: 14px;
                    }
                }
            }
            .chart-container {
                margin: 15px 0;
                .chart-form {
                    width: 100%;
                    height: 300px;
                    .header {
                        width: 100%;
                        height: 60px;
                        border-bottom: 1px solid #606266;
                        display: flex;
                        .item {
                            width: 50%;
                            padding: 0 10px;
                            display: flex;
                            // justify-content: center;
                            align-items: center;
                            position: relative;
                            .left {
                                margin-left: 14px;
                            }
                            .right {
                                position: absolute;
                                right: 14px;
                                .float {
                                    font-size: 12px;
                                }
                                .word {
                                    font-size: 24px;
                                    margin: 0 4px;
                                }
                            }
                            &:first-child {
                                border-right: 1px solid #606266;
                                display: flex;
                                
                            }
                            
                        }
                        // p {
                        //     margin: auto;
                        //     width: 50%;
                        //     font-size: 16px;
                        // }
                    }
                    .context {
                        // padding: 10px 10%;
                        // text-align: left;
                        height: calc(100% - 120px);
                        display: flex;
                        align-items: center;
                        .left {
                            width: 50%;
                            .item {
                                display: block;
                                margin: 10px 30px;
                                text-align: left;
                                .el-tag {
                                    font-size: 16px;
                                }
                                span {
    
                                }
                            }
                        }
                        .right {
                            margin: auto;
                            .text {
                                margin-top: 5px;
                            }
                        }
                    }
                }
            }
        }
        .add-data {

            .devide-line {
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                background-color: #606266;
                margin-top: 20px;
            }
        }
    }
</style>