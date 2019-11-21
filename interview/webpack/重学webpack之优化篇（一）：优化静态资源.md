## 图片资源
** 对于项目中的图片资源，我们主要从两方面进行优化：**

1. 对资源进行压缩，减少体积。
2. 减少请求的数量，降低服务器压力。

**对资源进行压缩，减少体积**，我们使用对应的loader进行处理。

使用`file-loader` 来处理图片文件
```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {}
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
          },
        ],
      },
    ],
  },
}
```
当我们要将一些图片转换为base64 uri，减少http请求时，就可以用`url-loader`进行处理
`url-loader`
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src')],
        options: {
          limit: 10000, // 限制文件的最大大小
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
```

`CSS Sprites`相信大家都了解了，当我们的项目中，使用了大量的svg-icon时，可以用`svg-sprite-loader`进行处理：

`svg-sprite-loader`
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        // 只对相应目录下的资源做处理
        include: [resolve('src/icons')],
        options: {}
      }
    ]
  }
}
```
## HTML模板
前面有讲到，我们会用`html-webpack-plugin`将`index.html`与打包后的进行关联，其实，`html-webpack-plugin`中还有提供输出配置`minify`：

当`mode`为`production`时，`minify`配置生效

`html-webpack-plugin`
```javascript
new HtmlWebpackPlugin({
  filename: 'index.html',
  template: 'index.html',
  inject: true,
  title: 'admin',
  minify: {
    // 合并空格
    collapseWhitespace: true,
    // 移除注解
    removeComments: true,
    // 移除多余的属性
    removeRedundantAttributes: true,
    // 移除脚本类型属性
    removeScriptTypeAttributes: true,
    // 移除样式类型属性
    removeStyleLinkTypeAttributes: true,
    // 使用简短的文档类型
    useShortDoctype: true
    // more options:
    // https://github.com/kangax/html-minifier#options-quick-reference
  }
}),
```

## CSS剥离与压缩
`extract-text-webpack-plugin`和`mini-css-extract-plugin`是可以提取CSS到单独的文件中。

```javascript
  module: {
    rules: [
      {
        test: /\.css/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader // 涉及到内容装转换
          },
          'css-loader'
        ]
      }
    ]
  }
  plugins: [
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
    })
  ]
```
这俩个插件的作用是相同的，至于为什么选择`mini-css-extract-plugin`?

<font color=red>不用`extract-text-webpack-plugin`的原因：`extract-text-webpack-plugin`默认安装的版本是3.x.x，还不支持webpack的4.x版本</font>

关于`webpack`中`hash`相关的详细内容，请移步[重学webpack之原理篇（二）：hash+chunkhash+contenthash](重学webpack之原理篇（二）：hash+chunkhash+contenthash)


## JavaScript
`webpack4.x`中已经可以将压缩的插件放置在`minimizer`中了。
用`UglifyJsPlugin`进行JS代码压缩
```javascript
module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            safari10: true
          },
          // 清除生产环境的控制台输出
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }  
        },
        sourceMap: config.build.productionSourceMap,
        cache: true,
        parallel: true
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSAssetsPlugin()
    ]
  }
})
```
## 关于代码分离
代码分离是 webpack 中最引人注目的特性之一。此特性能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。
代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，果使用合理，会极大影响加载时间。

常用的代码分离方法有三种：

1. 入口起点：使用 entry 配置手动地分离代码。
2. 防止重复：使用 SplitChunksPlugin 去重和分离 chunk。
3. 动态导入：通过模块中的内联函数调用来分离代码。

### 入口起点
我们可以通过配置多个入口文件，从而进行代码分离
```javascript
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: ['./src/main.js', './src/index.js']
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js'
  }
}
```

但是，这样做有两个缺点：
1. 如果入口 chunk 之间包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中。
2.  


### 防止重复
### 动态导入

```javascript
module.exports = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        },
        elementUI: {
          name: 'chunk-elementUI', // 单独将 elementUI 拆包
          priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
          test: /[\\/]node_modules[\\/]element-ui[\\/]/
        }
      }
    }
  }
})
```


