1. 在setting.json里做全局配置
```javascript
  {
      "code-runner.runInTerminal": true,
      "editor.fontSize": 19,
    "files.autoSave": "off",
    "eslint.autoFixOnSave": true,  //  启用保存时自动修复,默认只支持.js文件
  "eslint.validate": [
      "javascript",  //  用eslint的规则检测js文件
      {
        "language": "vue",   // 检测vue文件
        "autoFix": true   //  为vue文件开启保存自动修复的功能
      },
      {
        "language": "html",
        "autoFix": true
      },
    ],
    "diffEditor.renderSideBySide": true,
    "eslint.run": "onSave",
  }
```
2. 或者是配置package.json
```javascript
    "scripts": {
    "lint": "eslint --fix --ext .js,.vue src",
    }
```
`npm run lint`修复全部格式问题