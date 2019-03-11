# HTTP的缓存
## ETag(验证令牌) 验证缓存的响应
* 服务器使用 ETag HTTP 标头传递验证令牌。
* 验证令牌可实现高效的资源更新检查：资源未发生变化时不会传送任何数据

## cache-control
* 每个资源都可通过 Cache-Control HTTP 标头定义其缓存策略
* Cache-Control 指令控制谁在什么条件下可以缓存响应以及可以缓存多久

这里又涉及到：
**TCP长连接**
tcp建立一次连接后不关闭（具体的时间长短，是可以在header当中进行设置的，也就是所谓的超时时间）。web中的js,css，html都是可以缓存的

**TCP短连接**
tcp每次建立连接后，请求完成，连接关闭。下次传输连接需要再次建立。

## 缓存层次结构和技巧
* 使用一致的网址：如果您在不同的网址上提供相同的内容，将会多次提取和存储这些内容。 提示：请注意，网址区分大小写。
* 确保服务器提供验证令牌 (ETag)：有了验证令牌，当服务器上的资源未发生变化时，就不需要传送相同的字节。
* 确定中间缓存可以缓存哪些资源：对所有用户的响应完全相同的资源非常适合由 CDN 以及其他中间缓存进行缓存。
* 为每个资源确定最佳缓存周期：不同的资源可能有不同的更新要求。 为每个资源审核并确定合适的 max-age。
* 确定最适合您的网站的缓存层次结构：您可以通过为 HTML 文档组合使用包含内容指纹（版本号）的资源网址和短时间或 no-cache 周期，来控制客户端获取更新的速度。
* 最大限度减少搅动：某些资源的更新比其他资源频繁。 如果资源的特定部分（例如 JavaScript 函数或 CSS 样式集）会经常更新，可以考虑将其代码作为单独的文件提供。 这样一来，每次提取更新时，其余内容（例如变化不是很频繁的内容库代码）可以从缓存提取，从而最大限度减少下载的内容大小。

# webpack的哈希有哪几种
## hash
每次webpack构建的时候都生成新的hash（不管文件有没有发生变化）

## chunkhash
代表的是chunk(模块)的hash值。

## contenthash
插件`extract-text-webpack-plugin`引入的contenthash

|名称|说明|
|---|---|
|hash|代表的是compilation的hash值。compilation在项目中任何一个文件改动后就会被重新创建，然后webpack计算新的compilation的hash值，这个hash值便是hash|
|chunkhash|代表chunk的hash,模块发生改变才会重新生成hash|
|contenthash|解决改变style文件导致js文件重新生成hash的问题(使用extract-text-webpack-plugin单独编译输出css文件)|

## vue-cli举例
vue-cli脚手架中webpack的配置文件`hash`, `build/webpack.base.conf.js`
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
```
// chunkhash,js
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
```

**contenthash**
`build/webpack.prod.conf.js`
```javascript
// contenthash,css
filename: utils.assetsPath('css/[name].[contenthash].css')
```
**结论**
为了得到一份理想的缓存，我们需要以下这几个步骤：
* 抽离 boilerplate（[runtime & manifest）
* 将 module identifier 默认的数字标识方式转成使用路径标识
* JS 文件使用 chunkhash
* 抽离的 CSS 样式文件使用 contenthash
* gif|png|jpe?g|eot|woff|ttf|svg|pdf 等使用 hash
* 设置 namedChunks 为 true

**link**
* [https://www.cnblogs.com/ihardcoder/p/5623411.html](https://www.cnblogs.com/ihardcoder/p/5623411.html)
* [https://imweb.io/topic/5b6f224a3cb5a02f33c013ba](https://imweb.io/topic/5b6f224a3cb5a02f33c013ba)
* [https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/http-caching)