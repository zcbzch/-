<template>
    <div id="blood-sugar">
        <div class="chart"
            v-for="(item, index) in chartData" 
            :key="index">
            <div class="chart-title">{{ item.label }}</div>
            <div class="chart-container">
                <canvas class="myChart" height="80%" width="80%"></canvas>
                <div class="chart-form">
                    <div class="header">
                        <div class="item">平均值 <span class="word">{{ item.average.average }}</span>mmol/L</div>
                        <div class="item">模拟糖化 <span class="word">{{ item.average.imitate }}</span>%</div>
                    </div>
                    <div class="context">
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
                </div>
            </div>
        </div>
<!-- 
        <div class="add-data">
            <div class="devide-line">添加血糖数据</div>
            <mt-cell title="日期" is-link @click="getDate()"></mt-cell>
            <mt-datetime-picker
                v-model="pickerVisible"
                ref="picker"
                type="date"
                year-format="{value} 年"
                month-format="{value} 月"
                date-format="{value} 日">
            </mt-datetime-picker>
        </div> -->
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
                        data: [3.1, 6.8, 5.3, 3.1, 6.8, 5.3, 3.1, 6.8, 5.3],
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
                        }
                    },
                    {
                        label: '最近七天',
                        data: [4.1, 6.0, 5.0, 6.7, 7.2, 5.7, 6.0, 4.1, 6.0, 5.0, 6.7, 7.2, 5.7, 6.0, 4.1, 6.0, 5.0, 6.7, 7.2, 5.7, 6.0],
                        average: {},
                        classify: {}
                    },
                    {
                        label: '最近一月',
                        data: [3.1, 6.8, 5.3, 6.2, 6.2, 6.7, 5.0],
                        average: {},
                        classify: {}
                    },
                ],
                data: [],
                pickerVisible: '',
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
            }
        },
        methods: {
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
                let p = {}, time = {}
                for(let i in tmp) {
                    let d = (tmp[i].length / data.length).toFixed(4) * 100
                    d == 0 ? p[`${i}Rate`] = `00.00` : p[`${i}Rate`] = d
                }
                for(let i in tmp) {
                    time[`${i}Time`] = tmp[i].length
                }
                p = Object.assign(p, time)
                return p
            },
            $_average(data) {
                let sum = 0
                data.map((i) => { sum += i })
                let p = parseFloat((sum / data.length).toFixed(2))
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
                let params = {
                    username: sessionStorage.getItem('username')
                }
                this.axios.get('/detail/blood-sugar', { params: params })
                    .then((res) => {
                        this.data = res.data.data
                        this.chartData[0].data = bloodArray.call(this, 3)
                        this.chartData[1].data = bloodArray.call(this, 7)
                        this.chartData[2].data = bloodArray.call(this, 30)
                        this.$store.state.sugarData = res.data.data
                        console.log(this.$store.state.sugarData)
                        for(let i = 0; i < this.chartData.length; i++) {
                            this.makeChart(i)
                        }
                    })
                    .catch((error) => {  
                        console.log(error)
                })
                function bloodArray(day) {
                    let arr = []
                    for(let i = 0; i < day; i++) {
                        arr = arr.concat(this.data[i].data)
                    }
                    arr = arr.map((i) => { return i = i - 0 })
                    return arr
                }
                
                for(let item of this.chartData) {
                    item.average = this.$_average(item.data)
                    item.classify = this.$_classify(item.data)
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
                        onClick(e, item) {
                            console.log(item);
                            
                        }
                    }
                }
                var myChart = new Chart(ctx, {
                    type: "line",
                    data: data,
                    options: options
                });
            
            },
        },
        mounted() {
            this.$_getData()
        }
    }
</script>

<style lang="less">
    #blood-sugar {
        width: 100%;
        .chart {
            margin: 10px;
            background-color: #fff;
            border-radius: 8px;
            .chart-title {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #eee;
            }
            .chart-container {
                padding: 10px;
                .chart-form {
                    width: calc(100% - 20px);
                    height: 240px;
                    margin: 10px;
                    border: 1px solid #000;
                    border-radius: 8px;
                    .header {
                        width: 100%;
                        height: 60px;
                        border-bottom: 1px solid #000;
                        display: flex;
                        .item {
                            width: 50%;
                            padding: 0 10px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            &:first-child {
                                border-right: 1px solid #000;
                            }
                            .word {
                                font-size: 24px;
                                margin: 0 10px;
                            }
                        }
                        // p {
                        //     margin: auto;
                        //     width: 50%;
                        //     font-size: 16px;
                        // }
                    }
                    .context {
                        padding: 10px 10%;
                        text-align: left;
                        .item {
                            display: block;
                            margin: 10px;
                            .el-tag {
                                font-size: 16px;
                            }
                            span {

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
                background-color: #eee;
                margin-top: 20px;
            }
        }
    }
</style>