# loader
 loader 只是一个导出为函数的 JavaScript 模块。
## loader是一个函数
通过下面的例子，加深对loader的理解
```javascript
module.exports = function(content, map, meta) {
  return someSyncOperation(content);
};
```
