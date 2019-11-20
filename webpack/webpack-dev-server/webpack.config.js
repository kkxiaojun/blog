// 路径解析
const path = require('path')

// 简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 
// 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: {
    index: ['./index.js']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'index.html', // 配置文件模板
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
}

