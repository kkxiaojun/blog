# webpack优化方案
#### 不要让 loader 做太多事情——以 babel-loader 为例

babel-loader 无疑是强大的，但它也是慢的。

最常见的优化方式是，用 include 或 exclude 来帮我们避免不必要的转译，比如 webpack 官方在介绍 babel-loader 时给出的示例：

```
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }
  ]
}

```

这段代码帮我们规避了对庞大的 node\_modules 文件夹或者 bower\_components 文件夹的处理。但通过限定文件范围带来的性能提升是有限的。除此之外，如果我们选择开启缓存将转译结果缓存至文件系统，则至少可以将 babel-loader 的工作效率提升两倍。要做到这点，我们只需要为 loader 增加相应的参数设定：

```
loader: 'babel-loader?cacheDirectory=true'

```

以上都是在讨论针对 loader 的配置，但我们的优化范围不止是 loader 们。

举个🌰，尽管我们可以在 loader 配置时通过写入 exclude 去避免 babel-loader 对不必要的文件的处理，但是考虑到这个规则仅作用于这个 loader，像一些类似 UglifyJsPlugin 的 webpack 插件在工作时依然会被这些庞大的第三方库拖累，webpack 构建速度依然会因此大打折扣。所以针对这些庞大的第三方库，我们还需要做一些额外的努力。

#### 不要放过第三方库

第三方库以 node\_modules 为代表，它们庞大得可怕，却又不可或缺。

处理第三方库的姿势有很多，其中，Externals 不够聪明，一些情况下会引发重复打包的问题；而 CommonsChunkPlugin 每次构建时都会重新构建一次 vendor；出于对效率的考虑，我们这里为大家推荐 DllPlugin。

DllPlugin 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。**这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包**。

用 DllPlugin 处理文件，要分两步走：

*   基于 dll 专属的配置文件，打包 dll 库
*   基于 webpack.config.js 文件，打包业务代码

**AutoDllPlugin：解放你的配置负担**
webpack插件`autodll-webpack-plugin`
```javascript
// 文件目录：configs/webpack.common.js

const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin'); // 第 1 步：引入 DLL 自动链接库插件

module.exports = {
  // ......
  plugins: [
        // 第 2 步：配置要打包为 dll 的文件
        new AutoDllPlugin({
            inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
            filename: '[name].dll.js',
            context: path.resolve(__dirname, '../'), // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
            entry: {
                react: [
                    'react',
                    'react-dom'
                ]
            }
        })
  ]
}
```

**抛弃 DLL：Vue & React 官方的共同选择**
wepack4已经抛弃了dll,vue-cli和react-create-app都抛弃了dll

更好用的插件
[HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin)

```
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  // ......
  plugins: [
    new HardSourceWebpackPlugin() // <- 直接加入这行代码就行
  ]
}
```


#### Happypack——将 loader 由单进程转为多进程

大家知道，webpack 是单线程的，就算此刻存在多个任务，你也只能排队一个接一个地等待处理。这是 webpack 的缺点，好在我们的 CPU 是多核的，Happypack 会充分释放 CPU 在多核并发方面的优势，帮我们把任务分解给多个子进程去并发执行，大大提升打包效率。

HappyPack 的使用方法也非常简单，只需要我们把对 loader 的配置转移到 HappyPack 中去就好，我们可以手动告诉 HappyPack 我们需要多少个并发的进程：

```
const HappyPack = require('happypack')
// 手动创建进程池
const happyThreadPool =  HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  module: {
    rules: [
      ...
      {
        test: /\.js$/,
        // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
        loader: 'happypack/loader?id=happyBabel',
        ...
      },
    ],
  },
  plugins: [
    ...
    new HappyPack({
      // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
      id: 'happyBabel',
      // 指定进程池
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory']
    })
  ],
}

```

### 构建结果体积压缩

#### 文件结构可视化，找出导致体积过大的原因

这里为大家介绍一个非常好用的包组成可视化工具——[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)，配置方法和普通的 plugin 无异，它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来，格局如官方所提供这张图所示：

![](https://user-gold-cdn.xitu.io/2018/9/14/165d838010b20a4c?w=908&h=547&f=gif&s=3663774)

在使用时，我们只需要将其以插件的形式引入：

```
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}

```