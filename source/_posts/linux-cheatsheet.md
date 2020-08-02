---
title: Linux Cheatsheet
categories: Linux,cheatsheet
tags: cheatsheet,Linux
date: 2020-02-05 14:41:00
---
# linux cheatsheet

## 远程访问

### ssh

``` shell
ssh-keygen // 生成 rsa 公私钥对
ssh-copy-id [-i 公钥文件] [远程主机地址] // 向远程主机添加公钥
ssh-agent
ssh-add
```

``` shell
// ~/.ssh/config
Host blog
	HostName example.com
	User f00bar

ssh blog // 登录到 blog
```

- [centos7 禁用 root 用户登录](centos7禁用root用户登陆.md)
- [centos7-ss](centos7-ss)

#### reference

- https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client
- [ssh-agent 使用](https://blog.csdn.net/zhouguoqionghai/article/details/92134462)

## 网络管理

### netstat

``` shell
netstat -ntlp // 查看开放 tcp 端口及对应应用
```

### iptables

``` shell
iptables -F // 清除所有规则
```



## 磁盘管理

### df

``` shell
df -h // 人类可读方式显示磁盘信息
```

##  进程管理

### top

``` shell
top // 查看 CPU 占用信息
```

### a

```shell
lsof // 查看开放文件
```

## 文本编辑

## 文本处理

### vi 或 vim
### awk
### grep
### sed

## 软件管理

### 软件源

``` shell
编辑 /etc/apt/sources.list // 添加 Ubuntu 国内软件源
```

### 常用软件

#### 终端复用

- [tmux - terminal multiplexer](tmux)
- [Screen](Screen)

### RSS

- [tt-rss](tt-rss)

### Torrent

- [transmission](transmission)

## 编程语言

### Node.js

- [nodejs cheatsheet](node.js-cheatsheet)

### Python

- [pip3 换源](pip2-换源)

## 硬件

- [树莓派](树莓派)