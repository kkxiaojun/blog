# javascript纯前端导出excel表格（实用）
纯前端导出excel,在业务中是很经常见的。对于一些**没有分页要求**的表格，基本上可以由前端实现导出。

# 导出方法

导出步骤：
1. js获取需要导出的dom
2. 用Blob,将dom转为文件流
3. 用URL.createObjectURL生成url

```javascript
// 导出excel
function exportExcel() {
  // 获取table的html内容了，里面包括标签的class或id等。
  const dom = document.getElementById('sortTable').innerHTML

  // 这样做是为了让excel表格的样式完整
  const excelHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" 
  xmlns:x="urn:schemas-microsoft-com:office:excel" 
  xmlns="http://www.w3.org/TR/REC-html40">
  <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>学员阶段分析</x:Name>
    <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
    </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    </head><body><table>${dom}</table></body></html>`

  // 生成Excel
  const excelBlob = new Blob([excelHtml], {
    type: 'application/vnd.ms-excel'
  })
  // 通过a标签下载到本地了，下载前可以利用a标签的download属性命名
  const downloadObj = document.createElement('a')
  // 兼容firefox
  const isFirefox = navigator.userAgent.toUpperCase().indexOf('FIREFOX') !== -1
  if (isFirefox) {
    window.open(downloadObj, '_blank')
    return null
  }
  // 利用URL.createObjectURL()方法为a元素生成blob URL
  downloadObj.href = URL.createObjectURL(excelBlob)
  // 给文件命名
  downloadObj.download = '学员阶段分析.xls'
  downloadObj.click()
}
```