import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default {
    state: {
        route: '',
        riskNum: {
            mutiple: 0,
            bloodSugar: 0,
            bloodPressure: 0,
        },
        sugarData: [],
        username: '',
    },
    getters: {},
    mutation: {},
    action: {},
}