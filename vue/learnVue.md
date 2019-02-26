## 响应式原理
1. Vue遍历所有的data属性，并用Object.defineProperty把这些属性转化为getter（进行依赖收集）和setter（观察者，在数据变更的时候通知订阅者更新视图），Object.defineProperty 是 ES5 中一个无法 shim 的特性，这也就是为什么 Vue 不支持 IE8 以及更低版本浏览器
2. 每个组件实例都有相应的watcher实例对象，它会在组建渲染过程中把属性记录为依赖，之后当依赖项的setter被调用时，会通知watcher重新计算，从而使它关联的组件得以更新 

**检测变化的注意事项**
1. 受现代JavaScript的影响（Object.observe已被废弃），Vue无法检测到对象属性的添加和删除。**Vue在初始化实例时对data里面的属性进行getter和setter转化**，所以属性必须在data对象里才能让Vue转化它，这样它才是响应式的

2. Vue不允许在已经创建的实例上动态地添加新的根级别响应属性，但是可以使用Vue.set(Object, key, value)方法添加到嵌套的对象上

```
Vue.set(vm.Prop, 'a', 2)
this.$set(vm.Prop, 'a', 2)

// 向已有对象添加新的属性
Object.assign({}, vm.Prop, {a: 2, b: 3})
```
**异步更新队列**
1. Vue异步执行Dom更新，只要观察到数据变化，就会开启一个队列，并缓冲在同一事件循环中发生的所有数据改变
2. 同一个watcher被触发，只会被推入到队列中一次，在下一个的事件循环“tick”中，Vue 刷新队列并执行实际 (已去重的) 工作。（Promise().then or setTimeout()）
3. 要在Dom更新完后做一些事，可使用`Vue.nextTick(callback)`

## 为什么要收集依赖 
```
new Vue({
    template: 
        `<div>
            <span>text1:</span> {{text1}}
            <span>text2:</span> {{text2}}
        <div>`,
    data: {
        text1: 'text1',
        text2: 'text2',
        text3: 'text3'
    }
});
```
当text3改变的时候，还是会触发setter方法，导致重新执行渲染，这是不正确的。
**dependencies**
当对data上的对象进行修改值的时候会触发它的setter，那么取值的时候自然就会触发getter事件，所以我们只要在最开始进行一次render，此时，可以利用getter将data收集到Dep的subs中去。在对data中的数据进行修改的时候setter只会触发Dep的subs的函数。

## 数据绑定原理
**官网图示**
1. 先通过一次render操作触发getter，这里保证只有视图中需要被用到的data才会触发getter）进行依赖收集，这时候其实Watcher与data可以看成一种被绑定的状态（实际上是data的闭包中有一个Deps订阅者，在修改的时候会通知所有的Watcher观察者），在data发生变化的时候触发setter，setter通知Watcher，Watcher进行回调通知组件重新渲染的函数，之后根据diff算法来决定是否发生视图的更新。
2. Vue在初始化组件数据时，在生命周期的beforeCreate与created钩子函数之间实现了对data、props、computed、methods、events以及watch的处理。
![data](./../image/data.png)

**initData**
```javascript
// 初始化data
function initData() {
    while () {
        ...
        // 将data属性代理到vm实例上
        proxy(vm, '', data, key)
    }
    observe(data, true /* asRootData */)
}

// 如果存在ob对象则直接返回，不存在就创建新对象
function observe(value, asRootData) {
    let ob = {}
    if (value.__ob__) {
        ...
    } else {
        ob = new Observe();
    }
    return ob;
}

export class Observe{

}

```
