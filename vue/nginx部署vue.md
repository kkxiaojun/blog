# vue-download 项目总结
1. Vue 项目打包后favicon无法正常显示问题，v-for必须加上 track by，否则容易导致增删不更新view
 **将favicon置于static文件下即可**
## vue-cli构建的项目在nginx中的配置运行`npm run build`后，找到dist目录

1. 方法一
```
	location / {
		root   F:/CMTTrackDRUI/Resources/Web/pre-download-static/dist;
		index index.html;
	}
```
2. 方法二
```
server {
    listen       8089;
    server_name  localhost;
	root E:/git/pre-download-static/dist;
    #charset koi8-r;
    #access_log  logs/host.access.log  main;
	# rewrite index
	location /abc {
		try_files $uri $uri/ @router;
		#需要指向下面的@router否则会出现vue的路由在nginx中刷新出现404
		index index.html;
	}
    #对应上面的@router，主要原因是路由的路径资源并不是一个真实的路径，所以无法找到具体的文件
    #因此需要rewrite到index.html中，然后交给路由在处理请求资源
	location @router {
		rewrite ^.*$ /index.html last;
	}
}
```
3. 方法三
    1. 修改config/index.js配置文件
        ```
        module.exports = {
         dev: {
        // Paths
        assetsSubDirectory: 'static',
        assetsPublicPath: '/record-static/',
        proxyTable: {
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true
          }
        },
        ``
    2. 修改build/webpack.prod.conf.js配置文件
        ```
          output: {
            publicPath: '/record-static/',
            path: config.build.assetsRoot,
            filename: utils.assetsPath('js/[name].[chunkhash].js'),
            chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
          },
        ```
    3. 修改router.js文件
        ```
        export default new Router({
            base: '/record-static/',
        })
        ```
    4. ngnix配置
        ```
		location /record-static {
			alias E:/git/pre-download-static/dist;
			try_files $uri $uri/ record-static/index.html;
		}
        ```
```

```
## 销毁setInterval
```
created() {
	this.timer = setInterval(() => {
	    this.getDownLoadList()
    }, 3000)
}
beforeDestroy() {
	clearInterval(this.timer)
},
```
## 在添加keep-alive后会增加两个生命周期mounted>activated、离开时执行deactivated，路由的进入和切换回相应的触发`activated`和`deactivated`，这样就可以在每次入路由执行更细致的操作了
```
//如果是服务端渲染就算了
activated() {
    //只刷新数据，不改变整体的缓存
    this.fetchDate();
 }
```
## router的监听
```
methods:{
    getPath(){}
}
watch: {
    '$route': 'getPath'
}
```
## vue-router传参
```
使用 this.$router.push({name: '', params: {}}),避免参数显示在url中
```
## element问题
1. table刷新数据，保留checkbox选中
```
:row-key="getKey"
data() {
    return {
    	getKey: function(row) {
    		return row.szMagicId
    	}
    }
}
// 取消所选checkbox
this.$refs.multipleTable.clearSelection()
```

2. 用了element使用按键修饰符需要加上.native

比如：@keyup.enter.native
## static与asset
在项目结构中我们有两个静态资产目录：src/assets和static/
`src/assets`,需要经过webpack编译
`static/`，不经过webpack编译
```