const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const prod = require('./prod.env')
module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // 允许在编译时(compile time)配置的全局常量
    new webpack.DefinePlugin({
      'process.env': prod
    })
  ]
})
