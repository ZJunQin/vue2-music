import Vue from 'vue'
import App from '@/App.vue'
import axios from 'axios'
import router from '@/route'
import store from '@/store'
import { Popup, Dialog, Tab, Tabs, Toast } from 'vant'
import 'vant/lib/index.css';
import '@/assets/css/common.less'


Vue.config.productionTip = false
Vue.prototype.$axios = axios

Vue.use(Popup)
Vue.use(Dialog)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Toast)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
