**此优化配置的文章是基于webpack4.x的版本**
## webpack4.x
在webpack4中，一些默认插件由 optimization 配置替代了，如下：

* CommonsChunkPlugin废弃，由 optimization.splitChunks 和 optimization.runtimeChunk 替代，前者拆分代码，后者提取runtime代码。原来的CommonsChunkPlugin产出模块时，会包含重复的代码，并且无法优化异步模块，minchunks的配置也较复杂，splitChunks解决了这个问题；另外，将 optimization.runtimeChunk 设置为true（或{name: “manifest”}），便能将入口模块中的runtime部分提取出来。
* NoEmitOnErrorsPlugin 废弃，由 optimization.noEmitOnErrors 替代，生产环境默认开启。
* NamedModulesPlugin 废弃，由 optimization.namedModules 替代，生产环境默认开启。
* ModuleConcatenationPlugin 废弃，由 optimization.concatenateModules 替代，生产环境默认开启。
* optimize.UglifyJsPlugin 废弃，由 optimization.minimize 替代，生产环境默认开启。

**optimization 还提供了如下默认配置：**

```javascript
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
    },
    runtimeChunk: 'single',
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
    ]
  }
```
更多关于webpack4.x中splitChunks的内容，需要的可以查看官网文档了解。[https://webpack.js.org/plugins/split-chunks-plugin/](https://webpack.js.org/plugins/split-chunks-plugin/)
## webpack优化方案
1. 缩小编译范围，减少不必要的编译工作，即 modules、mainFields、noParse、includes、exclude、alias等。
2. 通过 externals 配置来提取常用库，引用cdn。
3. 使用缓存和dllplugin。
4. webpack-parallel-uglify-plugin和happypack多核构建项目。

### 缩小编译范围，减少不必要的编译工作
缩小编译范围，减少不必要的编译工作，即 modules、mainFields、noParse、includes、exclude、alias等。
```javascript
const resolve = dir => path.join(__dirname, '..', dir);

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')],
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      }
    ]
  }
```
### 通过 externals 配置来提取常用库，引用cdn
如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals。这个功能主要是用在创建一个库的时候用的，但是也可以在我们项目开发中充分使用。
```javascript
externals:["React","jQuery"]
```
### dllplugin启用预编译

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