<template>
<div class="cart">
  <!-- 导航 -->
  <nav-bar class="nav-bar"><div slot="center">购物车({{cartLength}})</div></nav-bar>

  <!-- 商品列表 -->
  <cart-list :cart-list="cartList"/>

  <!-- 底部汇总 -->
  <cart-bottom-bar/>

</div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";

  import CartList from './childComps/CartList'
  import CartBottomBar from './childComps/CartBottomBar'

  // 将getters导入用作计算属性
  import { mapGetters } from 'vuex'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottomBar
    },
    computed: {
      // 写法一
      ...mapGetters([
      	'cartLength',
        'cartList'
      ]),

      // 写法二
      // ...mapGetters({
      // 	Length: 'cartLength',
      //   List: 'cartList'
      // })

    },


  }
</script>

<style scoped>
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
  font-weight: 700;
}


</style>
