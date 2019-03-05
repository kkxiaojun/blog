# JavaScript高级程序设计

## 第一二章简介

**`<script>`元素定义了6个属性**

```javascript
async: 可选。表示应该立即下载的脚本，但不应妨碍页面中的其他操作。只对外部脚本文件有效
charset: 可选。表示通过src属性指定
defer: 可选。表示脚本可以延迟到文档完全被解析和显示之后再执行。只对外部脚本文件有效（更常用的做法是把脚本放到页面底部）
src: 可选。表示包含要执行代码的外部文件
type：可选。表示编写代码使用的脚本语言的内同类型
```


## 第三章基本概念

### 数据类型

1. 基本数据类型：Undefined、Null、Boolean、String、Number、Symbol（ES6*引入了一种新的原始数据类型*Symbol, 表示独一无二的值。用于解决对象属性名都是字符串容易造成属性名冲突）
2. 引用类型：Object
3. 0.1+0.2 =0.3000000004（原因：浮点数的最高精度是17位，会产生舍入误差）
4. NaN（not a number）。（NaN == NaN，false)
5. 数值转换：Number()、parseInt()、parseFloat()

### Object

Object的每个实例都有下列属性和方法：

1. Constructor：构造函数
2. hasOwnProperty(PropertyName)：用于检查给定属性是否在当前对象实例中
3. isPropertyOf(Object): 用于检查传入的对象是否是另一个对象的原型
4. propertyIsEnumerable（propertyName）：用于检查给定的属性是否能用for-in进行枚举
5. toLocalString（）
6. toString（）
7. valueOf（）

### 标识符规则

1. 第一个字符必须是一个字母、下划线（_）、或一个美元符号（💲）
2. 其它字符可以是字母、下划线、美元符号或者是数字

### 操作符

1. 前置递增/递减，后置递增/递减
   后置型递增/递减操作与前置递增/递减，最大的区别：后置是在它们的语句被求值之后才执行
2. ==与===，==会先进行数据类型转换

### 理解参数arguments

1. arguments参数是一个类数组对象（有length，argument[0]，但是没有数组push()等相应的等方法）
2. 参数传递都是按值传递



## 第四章 变量、作用域和内存问题

### 基本类型和引用类型

1. 最关键的点：基本类型保存在栈内存中，引用类型是存储在堆内存中
2. 检测类型：typeof／instanceof

###  执行环境和作用域

**执行环境：定义了变量或函数有权访问的其它数据**

理解：

1. 每个函数都有自己的执行环境。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中，而在函数执行后，栈（后进先出，LIFO）将其弹出
2. 代码在环境栈中执行时，会创建变量的一个作用域链。作用域链的用途：保证对执行环境有权访问的所有变量和函数的有序访问
3. 标识符解析：是沿着作用域链一级一级地搜索标识符的过程。从内往外搜索，从局部到全局

**没有块级作用域**

```javascript
if (true) {
    var color = 'blue';
}
console.log(color); // blue
```

### 垃圾收集

JavaScript具有自动垃圾收集机制，原理：找到那些不再使用的变量，然后释放内存

**策略**

1. 标记清除（最常用）。
2. 引用计数

## 第五章 引用类型

### Array

检测数组

```javascript
function isArray (arr) {
    if (typeof Array.isArray === 'function') {
        return Array.isArray(arr);
    } else {
        return Object.prototype.toString.call(arr) === '[Object Array]';
    }
}
```

转换方法

| 方法            | 用法                                    |
| --------------- | --------------------------------------- |
| toLocalString() | 返回字符串形式，每次都调用toLocalString |
| toString()      | 返回字符串形式                          |
| valueOf()       | 返回字符串形式                          |

栈和队列方法

| 方法类型         | 方法               |
| ---------------- | ------------------ |
| 栈方法（LIFO）   | push()、pop()      |
| 队列方法（FIFO） | unshift()、shift() |

重排序

1. `reverse()`反序

2. `sort()`升序，调用每个数组项的toString()方法，比较得到的字符串

   ```javascript
   // 解决 10,5这样的大小问题
   arr.sort(
   	function compoare(value1, value2) {
           return value2 - value1;
   	}
   )
   ```

操作方法

| 方法     | 语法                                                    | 是否改变原数组 |
| -------- | ------------------------------------------------------- | -------------- |
| concat() | arrayObject.concat(arrayX,arrayX,......,arrayX)         | 否，返回新数组 |
| slice()  | arrayObject.slice(start,end)                            | 否，返回新数组 |
| splice() | *array*.splice(*index*,*howmany*,*item1*,.....,*itemX*) | 是             |

位置方法

| 方法                             | 语法                           |
| -------------------------------- | ------------------------------ |
| *array*.indexOf(*item*, *start*) | 从数组的开头开始查找,不支持ie8 |
| lastIndexOf(item, start)         | 从数组的末尾开始查找           |

迭代方法（ie9）

| 方法      | 语法                                                         | 返回值       |
| --------- | ------------------------------------------------------------ | ------------ |
| every()   | arr.every(callback[, thisArg])                               | true，false  |
| filter()  | arr.filter(callback(element[, index[, array]])[, thisArg])   | 返回true的项 |
| forEach() | array.forEach(callback(currentValue, index, array){     //do something }, this) | 无           |
| map()     | var new_array = arr.map(function callback(currentValue[, index[, array]]) {  // Return element for new_array }[,  thisArg])。方法创建一个新数组，其结果是该数组中的每个元素都调用一个提供的函数后返回的结果。 | 新数组       |
| some（）  | arr.some(callback[, thisArg])                                | true，false  |

缩小方法

| 方法          | 语法                                                 |
| ------------- | ---------------------------------------------------- |
| reduce()      | arr.reduce(function(prev, cur, index, array){})      |
| reduceRight() | arr.reduceRight(function(prev, cur, index, array){}) |

### Date
`Date.parse()`，`Date.UTC()`
不同宿主在如何解析日期字符串上仍存在许多差异

### RegExp
### Function
**没有重载**
后面的会覆盖前面的函数
1. 函数表达式。
2. 函数声明。代码开始执行之前，解析器通过一个名为函数声明提升的过程，读取并将函数声明添加到执行环境中，JavaScript引擎在第一遍会声明函数并将它们放到源代码树的顶部
**函数内部属性**
`arguments`,`this`
**函数属性和方法**
属性
1. `length`,表示函数希望接受的命名参数的个数
2. `prototype`
方法
1. `apply()`。在特定的作用域中调用函数
2. `call()`。在特定的作用域中调用函数。类数组转化：`Array.prototype.slice.call(arguments)`

### 基本包装类型
Boolean,Number,String
### 单体内置对象
不依赖宿主环境的对象，这些对象在ECMAScript执行之前就已经存在（不必显示地实例化）
`Global`，`Math`
## 面向对象程序设计
### 属性
**数据属性:**
* configurable: 能否通过delete删除属性从而重新定义属性
* enumerable: 能否通过for-in循环返回属性
* writable: 表示能否修改属性的值
* value:包含这个属性的数据值
**访问器属性**
* configurable
* enumerable
* get
* set
### 创建对象

|模式|解释|优点|缺点|
|---|---|---|---|
|工厂模式|这种模式抽象了创建具体对象的过程|解决了创建多个相似对象的问题|没有解决对象识别的问题|
|构造函数模式|使用new操作符创建对象|可以将它的实例标记为特定的类型|每个方法都要在每个实例上创建一遍|
|原型模式|用prototype属性，创建实例的共享方法和属性|共享方法和属性|每个实例一般要有属于自己的全部属性|
|组合构造函数模式和原型模式|构造函数和原型模式一起使用|两种模式的优点|无|
|动态原型模式|根据检验方法是否有效来决定是否需要初始化原型|避免大量相同的添加操作|无|
|寄生构造函数模式|创建一个函数，返回新创建的对象|解决特殊需求，比如说不改prototype,但是要新增额外方法|无|
|稳妥构造函数模式|适合在安全的环境中，防止数据被其他应用程序改变时使用|安全性|无|

### 继承
实现继承，主要用原型链（prototype）实现
**确定原型和实例的关系**
`instanceof`,`isPrototypeOf`

## BOM
### window对象
|描述|属性|
|---|---|
|窗口位置|window.screenLeft/window.screenX,window.screenTop/window.screenY|
|窗口大小|window.innerWidth/innerHeight/outerHeight/outerWidth|
|导航和打开窗口|window.open()|

### 其它对象
|对象|属性|
|---|---|
|location|hash,host,host,name,href,pathname,port,protocol,search|
|navigator||
|screen||
|history|(方法)go(),back().forward(),length|
## 客户端检测
## DOM
### Node类型
每个节点都有一个nodeType属性用于表明节点的类型
**nodeName和nodeValue属性**
**操作节点**
appendChild(),insertBefore(),removeChild()
### Document类型
**文档信息**
`document.title`,`document.URL`,`document.domain`,`document.referrer`
**查找元素**
`getElementById()`,`getElementsByTagName()`,`getElementsByName()`,`getElementByClassName()`
## Dom扩展
**选择符API**
1. `querySelector()`。返回第一个元素
2. `querySelectorAll()`。返回所有
3. `scrollIntoView()`

## 事件流

**事件冒泡**

IE的事件流叫做事件冒泡。即事件开始时由最具体的元素（文档中嵌套深的节点）接受，后逐级向上传播到不具体的节点。

```javascript
let eventUtil = {
    addHandler: (element, type, handler) => {
        // dom2级事件处理程序(ie9)
        if (element.addEventListener) {
            // false表示在冒泡阶段调用事件处理程序
            element.addEventListener(type, handler, false);
        // dom0级事件处理程序(ie)
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        // 其它事件
        } else {
            element['on' + type] = handler; 
        }
    },
    removeHandler: (element, type, handler) => {
        // dom2级事件处理程序(ie9)
        if (element.addEventListener) {
            // false表示在冒泡阶段调用事件处理程序
            element.removeEventListener(type, handler, false);
        // dom0级事件处理程序(ie)
        } else if (element.attachEvent) {
            // ie事件处理程序
            element.detachEvent('on' + type, handler);
        // 其它事件
        } else {
            element['on' + type] = null; 
        }
    },
    stopPropagation: e => {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = false;
    },
    preventDefault: e => {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
    },
    getEvent: e => {
        return e || window.event;
    },
    getTarget: e => {
        return e.target || e.srcElement;
    }
};
```

**事件捕获**

与事件冒泡相反

**手写冒泡**

```javascript
<ul class="parent">
    <li class="son1">son1</li>
    <li class="son2">son2</li>
</ul>
            
let parent = document.querySelector('.parent');
eventUtil.addHandler(parent, 'click', e => {
    console.log(e.target.innerText)
})
```

# HTML5
## drag
1. 设置draggable,则元素可拖动
2. ondragstart,拖动开始
3. ondrop, ondragover拖拽后需要放置的地方
```javascript
    function dragstart_handler(ev) {
    console.log("dragStart");
    // Add the target element's id to the data transfer object
    ev.dataTransfer.setData("text/plain", ev.target.id);
    }

    <body>
        <p id="p1" draggable="true" ondragstart="dragstart_handler(event);">This element is draggable.</p>
        <div id="target" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">Drop Zone</div>
    </body>
```