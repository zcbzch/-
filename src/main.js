import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Mint)
Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
