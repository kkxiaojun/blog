
# v-if、key-changing优化组件

# this.$forceUpdate(), 不推荐

```javascript
  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };
```

# 强制刷新页面（没办法的时候）

借助路由强制刷新页面
