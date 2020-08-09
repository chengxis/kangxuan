import Vue from 'vue'
import App from './App'
import global from './lib/global/global'
import './../static/iconfonts/hollowlove/iconfont.css'
import './../static/iconfonts/solidlove/iconfont.css'

Vue.config.productionTip = false
App.mpType = 'app'
//挂载全局变量
Vue.prototype.$global = global

const app = new Vue(App)
app.$mount()
