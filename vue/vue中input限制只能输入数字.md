# 需求
日常工作中，用Vue的时候，经常遇到`input`框只能输入数字的要求

可以用，`onkeypress`事件结合`String.fromCharCode`去实现
```javascript
<el-input v-model="name" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)));"/>
```

要兼容firefox，则要做兼容：
```javascript
  <el-input v-model="name" onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"/>
```

但是`input`多了，并且其它地方都需要使用，所以，就准备写个`directive`方便使用

# `directive`指令的代码实现
`onkeypress.js`
```javascript
/**
 * input输入框只能输入数字的检验指令
 */
export default {
  bind: function(el, binding) {
    el.onkeypress = function(e) {
      const ev = e || event
      // ev.which兼容firefox， String.fromCharCode（将 Unicode 编码转为一个字符）
      return (/[\d]/.test(String.fromCharCode(ev.keyCode || ev.which))) || ev.which === 8
    }
  }
}

```
`index.js`
```javascript
import VueOnkeypress from './onkeypress.js'

// input输入框只能输入数字的检验指令
const install = function(Vue) {
  Vue.directive('VueOnkeypress', VueOnkeypress)
}

if (window.Vue) {
  window.VueOnkeypress = VueOnkeypress
  Vue.use(install) // eslint-disable-line
}

VueOnkeypress.install = install
export default VueOnkeypress

```

**局部使用**
```javascript
// 使用
<el-input v-vue-onkeypress v-model="name"/>


import VueOnkeypress from '@/directive/vue_onkeypress/index.js'
export default {
  directives: {
    VueOnkeypress
  }
}
```
**全局使用**
```javascript
import VueOnkeypress from 'src/directive/onkeypress/index'

Vue.directive('VueOnkeypress', VueOnkeypress);
```