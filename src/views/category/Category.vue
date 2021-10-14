<template>
  <div id="category">
    <nav-bar class="nav-bar"><div slot="center">商品分类</div></nav-bar>
    <div class="content">
      <tab-menu :categories="categories"
                @selectItem="selectItem"/>
      <div id="right-content">
        <tab-control :titles="['综合', '新品', '销量']"
                  @itemClick="tabClick"
                  @tabClick="tabClick"
                  ref="tabcontrol1"
                  class="tab-control" v-show="isTabFixed"/>
        <scroll id="tab-content"
              :data="[categoryData]"
              ref="scroll"
              :probe-type="3"
              @scroll="controlScroll">
        <div>
          <tab-content-category :subcategories="showSubcategory" @categoryImageLoad="categoryImageLoad"/>
          <tab-control :titles="['综合', '新品', '销量']"
                       @itemClick="tabClick"
                       @tabClick="tabClick"
                       ref="tabcontrol2"/>
          <goods-list :goods="showCategoryDetail"/>
        </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'

  import TabMenu from './childComps/TabMenu'
  import TabContentCategory from './childComps/TabContentCategory'


  import TabControl from 'components/content/tabControl/TabControl'
  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from 'components/content/goods/GoodsList'

  import {getCategory, getSubcategory, getCategoryDetail} from "network/category";
  import {POP, SELL, NEW} from "common/const";
  import {tabControlMixin} from "@/common/mixin";

  export default {
		name: "Category",
    components: {
		  NavBar,
      TabMenu,
      TabControl,
      Scroll,
      TabContentCategory,
      GoodsList
    },
    mixins: [tabControlMixin],
    data() {
		  return {
		    categories: [],
        categoryData: {
        },
        currentIndex: -1,
        tabOffsetTop: 0,
        isTabFixed: false,
      }
    },
    created() {
		  // 1.请求分类数据
      this._getCategory()

      // 2.监听图片加载完成
	    this.$bus.$on('imgLoad', () => {
		    this.$refs.scroll.refresh()
	    })
    },
    computed: {
		  showSubcategory() {
		    if (this.currentIndex === -1) return {}
        return this.categoryData[this.currentIndex].subcategories
      },
      showCategoryDetail() {
		    if (this.currentIndex === -1) return []
		    return this.categoryData[this.currentIndex].categoryDetail[this.currentType]
      }
    },
    methods: {
		  _getCategory() {
		    getCategory().then(res => {
		      // 1.获取分类数据
		      this.categories = res.data.category.list
			    console.log(res);
			    // 2.初始化每个类别的子数据
          for (let i = 0; i < this.categories.length; i++) {
            this.categoryData[i] = {
              subcategories: {},
              categoryDetail: {
                'pop': [],
                'new': [],
                'sell': []
              }
            }
          }
          // 3.请求第一个分类的数据
          this._getSubcategories(0)
        })
      },
      _getSubcategories(index) {
        this.currentIndex = index;
		    const mailKey = this.categories[index].maitKey;
        getSubcategory(mailKey).then(res => {
          this.categoryData[index].subcategories = res.data
          this.categoryData = {...this.categoryData}
          this._getCategoryDetail(POP)
          this._getCategoryDetail(SELL)
          this._getCategoryDetail(NEW)
        })
      },
      _getCategoryDetail(type) {
		    // 1.获取请求的miniWallkey
        const miniWallkey = this.categories[this.currentIndex].miniWallkey;
        // 2.发送请求,传入miniWallkey和type
		    getCategoryDetail(miniWallkey, type).then(res => {
		      // 3.将获取的数据保存下来
		      this.categoryData[this.currentIndex].categoryDetail[type] = res
          this.categoryData = {...this.categoryData}
        })
      },
      /**
       * 事件响应相关的方法
       */
      selectItem(index) {
        this._getSubcategories(index)
      },
      tabClick(index) {
         switch(index) {
           case 0:
           this.currentType = 'pop'
           break;
           case 1:
           this.currentType = 'sell'
           break;
           case 2:
           this.currentType = 'new'
           break;
         }
        // 让两个tabcontrol点击保持一致
        this.$refs.tabcontrol1.currentIndex = index;
        this.$refs.tabcontrol2.currentIndex = index;
      },
      controlScroll(position) {
        // 决定tabcontrol是否吸顶（position ：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
        console.log(this.isTabFixed,-position.y);

      },
      categoryImageLoad() {
        // 组件没有offsetTop属性
        // $el可以获取组件内的元素
        this.tabOffsetTop = this.$refs.tabcontrol2.$el.offsetTop
        console.log(this.tabOffsetTop);
      },

    }
	}
</script>

<style scoped>
  #category {
    height: 100vh;
  }

  .nav-bar {
    background-color: var(--color-tint);
    font-weight: 700;
    color: #fff;
  }

  .content {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 49px;

    display: flex;
  }

  #right-content {
    flex: 1;
  }

  #tab-content {
    height: 100%;
  }

</style>
