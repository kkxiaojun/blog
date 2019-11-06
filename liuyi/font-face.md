# @font-face This relative module was not found（字体引入路径问题）

## 问题描述
在vue项目，`sass`中引入字体的时候用相对路径报错：
[font]()

引入`font-face`字体文件的ulr如下，用的是相对路径：
```javascript
	@font-face {
	  font-family: "隶书";
	  src: url('./../assets/font/SIMLI.TTF') format('truetype');
	  font-weight: normal;
	  font-style: normal;
	}
```

## 解决方案
经过一番搜索，这里先说解决方案:
1. 使用`webpack`中的`alias`
```javascript
	@font-face {
	  font-family: "隶书";
	  src: url('~/@/assets/font/SIMLI.TTF') format('truetype');
	  font-weight: normal;
	  font-style: normal;
	}
```

2. 直接使用绝对路径
```javascript
	@font-face {
	  font-family: "隶书";
	  src: url('/src/assets/font/SIMLI.TTF') format('truetype');
	  font-weight: normal;
	  font-style: normal;
	}
```
3. 使用`url-loader`而不能是url
```javascript
	@font-face {
	  font-family: "隶书";
	  src: url-loader('./../assets/font/SIMLI.TTF') format('truetype');
	  font-weight: normal;
	  font-style: normal;
	}
```

## 相对路径出错原因
由于项目使用的是`sass`，所以先从`sass`找原因

其次，在打包的时候会报错，找不到 SIMLI.TTF。 在sass-loader [文档](https://github.com/webpack-contrib/sass-loader#problems-with-url)中找到有对 `url()` 进行了单独的说明：


在查看`sass-loader`中，在webpack官网对`sass-loader`的使用中，特别注明了`url(...)`的问题：

**由于 `Sass/libsass` 并没有提供`url rewriting` 的功能，所以所有的链接资源都是相对输出文件(output)而言。**

1. 如果生成的 CSS 没有传递给 `css-loader`，它相对于网站的根目录。
	1. 如果生成的 CSS 传递给了 `css-loader`，则所有的 url 都相对于入口文件（例如：main.scss）。
	2. 第二种情况可能会带来一些问题。正常情况下我们期望相对路径的引用是相对于 .scss 去解析（如同在 .css 文件一样）。幸运的是，有2个方法可以解决这个问题：

2. 将`resolve-url-loader`设置于 `loader` 链中的 sass-loader 之后，就可以重写 url。


使用`~@`可以的原因可以看Vue中的url转换规则：

* 如果 URL 是一个绝对路径 (例如 /images/foo.png)，它将会被保留不变。

* 如果 URL 以 . 开头，它会作为一个相对模块请求被解释且基于你的文件系统中的目录结构进行解析。

* 如果 URL 以 ~ 开头，其后的任何内容都会作为一个模块请求被解析。这意味着你甚至可以引用 Node 模块中的资源：
```javascript
	<img src="~some-npm-package/foo.png">
```
* 如果 URL 以 @ 开头，它也会作为一个模块请求被解析。它的用处在于 Vue CLI 默认会设置一个指向 <projectRoot>/src 的别名 @。(仅作用于模版中)




