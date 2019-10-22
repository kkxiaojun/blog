 在看过很多webpack优化的文章，webpack dll 动态链接库经常会出现。但是在用的时候，常常因为配置之复杂望而却步，最后寻找到类似`hard-source-webpack-plugin`这样优秀的插件。

 # dll的概念: 其实是做缓存
 > 所谓动态链接，就是把一些经常会共享的代码制作成 DLL 档，当可执行文件调用到 DLL 档内的函数时，Windows 操作系统才会把 DLL 档加载存储器内，DLL 档本身的结构就是可执行档，当程序有需求时函数才进行链接。透过动态链接方式，存储器浪费的情形将可大幅降低。

将dll和缓存进行对比可以发现：

|缓存|DLL|
|--|--|
|把常用的文件存储到内存或硬盘中|把公共代码打包为dll文件放到硬盘中|
|再次打包时，直接取读取缓存|再次打包时，读取dll文件，不重新打包|
|加载时间减少|打包时间减少|


 个人理解的基本过程：
 
 1. 第一次`npm run`的时候，把请求的内容存储起来（存储在映射表中）
 
 2. 再次请求时，先从映射表中找，看请求的内容是否有缓存，有则加载缓存（类似浏览器的缓存策略，命中缓存），没有就正常打包。

 3. 直接从缓存中读取。

 # dll的应用
 用 DllPlugin 处理文件，要分两步走：

1. 创建 webpack.dll.js 打包脚本
2. 配置`package.json`
3. 基于 dll 专属的配置文件，打包 dll 库


创建 dll 文件的打包脚本，目的是把vue打包成 dll 文件
```javascript
// 文件目录：configs/webpack.dll.js

'use strict';

const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        vue: ['vue'],
    },
    // 这个是输出 dll 文件
    output: {
        path: path.resolve(__dirname, '../dll'),
        filename: '_dll_[name].js',
        library: '_dll_[name]',
    },
    // 这个是输出映射表
    plugins: [
        new webpack.DllPlugin({ 
            name: '_dll_[name]', // name === output.library
            path: path.resolve(__dirname, '../dll/[name].manifest.json'),
        })
    ]
};
```
`package.json配置`
运行 npm run build:dll 就可以打包 dll 文件
```javascript
// package.json

{
  "scripts": {
    "build:dll": "webpack --config configs/webpack.dll.js",
  },
}
```

告诉 webpack 可以命中的 dll 文件进行关联
```javascript
// 文件目录：configs/webpack.common.js

const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin'); // 顾名思义，把资源加到 html 里，那这个插件把 dll 加入到 index.html 里
const webpack = require('webpack');
module.exports = {
  // ......
  plugins: [
    new webpack.DllReferencePlugin({
      // 注意: DllReferencePlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
      context: path.resolve(__dirname, '../'),
      manifest: path.resolve(__dirname, '../dll/vue.manifest.json'),
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, '../dll/_dll_vue.js'),
    }),
  ]
}
```

# 优化一：AutoDllPlugin：减少配置
webpack插件`autodll-webpack-plugin`
```javascript
// 文件目录：configs/webpack.common.js

const path = require('path');
const AutoDllPlugin = require('autodll-webpack-plugin'); // 第 1 步：引入 DLL 自动链接库插件

module.exports = {
  // ......
  plugins: [
        // 第 2 步：配置要打包为 dll 的文件
        new AutoDllPlugin({
            inject: true, // 设为 true 就把 DLL bundles 插到 index.html 里
            filename: '[name].dll.js',
            context: path.resolve(__dirname, '../'), // AutoDllPlugin 的 context 必须和 package.json 的同级目录，要不然会链接失败
            entry: {
                vue: [
                    'vue'
                ]
            }
        })
  ]
}
```

# 优化二：抛弃 DLL，选择hard-source-webpack-plugin
从`vue-cli`和`create-react-app`中可以知道并没有实用dll，
是因为：
<font color=red>Webpack 4 的打包性能足够好的，dll继续维护的必要了。<font>

更好的代替者`DLL，选择hard-source-webpack-plugin`

直接上代码：
```
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  // ......
  plugins: [
    new HardSourceWebpackPlugin() // <- 直接加入这行代码就行
  ]
}
```

