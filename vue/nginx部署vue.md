# nginx部署vue-cli项目
vue-cli项目`npm run buil`后的nginx部署。运行`npm run build`后，找到dist目录

## 方法一
直接部署在根目录下，遗憾的是不能自由命名location后的访问路径
```
	location / {
		root   F:/pre-download-static/dist;
		index index.html;
	}
```
## 方法二
指定root，rewrite到index.html，可自由命名location后的访问路径
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
## 方法三
可自由命名location后的访问路径

1. 修改config/index.js配置文件, `assetsPublicPath`的值
    
    ```javascript
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
    ```

2. 修改build/webpack.prod.conf.js配置文件，`publicPath`的值

    ```javascript
        output: {
        publicPath: '/record-static/',
        path: config.build.assetsRoot,
        filename: utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
        },
    ```

3. 修改router.js文件，`base`的值
    ```javascript
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
ps: 不足之处望指出，有更好的建议请分享