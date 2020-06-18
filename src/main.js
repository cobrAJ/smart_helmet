// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import "./component"
import './assets/css/common.less'
import './assets/css/reset.css'
// import Blob from './excel/Blob.js'
// import Export2Excel from './excel/Export2Excel.js'
Vue.config.productionTip = false

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
