# loop and iteration
`for in`循环一个对象所有可枚举的属性（注意结合hasOwnProperty使用）
`for of`在可迭代的对象上创建了一个循环(包括Array, Map, Set, 参数对象（ arguments） 等等) 

区别：`for in`是key,`for of`是value

## 函数
函数参数

1. 值传递 
2. 引用传递

函数可以指向并调用自身。有三种方法可以达到这个目的：
1. 函数名
2. arguments.callee (用于调用函数自身，特别是用在匿名函数上)

```javascript
[1, 2, 3, 4, 5].map(function(n) {
    return !(n > 1) ? 1 : arguments.callee(n - 1) * n;
});
```

嵌套函数和闭包
1. 一个闭包是一个可以自己拥有独立的环境和变量的表达式

## 数据对象

`forEach`
在数组定义时省略的元素不会在forEach遍历时被列出，但是手动赋值为undefined的元素是会被列出

## Promise

## 代理
### 1. 正向代理
正向代理类似一个跳板机，代理访问外部资源
例：翻墙，客户端访问不了的外部资源，但是代理服务器能访问外部资源，通过配置代理服务器，访问外部资源

正向代理的用途：
1. 访问原来不能访问的外部资源，如google
2. nginx配置缓存
```
// 不缓存
location / {

add_header Cache-Control no-cache;

add_header Expires 0;

}
```
### 2. 反向代理
通过反向代理服务器接受internet的内容，然后将请求转发给部署在内网的服务器
主要应用：负载均衡
```
// nginx通过proxy_pass_http 配置代理站点，upstream实现负载均衡。
```