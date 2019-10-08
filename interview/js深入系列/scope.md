# 作用域和闭包
闭包的定义：
* 是一个函数
* 能访问另外一个函数中的变量

闭包常见的场景：
1. 没有块级作用域
```
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();	// 3
data[1]();	// 3
data[2]();	// 3
```