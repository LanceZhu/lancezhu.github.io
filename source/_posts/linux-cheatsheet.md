---
title: Linux Cheatsheet
categories: Linux,cheatsheet
tags: cheatsheet,Linux
date: 2020-02-05 14:41:00
updated: 2020-10-30 16:12:00
---
# linux cheatsheet

## 远程访问

### ssh

``` bash
$ ssh-keygen // 生成 rsa 公私钥对
$ ssh-copy-id [-i 公钥文件] [远程主机地址] // 向远程主机添加公钥
$ ssh-agent
$ ssh-add
```

``` bash
$ cat ~/.ssh/config
Host blog
	HostName example.com
	User f00bar

ssh blog // 登录到 blog
```

#### reference

- https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client
- [ssh-agent 使用](https://blog.csdn.net/zhouguoqionghai/article/details/92134462)

## 网络管理

### netstat

``` shell
$ netstat -ntlp // 查看开放 tcp 端口及对应应用
```

### iptables

``` shell
$ iptables -F // 清除所有规则
```

## 磁盘管理

### df

``` bash
$ df -h // 查看磁盘信息
```

### du

```
$ du /home -h // 查看文件夹磁盘占用
```

##  进程管理

### top

``` bash
$ top // 查看 CPU 占用信息
$ htop // 信息显示更清晰
```

### ps

```bash
$ ps -ef
$ ps aux
```

### lsof

```bash
$ lsof // 查看开放文件
```

## 文本编辑

## 文本处理

### vi 或 vim
### awk
### grep

推荐 egrep，等价于 grep -E

grep 默认正则为基本正则即 BRE，egrep 默认正则为扩展正则即 ERE。

扩展正则相比于基本正则去掉了许多转义字符，方便使用。

### sed

## 软件管理

### 软件源

``` shell
# 编辑 /etc/apt/sources.list // 添加 Ubuntu 国内软件源
```

### 常用软件

#### 终端复用

- [tmux - terminal multiplexer](./tmux)
- screen

## shell

默认 `bash`，可执行文件 `bin/bash`

推荐 `zsh`，`zsh` 可安装 [`ohmyzsh`](https://github.com/ohmyzsh), `ohmyzsh` 提供了丰富的主题，突出显示终端中关键信息，自动补全功能强大。

### 基本语法

#### 变量:

```bash
# 变量声明及访问
$ name=bob # 定义变量 bob

$ echo $name
bob
$ echo ${name}
bob

# 命令替换
$ output=$(date) # date 命令的输出赋值给 output
$ echo $output
Sun Oct 18 09:09:12 CST 2020

$ output=`date`
$ echo $output
Sun Oct 18 09:09:27 CST 2020

# 数组
$ arr_number=(1 2 3) # 数字
$ echo ${arr_number[0]}
1
$ arr_nubmer[0]=4
$ echo ${arr_number[0]}
4

$ arr_string=('a' 'b' 'c')
$ echo ${arr_string[0]}

#!/bin.bash
# 遍历数组
for v in ${arr_nubmer[@]}; do
	echo $v;
done

```

#### 管道：

管道运算符：`|`，将上一步命令的输出传递给下一命令

```bash
# 管道将 find . 的标准输出作为标准输入传递给 egrep tmp
$ find . | egrep tmp # 列出当前文件夹内容，并查找名称包含 tmp 的文件
```



xargs

对于不接受标准输入作为参数的命令，可通过 xargs 将标准输出传递给命令行参数

```bash
$ ls *.txt | xargs rm # 删除当前文件夹下，后缀为 .txt 的文件
```

#### 重定向

重定向运算符：`>`、`>>`

```bash
# 执行命令，运行结果输出至 debug.log
$ ls . > debug.log # > 每次运行命令会对 debug.log 内容进行覆盖
$ ls . >> debug.log # >> 每次运行命令会将后续内容补充至 debug.log
```



标准输入：用户键盘输入

标准输出：命令正常运行的输出，标识符 1

标准错误：命令运行异常输出，标识符 2

```bash
$ non_exist_cmd 2>error.log # 标准错误输出值 error.log
$ non_exist_cmd 1>debug.log 2>&1 # 标准错误传递给标准输出，并将标准输出记录到 debug.log
```



tee

将标准输入同时输出至标准输出和文件

```bash
# 通过 tee，可以将某些耗时的命令输出同时输出至终端和文件
# 输出至终端可以试试查看运行进度，输出至文件用于记录和后续分析
$ find / -name 'tmp' | tee run.log
```
