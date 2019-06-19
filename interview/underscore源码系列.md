# underscore
## 为什么用void 0替代undefined
`undefined`
1. undefined 并不是保留词（reserved word）
2. window下的undefined是可以被重写的（ie8, 局部作用域），于是导致了某些极端情况下使用undefined会出现一定的差错

`void 0`
1. `void expression`均为`undefined`
2. `void` 不能被重写

## 常用类型检测
数组
```javascript
  function isArray(arr) {
    return Array.isArray ? Array.isArray(arr) : Object.prototype.String.call(arr) === '[object Array]'
  }
```

对象

```javascript
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type ==='object' || !!obj; 
  }
```
## 数组中寻找指定元素
`findIndex`, `find`

## 数组去重
方法一
```javascript
  // indexOf
  function reverts(arr) {
    let repeatArr = []
    for (let index = 0; index < arr.length; index++) {
      (repeatArr.indexOf(arr[index]) === -1) && repeatArr.push(arr[index])
    }
    return repeatArr
  }
  // filter
  function filterReverts(arr) {
    let repeatArr = []
    repeatArr = arr.filter(function (item, index) {
      return arr.indexOf(index) === index
    })
    return repeatArr
  }
```

方法二
sort
```javascript
  // sort, 1和 ’1‘会被当做相同的处理
  function sortUnique(arr) {
    return a.concat().sort().filter(function (item, index) {
      return !index || item !== arr[index - 1] 
    })
  }
```

方法三
Object
```javascript
  // Object, 无法分别1和’1‘
  function objectUnique(arr) {
    let seen = {}
    return arr.filter(function(item) {
      return seen.hasOwnProperty(item) ? false : (seen[item] = true)
    })
  }
```

方法四
ES6
```javascript
  // ES6
  function es6Unique(arr) {
    // return Array.from(new Set(arr))
    return [...new Set(arr)]
  }
```
# Javascript 特殊对象 Array-like 
Array-like 像数组的对象，有length属性，且length为非负number

将Array-like转化为数组

方法一
`slice`
```javascript
  [].slice(arguments)
  // Array.prototype.slice.call(arguments),ie9有问题
```

`Array.from`

```javascript
Array.from(arguments)
```

# 数组乱序
`splice`
```javascript
  function shuffle(a) {
    let shuffleArr = []
    while(a.length) {
      let index = ~~(Math.random() * a.length)
      shuffleArr.push(a[index])
      a.splice(index, 1)
    }
    return shuffleArr
  }
```
` Fisher–Yates Shuffle`
其实它的思想非常的简单，遍历数组元素，将其与之前的任意元素交换。因为遍历有从前向后和从后往前两种方式，所以该算法大致也有两个版本的实现
```javascript
  function shuffle(a) {
    let shuffleArr = a.concat()
    for(let index = shuffleArr.length; index--;) {
      let j = Math.floor(Math.random()*(index + 1))
      let temp = shuffleArr[index]
      shuffleArr[index] = shuffleArr[j]
      shuffleArr[j] = temp
    }
    return shuffleArr
  }
```

# bind需要了解的知识点和应用场景
`bind()`方法会创建一个新函数，在调用时创建`this`关键字为提供的值

# 防抖和节流
* 函数节流的核心是，让一个函数不要执行得太频繁，减少一些过快的调用来节流。(一个是间隔时间段触发)
* 函数去抖动就是对于一定时间段的连续的函数调用，只让其执行一次。(一个是只触发一次)

## throttle 应用场景
函数节流有哪些应用场景？哪些时候我们需要间隔一定时间触发回调来控制函数调用频率？

* DOM 元素的拖拽功能实现（mousemove）(不能用 H5 Drag&Drop API)
* 射击游戏的 mousedown/keydown 事件（单位时间只能发射一颗子弹）
* 计算鼠标移动的距离（mousemove）
* Canvas 模拟画板功能（mousemove）
* 搜索联想（keyup）
* 监听滚动事件判断是否到页面底部自动加载更多：给 scroll 加了 debounce 后，只有用户停止滚动后，才会判断是否到了页面底部；如果是 throttle 的话，只要页面滚动就会间隔一段时间判断一次
## debounce 应用场景
函数去抖有哪些应用场景？哪些时候对于连续的事件响应我们只需要执行一次回调？

* 每次 resize/scroll 触发统计事件
* 文本输入的验证（连续输入文字后发送 AJAX 请求进行验证，验证一次就好）

## 代码实现
去抖动
```javascript
    function debounce(method, context) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
        method.call(context);
    }, 1000);
    }

    function print() {
    console.log('hello world');
    }

    window.onscroll = function() {
    debounce(print);
    };
```

节流
```javascript
var throttle = function(delay, action){
  var last = return function(){
    var curr = +new Date()
    if (curr - last > delay){
      action.apply(this, arguments)
      last = curr 
    }
  }
}
```
# 从斐波那契数列谈_.memoize优化


