<template>
  <div class="nav-bar">
    <div class="left">
      <slot name="left"></slot>
    </div>

    <div class='center'>
      <slot name="center"></slot>
    </div>

    <div class='right'>
      <slot name="right"></slot>
    </div>

  </div>
</template>

<script>
  export default {
    name: "NavBar"
  }
</script>

<style scoped>
  .nav-bar{
    display: flex;
    height: 44px;
    line-height: 44px;
    box-shadow: 0 1px 1px rgb(221, 221, 221);
  }

  .left,.right{
    width: 60px;
    /*background: #ff5777;*/
  }

  .center{
    flex: 1;
    /*background: #ff8198;*/
    text-align: center;
  }
</style>
