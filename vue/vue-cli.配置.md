# 增加预发布环境的两种配置方法
## 方法一 采用新建构建配置webpack.preprod.env.js
```javascript
  //全部配置新建
```

## 方法二 采用npm 参数配置 `process.env.npm_config_argv`
```javascript
let env = ''
if (JSON.parse(process.env.npm_config_argv).remain[0] === 'crmDev') {
  env = require('../config/dev.env')
} else {
  env = require('../config/test.env')
}

```
