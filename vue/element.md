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