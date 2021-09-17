<template>
<div id="detail">
  <!-- 导航 -->
  <detail-nav-bar/>


</div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";

import { getDetail } from "network/detail";

export default {
  name: 'Detail',
  components: {
    DetailNavBar,
  },
  data() {
    return {
      iid: null,
      topImages: []
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid

    // 2.根据iid，请求详情数据
    getDetail(this.iid).then(res => {
      console.log(res);
      // a.获取顶部图片的轮播数据
      this.topImages = res.result.itemInfo.topImages


    })

  }

}
</script>

<style>

</style>
