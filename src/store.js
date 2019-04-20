import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        riskNum: {
            mutiple: 0,
            bloodSugar: 0,
            bloodPressure: 0,
        }
        // riskNum: 25,
        // riskNum_sugar: 30,
        // riskNum_pressure: 60,
    },
    getters: {},
    mutation: {},
    action: {},
}