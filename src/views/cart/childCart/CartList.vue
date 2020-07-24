<template>
  <div class="cart-list">
    <scroll class="content" ref="scroll">
      <cart-list-item v-for="(item, index) in cartList"
                      :key="index"
                      :item-info="item"/>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'components/scroll/Scroll'
  import CartListItem from '../childCart/CartListItem'

  export default {
    name: "CartList",
    components:{
      Scroll,
      CartListItem,
    },
    computed: {
      cartList(){
        return this.$store.state.cartList
      }
    },
    activated(){
      this.$refs.scroll.refresh()
    }
  }
</script>

<style scoped>
  .cart-list{
    height: 100vh;
  }

  .content{
    height: calc(100% - 44px - 49px - 30px);
    overflow: hidden;
  }
</style>
