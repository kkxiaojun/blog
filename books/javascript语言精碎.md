# javascript语言精碎

## 语法和对象

* &&：第一个值为false则输出第一个值，否则输出第二个值
* ||：第一个值为true则输出第一个值，否则输出第二个值

```javascript
1 && 2
1 || 2
```

**delete**

delete删除对象的属性

## 函数

**this的调用模式**

1. 方法调用模式

   ```javascript
   var Obj = {
       num: 0,
       fn: function() {
           console.log(this.num)
       }
   }
   ```

   

2. 函数调用模式

   ```javascript
   var double = function () {
       var that = this
       var helper = function () {
           this.value
       }
       helper();
   }
   ```

   

   

3. 构造器调用模式

   ```javascript
   function Perple (name) {
       this.name = name
   }
   Perple.prototype.eat = function () {
       return this.name
   }
   ```

   

4. apply调用模式

   ```javascript
   Object.apply(this, [...arg])
   ```

**一个函数总是会返回一个值，如果没有返回值，则返回undefined**

```javascript
var i = 0;
function fn() {
    i++;
    if(i < 10) {
		fn(); // return fn() --> result:10 
    } else {
        return i;
    }
}
var result = fn();
console.log(result) // undefined
```

**异常**

