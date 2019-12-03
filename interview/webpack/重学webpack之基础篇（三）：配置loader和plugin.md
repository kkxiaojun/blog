# 重学webpack（三）：loader和plugin的详细配置
前面已经配置了基本的`loader`和`plugin`，但是`loader`和`plugin`的配置内容还有很多详细的内容，这里主要记录常用的配置内容。

## 配置loader
`webpack` 的 `loader` 用于处理不同的文件类型，对模块的源代码进行转换。在实际的项目中使用时，遇到的情况会比较多，这里将详细讲解`loader`的配置

例子：
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx$/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, './src/js'), // js 目录下的才需要经过 babel-loader 处理
        ],
        loader: 'babel-loader'
      }
    ]
  }
}
```
### 模块规则
1. **module.rules**
创建模块时，匹配请求的规则数组。这些规则能够修改模块的创建方式。这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。

2. **Rule**
每个规则可以分为三部分 - 条件(condition)，结果(result)和嵌套规则(nested rule)。

3. **Rule 条件**
条件有两种输入值：

* resource：请求文件的绝对路径。它已经根据 resolve 规则解析。

* issuer: 被请求资源(requested the resource)的模块文件的绝对路径。是导入时的位置。

例如: 从 app.js 导入 './style.css'，resource 是 /path/to/style.css. issuer 是 /path/to/app.js。

在规则中，属性 test, include, exclude 和 resource 对 resource 匹配，并且属性 issuer 对 issuer 匹配。

当使用多个条件时，所有条件都匹配。

4. **Rule结果**
规则结果只在规则条件匹配时使用。

规则有两种输入值：

应用的 loader：应用在 resource 上的 loader 数组。
Parser 选项：用于为模块创建解析器的选项对象。
这些属性会影响 loader：loader, options, use。

也兼容这些属性：query, loaders。

enforce 属性会影响 loader 种类。不论是普通的，前置的，后置的 loader。

parser 属性会影响 parser 选项。
```javascript
  // 关于模块配置
  rules: [
    // 模块规则（配置 loader、解析器等选项）
    {
      test: /\.jsx?$/,
      include: [
        path.resolve(__dirname, "app")
      ],
      exclude: [
        path.resolve(__dirname, "app/demo-files")
      ],
      // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
      // test 和 include 具有相同的作用，都是必须匹配选项
      // exclude 是必不匹配选项（优先于 test 和 include）
      // 最佳实践：
      // - 只在 test 和 文件名匹配 中使用正则表达式
      // - 在 include 和 exclude 中使用绝对路径数组
      // - 尽量避免 exclude，更倾向于使用 include
      issuer: { test, include, exclude },
      // 标识应用这些规则，即使规则覆盖（高级选项）
      loader: "babel-loader",
      // 应该应用的 loader，它相对上下文解析
      options: {
        presets: ["es2015"]
      },
      // loader 的可选项
    },
    {
      test: /\.html$/,
      use: [
        // 应用多个 loader 和选项
        "htmllint-loader",
        {
          loader: "html-loader",
          options: {
            /* ... */
          }
        }
      ]
      },
```
### 规则条件

*   `test` 匹配特定条件
*   `include` 匹配特定路径
*   `exclude` 排除特定路径

总结：
1. 在 `include` 和 `exclude` 中使用绝对路径数组
2. 尽量避免 `exclude`，更倾向于使用 `include`


## 配置plugin
> 插件是 webpack 的 支柱 功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！插件目的在于解决 loader 无法实现的其他事。

对于插件的配置，这里主要介绍几个常用的插件


### extract-text-webpack-plugin与mini-css-extract-plugin
`extract-text-webpack-plugin`和`mini-css-extract-plugin`是可以提取CSS到单独的文件中。它创建了一个CSS文件/ JS文件包含CSS。

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

### hard-source-webpack-plugin
`hard-source-webpack-plugin`是对于构建的module进行缓存，二次构建的时候，提升构建速度
```javascript
  plugins: [
    new HardSourceWebpackPlugin({
      // cacheDirectory是在高速缓存写入。默认情况下，将缓存存储在node_modules下的目录中，因此如 
      // 果清除了node_modules，则缓存也是如此
      cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
      // Either an absolute path or relative to webpack's options.context.
      // Sets webpack's recordsPath if not already set.
      recordsPath: 'node_modules/.cache/hard-source/[confighash]/records.json',
      // configHash在启动webpack实例时转换webpack配置，并用于cacheDirectory为不同的webpack配 
      // 置构建不同的缓存
      configHash: function(webpackConfig) {
        // node-object-hash on npm can be used to build this.
        return require('node-object-hash')({sort: false}).hash(webpackConfig);
      },
      // 当加载器，插件，其他构建时脚本或其他动态依赖项发生更改时，hard-source需要替换缓存以确保输 
      // 出正确。environmentHash被用来确定这一点。如果散列与先前的构建不同，则将使用新的缓存
      environmentHash: {
        root: process.cwd(),
        directories: [],
        files: ['package-lock.json', 'yarn.lock'],
      }
    })
  ]
```

具体内容可以看

[重学webpack之优化篇（五）：用缓存提升二次构建](重学webpack之优化篇（五）：用缓存提升二次构建)
