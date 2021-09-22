<template>
  <swiper>
    <swiper-item v-for = "(item, index) in banners" :key="index">
      <!-- 或者 v-for = "item in banners" :key="item.index -->
      <a :href="item.link">
        <img :src="item.image" alt="" @load="imgLoad">
      </a>
    </swiper-item>
  </swiper>
</template>

<script>
import { Swiper, SwiperItem } from "components/common/swiper";

export default {
  name: 'HomeSwiper',
  props: {
    banners: {
      type: Array,
      // 当默认值是对象或者数组时，必须是一个函数
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoad: false
    }
  },
  components: {
    Swiper,
    SwiperItem
  },
  methods: {
    imgLoad() {
      if (!this.isLoad) {
        this.$emit('swiperImgLoad')
        this.isLoad = true
      }

    }
  }

}
</script>

<style>

</style>
