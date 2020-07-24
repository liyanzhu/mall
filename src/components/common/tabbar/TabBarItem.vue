<template>
  <div id="tab-bar-item" @click="itemClick">
    <div v-if="!isActive">
      <slot name="item-icon"></slot>
    </div>
    <div v-else>
      <slot name="item-icon-active"></slot>
    </div>
    <!--<div :class="{active: isActive}">-->
    <div :style="activeStyle">
      <slot name="item-text"></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TabBarItem",
    props: {
      path: String,
      activeColor: {
        type: String,
        default: 'red'
      }
    },
    data(){
      return {
        // isActive: true
      }
    },
    computed:{
      isActive(){
        return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle(){
        return this.isActive?{color: this.activeColor}: {}
      }
    },
    methods: {
      itemClick(){
        //console.log('itemClick');
        this.$router.replace(this.path)
      }
    }
  }
</script>

<style scoped>
  #tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    background: #f6f6f6f6;
    font-size: 12px;
  }
  #tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }
  /*.active{*/
    /*color: palevioletred;*/
  /*}*/
</style>
