## webpack基本概念
webpack 本质上是一个打包工具，它会根据代码的内容解析模块依赖，帮助我们把多个模块的代码打包。借用 webpack 官网的图片：

![webpack as a bundler](https://user-gold-cdn.xitu.io/2018/3/19/1623bfac4a1e0945?w=2152&h=850&f=png&s=133657)

### loader
loader 用于对模块的**源代码进行转换**。loader 可以使你在 import 或"加载"模块时预处理文件。<font color=red>(webpack默认只识别js结尾的文件,当遇到其他格式的文件后,webpack并不知道如何去处理。这时候就要用loader了)</font>

举个例子，在没有添加额外插件的情况下，webpack 会默认把所有依赖打包成 js 文件，如果入口文件依赖一个 .hbs 的模板文件以及一个 .css 的样式文件，那么我们需要 handlebars-loader 来处理 .hbs 文件，需要 css-loader 来处理 .css 文件（这里其实还需要 style-loader），最终把不同格式的文件都解析成 js 代码，以便打包后在浏览器中运行。

loader 模块需要导出为一个函数，并且使用 Node.js 兼容的 JavaScript 编写。
### plugins
插件是 webpack 的支柱功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！

**插件目的在于解决 loader 无法实现的其他事。**

webpack 插件是一个具有 apply 属性的 JavaScript 对象。apply 属性会被 webpack compiler 调用，并且 compiler 对象可在整个编译生命周期访问。

ConsoleLogOnBuildWebpackPlugin.js
```javascript
const pluginName = 'ConsoleLogOnBuildWebpackPlugin';

class ConsoleLogOnBuildWebpackPlugin {
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, compilation => {
            console.log("webpack 构建过程开始！");
        });
    }
}
```

### 简单的webpack配置
webpack 运行时默认读取项目下的 `webpack.config.js` 文件作为配置。

所以我们在项目中创建一个 `webpack.config.js` 文件：

```
const path = require('path')
const UglifyPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: 'babel-loader',
      },
    ],
  },

  // 代码模块路径解析的配置
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, 'src')
    ],

    extensions: [".wasm", ".mjs", ".js", ".json", ".jsx"],
  },

  plugins: [
    // 使用 uglifyjs-webpack-plugin 来压缩 JS 代码
    new UglifyPlugin()
  ]
}

```