<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>

  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
// a.导入上拉加载插件
import PullUp from '@better-scroll/pull-up'

// b.注册上拉加载插件
BScroll.use(PullUp)

export default {
  name: 'Scroll',
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
  data() {
    return {
      scroll: null,
    }
  },
  mounted() {
    // document.querySelector('.wrapper')可能会查询别的页面对象
    // 想要拿到明确的组件，可以通过ref属性
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      observeDOM: true,
      // 控制div元素是否可以点击
      click: true,
      probeType: this.probeType,
      // c.使用上拉加载插件
      pullUpLoad: this.pullUpLoad


    })

    // 2.监听滚动的位置
    if (this.probeType === 2 || this.probeType === 3) {
    this.scroll.on('scroll', (position) => {
      // console.log(position);
      this.$emit('scroll', position)
    })

    }

    // 3.监听上拉加载
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
      // console.log('--上拉加载更多--');
      this.$emit('pullingUp')
    })

    }

    // 传x和y，即可回到对应位置，t表示执行的时间
    // this.scroll.scrollTo(x, y, t)

  },
  methods: {
    scrollTo(x, y, time=300) {
      // this.scroll.scrollTo(x, y, time)
      this.scroll && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    refresh() {
      // this.scroll.refresh()
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }


  }

}
</script>

<style>

</style>
