<template>
    <div id="blood-pressure" v-loading.fullscreen.lock="loading">
        <div class="chart"
            v-for="(item, index) in chartData" 
            :key="index">
            <div class="chart-title">{{ item.label }}</div>
            <div class="chart-container">
                <canvas class="my-chart" height="80%" width="80%"></canvas>
            </div>
            <div class="chart-container">
                <canvas class="heart-rate-chart" height="80%" width="80%"></canvas>
            </div>
        </div>

        <mt-button type="primary" size="large" @click="() => {this.$router.push({name: 'blood-pressure-data'})}">查看详细数据</mt-button>
    </div>
</template>

<script>
    export default {
        name: 'blood-pressure',
        data() {
            return {
                chartData: [
                    {
                        label: '最近三天',
                        high: [],
                        low: [],
                        heartRate: [],
                        data: [],
                        average: {
                            average: null,
                            imitate: null,
                        },
                        classify: {
                        }
                    },
                    {
                        label: '最近七天',
                        high: [],
                        low: [],
                        heartRate: [],
                        data: [],
                        average: {},
                        classify: {}
                    },
                    {
                        label: '最近一月',
                        high: [],
                        low: [],
                        heartRate: [],
                        data: [],
                        average: {},
                        classify: {}
                    },
                ],
                data: [],
                loading: false,
            }
        },
        computed: {
            maxData() {
                let max = Math.max.apply(null, this.chartData[2].high) + 20 
                return parseInt(max) 
            },
            minData() {
                let min = Math.min.apply(null, this.chartData[2].low) - 20
                return parseFloat(min) 
            },
            maxDataHeart() {
                let max = Math.max.apply(null, this.chartData[2].heartRate) + 5
                return parseInt(max) 
            },
            minDataHeart() {
                let min = Math.min.apply(null, this.chartData[2].heartRate) - 5
                return parseFloat(min) 
            },
        },
        methods: {
            $_getData: async function() {
                this.loading = true
                await this.axios.get('/detail/blood-pressure')
                    .then((res) => {
                        this.data = res.data.data
                        handleData.call(this, 3, 0)
                        handleData.call(this, 7, 1)
                        handleData.call(this, 30, 2)
                        // console.log(this.chartData)

                        for(let i = 0; i < this.chartData.length; i++) {
                            this.makeChart(i)
                            this.heartRateChart(i)
                        }
                        this.loading = false
                    })
                    .catch((error) => {
                        console.log(error)
                    })

                    function handleData(day, index) {
                        let data = this.data.slice(0, day),
                            high = [],
                            low = [],
                            heartRate = []
                        for(let i = 0; i < day; i++) {
                            high = high.concat(this.data[i].data[0])
                            low = low.concat(this.data[i].data[1])
                            heartRate = heartRate.concat(this.data[i].data[2])
                        }
                        
                        let o = this.chartData[index]
                        o.data = data
                        o.high = high.map(item => { return item - 0 })
                        o.low = low.map(item => { return item - 0 })
                        o.heartRate = heartRate.map(item => { return item - 0 })
                    }
            },
            makeChart(i) {
                var ctx = document.getElementsByClassName("my-chart")[i];
                var data = {
                    labels: new Array(this.chartData[i].data.length),
                    datasets: [
                        {
                            label: "收缩压",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "#aaa",
                            pointStyle: "circle",
                            borderColor: "#909399",
                            borderWidth: 2,
                            pointRadius: 3,
                            lineTension: 0,
                            data: this.chartData[i].high
                        },
                        {
                            label: "舒张压",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            pointBackgroundColor: "#fff",
                            borderColor: "#909399",
                            borderWidth: 2,
                            pointRadius: 3,
                            lineTension: 0,
                            // borderDash: [5, 5],  
                            data: this.chartData[i].low
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
                                max: this.maxData,
                                min: this.minData,
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
            },
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
            background-color: #fff;
            border-radius: 8px;
            .chart-title {
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #eee;
            }
            .chart-container {
                padding: 10px 0;
                .my-chart {
                    border-bottom: 1px solid #606266;
                }
                .heart-rate-chart {
                    border-bottom: 1px solid rgb(160, 207, 255);
                }
                .chart-form {
                    width: 100%;
                    height: 240px;
                    border-top: 1px solid rgb(160, 207, 255);
                    // border-radius: 8px;
                    .header {
                        width: 100%;
                        height: 60px;
                        border-bottom: 1px solid rgb(160, 207, 255);
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
                                border-right: 1px solid rgb(160, 207, 255);
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
                        height: calc(100% - 60px);
                        display: flex;
                        align-items: center;
                        .left {
                            width: 50%;
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