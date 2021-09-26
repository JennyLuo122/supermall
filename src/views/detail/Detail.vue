<template>
<div id="detail">
  <!-- 导航 -->
  <detail-nav-bar class="detail-nav" @titleClick="titleClick" :current-index="currentIndex"/>

  <scroll class="detail-content" ref="scroll" @scroll="contentScroll"
          :probe-type="3">
    <!-- 给子组件传入值得时候，用短横命名 -->
    <detail-swiper :top-images="topImages" @detailImgLoad="detailImgLoad"/>
    <detail-base-info :goods="goods"/>
    <detail-shop-info :shop="shop"/>
    <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
    <detail-param-info :param-info="paramInfo" ref="param"/>
    <detail-comment-info :comment-info="commentInfo" ref="comment"/>
    <goods-list :goods="goodsList" ref="recommend"/>
  </scroll>

  <back-top @click.native="backClick" v-show="isShowBackTop"/>

  <detail-bottom-bar @addToCart="addToCart"/>

  <toast ref="toast"/>

</div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottomBar from "./childComps/DetailBottomBar";

import Scroll from "components/common/scroll/Scroll";
import Toast from 'components/common/toast/Toast'

import GoodsList from 'components/content/goods/GoodsList'

import { itemListenerMixin, backTopMixin } from "common/mixin";

import { getDetail, Goods, Shop, GoodsParam, getRecommend } from "network/detail";

import {mapActions} from 'vuex'

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    Scroll,
    Toast
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      goodsList: [],
      themeTops: [],
      currentIndex: 0,

    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid，请求详情数据
    getDetail(this.iid).then(res => {
      // 获取数据
      // console.log(res);
      const data = res.result;

      // a.获取顶部图片的轮播数据
      this.topImages = data.itemInfo.topImages

      // b.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

      // c.获取商家信息
      this.shop = new Shop(data.shopInfo)

      // d.获取商品详细信息
      this.detailInfo = data.detailInfo

      // e.获取参数信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

      // f.获取评论信息
      if (data.rate.list) {
		    this.commentInfo = data.rate.list[0];
	      }
    })

    // 3.请求推荐数据
    this._getRecommend()
  },
  mounted() {
    },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImageListener)
  },
  methods: {
    // 直接引用actions内的函数
    ...mapActions({
        addCart: 'addToCart'
      }),
    /**
     * 事件监听
     */
    detailImgLoad() {
      this.$refs.scroll.refresh()
    },
    imageLoad() {
      this.$refs.scroll.refresh()
      // 获取对应的offsetTop
        this.themeTops = []
        this.themeTops.push(0)
        this.themeTops.push(this.$refs.param.$el.offsetTop)
        this.themeTops.push(this.$refs.comment.$el.offsetTop)
        this.themeTops.push(this.$refs.recommend.$el.offsetTop)
        // 引入一个最大值，方便后面判断
        this.themeTops.push(Number.MAX_VALUE)
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTops[index] + 44, 200)

    },
    contentScroll(position) {
	    // 决定backTop按钮是否显示
		  // this.showBackTop = position.y <= -1000
	    // 监听滚动到某个主题
      this._listenScrollTheme(-position.y)

      // 判断backtop是否显示
      this.isShowBackTop = (-position.y) > 1000
	  },
    _listenScrollTheme(position) {
	    let length = this.themeTops.length;
	    for (let i = 0; i < length; i++) {
		    let iPos = this.themeTops[i];
		    /**
		    * 判断的方案:
		    *  方案一:
		    *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
		    *    优点: 不需要引入其他的内容, 通过逻辑解决
		    *    缺点: 判断条件过长, 并且不容易理解
		    *  方案二:
		    *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
		    *    优点: 简洁明了, 便于理解
		    *    缺点: 需要引入一个较大的int数字
		    * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
		    * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
		    */
		    if (position >= iPos && position < this.themeTops[i+1]) {
			    if (this.currentIndex !== i) {
            // 防止赋值过于频繁
				    this.currentIndex = i;
			    }
			    break;
		    }
	    }
    },
	  addToCart() {
      // 1.将商品信息添加到Store中
      const obj = {}
      obj.iid = this.iid
      obj.imgURL = this.topImages[0]
      obj.title = this.goods.title
      obj.desc = this.goods.desc
      obj.price = this.goods.realPrice

      // 2.将商品添加到购物车里
      // this.$store.commit('addCart', obj)
      // this.$store.dispatch('addToCart', obj).then(() => {
	    //  console.log('加入购物车成功');
      // })

      // 3.添加到购物车成功
      // this.$store.dispatch('addToCart', obj).then(() => {
	    //  this.$toast({message: '加入购物车成功'})
      // })
      this.addCart(obj).then(() => {
	      this.$toast({message: '加入购物车成功'})
      })
	  },

    /**
     * 网络请求
     */

    _getRecommend() {
	  getRecommend().then(res => {
	    this.goodsList = res.data.list
		  })
    },

  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 10;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .detail-content {
    /* 动态计算高度需要监听图片是否加载完成 */
    /* 需要减去导航栏和底部工具栏的高度 */
    height: calc(100% - 44px - 58px);
  }


</style>
