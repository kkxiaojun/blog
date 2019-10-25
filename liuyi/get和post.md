讨论GET和POST区别的时候，需要现确定下到底是**浏览器使用的GET/POST**还是**用HTTP作为接口传输协议**的场景。
## 浏览器的GET和POST
这里特指浏览器中<font color=red>非Ajax的HTTP请求</font>。
1. 浏览器用GET请求来获取一个html页面/图片/css/js等资源
2. 用POST来提交一个<form>表单，并得到一个结果的网页。

### GET
"读取"一个资源。如：get一个html文件。反复读取不应该对访问的数据有副作用。没有副作用被称为“幂等idempotent”。

特点：GET是读取，就可以对GET请求的数据做缓存（浏览器端304、nginx设置header、server端Etag）

### POST

**幂等与不幂等**
在页面里`<form>`表单。点击submit元素会发出一个POST请求让服务器做一件事。

特点：<font color=red>有副作用，不幂等。</font>

不幂等意味着不能随意多次执行。所以也就不能缓存。例：通过POST下一个单，服务器创建了新的订单，然后返回订单成功的界面。这个页面不能被缓存（如果这个页面缓存了，直接下单请求不同过服务器下单，恐怖如斯）。

**GET和POST携带数据的格式也有区别**
1. GET: 浏览器直接发出的GET只能由url触发。所以，GET上要在url之外带一些参数就只能让url附带queryString（HTTP本身并没有这个限制）。

2. POST:浏览器发出请求的body主要有两种格式：
  1. application/x-www-form-urlencoded (key1=value1&key2=value2)
  2. multipart/form-data

因此，我们一般说的“GET请求没有body，只有url，请求数据放在url的querystring中；post请求的数据在bodyzhong ”。<font color=red>这种情况仅限于浏览器发送的请求</font>

## 接口中的GET和POST
> 这里是指通过浏览器的Ajax api,或者iOS/Android的App的http client，java的commons-httpclient/okhttp或者是curl，postman之类的工具发出来的GET和POST请求。

此时GET/POST不光能用在前端和后端的交互中，还能用在后端各个子服务的调用中（即当一种RPC协议(Remote Procedure Call)使用）。

其中的“<METHOD>"可以是GET也可以是POST，或者其他的HTTP Method，如PUT、DELETE、OPTION……。<font color=red>从协议本身看，并没有什么限制说GET一定不能没有body，POST就一定不能把参放到<URL>的querystring上。</font>

> json相对于x-www-form-urlencoded的优势在于1）可以有嵌套结构；以及 2）可以支持更丰富的数据类型。通过一些框架，json可以直接被服务器代码映射为业务实体。用起来十分方便。但是如果是写一个接口支持上传文件，那么还是multipart/form-data格式更合适。

## 关于安全性

我们常常听到：GET不如POST安全，因为POST用body传输数据，而GET用url传输，更加容易看到。但是从攻击的角度，**无论是GET还是POST都不够安全**，因为<font color=red>HTTP本身是明文协议。</font>

<font color=red>每个HTTP请求和返回的每个byte都会在网络上明文传播，不管是url，header还是body。这完全不是一个“是否容易在浏览器地址栏上看到“的问题。</font>

**不安全的解决方案：加密**
为了避免传输中数据被窃取，必须做从客户端到服务器的端端加密。业界的通行做法就是：

https——即用SSL协议协商出的密钥加密明文的http数据。这个加密的协议和HTTP协议本身相互独立。如果是利用HTTP开发公网的站点/App，要保证安全，https是最最基本的要求。

**当然，绝大多数场景，用POST + body里写私密数据是合理的选择。**