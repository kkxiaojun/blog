# 双向数据绑定的原理v2.0和vue3.0
Vue 采用 数据劫持 结合 发布者-订阅者 模式的方式，通过 Object.defineProperty() 来劫持各个属性的 setter 以及 getter，在数据变动时发布消息给订阅者，触发相应的监听回调。

第一步：需要 Observe 的数据对象进行递归遍历，包括子属性对象的属性，都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。
第二步：Compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新数据。
第三步：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情有：

在自身实例化时往属性订阅器（dep）里面添加自己。
自身必须有一个 update() 方法
待属性变动 dep.notice() 通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。


第四步：MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和 Compile 之间的桥梁，达到数据变化 -> 视图更新；视图交互变化（input） -> 数据 model 变更的双向绑定效果。


为什么 Vue 3.0 中使用 Proxy 了？

# template
Vue 中 template 就是先转化成 AST 树，再得到 render 函数返回 VNode（Vue 的虚拟 DOM 节点）。

通过 compile 编译器把 template 编译成 AST 语法树（abstract syntax tree - 源代码的抽象语法结构的树状表现形式），compile 是 createCompiler 的返回值，createCompiler 是用以创建编译器的。另外 compile 还负责合并 option。
AST 会经过 generate（将 AST 语法树转换成 render function 字符串的过程）得到 render 函数，render 的返回值是 VNode，VNode 是 Vue 的虚拟 DOM 节点，里面有标签名、子节点、文本等待。
。

# 虚拟dom的原理
# 生命周期
# vue-router中hash和history的区别
# Object.defineProperty() 和 proxy 的区别

Vue 中使用 Object.defineProperty 进行双向数据绑定时，告知使用者是可以监听数组的，但是只是监听了数组的 push()、pop()、shift()、unshift()、splice()、sort()、reverse() 这八种方法，其他数组的属性检测不到。
Object.defineProperty 只能劫持对象的属性，因此对每个对象的属性进行遍历时，如果属性值也是对象需要深度遍历，那么就比较麻烦了，所以在比较 Proxy 能完整劫持对象的对比下，选择 Proxy。
为什么 Proxy 在 Vue 2.0 编写的时候出来了，尤大却没有用上去？因为当时 es6 环境不够成熟，兼容性不好，尤其是这个属性无法用 polyfill 来兼容。（polyfill 是一个 js 库，专门用来处理 js 的兼容性问题-js 修补器
# ue 的 nexttick 实现的原理
https://segmentfault.com/a/1190000012861862
