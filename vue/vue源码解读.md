# Vue源码
## 认识Flow

flow是一个静态类型检测工具，Vue.js的源码利用了flow做了静态类型检测，了解flow有助于理解源码。类型检查（在编译期尽早发现（由类型错误）引起的bug，又不影响代码运行）是当前动态类型语言的发展趋势。

## Flow的工作方式

通常类型检查有两种方式：

- 类型推断。通过变量的上下文来推断出变量类型，然后根据推断来检查类型。
- 类型注释。先添加类型注释，Flow通过这些注释来判断。

## 数据驱动

## vue 双向绑定底层实现原理

## v-show和v-if区别
`v-if`: 真正的条件渲染。false，不在dom中。
`v-show`: 一直在dom中，只是用css的display属性进行切换（存在于html结构中，但是未用css进行渲染）。存在dom结构中，`display:none`时，不在render（渲染树）树中。

## visibility：hidden和display：none之间区别
`display: none`: 标签不会出现在页面上（尽管你仍然可以通过dom与它进行交互）。其它标签不会为它分配空间。
`visibility:hidden`:  标签会出现在页面上，只是看不见而已。其它标签会为它分配空间。

## vue组件通信
* 父->子: props
* 子->: 回调参数(父组件通过props给子组件传递了一个changeParentComponentName函数，子组件调用这个函数时，传一个参数)和自定义事件($emit)

## 对MVVM的理解


## vue中mixin与extend区别

## Proxy 与 Object.defineProperty 对比
`Object.defineProperty`虽然已经能实现数据的双向绑定，但是还是有缺陷的
1. 只能对属性进行数据劫持，所以需要深度遍历整个对象
2. 对于数组不能监听到数据的变化

vue中对于数组虽然能监听到数据的变化，但是是用hack的方法
```javascript
    
```