<template>
<div class="goods">
  <goods-list-item v-for="item in goods" :key="item.index" :goods-item="item" class="goods-item"/>
</div>
</template>

<script>
import GoodsListItem from "./GoodsListItem.vue";

export default {
  name: 'GoodsList',
  props: {
    goods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    GoodsListItem
  }

}
</script>

<style>
.goods {
  display: flex;
  /* 不包裹，按实际宽度显示 */
  flex-wrap: wrap;
  padding: 5px;
  /* 均等分：中间的空隙均等分 */
  justify-content: space-around;
}

.goods-item {
    width: 48%;
  }

</style>
