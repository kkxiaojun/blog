# Webpack配置优化
项目基于vue-cli 2.x版本
## 缩短项目构建时间
我们可以利用`DllPlugin` 和 `DllReferencePlugin`，实现了拆分 bundles，同时还大大提升了构建的速度。
## 配置文件
在build文件夹中新建`webpack.dll.conf.js`
```javascript
const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development', // 用于开发环境还是生产环境
  entry: {
    vendor: ['vue/dist/vue.common.js','vue-router','axios', 'echarts']
  },
  output: {
    path: path.join(__dirname, '../static/js'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library'
    }),
  ]
}
```
## package.json配置
```javascript
  script: {
    "build:dll": "webpack --config build/webpack.dll.conf.js",
  }
```
## webpack.base.config.js 中通过 DLLReferencePlugin 来使用 DllPlugin 生成的 DLL Bundle
`webpack.base.config.js`
```javascript
  plugins: [
    new VueLoaderPlugin(),
    // 添加DllReferencePlugin
    new webpack.DllReferencePlugin({
        context: path.resolve(__dirname, '..'),
        manifest: require('./vendor-manifest.json')
    })
  ]
```
## 问题
当把太多的第三方依赖都打包到 vendor.dll.js 中去，该文件太大也会影响首屏加载时间。所以要权衡利弊，可以异步加载的插件就没有必要打包进来了，不要一味的把所有都打包到这里面来获取构建时的快感。