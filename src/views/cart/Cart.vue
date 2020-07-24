<template>
  <div class="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartLength}})</div>
    </nav-bar>
    <cart-list/>
    <cart-bottom-bar/>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/scroll/Scroll'
  import CartList from './childCart/CartList'
  import CartBottomBar from './childCart/CartBottomBar'

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      Scroll,
      CartBottomBar
    },
    computed: {
      cartLength(){
        return this.$store.state.cartList.length
      }
    }
  }
</script>

<style scoped>

  .nav-bar{
    background-color: var(--color-tint);
    color: white;
  }

</style>
