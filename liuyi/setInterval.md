# 一个页面多个setInterval应该怎么办？
## 说明
本文不科普`setInterval`，关于`setInterval`的用法就不多讲了，有兴趣的朋友自行了解。

## 问题描述
当一个组件或者一个页面中, 需要使用多个`setInterval`定时器的时候。


一开始我是这样写的
```
// index.js

function print1() {
  console.log('print1')
}
function print2() {
  console.log('print2')
}
function print3() {
  console.log('print3')
}
setInterval(print1, 3000)
setInterval(print2, 5000)
setInterval(print3, 7000)
```
<font color=red>问题就出来了，3、4、5....个`setInterval`，改怎么只用一个 `setInterval`就实现这个功能呢?</font>


## 优化方案
思路：
1. 设置一个定时器，每隔一分钟，或者是一秒发起请求
2. 用一个变量，存储执行次数count
3. 用count % time(需要定时发送的时间周期)，是否为0判断，是否触发

具体实现
```javascript
    // 改进后
    function print1() {
      console.log('print1')
    }
    function print2() {
      console.log('print2')
    }
    function print3() {
      console.log('print3')
    }
    const baseTime = 1000 // 定时器时间单位，1s
    let count = 0 // 计数器
    let postData = [
      {
        time: 3,
        funcType: print1
      },
      {
        time: 4,
        funcType: print2
      },
      {
        time: 5,
        funcType: print3
      },
    ]
    
    function updateTime() {
      // count++, 放在前面，刚开始不触发
      for (let index = 0; index < postData.length; index++) {
        let item = postData[index]
        // 根据根据计数器与定时器触发间隔，计算需要定时触发的方法
        if ((count % item.time) === 0) {
          item['funcType']()
        }
      }
      count++ // 放在后面，第一次就触发，原因：0 % n 结果都是 0
    }

    setInterval(updateTime, 1000)
```

