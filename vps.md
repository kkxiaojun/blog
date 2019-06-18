# 搭建vpn
## 购买vps
    可以通过paypal（注册绑定银行卡）付款，或者是支付宝微信（部分可以）
  1. [https://www.zhujiceping.com/](https://www.zhujiceping.com/)
  2. [https://my.vultr.com/subs/?SUBID=24326315](https://my.vultr.com/subs/?SUBID=24326315)
  3. [https://zhujiwiki.com/](https://zhujiwiki.com/)

## 建立客户端和vps服务器的连接
我是用[v2ray](https://github.com/v2ray/v2ray-core)
步骤：
1. 登录购买的vps服务器
2. 在买的vps服务器上安装，[https://github.com/Jrohy/multi-v2ray](https://github.com/Jrohy/multi-v2ray)，生成一串vmess信息
3. 在客户端安装[v2ray](https://github.com/v2ray/v2ray-core)
4. v2ray导入vmess
5. 启动即可使用

### 登录vps服务器
我用的是MobaXtermz这个软件

### vps上安装v2ray
```
    source <(curl -sL https://git.io/fNgqx)
    // 或者 bash <(curl -s -L https://git.io/v2ray.sh)，只是不同软件作用相同
```
安装完，执行`v2ray url` 生成的`vmess:....`脚本

ps:指令假设已在root权限下，如果不是，请先运行 sudo su

在本机v2ray客户端导入该脚本（菜单：服务器-从剪贴板导入批量url）

选中新建的，enter,即可连接，大功告成