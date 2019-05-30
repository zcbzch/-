<template>
    <div id="blood-pressure" v-loading.fullscreen.lock="loading">

        <el-radio-group style="margin-top: 15px" v-model="active">
            <el-radio-button label="chart1">今日状况</el-radio-button>
            <el-radio-button label="chart2">本周平均</el-radio-button>
            <el-radio-button label="chart3">本月平均</el-radio-button>
        </el-radio-group>

        <div class="chart">
            <div class="chart-header">血压危险度示意图</div>
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
            <div class="chart-container">
                <el-tag type="warning" style="font-size:14px"><i class="el-icon-warning"></i> 左侧为收缩压，右侧为舒张压</el-tag>
                <mt-tab-container v-model="active">
                    <mt-tab-container-item id="chart1">
                        <canvas class="pressureChartToday" height="80%" width="80%"></canvas>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="chart2">
                        <canvas class="pressureChartWeek" height="80%" width="80%"></canvas>
                    </mt-tab-container-item>
                    <mt-tab-container-item id="chart3">
                        <canvas class="pressureChartMonth" height="80%" width="80%"></canvas>
                    </mt-tab-container-item>
                </mt-tab-container> 
            </div>
        </div>

        <!-- 高压趋势 -->
        <div class="chart">
            <div class="chart-header">收缩压变化趋势图（月）</div>
            <div class="chart-container">
                <canvas class="pressureChartTrendHigh" height="80%" width="80%"></canvas>
            </div>
        </div>

        <!-- 低压趋势 -->
        <div class="chart">
            <div class="chart-header">舒张压变化趋势图（月）</div>
            <div class="chart-container">
                <canvas class="pressureChartTrendLow" height="80%" width="80%"></canvas>
            </div>
        </div>

        <mt-button type="primary" size="large" @click="() => {this.$router.push({name: 'blood-pressure-data'})}">查看详细数据</mt-button>
    </div>
</template>

<script>
    import Chart from 'chart.js'
    import { MessageBox } from 'mint-ui';
    export default {
        name: 'blood-pressure',
        data() {
            return {
                active: 'chart1',
                chartData: {
                    today: {
                        date: ['清晨', '中午', '黄昏', '睡前'],
                        pressureHigh: [],
                        pressureLow: [],
                        colorHigh: [],
                        colorLow: [],
                    },
                    week: {
                        date: ['清晨', '中午', '黄昏', '睡前'],
                        pressureHigh: [],
                        pressureLow: [],
                        colorHigh: [],
                        colorLow: [],
                    },
                    month: {
                        date: ['清晨', '中午', '黄昏', '睡前'],
                        pressureHigh: [],
                        pressureLow: [],
                        colorHigh: [],
                        colorLow: [],
                    },
                    trend: {
                        date: [],
                        high: [],
                        low: [],
                    }
                },
                data: [],
                loading: false,
            }
        },
        computed: {
            // maxData() {
            //     let max = Math.max.apply(null, this.chartData[2].high) + 20 
            //     return parseInt(max) 
            // },
            // minData() {
            //     let min = Math.min.apply(null, this.chartData[2].low) - 20
            //     return parseFloat(min) 
            // },
            // maxDataHeart() {
            //     let max = Math.max.apply(null, this.chartData[2].heartRate) + 5
            //     return parseInt(max) 
            // },
            // minDataHeart() {
            //     let min = Math.min.apply(null, this.chartData[2].heartRate) - 5
            //     return parseFloat(min) 
            // },
        },
        methods: {
            getMaxData(arr) {
                for(let i = 0; i < arr.length; i++) {
                    if(isNaN(arr[i])) arr[i] = 0
                }
                let max = Math.max.apply(null, arr) 
                // console.log('max: ' + max)
                return parseInt(max) 
            },
            getLineMax(arr, index) {
                let max = Math.max.apply(null, arr) 
                if(index == 'high') {
                    if(max > 150) return max
                    
                    else return 150
                }
                else if(index == 'low') {
                    if(max > 100) return max
                    else return 100
                }
            },
            getLineMin(arr, index) {
                let min = Math.min.apply(null, arr) 
                if(index == 'high') {
                    if(min < 80) return min
                    else return 80
                }
                else if(index == 'low') {
                    if(min < 50) return min
                    else return 50
                }
            },
            //时间 月/日
            $_formDate(time) {
                let myDate = new Date(time)
                let month = myDate.getMonth() + 1
                let day = myDate.getDate()
                month = month < 10 ? `0${month}` : month
                day = day < 10 ? `0${day}` : day
                return `${month}/${day}`
            },
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
            $_getData: async function() {
                this.loading = true
                await this.axios.get('/detail/blood-pressure/today')
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
                            }
                            if(arr.length) {
                                resultHigh /= arr.length
                                resultLow /= arr.length
                            }
                            highObj[item] = resultHigh
                            lowObj[item] = resultLow
                        }
                        highData = [highObj.beforeSleep, highObj.morning, highObj.noon, highObj.dusk]
                        lowData = [lowObj.beforeSleep, lowObj.morning, lowObj.noon, lowObj.dusk]
                        for(let i of highData) {
                            highColor.push(getColorHigh(i))
                        }
                        for(let i of lowData) {
                            lowColor.push(getColorLow(i))
                        }
                        //单期收缩变色
                        for(let i = 0; i < highData.length; i++) {
                            if(highData[i] > 140 && highData[i] <= 160 && lowData[i] < 90) {
                                highColor[i] = '#6666ff'
                            } else if(highData[i] > 160 && lowData[i] < 90) {
                                highColor[i] = '#ff1493'
                            }
                        }
                        this.chartData.today.pressureHigh = highData
                        this.chartData.today.colorHigh = highColor
                        this.chartData.today.pressureLow = lowData
                        this.chartData.today.colorLow = lowColor

                        // console.log(this.chartData.today)
                        this.makeChartToday()

                        this.loading = false
                    })
                    .catch((error) => {
                        if(error.response.status = 401) {
                            MessageBox('提示', '登录过期，请重新登录')
                            .then(action => {
                                this.$router.push({name: 'login'})
                            })
                        }
                    })

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
                            }
                            if(arr.length) {
                                resultHigh /= arr.length
                                resultLow /= arr.length
                            }
                            highObj[item] = resultHigh
                            lowObj[item] = resultLow
                        }
                        highData = [highObj.beforeSleep, highObj.morning, highObj.noon, highObj.dusk]
                        lowData = [lowObj.beforeSleep, lowObj.morning, lowObj.noon, lowObj.dusk]
                        for(let i of highData) {
                            highColor.push(getColorHigh(i))
                        }
                        for(let i of lowData) {
                            lowColor.push(getColorLow(i))
                        }
                        //单期收缩变色
                        for(let i = 0; i < highData.length; i++) {
                            if(highData[i] > 140 && highData[i] <= 160 && lowData[i] < 90) {
                                highColor[i] = '#6666ff'
                            } else if(highData[i] > 160 && lowData[i] < 90) {
                                highColor[i] = '#ff1493'
                            }
                        }
                        
                        this.chartData.week.pressureHigh = highData
                        this.chartData.week.colorHigh = highColor
                        this.chartData.week.pressureLow = lowData
                        this.chartData.week.colorLow = lowColor
                        this.makeChartWeek()

                        this.loading = false
                    })
                    .catch((error) => {
                        // console.log(error)
                    })
                //月
                await this.axios.get('/detail/blood-pressure/month')
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
                            }
                            if(arr.length) {
                                resultHigh /= arr.length
                                resultLow /= arr.length
                            }
                            highObj[item] = resultHigh
                            lowObj[item] = resultLow
                        }
                        highData = [highObj.beforeSleep, highObj.morning, highObj.noon, highObj.dusk]
                        lowData = [lowObj.beforeSleep, lowObj.morning, lowObj.noon, lowObj.dusk]
                        for(let i of highData) {
                            highColor.push(getColorHigh(i))
                        }
                        for(let i of lowData) {
                            lowColor.push(getColorLow(i))
                        }
                        //单期收缩变色
                        for(let i = 0; i < highData.length; i++) {
                            if(highData[i] > 140 && highData[i] <= 160 && lowData[i] < 90) {
                                highColor[i] = '#6666ff'
                            } else if(highData[i] > 160 && lowData[i] < 90) {
                                highColor[i] = '#ff1493'
                            }
                        }
                        
                        this.chartData.month.pressureHigh = highData
                        this.chartData.month.colorHigh = highColor
                        this.chartData.month.pressureLow = lowData
                        this.chartData.month.colorLow = lowColor
                        this.makeChartMonth()

                        this.loading = false
                    })
                    .catch((error) => {
                        // console.log(error)
                    })

                await this.axios.get('/detail/blood-pressure/list')
                    .then(res => {
                        let data = res.data.data
                        data = this.sortBobble(data)
                        // console.log(data)
                        let arrTime = []
                        let arrHigh = []
                        let arrLow = []
                        for(let i = 0; i < data.length; i++) {
                            // console.log(getStatus(data[i].blood_sugar))
                            // console.log(data[i].high)
                            arrTime.push(this.$_formDate(data[i].date))
                            arrHigh.push((getStatusHigh(data[i].pressure_high).pressure))
                            arrLow.push((getStatusLow(data[i].pressure_low).pressure))
                        }
                        // console.log(arrHigh)
                        // console.log(arrLow)
                        this.chartData.trend.date = arrTime
                        this.chartData.trend.high = arrHigh
                        this.chartData.trend.low = arrLow
                        this.lineChartHigh()
                        this.lineChartLow()
                        console.log(arrTime)
                        console.log(arrSugar)
                    })
                    .catch(err => {
                        console.log(err)
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
            },
            makeChartToday() {
                var ctx = document.getElementsByClassName("pressureChartToday");
                var data = {
                    labels: this.chartData.today.date,
                    datasets: [
                        {
                            backgroundColor: this.chartData.today.colorHigh,
                            data: this.chartData.today.pressureHigh,
                        }, 
                        {
                            backgroundColor: this.chartData.today.colorLow,
                            data: this.chartData.today.pressureLow,
                        }, 
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                suggestMax: 200,
                                suggestMin: 20,
                                max: this.getMaxData(this.chartData.today.pressureHigh) + 10,
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
                var ctx = document.getElementsByClassName("pressureChartWeek")
                var data = {
                    labels: this.chartData.week.date,
                    datasets: [
                        {
                            backgroundColor: this.chartData.week.colorHigh,
                            data: this.chartData.week.pressureHigh,
                        }, 
                        {
                            backgroundColor: this.chartData.week.colorLow,
                            data: this.chartData.week.pressureLow,
                        }, 
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                suggestMax: 200,
                                suggestMin: 20,
                                max: this.getMaxData(this.chartData.week.pressureHigh) + 10,
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
                var ctx = document.getElementsByClassName("pressureChartMonth")
                var data = {
                    labels: this.chartData.month.date,
                    datasets: [
                        {
                            backgroundColor: this.chartData.month.colorHigh,
                            data: this.chartData.month.pressureHigh,
                        }, 
                        {
                            backgroundColor: this.chartData.month.colorLow,
                            data: this.chartData.month.pressureLow,
                        }, 
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: false,
                            ticks: {
                                suggestMax: 200,
                                suggestMin: 20,
                                max: this.getMaxData(this.chartData.month.pressureHigh) + 10,
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
            lineChartHigh() {
                var ctx = document.getElementsByClassName("pressureChartTrendHigh");
                var data = {
                    labels: this.chartData.trend.date,
                    datasets: [
                        {
                            label: "收缩压",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "#aaa",
                            pointStyle: "circle",
                            pointRadius: 0,
                            borderColor: "#aaa",
                            borderWidth: 2,
                            data: this.chartData.trend.high,
                        },
                        {
                            label: "高血压线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(103, 194, 58, 0.2)",
                            borderColor: "#F56C6C",
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [5, 5],  
                            data: new Array(this.chartData.trend.high.length).fill(140),
                        },
                        {
                            label: "低血压线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(230, 162, 60, 0.2)",
                            borderColor: "#E6A23C",
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [5, 5], 
                            data: new Array(this.chartData.trend.low.length).fill(90),
                        },
                        
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestMax: 200,
                                suggestMin: 20,
                                max: this.getLineMax(this.chartData.trend.high, 'high') + 10,
                                min: this.getLineMin(this.chartData.trend.high, 'high') - 10
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
                })
            },
            lineChartLow() {
                var ctx = document.getElementsByClassName("pressureChartTrendLow");
                var data = {
                    labels: this.chartData.trend.date,
                    datasets: [
                        {
                            label: "舒张压",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "#aaa",
                            pointStyle: "circle",
                            pointRadius: 0,
                            borderColor: "#aaa",
                            borderWidth: 2,
                            data: this.chartData.trend.low,
                        },
                        {
                            label: "高血压线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(103, 194, 58, 0.2)",
                            borderColor: "#F56C6C",
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [5, 5],  
                            data: new Array(this.chartData.trend.low.length).fill(90),
                        },
                        {
                            label: "低血压线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(230, 162, 60, 0.2)",
                            borderColor: "#E6A23C",
                            borderWidth: 2,
                            pointRadius: 0,
                            borderDash: [5, 5], 
                            data: new Array(this.chartData.trend.low.length).fill(60),
                        },
                        
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestMax: 200,
                                suggestMin: 20,
                                max: this.getLineMax(this.chartData.trend.low, 'low') + 10,
                                min: this.getLineMin(this.chartData.trend.low, 'low') - 10
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
                })
            },
            // makeChart(i) {
            //     var ctx = document.getElementsByClassName("my-chart")[i];
            //     var data = {
            //         labels: new Array(this.chartData[i].data.length),
            //         datasets: [
            //             {
            //                 label: "收缩压",
            //                 backgroundColor: "rgba(0, 0, 0, 0)",
            //                 pointBackgroundColor: "#aaa",
            //                 pointStyle: "circle",
            //                 borderColor: "#909399",
            //                 borderWidth: 2,
            //                 pointRadius: 3,
            //                 lineTension: 0,
            //                 data: this.chartData[i].high
            //             },
            //             {
            //                 label: "舒张压",
            //                 backgroundColor: "rgba(0, 0, 0, 0)",
            //                 pointBackgroundColor: "#fff",
            //                 borderColor: "#909399",
            //                 borderWidth: 2,
            //                 pointRadius: 3,
            //                 lineTension: 0,
            //                 // borderDash: [5, 5],  
            //                 data: this.chartData[i].low
            //             },    
            //         ]
            //     }
            //     var options = {
            //         scales: {
            //             yAxes: [{
            //                 display: true,
            //                 ticks: {
            //                     suggestMax: 300,
            //                     suggestMin: 20,
            //                     max: this.maxData,
            //                     min: this.minData,
            //                 }
            //             }]
            //         },
            //         legend: {
            //             // display: false,
            //         }
            //     }
            //     var myChart = new Chart(ctx, {
            //         type: "line",
            //         data: data,
            //         options: options
            //     });
            // },
            heartRateChart(i) {
                var ctx = document.getElementsByClassName("heart-rate-chart")[i];
                var data = {
                    labels: new Array(this.chartData[i].data.length),
                    datasets: [
                        {
                            label: "心率",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "rgba(230, 162, 60, 0)",
                            borderColor: "#67C23A",
                            borderWidth: 2,
                            pointRadius: 3,
                            lineTension: 0,
                            // borderDash: [5, 5], 
                            data: this.chartData[i].heartRate
                        },
                    ]
                }
                var options = {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestMax: 300,
                                suggestMin: 20,
                                max: this.maxDataHeart,
                                min: this.minDataHeart,
                            }
                        }]
                    },
                    legend: {
                        // display: false,
                    }
                }
                var myChart = new Chart(ctx, {
                    type: "line",
                    data: data,
                    options: options
                });
            }
        },
        mounted() {
            this.$_getData()
        }
    }
</script>

<style lang="less">
    #blood-pressure{
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
    }
</style>