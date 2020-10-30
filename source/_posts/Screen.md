---
title: Screen
categories: Linux
tags: 
date: 2018-03-18 15:29:00
updated: 2018-03-18 15:29:00
---
# Screen
## 主bash界面
```
screen -S screenname 指定窗口名便于管理
```
```
screen -d detach窗口
```
```
screen -r screenname 重连detached的窗口
```
```
screen -d -r screenname 连接到attached的窗口
```

---

## 进入虚拟窗口后 命令均已ctrl+a开始

```
ctrl+a d detach掉当前窗口
```
```
ctrl+a k kill掉当前窗口
```
```
ctrl+a s 锁住当前窗口，命令不可见，仍可执行
```
```
ctrl+a q 解锁当前窗口
```
```
ctrl+a w 查看窗口数
```
```
ctrl+a 0-9 窗口间快速跳转
```