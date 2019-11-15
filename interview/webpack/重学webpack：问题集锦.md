# 问题一：uglifyjs不支持es6语法问题

相关plugin
* `uglifyjs-webpack-plugin`
* `terser-webpack-plugin`

解决方案：<font color=red>用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题</font>

# 问题二：