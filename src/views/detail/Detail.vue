<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav"
                    @titleClick="titleClick"
                    ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">

      <!--<div>-->
        <!--<ul>-->
          <!--<li v-for="item in $store.state.cartList">{{item}}</li>-->
        <!--</ul>-->
        <!--{{$store.state.cartList.length}}-->
      <!--</div>-->

      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="goods" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShow"></back-top>
  </div>
</template>

<script>
  import DetailNavBar from 'views/detail/childDetail/DetailNavBar'
  import DetailSwiper from 'views/detail/childDetail/DetailSwiper'
  import DetailBaseInfo from './childDetail/DetailBaseInfo'
  import DetailShopInfo from './childDetail/DetailShopInfo'
  import DetailGoodsInfo from './childDetail/DetailGoodsInfo'
  import DetailParamInfo from './childDetail/DetailParamInfo'
  import DetailCommentInfo from './childDetail/DetailCommentInfo'
  import GoodsList from 'components/content/goods/GoodsList'
  import DetailBottomBar from './childDetail/DetailBottomBar'

  import Scroll from 'components/scroll/Scroll'

  import {getDetail,
          getRecommend,
          Goods,
          Shop,
          GoodsParam} from "network/detail";

  import {backTopMin} from 'common/mixin'


  export default {
    name: "Detail",
    components: {
      GoodsList,
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      DetailBottomBar,

      Scroll
    },
    data(){
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommends: [],
        itemImgListener: null,
        itemTopYs: [],
        currentIndex: 0
      }
    },
    mixins: [backTopMin],
    created(){
      //1.保存传入的iid
      this.iid = this.$route.params.iid

      //2.根据iid请求数据
      getDetail(this.iid).then(res =>{
        //console.log(res);
        const data = res.result

        //2.1获取顶部轮播图
        this.topImages = data.itemInfo.topImages

        //2.2获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
        //console.log(this.goods);

        //2.3创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        //2.4保存商品的详情数据
        this.detailInfo = data.detailInfo

        //2.5获取参数信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        //2.6获取评论信息
        if(data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }

        /*
        this.$nextTick(() =>{
          //根据最新的数据 对于的DOM是已经被渲染出来的
          //但是图片依然是没有加载完（目前获取到的offsetTop不包含其中的图片）
          //offsetTop值不对 是因为图片的问题
          this.itemTopYs = []
          this.itemTopYs.push(0)
          this.itemTopYs.push(this.$refs.param.$el.offsetTop)
          this.itemTopYs.push(this.$refs.comment.$el.offsetTop)
          this.itemTopYs.push(this.$refs.goods.$el.offsetTop)
          console.log(this.itemTopYs);
        })
       */

      })

      //3请求推荐数据
      getRecommend().then(res =>{
        console.log(res);
        this.recommends = res.data.list
      })
    },
    mounted(){
      //防抖动
      const refresh = this.debounce(this.$refs.scroll.refresh, 9)

      this.itemImgListener =  () =>{
        refresh()
      }

      this.$bus.$on('imgItemLoad',this.itemImgListener)

    },
    destroyed(){
      this.$bus.$off('imgItemLoad', this.itemImgListener)
    },
    methods: {
      //事件监听相关方法
      debounce(func, delay){
        let timer = null
        if (timer) clearTimeout(timer)
        return function(...args){
          timer = setTimeout(() =>{
            func.apply(this, args)
          }, delay)
        }
      },
      imageLoad(){
        this.$refs.scroll.refresh()

        this.itemTopYs = []
        this.itemTopYs.push(0)
        this.itemTopYs.push(this.$refs.param.$el.offsetTop-44)
        this.itemTopYs.push(this.$refs.comment.$el.offsetTop-44)
        this.itemTopYs.push(this.$refs.goods.$el.offsetTop-44)
        this.itemTopYs.push(Number.MAX_VALUE)

        console.log(this.itemTopYs);
      },
      titleClick(index){
        //console.log(index);
        this.$refs.scroll.scrollTo(0, -this.itemTopYs[index], 100)
      },
      contentScroll(position){
        const positionY = -position.y
        //console.log(positionY);
        let length = this.itemTopYs.length

        this.isShow = (-position.y) > 1000

        //优化
        for (let i = 0; i < length-1 ;i++) {
          if(this.currentIndex !== i && ( positionY >= this.itemTopYs[i] && positionY < this.itemTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }


        //普通
        // for (let i = 0;i<length;i++){
        //   if(this.currentIndex !== i && ((i < length-1 && positionY >= this.itemTopYs[i] && positionY < this.itemTopYs[i+1]) || (i === length-1 && positionY >= this.itemTopYs[i]))){
        //     this.currentIndex = i;
        //     //console.log(this.currentIndex);
        //     this.$refs.nav.currentIndex = this.currentIndex
        //   }
        // }
      },
      addToCart(){
        //console.log('-');
        //1.获取购物车展示的信息
        const product = {}
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice
        product.iid = this.iid

        //console.log(product);

        //2.将商品加入到购物车
        this.$store.dispatch('addCart', product)
        console.log('---');
      }
    }
  }
</script>

<style scoped>
  #detail{
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav{
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content{
    height: calc(100% - 44px - 49px);
  }
</style>
