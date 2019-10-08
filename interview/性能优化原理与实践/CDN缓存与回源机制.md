# CDN的缓存与回源机制
**特点**
缓存和回源

## 缓存
“缓存”就是说我们把资源 copy 一份到 CDN 服务器上这个过程

## 回源
“回源”就是说 CDN 发现自己没有这个资源（一般是缓存的数据过期了），转头向根服务器（或者它的上层服务器）去要这个资源的过程。

## webpack externals

防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。
```javascript
externals: {
  vue : 'Vue',
  "echarts": 'echarts',
  "element-ui": 'ELEMENT'
}
<script src="https://unpkg.com/vue@2.5.17/dist/vue.min.js"></script>
```
## 应用
CDN 往往被用来存放静态资源。
Cookie 是紧跟域名的。同一个域名下的所有请求，都会携带 Cookie。

> 同一个域名下的请求会不分青红皂白地携带 Cookie，而静态资源往往并不需要 Cookie 携带什么认证信息。把静态资源和主页面置于不同的域名下，完美地避免了不必要的 Cookie 的出现！