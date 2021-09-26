import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Toast from 'components/common/toast'

import FastClick from 'fastclick'
import LazyLoad from 'vue-lazyload'

Vue.config.productionTip = false

Vue.use(Toast)

// 解决移动端300ms延时
FastClick.attach(document.body)

// 使用懒加载插件
Vue.use(LazyLoad, {
  loading: require('assets/img/common/placeholder.png')
})

// 在vue原型上定义全局变量，使其在每个Vue实例中可用
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
