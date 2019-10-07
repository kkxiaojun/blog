# vue api 扫盲
**performance**开启性能追踪
```javascript
if (process.env.NODE_ENV !== 'production') {
  Vue.config.performance = true
}

// 务必在加载 Vue 之后，立即同步设置以下内容
Vue.config.devtools = true
```
同时结合`Vue Performance Devtool`chrome 插件查看组件的加载情况