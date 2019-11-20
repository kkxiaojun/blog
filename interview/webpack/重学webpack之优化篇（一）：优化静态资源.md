## 图片资源
### 图片
url-loader file-loader
### svg
url-loader svg-sprite-loader
## js/css/html
MiniCssExtractPlugin HtmlWebpackPlugin optimization
```javascript
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          mangle: {
            safari10: true
          }
        },
        sourceMap: config.build.productionSourceMap,
        cache: true,
        parallel: true
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSAssetsPlugin()
    ]
```
分离代码文件
* MiniCssExtractPlugin

* webpack 4.x 的 optimization
https://webpack.docschina.org/guides/code-splitting/#%E5%85%A5%E5%8F%A3%E8%B5%B7%E7%82%B9-entry-points-


