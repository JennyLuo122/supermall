<template>
<div class="goods-item" @click="goodsClick">
  <!-- 监听图片是否加载完，加载完刷新scroll height -->
  <!-- <img :src="showImage" alt="" @load="imgLoad"> -->
  <img v-lazy="showImage" alt="" @load="imgLoad">
  <!-- src要动态绑定值 -->
  <!-- <img :src="goodsItem.show.img" alt=""> -->
  <div class="goods-info">
    <p>{{goodsItem.title}}</p>
    <span class="price">{{goodsItem.price}}</span>
    <span class="collect">{{goodsItem.cfav}}</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'GoodsListItem',
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
  	showImage() {
    	return this.goodsItem.img || this.goodsItem.image || this.goodsItem.show.img
    }
  },
  methods: {
    imgLoad() {
      // 发送时间到 ‘事件总线’
      this.$bus.$emit('itemImgLoad')
    },
    goodsClick() {
      // console.log('跳转详情页');
      // 详情页需要返回，最好用push，push可以返回
      this.$router.push('/detail/'+this.goodsItem.iid)
    }
  }

}
</script>

<style>
  .goods-item {
    padding-bottom: 40px;
    position: relative;
  }

  .goods-item img {
    width: 100%;
    border-radius: 5px;
  }

  .goods-info {
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 0;
    right: 0;
    overflow: hidden;
    text-align: center;
  }

  .goods-info p {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 3px;
  }

  .goods-info .price {
    color: var(--color-high-text);
    margin-right: 20px;
  }

  .goods-info .collect {
    position: relative;
  }

  /* 伪元素设置收藏的五角星 */
  .goods-info .collect::before {
    content: '';
    position: absolute;
    left: -15px;
    top: -1px;
    width: 14px;
    height: 14px;
    background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
  }

</style>
