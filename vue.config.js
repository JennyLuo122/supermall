module.exports = {
  // 表示要配置 webpack
  configureWebpack: {
        // 配置路径相关
    resolve: {
      // 哪些后缀可以不用写
      extensions: [],
      // 配置别名
        alias: {
        // 内部已经配置过了，src别名就是@
        // '@': 'src',
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        // 可以通过this.$router和this.$store直接拿到这两个对象
        // 'router': '@/router',
        // 'store': '@/store',
        'views': '@/views',

        }

    }

  }
}

