<template>

  <div id="home">

    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>

    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <!--:class="{fixed: isTabFixed}-->

    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pulingUp="pulingUp">
      <home-swiper :banners="banners"
                    @swiperImgLoad="swiperImgLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>

    <!--
      组件不能直接监听点击
      在我们需要监听一个原生事件时，必须给对应的的事件加上native 才能进行点击
    -->
    <back-top @click.native="backClick" v-show="isShow"/>
  </div>

</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from 'components/content/tabControl/TabControl'

  import HomeSwiper from './ChildHome/HomeSwiper'
  import RecommendView from './ChildHome/RecommendView'
  import FeatureView from './ChildHome/FeatureView'
  import GoodsList from 'components/content/goods/GoodsList'
  import Scroll from 'components/scroll/Scroll'
  // import BackTop from 'components/content/backTop/BackTop'

  import {getHomeMultidate,
          getHomeGoods
  } from "network/home";

  import {backTopMin} from 'common/mixin'


  export default {
    name: "Home",
    components:{
      HomeSwiper,
      RecommendView,
      FeatureView,
      GoodsList,
      Scroll,
      // BackTop,

      NavBar,
      TabControl
    },
    data(){
      return {
        banners: [],
        recommends: [],

        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        // isShow: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        scrollY: 0,
        itemImgListener: null,
      }
    },
    mixins: [backTopMin],
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    //组件一旦创建好就发送网络请求
    created(){
      //请求多个数据
      this.getHomeMultidate()

      //请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    destroyed(){
      console.log('home destroyed');
    },
    activated(){
      //console.log('activated');
      this.$refs.scroll.scrollTo(0, this.scrollY)
      this.$refs.scroll.refresh()
    },
    deactivated(){
      //console.log('deactivated');
      //1.保存Y值
      this.scrollY = this.$refs.scroll.bscroll.y
      //console.log(this.scrollY);

      //2.取消全局事件监听
      this.$bus.$off('imgItemLoad', this.itemImgListener)
    },
    mounted(){
      //防抖动
      const refresh = this.debounce(this.$refs.scroll.refresh, 9)
      //监听item中图片加载完成

      //对监听事件进行保存
      this.itemImgListener =  () =>{
        //console.log('-------');
        //this.$refs.scroll.refresh()
        refresh()
      }

      this.$bus.$on('imgItemLoad',this.itemImgListener)

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
      tabClick(index){
        //console.log(index);
        switch (index) {
          case 0 : this.currentType = 'pop'
                   break
          case 1 : this.currentType = 'new'
            break
          case 2 : this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      // backClick(){
      //   //console.log("======");
      //   this.$refs.scroll.scrollTo(0, 0)
      // },
      contentScroll(position){
        //console.log(position);

        //判断BackTop是否显示
        this.isShow = (-position.y) > 1000

        //决定tabControl是否吸顶（position： fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      pulingUp(){
        //console.log('上啦加载更多');
        this.getHomeGoods(this.currentType)
      },
      swiperImgLoad(){
        //获取tabControl的offsetTop
        //所有的组件都有一个属性$el： 用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },
      //网络请求相关方法
      getHomeMultidate(){
        getHomeMultidate().then(res =>{
          //console.log(res);
          this.banners = res.data.banner.list
          this.recommends = res.data.recommend.list
          //console.log(this.banners);
          //console.log(this.recommends);
        })
      },

      getHomeGoods(type){
        const page = this.goods[type].page + 1
        getHomeGoods(type,page).then(res =>{
          //console.log(res.data.list);
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }

</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    /*padding-bottom: 800px;*/
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: white;

    /*在使用浏览器原生滚动时 为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*left: 0;*/
    /*right: 0;*/
    /*top: 0;*/
    /*z-index: 9;*/
  }

  /*.fixed{*/
    /*position: fixed;*/
    /*right: 0;*/
    /*left: 0;*/
    /*top: 44px;*/
  /*}*/

  /*.content{*/
    /*height: calc(100% - 93px);*/
    /*overflow: hidden;*/
    /*margin-top: 44px;*/
  /*}*/

  .content{
    /*height: 300px;*/
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }

</style>
