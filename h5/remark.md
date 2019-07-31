# nginx缓存
微信入口文件缓存
```
location / {

add_header Cache-Control no-cache;

add_header Expires 0;

}
```
