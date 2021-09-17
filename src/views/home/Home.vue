<template>
<div id="home">
  <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
  <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabcontrol1"
                  class="tab-control" v-show="isTabFixed"/>
  <scroll class="content" ref="scroll"
          :probe-type="3" :pull-up-load="true"
          @scroll="controlScroll" @pullingUp="loadMore">
    <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"/>
    <recommend-view :recommends="recommends"/>
    <feature-view/>
    <tab-control :titles="['流行', '新款', '精选']"
                  @tabClick="tabClick"
                  ref="tabcontrol2"
                  :class="{fixed: isTabFixed}"
                  />
    <goods-list :goods="showGoods"/>
  </scroll>

  <!-- 组建不可以直接监听点击，要加上修饰符native -->
  <back-top @click.native="backClick" v-show="isShowBackTop"/>

</div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";
import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";


import HomeSwiper from "./childComponents/HomeSwiper";
import RecommendView from "./childComponents/RecommendView";
import FeatureView from "./childComponents/FeatureView";

import { debounce } from "common/utils";

import {
  getHomeMultidata,
  getHomeGoods
  } from "network/home";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    data() {
      return {
        // result: null,
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []}
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }

    },
    // 切换页面时，每次返回首页位置信息都会置顶，是因为每次离开都被销毁重新创建
    destroyed() {
      console.log('destroyed');
    },
    activated() {
      // 最后一个时间参数不要设置为0，否则上拉加载后会回到顶部
      this.$refs.scroll.scrollTo(0, this.saveY, 1)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    // 组件创建完会执行的生命周期函数
    created() {
      // created里面不适合放函数具体执行过程，只需要知道执行了那些函数即可
      // 1.请求轮播图等
      this.getHomeMultidata();

      // 2.请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

    },
    mounted() {
      // 1.监听Item中图片加载完成
      // refresh后面不能带小括号，带小括号会立即执行穿进去的是函数执行的结果
      const refresh = debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('itemImgLoad', () => {
      // console.log('-------');
      // 刷新
      // this.$refs.scroll && this.$refs.scroll.refresh()
      refresh()
      })

    },

    methods: {
      /**
       * 事件监听相关的方法
       */
      tabClick(index) {
         switch(index) {
           case 0:
           this.currentType = 'pop'
           break;
           case 1:
           this.currentType = 'new'
           break;
           case 2:
           this.currentType = 'sell'
           break;
         }
        // 让两个tabcontrol点击保持一致
        this.$refs.tabcontrol1.currentIndex = index;
        this.$refs.tabcontrol2.currentIndex = index;

      },
      backClick() {
        // 拿到srcoll组件，再调用srcoll对象的scrollTo方法
        // this.$refs.scroll.scroll.scrollTo(0, 0, 500)
        // 拿到srcoll组件直接调用封装好的方法
        this.$refs.scroll.scrollTo(0, 0, 500)
      },
      controlScroll(position) {
        // 1.判断backtop是否显示
        // console.log(position);
        this.isShowBackTop = (-position.y) > 1000

        // 2.决定tabcontrol是否吸顶（position ：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop

      },
      loadMore() {
        console.log('上拉加载更多');
        this.getHomeGoods(this.currentType)

        // ----------上拉不滚动的bug----------
        // 监听图片加载完
        // 刷新DOM
        // this.$refs.scroll.scroll.refresh()
      },
      swiperImgLoad() {
        // 组件没有offsetTop属性
        // $el可以获取组件内的元素
        this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop
      },


      /**
       * 网络请求相关的方法
       */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
        console.log(res);
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
      },
      getHomeGoods(type) {
        // 获取当前页签的页码
        const page = this.goods[type].page + 1
        // 根据页码请求数据
        getHomeGoods(type, page).then(res => {
        // push函数可以穿多个参数
        // 不能直接传输数组，否则会被当成一个对象
        // push函数内部会将...语法可以将数组解析成一个个值，然后依次push
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1
        console.log(res);

        // 重复上拉加载
        this.$refs.scroll.finishPullUp()
      })
      },


      }
  }
</script>

<style scoped>
/* scoped表示作用域 */
#home {
  /* padding-top: 44px; */
  /* vh 视口高度 */
  height: 100vh;
  position: relative;
}

.home-nav {
  /* 设置背景颜色 */
  background-color: var(--color-tint);
  /* 设置文字颜色 */
  color: var(--color-background);

  /* 浏览器原生滚动时，为了让导航固定 */
  /* position: fixed; */
  /* left right都要写，不然宽度不能全部填充 */
  /* left: 0; */
  /* right: 0; */
  /* top: 0; */
  /* 当布局重叠的时候，谁得值大显示谁 */
  /* z-index: 8; */
}

/* 用插件scroll以后，吸顶效果就不能实现了 */
/* 吸顶效果，达到top值之前，属性为sticky；达到top值之后，会自动将属性变为fixed */
/* .tab-control {
  position: sticky;
  top: 44px;
  z-index: 9;
} */
/* better-scroll不能用 */
/* .fixed {
  position: fixed;
  left: 0;
  right: 0;
  top: 44px;
  z-index: 9;
} */
.tab-control {
  position: relative;
  /* 定位z-index才会有效果 */
  z-index: 9;
}

/* 方案一：计算得出 */
/* 取消home padding-top*/
/* .content {
  height: calc(100%-93px);
  margin-top: 44px;
  overflow: hidden;
  } */

/* 方案二：定位*/
 .content {
  position: absolute;
  top: 44px;
  bottom: 49px;
  left: 0;
  right: 0;
  overflow: hidden;
  }
</style>
