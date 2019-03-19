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

# 虚拟dom的原理,diff算法



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

# vue 的 nextTick 实现的原理

**JS 运行机制**
JS 执行是单线程的，它是基于事件循环的。事件循环大致分为以下几个步骤：

（1）所有同步任务都在主线程上执行，形成一个执行栈（execution context stack）。

（2）主线程之外，还存在一个"任务队列"（task queue, 分为macro task和micro task）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。

（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。

（4）主线程不断重复上面的第三步。

**macro task,micro task**
```javascript
    for (macroTask of macroTaskQueue) {
    // 1. Handle current MACRO-TASK
    handleMacroTask();
      
    // 2. Handle all MICRO-TASK
    for (microTask of microTaskQueue) {
        handleMicroTask(microTask);
    }
}
```
在浏览器环境中，常见的 macro task 有 setTimeout、MessageChannel、postMessage、setImmediate；常见的 micro task 有 MutationObsever(MutationObserver接口提供了监视对DOM树变化的能力) 和 Promise.then。

**nextTick原理**

1. Vue异步执行Dom更新，只要观察到数据变化，就会开启一个队列，并缓冲在同一事件循环中发生的所有数据改变
2. 同一个watcher被触发，只会被推入到队列中一次，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。（Promise().then or setTimeout()）
3. 要在Dom更新完后做一些事，可使用`Vue.nextTick(callback)`
4. nextTick想要一个异步API，用来在当前的同步代码执行完毕后，执行我想执行的异步回调，包括Promise和 setTimeout都是基于这个原因
