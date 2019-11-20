## webpack-dev-server介绍
`webpack-dev-server`是webpack官方提供的一个小型`Express`服务器。使用它可以为webpack打包生成的资源文件提供web服务。[webpack-dev-server官方文档](https://webpack.docschina.org/configuration/dev-server/)


我们日常开发时可以使用它来调试前端代码。可以实时监听代码文件变化，从而提高开发效率。

## 目前使用webpack的模式
图片

## webpack-dev-server的使用

项目中只需要配置`hot: true, // 是否热更新`即可开启`Hot Module Replacemen`即热模块替换
```javascript
var path = require('path');

module.exports = {
  //...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true, // Gzip压缩
    quiet: true, // necessary for FriendlyErrorsPlugin
    port: PORT, // 端口
    host: 'localhost', // 域名
    open: true, // 自动开启浏览器
    hot: true, // 是否热更新
    proxy: {
      // 开启代理
      '/sys': {
        target: 'http://test.com',
        changeOrigin: true
      },      
      '/transfer': {
        target: 'http://10.10.119.207:8004',
        changeOrigin: true
      }
    }
  }
};
```
## webpack-dev-server的配置
**Proxy**
`proxy`即代理，这开发中，可以方便我们进行项目的调试。
```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    }
  }
};
```

<font color=red>需要注意的是，如果要运行在 HTTPS 上，且使用了无效证书的后端服务器。需要设置`secure: false`</font>
```javascript
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'https://other-server.example.com',
        secure: false // 
      }
    }
  }
};
```
**HistoryApiFallback**
当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。·devServer.historyApiFallback· 默认禁用。通过传入以下启用：
```javascript
module.exports = {
  //...
  devServer: {
    historyApiFallback: true
  }
};
```
具体的使用如下：

`webpack.config.js`
```javascript
module.exports = {
    entry: "./src/app/index.js",
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: 'build',
        filename: 'bundle-main.js'
    },
    devServer: {
        historyApiFallback:{
            index:'build/index.html'
        },
    },
    //...
};
```
**Live reload**
`Live reload`监控文件的变化，然后通知浏览器端刷新页面。
<font color=red>缺点：</font>
live reload 工具并不能够保存应用的状态（states），当刷新页面后，应用之前状态丢失，还是上文中的例子，点击按钮出现弹窗，当浏览器刷新后，弹窗也随即消失，要恢复到之前状态，还需再次点击按钮。而 webapck HMR 则不会刷新浏览器，而是运行时对模块进行热替换，保证了应用状态不会丢失，提升了开发效率。

**HRM**
`Hot Module Replacement`（以下简称 HMR）是 `webpack` 发展至今引入的最令人兴奋的特性之一 ，当你对代码进行修改并保存后，webpack 将对代码重新打包，并将新的模块发送到浏览器端，浏览器通过新的模块替换老的模块，这样在不刷新浏览器的前提下就能够对应用进行更新。例如，在开发 Web 页面过程中，当你点击按钮，出现一个弹窗的时候，发现弹窗标题没有对齐，这时候你修改 CSS 样式，然后保存，在浏览器没有刷新的前提下，标题样式发生了改变。感觉就像在 `Chrome` 的开发者工具中直接修改元素样式一样。



**GZIP**
在开发环境中启用`GZIP压缩`，只需要设置`compress: true`即可
```javascript
module.exports = {
  //...
  devServer: {
    compress: true
  }
};
```

但是如果要在打包的时候使用`GZIP`，则需要用到插件`compression-webpack-plugin`
```javascript
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' + config.build.productionGzipExtensions.join('|') + ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
```

关于`GZIP`的详细内容可以看[重学webpack之优化篇（三）：http压缩之Gzip](重学webpack之优化篇（三）：http压缩之Gzip)
**Before/after**
在服务内部的所有其他中间件之前(`after`即之后)， 提供执行自定义中间件的功能。 这可以用来配置自定义处理程序，例如：
```javascript
module.exports = {
  //...
  devServer: {
    before: function(app, server) {
      app.get('/some/path', function(req, res) {
        res.json({ custom: 'response' });
      });
    }
  }
};
```
