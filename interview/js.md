## websoket
> WebSocket 使用ws或wss协议，Websocket是一个持久化的协议，相对于HTTP这种非持久的协议来说。WebSocket API最伟大之处在于服务器和客户端可以在给定的时间范围内的任意时刻，**相互**推送信息。WebSocket并不限于以Ajax(或XHR)方式通信，因为Ajax技术需要客户端发起请求，而WebSocket服务器和客户端可以彼此相互推送信息；XHR受到域的限制，而WebSocket允许跨域通信。它实现了浏览器与服务器的全双工通信，扩展了浏览器与服务端的通信功能，使服务端也能主动向客户端发送数据。

```
// 创建一个socket实例
var socket = new WebSocket('server')
socket.onopen = function(event) {
  socket.send('hei,man')
  socket.onmessage = function(event) {
    console.log(event);
  }
  socket.onclose = function(event){
    console.log(event);
  }
  // socket.close();
}

// 打开socket
// 发送一个初始化消息
// 监听信息
// 监听socket的关闭
// 关闭socket
```

## 浏览器的事件处理机制，事件代理
  ### 事件冒泡/事件捕捉
  * 事件冒泡
  > 事件由具体的元素先接收，逐级向上传播直到绑定事件的元素。
  
  * 事件捕捉
  > 事件由顶层对象触发，然后逐级向下传播直到目标元素

  * 阻止冒泡/捕获：event.stopPropagation() 和 ie的 event.cancelBubble()
  ### 事件委托
  利用事件冒泡的原理，把事件加到父级元素上，执行触发效果，提高效率
  ```
  <ul id="btn">
    <li>btn1</li>
    <li>btn2</li>
    <li>btn3</li>
  <ul>
  var btn = document.getElementById('btn');
  btn.addEventListener('click', btnClick);
  function btnClick(e) {
    var that = this;
    var ev = e || window.event;
    var target = ev.target || ev.srcElement;
    if (target.nodeName.toLowerCase() === 'li') {
                //do something
         }  
  }
  ```
###事件循环（Event Loop）
浏览器中，js引擎线程会循环从任务队列中读取事件并且执行，这种运行机制叫做事件循环（event loop）
* 先执行同步的代码，然后js跑去消息队列中执行异步的代码，异步完成后，再轮到回调函数，然后去下个事件循环中执行setTimeout
* 它从script(整体代码)开始第一次循环。之后全局上下文进入函数调用栈。直到调用栈清空(只剩全局)，然后执行所有的micro-task。
当所有可执行的micro-task执行完毕之后。循环再次从macro-task开始，找到其中一个任务队列执行完毕，然后再执行所有的micro-task，这样一直循环下去。
* 从规范上来讲，setTimeout有一个4ms的最短时间，也就是说不管你设定多少，反正最少都要间隔4ms才运行里面的回调。而Promise的异步没有这个问题。Promise所在的那个异步队列优先级要高一些。Promise是异步的，是指他的then()和catch()方法，Promise本身还是同步的
Promise的任务会在当前事件循环末尾中执行，而setTimeout中的任务是在下一次事件循环执行
    
涉及的名词：
* task queue.任务队列;task = sync task(同步任务) + microtask + macrotask
* microtask队列（微任务），在task末尾执行，栈空了也执行; include: setTimeout, setInterval, setImmediate, I/O, UI rendering
* macrotask队列 （宏任务），在第一次task执行完了（即microtask执行完），浏览器进行渲染，然后才执行macrotask; include: process.nextTick, Promises, Object.observe, MutationObserver
* stack执行栈

具体过程描述：
```
    setTimeout(function(){
      console.log(4)
      }
    ,0)
    new Promise(function(resolve){
      console.log(1)
      for(var i=0;i<10000;i++){
        i===9999 && resolve()
      }
      console.log(2)
    }).then(function(){
      console.log(5)
    })
    console.log(3)
```

    1. js执行setTimeout脚本，压入task queue
    2. 遇到promise, 执行promise里的同步部分，输出1,2；promise属于microtask,then()后面的跟随在task末尾
    3. 执行console.log(3)，输出3
    4. 一个task执行完后，执行microtask,输出5
    5. 进行浏览器渲染，执行setTimeout（macrotask,属于新的task,Event Loop就是指从这里开始一个新的task）,输出4
    
    最后个人理解：
    浏览器执行js脚本->sync->microtask->macrotask(一个新的task->sync task->microtask不断循环)
## 闭包
要理解闭包，首先必须理解Javascript特殊的静态作用域。
1. javascript语言的特殊之处在于函数内部可以读取函数外部的变量。而函数外部无法读取函数内部变量。
子对象会一级一级向上寻找所有父对象变量。父对象的所有变量对子对象可见，反之不成立。
2. 静态作用域的含义是函数作用域的嵌套关系由定义时决定而不是调用时决定。又成为词法作用域，其作用域嵌套关系
3. 在函数外部无法读取函数内的局部变量

变量的作用域无非就是两种：全局变量和局部变量。
  闭包（closure）是指有权访问另一个函数作用域中的变量的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，通过另一个函数访问这个函数的局部变量
  
  闭包的三个特性
  ```
  1.函数嵌套函数
  2.函数内部可以引用外部的参数和变量
  3.参数和变量不会被垃圾回收机制回收
  ```
  闭包是javascript语言的一大特点，主要应用闭包场合主要是为了：设计私有的方法和变量,避免全局变量污染，希望一个变量长期驻扎在内存中。

## 原型与原型链、作用域链
  * 当从一个对象那里调取属性或方法时，如果该对象自身不存在这样的属性或方法，就会去自己关联的prototype对象那里寻找，如果prototype没有，就会去prototype关联的前辈prototype那里寻找，如果再没有则继续查找Prototype.Prototype引用的对象，依次类推
  * 直到Prototype.….Prototype为undefined（Object的Prototype就是null）从而形成了所谓的“原型链”

  > 作用域链，作用域链的作用是保证**执行环境**里有权访问的变量和函数是**有序的**，作用域链的变量只能向上访问，变量访问到window对象即被终止，作用域链向下访问变量是不被允许的。
## js继承
当谈到继承时，JavaScript 只有一种结构：对象。每个对象都有一个私有属性（称之为 [[Prototype]]），它持有一个连接到另一个称为其 prototype 对象（原型对象）的链接。该 prototype 对象又具有一个自己的原型，层层向上直到一个对象的原型为 null。（Object.getPrototypeOf(Object.prototype) === null; // true）根据定义，null 没有原型，并作为这个原型链中的最后一个环节。)

* 原型链继承缺点
  一是字面量重写原型会中断关系，使用引用类型的原型，并且子类型还无法给超类型传递参数。
* 借用构造函数
  借用构造函数虽然解决了刚才两种问题，但没有原型，则复用无从谈起。所以我们需要原型链+借用构造函数的模式，这种模式称为组合继承
* 组合继承
  组合式继承是比较常用的一种继承方法，其背后的思路是 使用原型链实现对原型属性和方法的继承，而通过借用构造函数来实现对实例属性的继承。这样，既通过在原型上定义方法实现了函数复用，又保证每个实例都有它自己的属性。

### ajax
1. 创建XMLHttpRequest对象,也就是创建一个异步调用对象.

2. 创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息（xhr.open()）.

3. 设置响应HTTP请求状态变化的函数.(onreadystatechange,readyState==4,status==200)

4. 发送HTTP请求.(xhr.send())

5. 获取异步调用返回的数据.

6. 使用JavaScript和DOM实现局部刷新.

```
var xhr;
if (window.XMLHttpRequest)
  {// code for IE7+, Firefox, Chrome, Opera, Safari
  xhr=new XMLHttpRequest();
  }
else
  {// code for IE6, IE5
  xhr=new ActiveXObject("Microsoft.XMLHTTP");
  }
xhr.onreadystatechange=function()
  {
  if (xhr.readyState==4 && xhr.status==200)
    {
    document.getElementById("txtHint").innerHTML=xhr.responseText;
    }
  }
xhr.open("GET","gethint.asp?q="+str,true);
xhr.send();
}
```
### fetch
XMLHttpRequest 是一个设计粗糙的 API，不符合关注分离（Separation of Concerns）的原则，配置和调用方式非常混乱，而且基于事件的异步模型写起来也没有现代的 Promise，generator/yield,async/await友好

fetch 是浏览器提供的一个新的 web API，它用来代替 Ajax（XMLHttpRequest），其提供了更优雅的接口，更灵活强大的功能。
Fetch 优点主要有：
* 语法简洁，更加语义化
* 基于标准的promise实现，支持async/await
```
fetch(url).then(response=> response.json())
.then(data=>console.log(data))
.catch(e=>console.log(e))
```
## promise原理
   > 观察者模式
    
## ES6相关
