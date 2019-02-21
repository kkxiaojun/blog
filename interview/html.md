# doctype（文档类型的）的作用
1. 对文档进行有效性验证。它告诉用户代理和验证器这个文档是按照什么DTD（文档类型定义Document Type Definition）写的。这是个被动的过程，每当页面加载时浏览器并不会主动下载DTD并校验合法性，只有当手动校验时才启动。
2. 决定浏览器的呈现模式。通知浏览器用哪种算法解析文档。如果没有写，则浏览器根据自身的规则进行渲染，可能会严重影响布局。浏览器有三种方式解析html文档
    1. 非怪异（标准）模式
    2. 怪异模式
    3. 部分怪异模式

# 浏览器标准模式与怪异模式的区别
在“标准模式”(Standards Mode) 页面按照 HTML 与 CSS 的定义渲染，而在“怪异模式”(Quirks Mode)就是浏览器为了兼容很早之前针对旧版本浏览器设计、并未严格遵循 W3C 标准的网页而产生的一种页面渲染模式。
浏览器基于页面中文件类型描述的存在以决定采用哪种渲染模式；如果存在一个完整的DOCTYPE则浏览器将会采用标准模式，而如果它缺失则浏览器将会采用怪异模式。

# 浏览器内核
```
IE:trident内核

Firefox：gecko(壁虎)内核

safari：webkit内核，WebKit的优势在于高效稳定，兼容性好，且源码结构清晰，易于维护。

Chrome：Blink（基于webkit，google与opera software共同开发）

opera：以前是presto内核，现在改用google chrome的Blink内核
```

# 标签语义化
描述内容的含义
1. 去掉或者丢失样式的时候能够让页面呈现出清晰的结构
2. 有利于SEO；
3. 便于团队开发和维护，语义化更具可读性。遵循 W3C 标准的团队都遵循这个标准，可以减少差异化

# 可替换元素（replaced element）和 非替换元素（non-replaced element）
**可替换元素（replaced element）**
`img, object, iframe, video 等`,展现效果不是由 CSS 来控制的。这些元素是一种外部对象，它们外观的渲染，是独立于 CSS 的。（浏览器根据元素的标签和属性，来决定元素的具体显示内容。）
**非替换元素**
大多数标签属于非替换元素，这部分标签把标签里的内容直接告诉浏览器显示出来

# meta标签
1. 如何在不使用JS的情况下刷新页面（<meta http-equiv="refresh" content="time">）
2. 设置页面缓存（<meta http-equiv="cache-control" content="no-cache">）
3. 移动端设置

# 行内元素
1. 只有设置左右的margin和padding。
2. 不能设置高宽，它的高度取决于内部文字的行高。宽度取决于内部文字的多少
html 里的元素分为替换元素（replaced element）和非替换元素（non-replaced element）。

讨论margin-top和margin-bottom对行内元素是否起作用，则要对行内替换元素和行内非替换元素分别讨论。

行内替换元素：(img)有影响
行内非替换元素：无影响

# HTML5新特性
* 画布Canvas API
* 地理Geolocation API
* 音频和视频(audio,video)
## localStorage,sessionStorage
> localStorage 不会过期 sessionStorage 一个会话

## webworker
> webworker是运行在浏览器后台的js程序，不影响主线程的运行，是另开的一个js线程。可以使用这个线程进行复杂的数据操作，
把结果通过postMessage传递给主线程，这样在进行复杂且耗时的任务时就不会阻塞主线程。
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