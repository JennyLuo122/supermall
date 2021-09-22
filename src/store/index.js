import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

Vue.use(Vuex)

const state = {
	cartList: []
}

const store = new Vuex.Store({
	state,
	mutations,
	getters,
	actions
})

export default store



// const store = new Vuex.Store({
// 	state,
// 	mutations: {
    // // 一般有判断逻辑的函数，也放在action不比较好
    // addCart(state, payload) {
    // // 1.查找之前数组是否有该商品
    // let oldProduct = state.cartList.find(item => item.iid === payload.iid)

		// // 2.如果oldInfo存在, 那么原来的数量加1
		// if (oldProduct) {
		//   oldProduct.count += 1
		//   } else {
		// 	  payload.count = 1
		// 		state.cartList.push(payload)
		// 	}
    // }
    // addCounter(state, payload) {
    //   payload.count ++
    // },
    // addToCart(state, payload) {
    //   state.cartList.push(payload)
    // },

  // },
  // actions: {
  //   addCart(context, payload) {

  //     let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

	// 		if (oldProduct) {
	// 			context.commit('addCounter',oldProduct)
	// 		} else {
	// 			payload.count = 1
  //       context.commit('addToCart',payload)
	// 		}
  //   }
  // }
// })
