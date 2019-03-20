# webpack基本知识
## loader与plugins的区别
**loader**
loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

**plugins**
可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。譬如 ExtractTextPlugin(contenthash)，它可以将所有文件中的css剥离到一个独立的文件中，这样样式就不会随着组件加载而加载。

## 常用的loader和plugins
**loader**
|loader|解释|
|---|---|
|babel-loader|转化ES6代码|
|css-loader|转化css|
|file-loader|file-loader主要用来处理图片|
|url-loader|file-loader的加强版，用来处理img,media,font|

**plugins**

|plugins|解释|
|--|--|
|ExtractTextPlugin|它可以将所有文件中的css剥离到一个独立的文件中(build的时候不会影响js)|
|html-webpack-plugin|生成一个 HTML5 文件， 其中包括使用 script 标签的 body 中的所有 webpack 包|
|uglifyjs-webpack-plugin|压缩js(webpack 之前的 uglify 不支持压缩 es6)|

## webpack打包过程
1. 读取文件，分析模块依赖
2. 对模块进行解析执行（深度遍历）
3. 针对不同的模块使用不同的 loader
4. 编译模块，生成抽象语法树（AST）
5. 遍历 AST，输出 JS

### webpack 打包出来的文件体积过大怎么办,打包速度过慢
1. 去掉开发环境下的配置.webpack中的devtool
2. ExtractTextPlugin：提取样式到css文件
3. CommonsChunkPlugin：提取通用模块文件



# hash、chunkhash和contenthash

## hash
> [hash] is replaced by the hash of the compilation（）. 代表的是cpmpilation的hash。

compilation在项目中任何一个文件改动后就会被重新创建，然后webpack计算新的compilation的hash值，这个hash值便是hash。

## chunkhash
> [chunkhash] is replaced by the hash of the chunk. chunk（模块）的hash

代表的是chunk(模块)的hash值。

## contenthash
插件`extract-text-webpack-plugin`引入的contenthash

|名称|说明|
|---|---|
|hash|代表的是compilation的hash值。compilation在项目中任何一个文件改动后就会被重新创建，然后webpack计算新的compilation的hash值|
|chunkhash|代表chunk的hash,模块发生改变才会重新生成hash|
|contenthash|解决改变style文件导致js文件重新生成hash的问题(使用extract-text-webpack-plugin单独编译输出css文件)|

## vue-cli举例
vue-cli脚手架中webpack的配置文件`hash`, `build/webpack.base.conf.js`

vue-cli中，hash用于图片，音视频，和字体文件
```javascript
// hash(hash,jpg,mo4,txt)
{
test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
loader: 'url-loader',
options: {
    limit: 10000,
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
}
},
{
test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
loader: 'url-loader',
options: {
    limit: 10000,
    name: utils.assetsPath('media/[name].[hash:7].[ext]')
}
},
{
test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
loader: 'url-loader',
options: {
    limit: 10000,
    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
}
})
{
test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
loader: 'url-loader',
options: {
    limit: 10000,
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
}
},
{
test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
loader: 'url-loader',
options: {
    limit: 10000,
    name: utils.assetsPath('media/[name].[hash:7].[ext]')
}
},
{
test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
loader: 'url-loader',
options: {
    limit: 10000,
    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
}
}
```

**chunkhash**,`build/webpack.prod.conf.js`

chuunkhash主要用于js文件中
```
// chunkhash,js
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
```

**contenthash**：`build/webpack.prod.conf.js`

使用extract-text-webpack-plugin单独编译输出css文件。extract-text-webpack-plugin提供了另外一种hash值：`contenthash`

```javascript
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
```

**参考资料**
* [https://www.cnblogs.com/ihardcoder/p/5623411.html](https://www.cnblogs.com/ihardcoder/p/5623411.html)
* [https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)
