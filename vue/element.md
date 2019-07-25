# element笔记
Form​Data 对象的使用
```javascript
  FormData对象用以将数据编译成键值对，以便用XMLHttpRequest来发送数据。其主要用于发送表单数据
```

DatePicker设置范围
```javascript
  // 设置 icker-options参数
  pickerOptions: {
    disabledDate: time => {
      if (time.getTime() < this.minDate || time.getTime() > this.maxDate) {
        return true
      } else {
        return false
      }
    }
  }
```
upload上传excel
```javascript
    // 上传excel前的校验
    beforeAvatarUpload(file) {
      const result =
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.indexOf('.xls')
      if (result < 0) {
        this.$message.error('只能上传excel文件')
        return false
      } else {
        return true
      }
    },
    // 上传excel
    excelFile(item) {
      this.btnObj.upload = true
      // FormData对象用以将数据编译成键值对
      var formData = new FormData()
      formData.append('file', item.file)
      uploadExcel(formData || '').then(res => {
        if (res.code === 0) {
          this.btnObj.upload = false
          this.$message.success('导入成功')
          this.statusObj.statusTxt = this.statusMap.uploadSuccess
          this.statusZhMap.current = `上传成功，已上传${res.data}个学员`
          this.queryCurrentStatus(false)
        } else {
          this.btnObj.upload = false
          this.statusZhMap.current = this.statusZhMap.normal
          this.$message.error(res.detail)
        }
      })
    },
    // api
    import qs from 'qs'
    export function uploadExcel(data) {
      return request({
        url: '/experience/channelOut/openCourse/uploadExcel.json',
        method: 'post',
        transformRequest: function(data) {
          if (data instanceof FormData) {
            return data
          }
          data = qs.stringify(data)
          return data
        },
        data
      })
    }
```

post请求，表单参数
```javascript
  import qs from 'qs'
  // vue
  const formData = new FormData()
  formData.append('scheduleIds', row.tableCourseScheduleId)
  // js
  export function approve(data) {
  return request({
    url: '/teacher/schedule/v3/demo/schedule/vacate/approval.json',
    method: 'post',
    transformRequest: [function(data) {
      if (data instanceof FormData) {
        return data
      }
      data = qs.stringify(data)
      return data
    }],
    data
  })
}
```
## 坑
1. el-table的坑，用v-if的时候加上key

## 微信公众号html页面缓存问题
nginx配置解决
```
 // 找到nginx安装目录下的nginx.conf文件，再nginx里面添加如下的内容

  location / {

  add_header Cache-Control no-cache;

  add_header Pragma no-cache;

  add_header Expires 0;

  }
```

## 合并单元格
```javascript
// 计算需要合并的单元格
getSpanArr(data) {
  this.spanArr = []
  for (var i = 0; i < data.length; i++) {
    if (i === 0) {
      this.spanArr.push(1)
      this.pos = 0
    } else {
      // 判断当前元素与上一个元素是否相同
      if (data[i].realOpenDate === data[i - 1].realOpenDate) {
        this.spanArr[this.pos] += 1
        this.spanArr.push(0)
      } else {
        this.spanArr.push(1)
        this.pos = i
      }
    }
  }
}
// 合并单元格
handleObjectSpanMethod({ row, column, rowIndex, columnIndex }) {
  if (columnIndex === 1) {
    const _row = this.spanArr[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
  if (columnIndex === 0) {
    const _row = this.spanArr[rowIndex]
    const _col = _row > 0 ? 1 : 0
    return {
      rowspan: _row,
      colspan: _col
    }
  }
}
```
