const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const app = express()
const config = require('./webpack.config.js')
const compiler = webpack(config)

// 通知express 使用 
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(3000, function () {
  console.log('webpack app listening on port 3000!\n')
})