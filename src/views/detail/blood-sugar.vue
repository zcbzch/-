<template>
    <div id="blood-sugar">
        <div class="chart">
            <canvas id="myChart2" height="80%" width="80%"></canvas>
        </div>
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
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js'
import { log } from 'util';
    export default {
        name: 'blood-sugar',
        data() {
            return {
                data: [5.1, 6.8, 5.3, 6.2, 6.2, 6.7, 5.0],
                pickerVisible: '',
            }
        },
        computed: {
            
        },
        methods: {
            barColor(data) {
                if(data > 6.1) {return 'red';}
                else return 'green'
            },
            test(){
                // console.log(this.data.map((i) => { return this.barColor(i)}))

            },
            makeChart() {
                var ctx2 = document.getElementById("myChart2");
                var data = {
                    labels: ["早餐前", "早餐后", "午餐前", "午餐后", "晚餐前", "晚餐后", "睡前"],
                    datasets: [
                        {
                            label: "血糖浓度",
                            backgroundColor: this.data.map((i) => { return this.barColor(i)}),
                            borderColor: "rgba(220,220,220,1)",
                            borderWidth: 1,
                            data: this.data,
                        },
                        
                    ]
                }
                var options = {
                    // multiTooltipTemplate: "<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestMax: 15.0,
                                min: 0
                            }

                        }]
                    },
                    legend: {
                        
                        onClick(e, item) {
                            console.log(item);
                            
                        }
                    }
                }
                var myChart2 = new Chart(ctx2, {
                    type: "bar",
                    data: data,
                    options: options
                });
            
            },
            getDate() {
                console.log('1')
                this.$refs.picker.open()
            }
        },
        mounted() {
            this.makeChart()
        }
    }
</script>

<style lang="less">
    #blood-sugar {
        width: 100%;
        .chart {
            padding: 10px;
        }
        .add-data {

            .devide-line {
                height: 30px;
                line-height: 30px;
                font-size: 14px;
                background-color: #eee;
                margin-top: 10px;
            }
        }
    }
</style>