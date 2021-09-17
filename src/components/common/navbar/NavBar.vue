<template>
<!-- 每个页面都会有导航，所以将导航给一个class -->
<div class="nav-bar">
  <!-- 具名插槽，写name属性 -->
  <div class="left"><slot name="left"></slot></div>
  <div class="center"><slot name="center"></slot></div>
  <div class="right"><slot name="right"></slot></div>
</div>

</template>

<script>
export default {
  name: 'NavBar'

}
</script>

<style>
.nav-bar {
  display: flex;
  /* 设置高度 */
  height: 44px;
  /* 设置line-height也能撑起高度，但是必须有内容，且设置后文字垂直居中 */
  line-height: 44px;
  /* 水平居中 */
  text-align: center;
  /* 导航下设置阴影 */
  box-shadow: 0 1px 1px rgba(100, 100, 100, 0.1);

}

.left, .right {
  width: 60px;
   /* background-color: pink; */
}

.center {
  flex: 1;
   /* background-color: skyblue; */
}

</style>
