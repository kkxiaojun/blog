#  设计

阅读后留下的应该是设计思想

# 源码

## 入口

```javascript
var Zepto = (function(){
    var $
    
    // ...省略N行代码...
    
    $ = function(selector, context){
        return zepto.init(selector, context)
    }
    
    // ...省略N行代码...
    
    return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)
```

## zepto.init()

```javascript
var Zepto = (function(){
    var $,
        zepto = {}
    
    // ...省略N行代码...
    
    zepto.init = function(selector, context) {
        // 函数内容
    }
    
    
    $ = function(selector, context){
        return zepto.init(selector, context)
    }
    
    // ...省略N行代码...
    
    return $
})()

window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)
```

