// 路径解析
const path = require('path')

// 压缩JavaScript文件
const UglifyPlugin = require('uglifyjs-webpack-plugin')

// 简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 
// 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

const HtmlWebpackPlugin = require('html-webpack-plugin')

// - css-loader 负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 `@import` 和 `url()` 等引用外部文件的声明；
// - style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时动态插入 `style` 标签来让 CSS 代码生效。
// extract-text-webpack-plugin将css单独剥离出来
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// optimize-css-assets-webpack-plugin, 压缩css

module.exports = {
  entry: './js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[hash].js'
  },
  module: {
    rules: [
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'style'),
        ],
        // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
        use: ExtractTextPlugin.extract({ 
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'index.html', // 配置文件模板
    }),
    // 压缩js代码
    new UglifyPlugin(),
    new ExtractTextPlugin('index.css')
  ]
}

