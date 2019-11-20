// 路径解析
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')
const env = require('./dev.env')
// 简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 
// 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    // 允许在编译时(compile time)配置的全局常量
    new webpack.DefinePlugin({
      'process.env': env
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // Gzip压缩
    port: 8080, // 端口
    host: 'localhost',
    open: true, // 自动开启浏览器
    hot: true, // 是否热更新
  }
})
