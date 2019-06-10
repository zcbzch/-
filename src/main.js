import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/iconfont/iconfont.css' // iconfont
import axios from 'axios'
import sha1 from 'js-sha1'

Vue.use(Mint)
Vue.use(Element)
Vue.config.productionTip = false

Vue.prototype.axios = axios
Vue.prototype.sha1 = sha1

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
