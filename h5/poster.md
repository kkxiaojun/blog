# 实现H5制作海报
## 基本介绍
最终实现的需求是：
将海报模版与自己上传的照片进行合成并且贴上二维码，生成可长按保存的海报。

海报H5的基本功能：
1. 接入微信SDK
2. 上传照片、拍照
3. 裁剪图片
4. 将海报模板、二维码、上传的照片合成海报
5. 长按保存图片
## 方案选择
* **方案一：** 采用第三方的裁剪库[PhotoClip](https://github.com/baijunjie/PhotoClip.js?utm_source=recordnotfound.com),和canvas的`drawImage`进行合成

* **方案二：** 采用第三方的裁剪库[PhotoClip](https://github.com/baijunjie/PhotoClip.js?utm_source=recordnotfound.com),和`html2canvas`纯前端合成

方案选择：
1. 方案一：需要解决移动端图片失真问题严重，二维码需要后台贴
2. 方案二：可前端进行合成，图片还原度高

**小结：** `html2canvas`确实是目前实现网页保存为图片的综合选择。

## 实现步骤
### 1. 接入微信SDK
主要参考[官方文档](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421141115)

主要根据后台接口获取appId和signature，最后用`wx.config`获取所需接口的权限，比如：调用本地上传图片等

前端采用vue框架，所以直接`npm`引入`weixin-js-sdk`

### 2. 实现关键功能上传照片，进行裁剪，合成海报
最终采用的是方案二

**方案一**

采用第三方的裁剪库[PhotoClip](https://github.com/baijunjie/PhotoClip.js?utm_source=recordnotfound.com),和canvas的`drawImage`进行合成

* 在移动设备上双指捏合为缩放，双指转动为旋转
* 在PC设备上鼠标滚轮为缩放，每次双击则顺时针旋转90度

裁剪成功后，用`drawImage`合成海报

关键代码
```javascript
  // 解决移动端图片合成失真问题
  const ctx = this.canvas.getContext("2d");
  const dpr = this.getPixelRatio(ctx);
  var oldWidth = this.canvas.width;
  var oldHeight = this.canvas.height;
  this.canvas.style.width = oldWidth + 'px'; 
  this.canvas.style.height = oldHeight + 'px';
  this.canvas.width = oldWidth * dpr;
  this.canvas.height = oldHeight * dpr;
  ctx.scale(dpr, dpr);

  // 将两张图画进canvas
  ctx.drawImage(this.$refs.cropImg, 0, 0, 250, 400); // 裁剪后图片
  ctx.drawImage(this.$refs.postImg, 0, 0, 250, 400); // 海报模板

  // 合成后，将图片传给后台贴二维码
  this.canvas.toBlob(）

  // 获取dpr
  getPixelRatio: function(context) {
    let backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
```

```javascript
  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
      value: function(callback, type, quality) {
        var binStr = atob(this.toDataURL(type, quality).split(",")[1]),
          len = binStr.length,
          arr = new Uint8Array(len);

        for (var i = 0; i < len; i++) {
          arr[i] = binStr.charCodeAt(i);
        }

        callback(new Blob([arr], { type: type || "image/png" }));
      }
    });
  }
```
**方案二**
采用第三方的裁剪库[PhotoClip](https://github.com/baijunjie/PhotoClip.js?utm_source=recordnotfound.com),和`html2canvas`纯前端合成

裁剪后将模版图，裁剪图，和二维码一起通过`html2canvas`直接合成canvas即可

关键代码
```javascript
// 调用本地相册
<input type="file"  accept="image/*" capture="camera" size="30">
// accept="image/*;capture=camera" 直接调用相机
// accept="image/*" 调用相机 图片或者相册
```

```javascript
  // 初始化插件
  let pc = new PhotoClip('#top', {
    size: [250,444],
    outputSize: [750,1334],
    maxZoom : 3,
    outputQuality: 1,
    lrzOption:{quality:1},
    adaptive: ['60%', '80%'],
    // file: '#file',
    view: '#view',
    ok: '#clipBtn',
    //是否开启图片自由旋转
    rotateFree: true,
    img: 'img/mm.jpg',
    loadStart: function () {
    },
    loadComplete: function() {
      console.log('照片读取完成');
    },
    done: function(dataURL) {
      console.log('dataURL:', dataURL)
    },
    //剪裁失败
    fail: function (err) {
        //msg(err);
    },
    //图片加载失败
    loadError: function(err) {
      msg(err);	                	
    }					
  });
  // html2canvas合成
  html2canvas(document.querySelector("#img-box"),
    {
      scale: 6,
      width:  document.querySelector('.img-box').offsetWidth,
      heith:  document.querySelector('.img-box').offsetHeight,
    }).then(function(canvas){
      //生成海报，将图片追加进dom
      var img = new Image();
      img.src = canvas.toDataURL('image/jpg');
      img.style.maxHeight = '100%'
      img.style.maxWidth = '100%'
      img.onload = () => {
        document.querySelector('.create-poster').append(img)
        document.querySelector('#img-box').removeChild
      }
    })

```

## 踩坑记录
### 图片跨域

由于canvas对图片资源有**同源限制**
> 如果图片的服务器允许跨域访问这个图片，那么你可以使用这个图片而不污染canvas，否则，使用这个图片将会污染canvas。

解决方案：
1. 服务端将图片配置`Access-Control-Allow-Origin: *`
2. 设置`html2canvas`的`useCORS`[配置](http://html2canvas.hertzen.com/configuration)
3. 强制性跨域请求可使用`crossorigin=“anonymous”`属性

### drawImage图片失真
解决方案：根据`devicePixelRatio`对`canvas`进行操作

具体步骤：
1. `canvas`的`width`和`height`放大`devicePixelRatio`倍
2. `canvas.style.width`和`canvas.style.height`设置为原来大小
3. `canvas.scale(devicePixelRatio, devicePixelRatio)`进行缩放

具体代码
```javascript
  const ctx = this.canvas.getContext("2d");
  const dpr = this.getPixelRatio(ctx);
  var oldWidth = this.canvas.width;
  var oldHeight = this.canvas.height;
  this.canvas.style.width = oldWidth + 'px'; 
  this.canvas.style.height = oldHeight + 'px';
  this.canvas.width = oldWidth * dpr;
  this.canvas.height = oldHeight * dpr;
  ctx.scale(dpr, dpr);

  //进行图片合成
  ctx.drawImage(this.$refs.cropImg, 0, 0, 250, 400);
  ctx.drawImage(this.$refs.postImg, 0, 0, 250, 400);

  // dpr
  getPixelRatio: function(context) {
    let backingStore = context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio || 1;
    return (window.devicePixelRatio || 1) / backingStore;
  }
```
### 二维码图片的位置定位
问题： 如何让二维码图片在不同屏幕下都定位到正确的位置。

解决方法： 设为绝对定位，使用屏幕宽度作为基准设置 left、top 值。
```javascript
.qr-code {
    width: 10vw;
    position: absolute;
    left: 1vw;
    top: 2vw;
}
```

### `html2canvas`读取透明底png图片变为不透明
暂未解决

### html2canvas合成图的大小动态设置
由于移动端需要进行适配，所以需要动态获取宽高进行设置合成图的宽高

```javascript
  html2canvas(document.querySelector("#img-box"),
    {
      scale: 6,
      width: document.querySelector('#img-box').offsetWidth,
      heith: document.querySelector('#img-box').offsetHeight,
    }).then(function(canvas){
      //生成海报，将图片追加进dom
      var img = new Image();
      img.src = canvas.toDataURL('image/jpg');
      img.style.maxHeight = '100%'
      img.style.maxWidth = '100%'
      img.onload = () => {
        document.querySelector('.create-poster').append(img)
      }
    })

} 
```

## 总结 