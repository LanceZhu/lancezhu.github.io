---
title: centos7-ss
categories: Linux
tags: 
date: 2018-01-18 20:47:00
---
# centos7-ss

## server

centos上利用python安装ss

 ```shell
$ yum install python-setuptools && easy_install pip
$ pip install shadowsocks
 ```

建立配置文件

```shell
$ vi /etc/shadowsocks.json
```

添加配置信息

```json
// shadowsocks.json
{
    "server":"my_server_ip",#"::"同时监听ipv4和ipv6
    "server_port":8388,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"mypassword",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```


打开ss配置中的端口

```shell
$ firewall-cmd --zone=public --add-port=8388/tcp --permanent
```
## client

 - [windows][1]
 - [Android][2]
 - [iOS][3]

## 服务器推荐

vps 使用的 vultr 家的机子:[购买链接][4]
vps IP 被墙:重装，新分配 IP 可破

[1]: https://github.com/shadowsocks/shadowsocks-windows/releases
[2]: https://github.com/shadowsocks/shadowsocks-android/releases
[3]: https://github.com/shadowsocks/shadowsocks-iOS/releases
[4]: https://www.vultr.com/?ref=7308456

