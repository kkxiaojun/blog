# 黑眼圈公司

# 笔试

1. 写出清除浮动的几种方法
2. 有哪些伪元素，有什么作用
3. 输出结果
```javascript
  var name = 'kk';
  var fn = function () {
    console.log(this.name)
  }
  var obj1 = {name: 'obj1'};
  var obj2 = {name: 'obj2'};
  fn();
  obj1.call(fn);
  obj2.call(fn);
```

```javascript
function Foo() {
    getName = function () { alert (1); };
    return this;
}
Foo.getName = function () { alert (2);};
Foo.prototype.getName = function () { alert (3);};
var getName = function () { alert (4);};
function getName() { alert (5);}

//请写出以下输出结果：
Foo.getName();
getName();
Foo().getName();
getName();
new Foo.getName();
new Foo().getName();
new new Foo().getName();
```

```javascript
  var length = 10;
  var foo = function () {
    console.log(this.length)
  }
  var obj = {
    lenth: 1,
    fn: function(foo) {
      argument[0]();
      foo();
    }
  };
  obj.fn(foo, 100)

```
```javascript
  function Ext() {
    this.value = 0;
  }
  Ext.prototype.fn = function() {
    this.value++
    console.log(this.value)
  }
  var ext = new Ext()
  ext.fn();
  ext.fn();
  ext.fn();
```
```javascript
// 考闭包，闭包内的变量不会释放
```

```javascript
  
```
4. 解析事件委托
5. amd和cmd区别
6. 盒模型
7. typeof输出哪些类型 
8. 一个11L的杯子，和一个7L的杯子，怎么量出2L的水?

# 面试
  1. 讲笔试题，一道道往下讲
  2. 讲一个你的项目
  3. vue生命周期，常用的，说说
  4. 箭头函数和普通函数的区别
  5. promise
  6. 其它的主要是看着你的简历问

  1. 11L往7L倒，剩4L
  2. 4L往7L倒，11L空了，7L的有4升水。
  3. 11L再往7L倒，剩8L水
