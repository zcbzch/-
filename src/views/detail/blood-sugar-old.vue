<template>
    <div id="blood-sugar" v-loading.fullscreen.lock="loading">
        <div class="chart"
            v-for="(item, index) in chartData" 
            :key="index">
            <div class="chart-title">{{ item.label }}</div>
            <div class="chart-container">
                <div class="chart-form">

                    <div class="header">
                        <div class="item">
                            <div class="left">上限值</div>
                            <div class="right">
                                <span class="word">{{ getMaxData(index) }}</span>
                                <div class="float">mmol/L</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="left">下限值</div>
                            <div class="right">
                                <span class="word">{{ getMinData(index) }}</span>
                                <div class="float">mmol/L</div>
                            </div>
                        </div>
                    </div>

                    <div class="header">
                        <div class="item">
                            <div class="left">平均值</div>
                            <div class="right">
                                <span class="word">{{ item.average.average }}</span>
                                <div class="float">mmol/L</div>
                            </div>
                        </div>
                        <div class="item">
                            <div class="left">模拟糖化</div>
                            <div class="right">
                                <span class="word">{{ item.average.imitate }}</span>
                                <div class="float">%</div>
                            </div>
                        </div>
                    </div>

                    
                    <div class="context">
                        <div class="left">
                            <div class="item">
                                <el-tag type="success">正常 {{ item.classify.mediumRate }}% | {{ item.classify.mediumTime }}次</el-tag>
                            </div>
                            <div class="item">
                                <el-tag type="danger">过高 {{ item.classify.highRate }}% | {{ item.classify.highTime }}次</el-tag>
                            </div>
                            <div class="item">
                                <el-tag type="warning">过低 {{ item.classify.lowRate }}% | {{ item.classify.lowTime }}次</el-tag>
                            </div>
                        </div>
                        <div class="right">
                            <canvas class="pieChart" height="100" width="100"></canvas>
                            <div class="text">测量次数 {{ item.classify.totalTime }}次</div>
                        </div>
                    </div>
                </div>
                <canvas class="myChart" height="80%" width="80%"></canvas>
            </div>
        </div>
        <mt-button type="primary" size="large" @click="() => {this.$router.push({name: 'blood-sugar-data'})}">查看详细数据</mt-button>
    </div>
</template>

<script>
    import Chart from 'chart.js'
    export default {
        name: 'blood-sugar',
        data() {
            return {
                chartData: [
                    {
                        label: '最近三天',
                        // day: 3,
                        data: [],
                        average: {
                            average: null,
                            imitate: null,
                        },
                        classify: {
                            highRate: null,
                            mediumRate: null,
                            lowRate: null,
                            highTime: null,
                            mediumTime: null,
                            lowTime: null,
                            totalTime: null,
                        }
                    },
                    {
                        label: '最近七天',
                        // day: 7,
                        data: [],
                        average: {},
                        classify: {}
                    },
                    {
                        label: '最近一月',
                        // day: 30,
                        data: [],
                        average: {},
                        classify: {}
                    },
                ],
                data: [],
                pickerVisible: '',
                loading: false,
            }
        },
        computed: {
            maxData() {
                let max = Math.max.apply(null, this.chartData[2].data) + 1 
                return parseFloat(max.toFixed(1)) 
            },
            minData() {
                let min = Math.min.apply(null, this.chartData[2].data) - 1
                return parseFloat(min.toFixed(1)) 
            },
            isGetData() {
                return this.data.length
            }
        },
        methods: {
            getMaxData(day) {
                let max = Math.max.apply(null, this.chartData[day].data) 
                return parseFloat(max.toFixed(1)) 
            },
            getMinData(day) {
                let min = Math.min.apply(null, this.chartData[day].data)
                return parseFloat(min.toFixed(1)) 
            },
            //正常，过高，过低的次数及百分比
            $_classify(data) {
                let tmp = {
                    high: [],
                    medium: [],
                    low: [],
                }
                data.map((i) => {
                    if(i >= 6.1) {
                        tmp.high.push(i)
                    } else if(i <= 3.9) {
                        tmp.low.push(i)
                    } else {
                        tmp.medium.push(i)
                    } 
                })
                let p = {}, time = {}, total = 0
                for(let i in tmp) {
                    let d = Math.round((tmp[i].length / data.length) * 100) 
                    d == 0 ? p[`${i}Rate`] = `00` : p[`${i}Rate`] = d
                }
                for(let i in tmp) {
                    time[`${i}Time`] = tmp[i].length
                    total += tmp[i].length
                }
                p = Object.assign(p, time)
                p["totalTime"] = total
                return p
            },
            //平均血糖，平均血氧浓度
            $_average(data) {
                // console.log('data:'+data)
                let sum = 0
                data.map((i) => { sum += i })
                let p = parseFloat((sum / data.length).toFixed(2))
                // console.log('p:'+p)
                let tmp = {
                    average: p.toFixed(2),
                    imitate: ((p + 4.29) / 1.98).toFixed(2)
                }
                return tmp
            },
            barColor(data) {
                if(data > 6.1) {return 'red';}
                else return 'green'
            },
            $_getData: async function() {
                // this.loading = true
                await this.axios.get('/api/detail/blood-sugar')
                    .then((res) => {
                        this.data = res.data.data
                        this.chartData[0].data = bloodArray.call(this, 3)
                        // console.log(this.chartData[0])
                        this.chartData[1].data = bloodArray.call(this, 7)
                        this.chartData[2].data = bloodArray.call(this, 30)

                        for(let item of this.chartData) {
                            item.average = this.$_average(item.data)
                            item.classify = this.$_classify(item.data)
                        }

                        for(let i = 0; i < this.chartData.length; i++) {
                            this.makeChart(i)
                            this.pieChart(i)
                        }
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

                function bloodArray(day) {
                    let arr = []
                    for(let i = 0; i < day; i++) {
                        arr = arr.concat(this.data[i].data)
                    }
                    arr = arr.map((i) => { return i = i - 0 })
                    return arr
                }
            },
            makeChart(i) {
                var ctx = document.getElementsByClassName("myChart")[i];
                var data = {
                    labels: new Array(this.chartData[i].data.length),
                    datasets: [
                        {
                            label: "血糖浓度",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "#aaa",
                            pointStyle: "circle",
                            pointRadius: 0,
                            borderColor: "#aaa",
                            borderWidth: 1,
                            data: this.chartData[i].data,
                        },
                        {
                            label: "高血糖线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(103, 194, 58, 0.2)",
                            borderColor: "#F56C6C",
                            borderWidth: 1,
                            pointRadius: 0,
                            borderDash: [5, 5],  
                            data: new Array(this.chartData[i].data.length).fill(6.1),
                        },
                        {
                            label: "低血糖线",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            // backgroundColor: "rgba(230, 162, 60, 0.2)",
                            borderColor: "#E6A23C",
                            borderWidth: 1,
                            pointRadius: 0,
                            borderDash: [5, 5], 
                            data: new Array(this.chartData[i].data.length).fill(3.9),
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
                                max: this.maxData,
                                min: this.minData,
                            }
                        }]
                    },
                    legend: {
                        display: false,
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
            for(let i = 0; i < 3; i++){
                this.pieChart(i)
            }
        }
    }
</script>

<style lang="less">
    #blood-sugar {
        width: 100%;
        padding: 0 10px 20px 10px;
        .chart {
            margin: 20px 0px;
            background-color: #fff;
            border-radius: 8px;
            .chart-title {
                height: 40px;
                line-height: 40px;
            }
            .chart-container {
                padding: 10px 0;
                .chart-form {
                    width: 100%;
                    height: 300px;
                    border-top: 1px solid #606266;
                    // border-radius: 8px;
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