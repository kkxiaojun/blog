# webpack的哈希有哪几种
**hash**
每次webpack构建的时候都生成新的hash
**chunkhash**
代表的是chunk(模块)的hash值。
|名称|说明|
|---|---|
|hash|每次构建，hash的值都会变（不管文件内容有没有变）|
|chunckhash|代表模块的hash,模块发生改变才会重新生成hash|
|contenthash|解决改变style文件影响js文件的问题|

**结论**
为了得到一份理想的缓存，我们需要以下这几个步骤：
* 抽离 boilerplate（[runtime & manifest）
* 将 module identifier 默认的数字标识方式转成使用路径标识
* JS 文件使用 chunkhash
* 抽离的 CSS 样式文件使用 contenthash
* gif|png|jpe?g|eot|woff|ttf|svg|pdf 等使用 hash
* 设置 namedChunks 为 true

**举例**
vue-cli脚手架中webpack的配置文件：
```
// contenthash,css
filename: utils.assetsPath('css/[name].[contenthash].css'),

// hash,jpg,mo4,txt
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

// chunkhash,js
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
```

**link**
* https://www.cnblogs.com/ihardcoder/p/5623411.html
* https://imweb.io/topic/5b6f224a3cb5a02f33c013ba