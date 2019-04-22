# 笔试
1. 用不同方法实现垂直居中
2. 直接写出输出结果
    1. for循环加setTime和闭包，输出i的简单题
3. this的题目
  ```javascript
    var a = 2;
    var obj ={
      a: 1,
      fn1: function(){
        console.log(this.a);
      },
      fn2: () => {
        console.log(this.a)
      }
    }
    // 还有apply，call的具体忘了
  ```

算法题

1. 输入一个数字，转换为二进制，然后输出结果
2. 输入一个字符串，统计每个字符出现的次数
3. 实现一个单向链表

# 面试
1. webpack的hash有哪些，有什么特点，做什么用（当时不会😢）
2. http长连接和短链接（当时不不会😢），应该会顺着往下问的，tcp／ip，握手之类，知道http／2.0
3. 讲讲你了解的算法和实现原理

其它的记不起来了，都是一些简历上写的😢

