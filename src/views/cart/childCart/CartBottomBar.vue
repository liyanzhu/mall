<template>
  <div class="bottom-bar">

    <div class="check-content">
      <check-button :is-check="isSelectAll"
                    class="check-all"
                    @click.native="checkClick"/>
      <span>全选</span>
    </div>

    <div class="price">合计：{{totalPrice}}</div>

    <div class="calculate">结算: {{checkLength}}</div>

  </div>
</template>

<script>
  import CheckButton from 'components/content/checkButton/CheckButton'

  export default {
    name: "CartBottomBar",
    components: {
      CheckButton
    },
    computed :{
      totalPrice(){
        return '¥' + this.$store.state.cartList.filter(item =>{
          return item.checked
        }).reduce((preValue, item) =>{
          return preValue + item.price * item.count
        }, 0).toFixed(2)
      },
      checkLength(){
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll(){
        if (this.$store.state.cartList.length === 0)  return false
        return !this.$store.state.cartList.find(item =>!item.checked)
      }
    },
    methods: {
      checkClick(){
        //console.log('---');
        if (this.isSelectAll){
          this.$store.state.cartList.forEach(item =>item.checked = false)
        }else{
          this.$store.state.cartList.forEach(item =>item.checked = true)
        }
      }
    }
  }
</script>

<style scoped>
  .bottom-bar{
    position: relative;

    height: 40px;
    background-color: #d8d8d8;
    position: fixed;
    bottom: 40px;
    left: 0;
    right: 0;

    display: flex;
  }

  .check-content{
    display: flex;
    align-items: center;
    margin-left: 10px;
    margin-top: -5px;


  }

  .check-all{
    height: 20px;
    width: 20px;
    margin-right: 5px;
  }

  .price{
    margin-left: 30px;
    margin-top: 7px;
    margin-right: 5px;
  }

  .calculate{
    position: absolute;
    right: 0;
    background-color: #ff8d8d;
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;

  }
</style>
