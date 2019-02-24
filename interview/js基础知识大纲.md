题目->考点->知识再到题目

# window.onload与DOMContentLoaded

1. 当 `onload` 事件触发时，页面上所有的DOM，样式表，脚本，图片，flash都已经加载完成了。
2. 当 `DOMContentLoaded` 事件触发时，仅当DOM加载完成，不包括样式表，图片，flash 

# 变量类型和计算

**类型**

- 值类型。栈内存

- 引用类型。堆内存（指针）。对象、数组、函数

- typeof。只能识别值类型和函数，不能识别引用类型

  ```javascript
  typeof undefined // undefined
  typeof 123 // number
  typeof 'rty' // string
  typeof true // boolean
  typeof null // object
  typeof {} // object
  typeof [] // object
  typeof console.log // function
  ```

**计算-强制类型转换**

- 字符串拼接。
- ==。
- if。
- 逻辑运算符。（tips：!!undefined）
- 何时使用==和===？除了（obj.a == null ,jquery源码写法）其它均用===

# 内置函数

- Object
- Array
- Boolean
- Numner
- String
- Function
- Date
- RegExp
- Error
- ~~Math内置对象~~

# 原型和原型链

**构造函数**

- 名称首字母大写。
- 默认`return this`

```javascript
function Food(){
    this.cai = cai;
    // return this // 默认返回
}
```

**构造函数-扩展**

```javascript
var a = {} 其实是var a = new Object()的语法糖
var a = [] 其实是var a = new Object()的语法糖
function Foo() {} 其实是var Foo = new Function()
```

**基本概念**

* 原型：所有的函数才有的`prototype`属性，`prototype`属性值是一个普通的对象。
* 原型链：JavaScript 常被描述为一种**基于原型的语言 (prototype-based language)**——每个对象拥有一个**原型对象**，对象以其原型为模板、从原型继承方法和属性。原型对象也可能拥有原型，并从中继承方法和属性，一层一层、以此类推。这种关系常被称为**原型链 (prototype chain)**，它解释了为何一个对象会拥有定义在其他对象中的属性和方法。
* 对象实例和它的构造器之间建立一个链接（它是`__proto__`属性，是从构造函数的`prototype`属性派生的），之后通过上溯原型链，在构造器中找到这些属性和方法。

* JavaScript是动态的没有class实现。在ES6中引入了`class`关键字，但是是语法糖。
* 谈到继承时，JavaScript只有一种结构：对象。每个object都有一个私有属性（`__proto__`)指向它的原型对象（prototype）。该原型对象也有一个自己的（`__proto__`），层层往上直到一个对象的原型对象为`null`。根据定义，`null`没有原型。

## 原型规则（5条规则）和实例

1. 所有的引用类型（数组、对象、函数），都具有对象特性，即可自由拓展属性（除了null）。
2. 所有的引用类型（数组、对象、函数），都具有一个`__proto__`（隐式原型）属性，属性值是一个普通的对象。
3. 所有的函数，都有一个`prototype`（原型）属性，属性值也是一个普通的对象。里边有一个`constructor`，指向函数自身。
4. 所有的的引用类型（数组、函数、对象），`__proto__`（隐式原型）属性值指向它构造函数的`prototype`（原型）属性值。`obj.__proto__ === Object.prototype // true`
5. 当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去它的`__proto__`(即构造函数的prototype)中寻找。

**循环对象自身的属性**

```javascript
for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
        // 高级浏览器已经在for in中屏蔽了来自原型链的属性
    }
}
```

## 原型链

**例子**

```javascript
// 构造函数
function Foo(name, age) {
    this.name = name;
    this.age = age;
}

Foo.prototype.alertName = function () {
    alert(this.name)
}
// 创建示例
var f = new Foo('kk', 90);
f.printName = function () {
	console.log(this.name)
}
// 测试
f.printName()
f.alertName()
f.toString() // 要去 f.__proto.__proto__找
```

**图示**

![prototype](/Users/apple/Desktop/prototype.png)

**使用instanceof判断一个函数是否是一个变量的构造函数**

- f instanceof Foo的判断逻辑：

1. f 的`__proto__`一层层往上，能否对应到Foo.prototype
2. 再试着判断f instanceof Object

## 例题

**如何准确判断一个变量是数组**

```javascript
// arr instanceof Array

// 判断数组
function isArray(arr) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    } else {
        return Object.prototype.String.call(arr) === '[Object Array]';
    }
}
```



**写一个原型链继承的例子**

```javascript
// 形象例子
function Animal() {
    this.eat = function() {console.log('animal eat');}
}

function Cat(){
    this.mill = function() {console.log('cat mill');}
}
// 原型链继承
Cat.prototype = new Animal();

var bosimao = new Cat();
```

```javascript
// 接近实战的例子
function Ele(id) {
    this.elem = document.getElementById(id)
}

Ele.prototype.html = function(val) {
    var elem = this.elem
    if (val) {
        elem.innerHTML = val
        return this //链式调用
        } else {
        return elem.innerHTML
    }
}

Ele.ptototype.on = function(type, handle) {
    var elem = this.elem
    elem.addEventListner(type, handle)
    return this // 链式调用
}

var divc = new Ele('id');
divc.on('click', function(e){
    console.log('i am click')
})
```



**描述new一个对象的例子**

```javascript
1. 创建一个新对象
2. this指向这个新对象
3. 执行代码对this赋值
4. 返回this
function Food(){
    this.cai = cai;
    // return this // 默认有这一行
}
```

**zepto（或其它框架）源码中如何使用原型链**

```javascript

```

# 作用域和闭包

### 基础知识

* 执行上下文。

* this。要在执行时才能确认，定义时无法确认。

* call,bind,apply

  ```javascript
  // 指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)
  fun.call(thisArg, arg1, arg2, ...)
  fun.apply(thisArg, [argsArray])
  // 创建一个新函数，在调用时设置this关键字为提供的值。
  function.bind(thisArg[, arg1[, arg2[, ...]]])
  ```

## 作用域

* 没有块级作用域
* 只有函数和全局作用域
* 作用域链。由函数和全局作用域组成
* 自由变量，到父作用域（定义的时候决定）寻找

## 闭包

不要尝试用几句话去说明闭包

**使用场景**

* 函数作为返回值
* 函数作为参数传递

## 例题

**对变量提升的理解**

* 变量定义
* 函数声明（注意函数表达式的区别）
* 作用域链

**说明this的几种不同使用场景**

* 作为构造函数执行
* 作为对象属性执行
* 作为普通函数执行
* call apply bind

**创建10个a标签，点击弹出相应的序号**

```javascript
  var i;
  for (i = 0; i < 10; i++) {
    (function (i) {
      var a = document.createElement('a');
      a.innerHTML = i + '<br>';
      a.addEventListener('', function (e) {
        e.preventDefault();
        alert(i); // 自由变量，要去父作用域获取值
      });
      document.body.appendChild(a);
    })(i)
  }
```

**如何理解作用域**

* 自由变量
* 作用域链，即自由变量的查找
* 闭包的两个应用场景

**实际开发中闭包的应用**
实际开发中主要用于封装变量，收敛权限

# 异步和单线程

## 异步
**异步与同步区别**
* 是否会阻塞代码执行
* alert是同步，setTimeout是异步

## 前端使用异步的场景
* 定时任务：setTimeout、setInterval
* 网络请求：ajax请求，动态img加载
* 事件绑定

## 异步和单线程
**单线程**
* 一次只能执行一个任务
* 不能同时干两件事情

## Date Math Array Object
**Date**
```javascript
Date.now() // 获取当前时间的毫秒数
var dt = new Date()
dt.getTime() // 获取毫秒数
dt.getFullYear() // 年
dt.getMonth()
dt.getDay()
dt.getHours()
dt.getMinutes()
dt.getSeconds()
```
**Math**
```javascript
Math.random() // 获取随机数
```
**Array**
```javascript
forEach()
every()
some()
sort()
map()
filter()
```
**Object**
```
for in
```
**写一个能遍历对象和数组的函数**
```javascript
function forEach(obj, callback) {
  var key;
  if (obj instanceof Array) {
    obj.forEach(function (item, index) {
      callback(index, item);
    })
  } else {
    for (key in obj) {
      callback(key, obj[key]);
    }
  }
}
```
# Web API








