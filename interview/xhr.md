# ajax
**基础**
发送异步请求

**创建过程**
1. 创建XMLHttpRequest对象,也就是创建一个异步调用对象.

2. 创建一个新的HTTP请求,并指定该HTTP请求的方法、URL及验证信息（xhr.open(method, url, true/false)）.

3. 设置响应HTTP请求状态变化的函数.(onreadystatechange,readyState==4,status==200)

4. 发送HTTP请求.(xhr.send(method, url, true/false))

5. 获取异步调用返回的数据.

6. 使用JavaScript和DOM实现局部刷新.

```javascript
method
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
if(method === 'post') {
    xhr.send(data);
} else {
    xhr.send();
}
}
```

**AJAX的工作原理**

Ajax的工作原理相当于在用户和服务器之间加了—个中间层(AJAX引擎),使用户操作与服务器响应异步化。　Ajax的原理简单来说通过XmlHttpRequest对象来向服务器发异步请求，从服务器获得数据，然后用javascript来操作DOM而更新页面。

**ajax优缺点**

优点：无刷新更新数据，异步与服务器通信，前后端负载均衡

缺点：

- ajax干掉了Back和history功能，对浏览器机制的破坏
- 对搜索引擎支持较弱
- 违背了URI和资源定位的初衷

# Promise

一句话概括promise: Promise 对象用于表示一个异步操作的最终状态（完成或失败），以及该异步操作的结果值。


`Promise`是ES6新增的语法，解决了`callback hell`的问题。

可以把Promise看成是一个状态机。初始状态是pending，通过resolve or reject 可以将状态转化为fulfilled or rejected.状态一旦改变就不能再次改变。

`then` 函数会返回一个 Promise 实例，并且该返回值是一个新的实例而不是之前的实例。因为 Promise 规范规定除了 `pending` 状态，其他状态是不可以改变的，如果返回的是一个相同实例的话，多个 `then`调用就失去意义了。

**Promise实现类似Axios**
```javascript
// 用promise实现类似axios的功能
function p(method, url, data) {
    return new Promise((resolve, reject) => {
        let xhrObj;
        if (window.XMLHttpRequest) {
            xhrObj = new XMLHttpRequest();
        } else {
            xhrObj = new ActiveObject("Microsoft.XMLHTTP");
        }
        xhrObj.open(method, url, true);
        if (method === 'post') {
            xhrObj.send(data);
        }
        xhrObj.send();
        xhrObj.onreadystatechange = () => {
            if (xhrObj.readyState === 400) {
                let res = xhrObj.response;
                if (xhrObj.status === 200) {
                    return resolve(JSON.parse(res));
                } else {
                    return reject(xhrObj);
                }
            }
        }
    })
}
```

**手写promise**
```javascript
       // 简易版本的promise 
        // 第一步： 列出三大块  this.then   resolve/reject   fn(resolve,reject)
        // 第二步： this.then负责注册所有的函数   resolve/reject负责执行所有的函数 
        // 第三步： 在resolve/reject里面要加上setTimeout  防止还没进行then注册 就直接执行resolve了
        // 第四步： resolve/reject里面要返回this  这样就可以链式调用了
        // 第五步： 三个状态的管理 pending fulfilled rejected
     
        // *****promise的链式调用 在then里面return一个promise 这样才能then里面加上异步函数
        // 加上了catch
        function PromiseM(fn) {
            var value = null;
            var callbacks = [];
            //加入状态 为了解决在Promise异步操作成功之后调用的then注册的回调不会执行的问题
            var state = 'pending';
            var _this = this;

            //注册所有的回调函数
            this.then = function (fulfilled, rejected) {
                //如果想链式promise 那就要在这边return一个new Promise
                return new Promise(function (resolv, rejec) {
                    //异常处理
                    try {
                        if (state == 'pending') {
                            callbacks.push(fulfilled);
                            //实现链式调用
                            return;
                        }
                        if (state == 'fulfilled') {
                            var data = fulfilled(value);
                            //为了能让两个promise连接起来
                            resolv(data);
                            return;
                        }
                        if (state == 'rejected') {
                            var data = rejected(value);
                            //为了能让两个promise连接起来
                            resolv(data);
                            return;
                        }
                    } catch (e) {
                        _this.catch(e);
                    }
                });
            }

            //执行所有的回调函数
            function resolve(valueNew) {
                value = valueNew;
                state = 'fulfilled';
                execute();
            }

            //执行所有的回调函数
            function reject(valueNew) {
                value = valueNew;
                state = 'rejected';
                execute();
            }

            function execute() {
                //加入延时机制 防止promise里面有同步函数 导致resolve先执行 then还没注册上函数
                setTimeout(function () {
                    callbacks.forEach(function (cb) {
                        value = cb(value);
                    });
                }, 0);
            }

            this.catch = function (e) {
                console.log(JSON.stringify(e));
            }

            //经典 实现异步回调
            fn(resolve, reject);
        }
```
promise特性：参考`promise-polyfill`
1. 捕获错误与try catch等同
```
var pp = new Promise((resolve, reject) => {
  throw Error('sync error)
})
  .then(res => {

  })
  .catch(err => {
    console.log(err)
  })

// try/catch包裹回调代码
function Promise(fn) {
    ...
    doResolve(fn, this)
}

function doResolve(fn, self) {
    try {
        fn(function(value) {
            ...
        },
        function(reason) {
            ...
        })
    } catch(err) {
        reject(self, err)
    }
}

Promise.prototype.then = function(onFulfilled, onRejected) {
    try {
        ...
        onFulfilled(value)
    } catch(err) {
        reject(err)
    }
};

function reject(self, newValue) {
    ...
    if (!self._handled) {
        Promise._unhandledRejectionFn(self._value);
    }
}
```
2. Promise拥有状态变化
一个 Promise有以下几种状态:
* pending: 初始状态，既不是成功，也不是失败状态。
* fulfilled: 意味着操作成功完成。
* rejected: 意味着操作失败。

```javascript

```


3. Promise方法中的回调是异步的
```javascript
var pp = new Promise((resolve, reject) => {
  resolve()
  setTimeout(() => {
    console.log(1)
  })
  console.log(2)
})
  .then(res => {
    console.log(3)
  })

console.log(4)
```

4. Promise会存储返回值
```javascript
var p1 = new Promise(function(resolve, reject) {
    reject(1)
})
    .catch(err => {
        console.log(err)
        return 2
    })

setTimeout(() => {
    p1
        .then(res => console.log(res))
}, 1000)

// 先输出： 1，1秒后输出：2
```

5. Promise方法每次都返回一个新的Promise

```javascript
// 三种状态
const PENDING = "pending";
const RESOLVED = "resolved";
const REJECTED = "rejected";
// promise 接收一个函数参数，该函数会立即执行
function MyPromise(fn) {
  let _this = this;
  _this.currentState = PENDING;
  _this.value = undefined;
  // 用于保存 then 中的回调，只有当 promise
  // 状态为 pending 时才会缓存，并且每个实例至多缓存一个
  _this.resolvedCallbacks = [];
  _this.rejectedCallbacks = [];

  _this.resolve = function (value) {
    if (value instanceof MyPromise) {
      // 如果 value 是个 Promise，递归执行
      return value.then(_this.resolve, _this.reject)
    }
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = RESOLVED;
        _this.value = value;
        _this.resolvedCallbacks.forEach(cb => cb());
      }
    })
  };

  _this.reject = function (reason) {
    setTimeout(() => { // 异步执行，保证执行顺序
      if (_this.currentState === PENDING) {
        _this.currentState = REJECTED;
        _this.value = reason;
        _this.rejectedCallbacks.forEach(cb => cb());
      }
    })
  }
  // 用于解决以下问题
  // new Promise(() => throw Error('error))
  try {
    fn(_this.resolve, _this.reject);
  } catch (e) {
    _this.reject(e);
  }
}

MyPromise.prototype.then = function (onResolved, onRejected) {
  var self = this;
  // 规范 2.2.7，then 必须返回一个新的 promise
  var promise2;
  // 规范 2.2.onResolved 和 onRejected 都为可选参数
  // 如果类型不是函数需要忽略，同时也实现了透传
  // Promise.resolve(4).then().then((value) => console.log(value))
  onResolved = typeof onResolved === 'function' ? onResolved : v => v;
  onRejected = typeof onRejected === 'function' ? onRejected : r => throw r;

  if (self.currentState === RESOLVED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      // 规范 2.2.4，保证 onFulfilled，onRjected 异步执行
      // 所以用了 setTimeout 包裹下
      setTimeout(function () {
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === REJECTED) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      setTimeout(function () {
        // 异步执行onRejected
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (reason) {
          reject(reason);
        }
      });
    }));
  }

  if (self.currentState === PENDING) {
    return (promise2 = new MyPromise(function (resolve, reject) {
      self.resolvedCallbacks.push(function () {
        // 考虑到可能会有报错，所以使用 try/catch 包裹
        try {
          var x = onResolved(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });

      self.rejectedCallbacks.push(function () {
        try {
          var x = onRejected(self.value);
          resolutionProcedure(promise2, x, resolve, reject);
        } catch (r) {
          reject(r);
        }
      });
    }));
  }
};
// 规范 2.3
function resolutionProcedure(promise2, x, resolve, reject) {
  // 规范 2.3.1，x 不能和 promise2 相同，避免循环引用
  if (promise2 === x) {
    return reject(new TypeError("Error"));
  }
  // 规范 2.3.2
  // 如果 x 为 Promise，状态为 pending 需要继续等待否则执行
  if (x instanceof MyPromise) {
    if (x.currentState === PENDING) {
      x.then(function (value) {
        // 再次调用该函数是为了确认 x resolve 的
        // 参数是什么类型，如果是基本类型就再次 resolve
        // 把值传给下个 then
        resolutionProcedure(promise2, value, resolve, reject);
      }, reject);
    } else {
      x.then(resolve, reject);
    }
    return;
  }
  // 规范 2.3.3.3.3
  // reject 或者 resolve 其中一个执行过得话，忽略其他的
  let called = false;
  // 规范 2.3.3，判断 x 是否为对象或者函数
  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    // 规范 2.3.3.2，如果不能取出 then，就 reject
    try {
      // 规范 2.3.3.1
      let then = x.then;
      // 如果 then 是函数，调用 x.then
      if (typeof then === "function") {
        // 规范 2.3.3.3
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            // 规范 2.3.3.3.1
            resolutionProcedure(promise2, y, resolve, reject);
          },
          e => {
            if (called) return;
            called = true;
            reject(e);
          }
        );
      } else {
        // 规范 2.3.3.4
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    // 规范 2.3.4，x 为基本类型
    resolve(x);
  }
}
```
关于批量发送请求

**Promise.all**
Promise.all(iterable) 方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败原因的是第一个失败 promise 的结果。

**Promise.allSettled()**
Promise.allSettled()方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，
不管是fulfilled还是rejected，包装实例才会结束。该方法由 ES2020 引入。


**Promise.allsettled**
# generator/yield,async/await
```javascript
// generator/yield
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
// 无限迭代器
function* idMaker(){
    let index = 0;
    while(true)
        yield index++;
}

let gen = idMaker(); // "Generator { }"

console.log(gen.next().value); 
// 0
console.log(gen.next().value); 
// 1
console.log(gen.next().value); 
// 2
// ...

// async/await（它就是 Generator 函数的语法糖）
async function Name() {
  await fetch(ulr)
}


```
# fetch api
**优点**
* XMLHttpRequest 是一个设计粗糙的 API，不符合关注分离（Separation of Concerns）的原则，配置和调用方式非常混乱，而且基于事件的异步模型写起来也没有现代的 Promise，generator/yield，async/await 友好
* 语法简洁，更加语义化
* 基于标准 Promise 实现，支持 async/await
* 同构方便，使用 [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)

**特点**
* Fetch 请求默认是不带 cookie 的，需要设置 `fetch(url, {credentials: 'include'})`
* 服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。

**实例**
```javascript
	if (window.fetch && method == 'fetch') {
		let requestConfig = {
			credentials: 'include', // Fetch 请求默认是不带 cookie 的，需要设置 `fetch(url, {credentials: 'include'})`
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: "cors",
			cache: "force-cache"
		}

		if (type == 'POST') {
      // 发送post请求需要设置body属性传数据
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		
		try {
			const response = await fetch(url, requestConfig); // async function, return Promise
			const responseJson = await response.json(); //  parses response to JSON
			return responseJson
		} catch (error) {
			throw new Error(error)
		}
	} 
```

# websocket
web浏览器与web服务器之间的全双工通信标准
优点：
1. 服务端能主动推送
2. 只要建立连接，能一直保持连接状态

原理： http连接建立之后，要完成“握手”，需要用到http的Upgrade首部字段。
image-http-websoket

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
