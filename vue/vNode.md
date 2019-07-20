```javascript

// 下面这段代码是vue的methohs中某个方法的部分代码，作用在notifycation上添加按钮，在点击按钮之后实现路由跳转，同时关闭该消息弹窗
const h = this.$createElement
let notify = this.$notify({
  title: '开始考勤提醒',
  message: h('p', null, [
    msg,
    h('a',
      {
        attrs: {href: routeData.href, target: '_blank'}  // 在新窗口加载路由
     },
      [
        h('el-button', {
          style: {
            float: 'right'
          },
          attrs: {
            size: 'small',
            type: 'primary'
          },
          on: {
            click: this.closeNotify // 路由加载之后，调用关闭消息弹窗的方法
          }
        }, '开始考勤')
      ]
    )
  ]),
  position: 'bottom-right',
  duration: 0,
  offset: 20,
  dangerouslyUseHTMLString: true
})
```