# HTTP的缓存
> 通过网络提取内容既速度缓慢又开销巨大。 较大的响应需要在客户端与服务器之间进行多次往返通信，这会延迟浏览器获得和处理内容的时间，还会增加访问者的流量费用。 因此，缓存并重复利用之前获取的资源的能力成为性能优化的一个关键方面。

每个浏览器都自带了 HTTP 缓存实现功能。 您只需要确保每个服务器响应都提供正确的 HTTP 标头指令，以指示浏览器何时可以缓存响应以及可以缓存多久。

当服务器返回响应时，会有响应头。用于描述响应的内容类型、长度、缓存指令、验证令牌（ETag）。

ETag是HTTP协议提供的若干机制中的一种Web缓存验证机制，并且允许客户端进行缓存协商。这就使得缓存变得更加高效，而且节省带宽

## 通过ETag(验证令牌) 验证缓存的响应
* 服务器使用 ETag HTTP 标头传递验证令牌。
* 验证令牌可实现高效的资源更新检查：资源未发生变化时不会传送任何数据

服务器生成并返回的随机令牌通常是文件内容的哈希值或某个其他指纹。 客户端不需要了解指纹是如何生成的，只需在下一次请求时将其发送至服务器。 如果指纹仍然相同，则表示资源未发生变化，您就可以跳过下载。

## 通过cache-control设置缓存
* 每个资源都可通过 Cache-Control HTTP 标头定义其缓存策略
* Cache-Control 指令控制谁在什么条件下可以缓存响应以及可以缓存多久

**cache-control说明**
|参数|说明|
|--|--|
|max-age=86400 |	浏览器以及任何中间缓存均可将响应（如果是“public”响应）缓存长达 1 天（60 秒 x 60 分钟 x 24 小时）|
|private, max-age=600 |	客户端的浏览器只能将响应缓存最长 10 分钟（60 秒 x 10 分钟）|
|no-store |	不允许缓存响应，每次请求都必须完整获取|

这里补充个知识点：数据传输涉及的tcp/ip: 

* **TCP长连接**: tcp建立一次连接后不关闭（具体的时间长短，是可以在header当中进行设置的，也就是所谓的超时时间）。web中的js,css，html都是可以缓存的

* **TCP短连接**: tcp每次建立连接后，请求完成，连接关闭。下次传输连接需要再次建立。

## 缓存层次结构和技巧
* 使用一致的网址：如果您在不同的网址上提供相同的内容，将会多次提取和存储这些内容。 提示：请注意，网址区分大小写。
* 确保服务器提供验证令牌 (ETag)：有了验证令牌，当服务器上的资源未发生变化时，就不需要传送相同的字节。
* 确定中间缓存可以缓存哪些资源：对所有用户的响应完全相同的资源非常适合由 CDN 以及其他中间缓存进行缓存。
* 为每个资源确定最佳缓存周期：不同的资源可能有不同的更新要求。 为每个资源审核并确定合适的 max-age。
* 确定最适合您的网站的缓存层次结构：您可以通过为 HTML 文档组合使用包含内容指纹（版本号）的资源网址和短时间或 no-cache 周期，来控制客户端获取更新的速度。
* 最大限度减少搅动：某些资源的更新比其他资源频繁。 如果资源的特定部分（例如 JavaScript 函数或 CSS 样式集）会经常更新，可以考虑将其代码作为单独的文件提供。 这样一来，每次提取更新时，其余内容（例如变化不是很频繁的内容库代码）可以从缓存提取，从而最大限度减少下载的内容大小。

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

# webpack基本知识
## loader与plugins的区别
**loader**
loader 让 webpack 能够去处理那些非 JavaScript 文件（webpack 自身只理解 JavaScript）。loader 可以将所有类型的文件转换为 webpack 能够处理的有效模块，然后你就可以利用 webpack 的打包能力，对它们进行处理。

**plugins**
可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩，一直到重新定义环境中的变量。譬如 ExtractTextPlugin，它可以将所有文件中的css剥离到一个独立的文件中，这样样式就不会随着组件加载而加载。
