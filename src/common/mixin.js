import BackTop from 'components/content/backTop/BackTop'


export const backTopMin = {
  data(){
    return {
      isShow: false
    }
  },
  components: {
    BackTop
  },
  methods: {
    backClick(){
      //console.log("======");
      this.$refs.scroll.scrollTo(0, 0)
    }
  }
}
