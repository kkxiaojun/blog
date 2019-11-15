// 路径解析
const path = require('path')

// 压缩JavaScript文件, uglifyjs-webpack-plugin不支持ES6语法
const terserWebpackPlugin = require('terser-webpack-plugin')

// 简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 
// 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

const HtmlWebpackPlugin = require('html-webpack-plugin')

// - css-loader 负责解析 CSS 代码，主要是为了处理 CSS 中的依赖，例如 `@import` 和 `url()` 等引用外部文件的声明；
// - style-loader 会将 css-loader 解析的结果转变成 JS 代码，运行时动态插入 `style` 标签来让 CSS 代码生效。
// extract-text-webpack-plugin将css单独剥离出来,替换插件（optimize-css-assets-webpack-plugin，mini-css-extract-plugin）
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

// 生成控制台的友好提示信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const PORT = 8080
module.exports = {
  entry: {
    index: ['./src/js/index.js'],
    vendors: ["./src/js/vendors.js"]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[name].[hash].js'
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // Gzip压缩
    quiet: true, // necessary for FriendlyErrorsPlugin
    port: PORT
  },
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, './src/js'), // js 目录下的才需要经过 babel-loader 处理
        ],
        use: {
          loader: 'babel-loader'
          // options: {
          //   // babel-preset-env 会是一个更好的选择，babel-preset-env 可以根据配置的目标浏览器或者运行环境来自动将ES2015+的代码转换为es5。
          //   presets: ['@babel/preset-env']
          // }
        }
      },      
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192 // 在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'index.html', // 配置文件模板
    }),
    // 压缩js代码
    new terserWebpackPlugin({
      cache: true,
      parallel: true
    }),
    // extract css into its own file
    // Error contenthash not implemented with webpack > 4.3.0
    // 1. yarn upgrade extract-text-webpack-plugin@next
    // 2. 采用 mini-css-extract-plugin
    new MiniCssExtractPlugin({
      // 因为webpack4.3包含了contenthash这个关键字，所以ExtractTextPlugin中不能使用contenthash
      // 使用md5:contenthash:hex:8代替contenthash
      // github issue https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/765
      filename: 'css/[name].[contenthash].css',
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`, 
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true,
    }),
    // 生成控制台的友好提示信息
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: localhost:${PORT}`
        ]
      }
    })
  ]
}

