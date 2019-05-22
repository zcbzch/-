<template>
    <div id="blood-pressure-data">
        <div class="header">
            <div class="left" @click="() => {this.$router.back()}"><i class="el-icon-arrow-left"></i></div>
            {{ `血压记录` }}
        </div>
        <div class="row">
            <div class="dateTime">日期</div>
            <div class="dayTime">高压</div>
            <div class="dateTime">低压</div>
            <div class="dayTime">心率</div>
            <!-- <div class="dateTime">晚</div> -->
        </div>

        <div class="row" v-for="(item, index) in rowData" :key="index">
            <div class="dateTime">{{ $_formDate(item.date) }}</div>
            <div class="dayTime">{{ item.data[0] }}</div>
            <div class="dateTime">{{ item.data[1] }}</div>
            <div class="dayTime">{{ item.data[2] }}</div>
            <!-- <div class="dateTime">{{ item.data[3] }}</div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'blood-pressure-data',
    data() {
        return {
            rowData: []
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
        $_getData: async function() {
            let params = {
                username: sessionStorage.getItem('username')
            }
            this.axios.get('/detail/blood-pressure', { params: params })
                .then((res) => {
                    this.rowData = res.data.data
                })
                .catch((error) => {
                    console.log(error)
                })
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

        .row {
            display: flex;
            .dateTime {
                @flex-center();
                width: 25%;
                height: 44px;
                border-top: 1px solid #DCDFE6;
                background-color: #F2F6FC;
            }
            .dayTime {
                @flex-center();
                width: 25%;
                height: 40px;
                border-top: 1px solid #DCDFE6;
            }
        }
    }
</style>