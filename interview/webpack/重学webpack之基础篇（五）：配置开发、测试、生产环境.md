# 为什么要区分配置
development(开发环境) 和 production(生产环境) 这两个环境下的构建目标存在着巨大差异。在开发环境中，我们需要：强大的 source map 和一个有着 live reloading(实时重新加载) 或 hot module replacement(热模块替换) 能力的 localhost server。而生产环境目标则转移至其他方面，关注点在于压缩 bundle、更轻量的 source map、资源优化等，通过这些优化方式改善加载时间。由于要遵循逻辑分离，我们通常建议为每个环境编写彼此独立的 webpack 配置。

# `webpack-merge`根据不同环境，分离配置文件
虽然，以上我们将生产环境和开发环境做了略微区分，但是，请注意，我们还是会遵循不重复原则(Don't repeat yourself - DRY)，保留一个 "common(通用)" 配置。为了将这些配置合并在一起，我们将使用一个名为 webpack-merge 的工具。此工具会引用 "common" 配置，因此我们不必再在环境特定(environment-specific)的配置中编写重复代码。

我们先从安装 webpack-merge 开始，并将之前指南中已经成型的那些代码进行分离： 

项目
webpack-environment
```javascript
│  index.html
│  package-lock.json
│  package.json
│
├─config
│      dev.env.js
│      prod.env.js
│      webpack.common.js
│      webpack.dev.js
│      webpack.prod.js
│
├─dist
│      bundle.js
│      index.html
│
└─src
        index.js
```

`webpack.common.js`
```javascript
// 路径解析
const path = require('path')
const webpack = require('webpack')
// 简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 
// 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'index.html', // 配置文件模板
    })
  ]
}

```

`webpack.dev.js`
```javascript
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

```

`webpack.prod.js`
```javascript
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const prod = require('./prod.env')
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // 允许在编译时(compile time)配置的全局常量
    new webpack.DefinePlugin({
      'process.env': prod
    })
  ]
})

```
`package.json`
```javascript
{
  "name": "webpack-dev-server",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "dev": "webpack-dev-server --inline --progress --config config/webpack.dev.js",
    "build": "webpack --progress --config config/webpack.prod.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "html-webpack-plugin": "^3.2.0",
    "webpack": "^4.41.2",
    "webpack-cli": "^3.3.10",
    "webpack-dev-server": "^3.9.0",
    "webpack-merge": "^4.2.2"
  }
}
```

# `webpack.DefinePlugin`编译时(compile time)配置全局常量

可以看到项目的整体目录：
```javascript
│  index.html
│  package-lock.json
│  package.json
│
├─config
│      dev.env.js
│      prod.env.js
│      webpack.common.js
│      webpack.dev.js
│      webpack.prod.js
│
├─dist
│      bundle.js
│      index.html
│
└─src
        index.js
```

`config`目录下有`dev.env.js、prod.env.js`两个目录，用于编译时(compile time)配置全局常量

具体的作用是：

**例如：我们经常需要在开发环境使用开发环境的`URL`, 生成环境使用生产环境的`URL`**

借助`webpack.DefinePlugin`（允许在编译时(compile time)配置的全局常量）即可实现
```javascript
const prod = require('./prod.env')
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // 允许在编译时(compile time)配置的全局常量
    new webpack.DefinePlugin({
      'process.env': prod
    })
  ]
})
```
`prod.env.js`的内容
```javascript
'use strict'
module.exports = {
  NODE_ENV: '"production"',
  // 生产环境地址
  BASE_API: '"http://production.com"'
}

```

`dev.env.js`的内容
```javascript
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 开发环境地址
  BASE_API: '"http://development.com"'
})
```

结合`axios`即可有如下配置：
```javascript
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API
})
```

这样，我们开发环境和生产环境就分离了。





