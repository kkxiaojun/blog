# 重学webpack（二）：前端基本开发环境的搭建

**在日常工作中的使用：**

- 构建我们发布需要的 HTML、CSS、JS 文件, 主要用的plugin和loader：mini-css-extract-plugin、html-webpack-plugin
- 使用 CSS 预处理器来编写样式
- 压缩JS
- 处理和压缩图片
- 使用 Babel 来支持 ES 新特性
- 本地提供静态服务以方便开发调试

## 关联HTML（`html-webpack-plugin`）
> 简化了HTML文件的创建，以便为你的webpack包提供服务。这对于在文件名中包含每次会随着编译而发生变化哈希的 webpack bundle 尤其有用。 你可以让插件为你生成一个HTML文件，使用lodash模板提供你自己的模板，或使用你自己的loader。

主要有三个作用：
1. 为html文件中引入的外部资源如script、link动态添加每次compile后的hash，防止引用缓存的外部文件问题。
2. 可以生成创建html入口文件，比如单页面可以生成一个html文件入口，配置N个html-webpack-plugin可以生成N个页面入口。
3. 将HTML引用路径和我们的构建结果关联起来。


**先安装html-webpack-plugin**

`npm install --save-dev html-webpack-plugin`

然后加入webpack配置中：

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'dist/index.html', // 配置文件模板
    })
  ]
}

```

**通过 html-webpack-plugin 就可以将我们的页面和构建 JS 关联起来**

更多的配置，官网参考文档[https://github.com/jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin)

## 构建CSS环境
上一章说明过，webpack 会默认把所有依赖打包成 js 文件。需要借助`loader`对文件进行**源代码进行转换**。

需要用到的loader是：
  * `css-loader`
  * `mini-css-extract-plugin`,将css单独剥离出来

安装：

```javascript
npm i css-loader mini-css-extract-plugin --save-dev
```

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'style'),
        ],
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader'
        ]
      },
    ],
    plugins: [
      new MiniCssExtractPlugin()
    ]
  }
}
```

<font color=red>不用`extract-text-webpack-plugin`的原因：`extract-text-webpack-plugin`默认安装的版本是3.x.x，还不支持webpack的4.x版本</font>

## 增加CSS预处理（sass,less,style）
> 预处理器功能强大，开发中经常使用以下特性：变量（variables），代码混合（ mixins），嵌套（nested rules）以及 代码模块化(Modules)。

接下来安装sass预处理器，官网参考文档[https://www.webpackjs.com/loaders/sass-loader/](https://www.webpackjs.com/loaders/sass-loader/)

安装 `npm install sass-loader node-sass webpack --save-dev`

`node-sass` 和 `webpack` 是 `sass-loader` 的 `peerDependency`，因此能够精确控制它们的版本。

```javascript
module.exports = {
    ...
    module: {
        rules: [
          {
            test: /\.scss$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader
              },
              'css-loader',
              'sass-loader'
            ]
          }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin()
    ]
};
```

## 处理JS文件
主要是进行js文件的压缩

这里使用`uglifyjs-webpack-plugin`，官方文档[https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/](https://www.webpackjs.com/plugins/uglifyjs-webpack-plugin/)

安装`npm i uglifyjs-webpack-plugin --save-dev`

```javascript
module.exports = {
    module: {}
    plugins: [
    // 压缩js代码
    new UglifyPlugin()
    ]
}
```

<font color=red>`uglifyjs-webpack-plugin`不支持ES6，可以用`terser-webpack-plugin`替代</font>


## 处理图片文件
前边已经对css进行处理了，但是对于样式文件`url()`中的`jpg/png/gig`等是无法处理的，这里时候就需要用到另外的loader处理了。

`url-loader` 功能类似于 `file-loader`，但是在文件大小（单位 byte）低于指定的限制时，可以返回一个 DataURL。

```javascript
module.exports = {
  module: {
    rules: [
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
  }
}
```

**loader将图片处理成`base64`的格式**

## Babel支持JavaScript新特性
由于`ES6、ES7`的新特性，我们需要采用转义才能在项目中更好地支持。

`npm i babel-loader --save-dev`

```javascript
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.js?/, // 支持 js 和 jsx
        include: [
          path.resolve(__dirname, 'js'), // js 目录下的才需要经过 babel-loader 处理
        ],
        loader: 'babel-loader',
      },
    ],
  },
}
```

## `webpack-dev-server`构建本地静态服务
开发的过程中，实时查看效果[https://www.webpackjs.com/configuration/dev-server/](https://www.webpackjs.com/configuration/dev-server/)

安装`webpack-dev-server`

配置`scripts`脚本
```javascript
// package.json
  "scripts": {
    "start": "webpack-dev-server --inline --progress --mode development", // 这里会涉及很多配置参数，具体的可以看官网文档
    "build": "webpack --mode production"
  }
```
这里对于`webpack-dev-server`先做简单的配置，后面用单独的章节了解熟悉。

**最后webpack的配置**
```javascript
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

module.exports = {
  entry: {
    index: ['./src/js/index.js'],
    vendors: ["./src/js/vendors.js"]
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[name].[hash].js'
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
    })
  ]
}


```