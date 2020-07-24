import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

//1.安装插件
Vue.use(Vuex)

//2.创建插件
const store = new Vuex.Store({
  state: {
    cartList: []
  },
  mutations,
  actions
})

//3.挂在在Vue
export default store
