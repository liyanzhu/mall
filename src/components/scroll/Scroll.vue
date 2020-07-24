<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data(){
      return {
        bscroll: null
      }
    },
    mounted(){
      //1.创建BScroll对象
      this.bscroll = new BScroll(this.$refs.wrapper, {
        mouseWheel: true,
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad
      })


      //console.log(this.bscroll);

      //2.监听滚动位置
      this.bscroll.on('scroll', (position) =>{
        //console.log(position);
        this.$emit('scroll', position)
      })

      //3.上拉加载更多
      this.bscroll.on('pullingUp', () =>{
        //console.log('pulling');
        this.$emit('pulingUp')
      })
    },
    methods: {
      scrollTo(x, y, time = 300){
        this.bscroll && this.bscroll.scrollTo(x, y, time)
      },
      refresh(){
        this.bscroll && this.bscroll.refresh()
        //console.log('-----');
      },
      finishPullUp(){
        this.bscroll.finishPullUp()
      }
    }
  }
</script>

<style scoped>

</style>
