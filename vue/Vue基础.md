# 双向数据绑定的原理v2.0和vue3.0
1. 第一步：Observe，Vue遍历所有的data属性，并用Object.defineProperty将这些属性添加getter（进行依赖收集）和setter（观察者，在数据变更的时候通知订阅者更新视图）

2. 第二步：Compile 解析模板指令，初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新数据。

3. 第三步：Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，主要做的事情有：在自身实例化时依赖（dep）里面添加自己。自身必须有一个 update() 方法待属性变动 dep.notice() 通知时，能调用自身的 update() 方法，并触发 Compile 中绑定的回调，则功成身退。

4. 第四步：MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，最终利用 Watcher 搭起 Observer 和Compile 之间的桥梁，达到数据变化 -> 视图更新；视图交互变化（input） -> 数据 model 变更的双向绑定效果。

为什么 Vue 3.0 中使用 Proxy 了？

Object.DefinedProperty不能完整劫持对象（即，属性值也是对象，需要深度遍历）

Object.defineProperty 只能劫持对象的属性，因此对每个对象的属性进行遍历时，如果属性值也是对象需要深度遍历，那么就比较麻烦了，所以在比较 Proxy 能完整劫持对象的对比下，选择 Proxy。

# template

Vue 中 template 就是先转化成 AST 树，再得到 render 函数返回 VNode（Vue 的虚拟 DOM 节点）。

通过 compile 编译器把 template 编译成 AST 语法树（abstract syntax tree - 源代码的抽象语法结构的树状表现形式），compile 是 createCompiler 的返回值，createCompiler 是用以创建编译器的。另外 compile 还负责合并 option。
AST 会经过 generate（将 AST 语法树转换成 render function 字符串的过程）得到 render 函数，render 的返回值是 VNode，VNode 是 Vue 的虚拟 DOM 节点，里面有标签名、子节点、文本等待。
。

# 虚拟dom的原理



# 生命周期

| beforeCreate  | 组件刚被创建，组件属性计算之前，data observer配置之前 |                                                              |
| ------------- | ----------------------------------------------------- | ------------------------------------------------------------ |
| created       | 组件实例刚创建完成，DOM未生成，$el属性还不存在        | 初始化数据                                                   |
| beforeMount   | 模板编译／挂载之前                                    | `render` 函数首次被调用。该钩子在服务器端渲染期间不被调用。  |
| mounted       | 模板编译／挂载之后                                    | `el` 被新创建的 `vm.$el` 替换                                |
| beforeUpdate  | 组件更新之前                                          | 这里适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。 |
| updated       | 组件更新之后                                          |                                                              |
| activated     | keep-alive，组件被激活时调用                          | 适合重新请求数据（用了keep-alive但是有些数据是需要更新的）   |
| deactivated   | keep-alive，组件被移除时调用                          |                                                              |
| beforeDestory | 组建销毁前调用                                        |                                                              |
| destoryed     | 组件被销毁后调用                                      |                                                              |



# vue 的 nexttick 实现的原理
https://segmentfault.com/a/1190000012861862
