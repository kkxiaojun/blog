# 路由的两种实现方式

## hash
1. 通过a标签，设置href属性
```javascript
    <a href="#page1">page1</a>
```
2. 通过js直接设置`location.hash`
```javascript
    location.hash = '#page1'
```
```javascript
    window.onload = function () {
        function Router() {
            this.routes = {}; // 路由集合
            this.currentRouter = '';
        }
        // 添加路由
        Router.prototype.route = function (path, callback) {
            this.routes[path] = callback || function() {};
        }
        Router.prototype.refresh = function () {
            this.currentRouter = location.hash.replace(/#/, '/') || '';
            this.routes[this.currentRouter]();
        }
        Router.prototype.init = function () {
            window.addEventListener('load', this.refresh.bind(this), false);
            window.addEventListener('hashchange', this.refresh.bind(this), false);
        }
        var elem = document.querySelector('.wrapper');
        function changeColor(color) {
            elem.style.background = color;
        }
        var router = new Router(); 
        router.init();
        router.route('/page1', function (e) {
            changeColor('yellow')
        })

        router.route('/page2', function (e) {
            changeColor('red')
        })

        router.route('/page3', function (e) {
            changeColor('green')
        })
    }
```
## html5 history.pushState() popState
```javascript
    <p id="menu">
        <a href="/profile" title="profile">profile</a>
        <a href="/account" title="account">account</a>
    </p>
    <div class="main" id="main"></div>
    <script>
    ;(function(){
        var menubox = document.getElementById('menu');
        var mainbox = document.getElementById('main');
        
        menubox.addEventListener('click',function(e){
            e.preventDefault();
            var elm = e.target;
            var uri = elm.href;
            var tlt = elm.title;
            history.pushState({path:uri,title:tlt},null,uri);
            mainbox.innerHTML = 'current page is '+tlt;
        })
        window.addEventListener('popstate',function(e){
            var state = e.state;
            console.log(state);
            mainbox.innerHTML = 'current page is '+state.title; // 还原UI
        })
    })()
    </script>
```
## history模式的缺点
你刷新了之后浏览器就耿直的去请求服务器了，然而服务器没有这个路由，于是就404了。

解决方法：
1. 服务端增加一个覆盖所有情况的候选资源：如果 URL 匹配不到任何静态资源，则应该返回同一个 index.html
2. 可以做个代理，让所有访问服务器的地址都返回同一个入口文件
