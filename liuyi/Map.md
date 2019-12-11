记录这篇文章，主要是博主认为Map的数据结构非常重要，想起浏览器的命中缓存（类似映射表），session后台存储session用到的session map，webpack的hash等，很多地方都用到map的数据结构，所以想深入学习了解，知其所以然。
# Object
JavaScript中的常规对象是一种字典类型的数据结构——这意味着它依然遵循与Map类型相同键值对的存储结构。Object中的key，或者我们可以称之为属性，同样是独一无二的并且对应着一个单独的value。
另外，JavaScript中的Object拥有内置原型(prototype)。需要注意的是，JavaScript中几乎所有对象都是Object实例，包括Map。
```javascript
typeof new Map() // object
```


# Map
Map是一种数据结构（它很特别，是一种抽象的数据结构类型），数据一对对进行存储，其中包含键以及映射到该键的值。并且由于键的唯一性，因此不存在重复的键值对。
Map便是为了快速搜索和查找数据而生的。
```javascript
  var mapObj = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ]);
// {1 => "one", 2 => "two", 3 => "three"}
```

在Map中，每一对数据的格式都为键值对的形式。
<font color=red>注：Map 对象保存键值对。任何值(对象或者原始值) 都可以作为一个键或一个值。</font>

## Map的基础
### 构建
对于Map的创建只能使用`new`操作符, `new Map([iterable])`
```javascript
  var mapObj = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ]);
// {1 => "one", 2 => "two", 3 => "three"}
```

Map的构造函数接收一个数组或是一个可遍历的对象作为参数，这个参数内的数据都为键值对结构。如果是数组，则包含两个元素[key, value]。

### 常用方法
`Map.prototype.set(key, value)`
设置Map对象中键的值。返回该Map对象。

`Map.prototype.get(key)`
返回键对应的值，如果不存在，则返回undefined。

`Map.prototype.has(key)`
返回一个布尔值，表示Map实例是否包含键对应的值。

`Map.prototype.delete(key)`
如果 Map 对象中存在该元素，则移除它并返回 true；否则如果该元素不存在则返回 false

`Map.prototype.clear()`
移除Map对象的所有键/值对 。


**遍历**

因为Map也是Object, 所以Object的迭代均适用于Map

```javascript
  var mapObj = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
  ]);
  console.log('mapObj:', mapObj)

  mapObj.forEach((value, key) => {
    console.log(value, key)
  })
  // one 1
  // two 2
  // three 3

  for (const i of mapObj.keys()) {
    console.log('for of:', i)
  }
  // 1
  // 2
  // 3

  for (const i of mapObj.values()) {
    console.log('for of', i)
  }
  // one
  // two
  // three
  
```

## Object 与Map的区别
Objects 和 Maps 类似的是，它们都允许你按键存取一个值、删除键、检测一个键是否绑定了值。因此（并且也没有其他内建的替代方式了）过去我们一直都把对象当成 Maps 使用。不过 Maps 和 Objects 有一些重要的区别，在下列情况里使用 Map 会是更好的选择：

1. 一个Object的键只能是字符串或者 Symbols，但一个 Map 的键可以是任意值，包括函数、对象、基本类型。
2. Map 中的键值是有序的，而添加到对象中的键则不是。因此，当对它进行遍历时，Map 对象是按插入的顺序返回键值。[具体了解供参考](https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order)
3. Object 都有自己的原型，原型链上的键名有可能和你自己在对象上的设置的键名产生冲突。虽然 ES5 开始可以用 map = Object.create(null) 来创建一个没有原型的对象，但是这种用法不太常见。
Map 在涉及频繁增删键值对的场景下会有些性能优势。
```javascript
var map = new Map();
console.log(map instanceof Object); //true
var obj = new Object();
console.log(obj instanceof Map); //false
```

资料链接：
* [Object-Javascript-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)
* [Map-Javascript-MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map)
* [https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order](https://stackoverflow.com/questions/5525795/does-javascript-guarantee-object-property-order)