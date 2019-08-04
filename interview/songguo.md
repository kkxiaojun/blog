# 笔试
post和get的区别
`涉及到抓包原理最好`

前端性能优化
`浏览器层面`
`代码执行效率层面`，少用闭包，内存泄漏

写出运行结果
```javascript
function Foo() {
  this.foo = function() {
    console.log(9);
  }
}
Foo.prototype.foo = function() {
  console.log(10)
}
Foo.foo = function() {
  console.log(8)
}
var foo1 = new Foo();
foo1();
```

js继承的实现方法

正则？写一个表示中国大陆手机号的正则

js实现一个单链表

typeof null。null instanceof Object

点击页面上的元素，弹出对应的标签（考虑ie兼容性）

有两个已经排好序的数组，现在有另一个排好序的数组，让这三个数组合并后有序，写出你认为最优的解法

web安全和防御

```javascript
  
```