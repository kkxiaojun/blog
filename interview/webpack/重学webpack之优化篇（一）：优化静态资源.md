## 图片资源
**对于项目中的图片资源，我们主要从两方面进行优化：**

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
2. 这种方法不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码。

关于模块重复的问题，可以用``解决

### 防止重复
`optimization`中的`splitChunks`即可做到

注意：`splitChunks`是webpack4.x的解决方案，webpack3.x是用`CommonsChunkPlugin`插件

`webpack3.x`
```
 new webpack.optimize.CommonsChunkPlugin(options)
```

`webpack4.x`
```javascript
 const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
      splitChunks: {
        chunks: 'all', // chunks 代码公共的部分分离出来成为一个单独的文件
      }
    }
  };
```

更详细的配置内容：

```javascript
optimization: {
    minimize: env === 'production' ? true : false, // 开发环境不压缩
    splitChunks: {
        chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
        minSize: 30000, // 模块超过30k自动被抽离成公共模块
        minChunks: 1, // 模块被引用>=1次，便分割
        maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
        maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
        name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
        automaticNameDelimiter: '~', // 命名分隔符
        cacheGroups: { // 缓存组，会继承和覆盖splitChunks的配置
            default: { // 模块缓存规则，设置为false，默认缓存组将禁用
                minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
                priority: -20, // 优先级
                reuseExistingChunk: true, // 默认使用已有的模块
            },
            vendors: {
                test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
                priority: -10
            }
        }
    }
}
```

plitChunks是拆包优化的重点，如果你的项目中包含 element-ui 等第三方组件（组件较大），建议单独拆包，如下所示:
```javascript
splitChunks: {
    // ...
    cacheGroups: {    
        elementUI: {
            name: "chunk-elementUI", // 单独将 elementUI 拆包
            priority: 10, // 权重需大于其它缓存组
            test: /[\/]node_modules[\/]element-ui[\/]/
        }
    }
}
```
### 动态导入
使用ECMAScript的 `import()`, webpack 会自动处理使用该语法编写的模块。

```javascript
// import 作为一个方法使用，传入模块名即可，返回一个 promise 来获取模块暴露的对象
// 注释 webpackChunkName: "lodash" 指定 chunk 的名称，输出文件时有用
import(/* webpackChunkName: "lodash" */ 'lodash').then((_) => { 
  console.log(_.lash([1, 2, 3])) // 打印 3
})

```

`vue-router`中也有类似的应用：
有时候我们想把某个路由下的所有组件都打包在同个异步块 (chunk) 中。只需要使用 命名 chunk，一个特殊的注释语法来提供 chunk name (需要 Webpack > 2.4)。
```javascript
const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
```


