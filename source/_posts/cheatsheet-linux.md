---
title: Linux Cheatsheet
categories: Linux,cheatsheet
tags: cheatsheet,Linux
date: 2020-02-05 14:41:00
updated: 2020-11-24 18:33:00
---
# Linux Cheatsheet

本文记录了使用 Linux 操作系统进行软件开发时的常用操作。

## 远程访问

### ssh

``` bash
$ ssh-keygen # 生成 rsa 公私钥对
$ ssh-copy-id [-i 公钥文件] [远程主机地址] # 向远程主机添加公钥
$ ssh-agent
$ ssh-add
```

``` bash
$ cat ~/.ssh/config
Host blog
	HostName example.com
	User f00bar

$ ssh blog # 登录到 blog
```

#### ssh 远程登录保持连接不断开

```bash
$ ssh blog -o ServerAliveInterval=60 # 每60s发送心跳包
```

- https://www.digitalocean.com/community/tutorials/how-to-configure-custom-connection-options-for-your-ssh-client
- [ssh-agent 使用](https://blog.csdn.net/zhouguoqionghai/article/details/92134462)

### scp

```bash
$ scp file.txt user@ip:/home/user # 复制本机文件至远程主机
$ scp user@ip:/home/user/file.txt file.txt # 复制远程主机文件至本机
$ scp -r dir user@ip:/home/user # 复制本机文件夹至远程主机，-r recrusive 递归复制
```

## 网络管理

### netstat

``` bash
$ netstat -ntlp # 查看开放 tcp 端口及对应应用
```

### iptables

``` shell
$ iptables -F # 清除所有规则
```

## 磁盘管理

### df

``` bash
$ df -h # 查看磁盘信息
```

### du

```bash
$ du /home -h # 查看文件夹磁盘占用
```

##  进程管理

### top/htop

``` bash
$ top # 查看 CPU 占用信息
$ top -d 10 # 信息刷新时间为10s
$ htop # 信息显示更清晰
```

### ps

```bash
$ ps -ef
$ ps aux
```

### lsof

```bash
$ lsof # 查看开放文件
```

## 文本处理

### more/tail/less

### vi 或 vim
### awk
### grep

推荐 egrep，等价于 grep -E

grep 默认正则为基本正则即 BRE，egrep 默认正则为扩展正则即 ERE。

扩展正则相比于基本正则去掉了许多转义字符，方便使用。

### sed

## 软件管理

### 软件源

对于 Ubuntu，编辑 /etc/apt/sources.list，添加 Ubuntu 国内软件源：[阿里镜像源](https://developer.aliyun.com/mirror/ubuntu)、[清华镜像源](https://mirror.tuna.tsinghua.edu.cn/help/ubuntu/)

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

---

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

---

标准输入：用户键盘输入

标准输出：命令正常运行的输出，标识符 1

标准错误：命令运行异常输出，标识符 2

```bash
$ non_exist_cmd 2>error.log # 标准错误输出值 error.log
$ non_exist_cmd 1>debug.log 2>&1 # 标准错误传递给标准输出，并将标准输出记录到 debug.log
```

---

tee

将标准输入同时输出至标准输出和文件

```bash
# 通过 tee，可以将某些耗时的命令输出同时输出至终端和文件
# 输出至终端可以试试查看运行进度，输出至文件用于记录和后续分析
$ find / -name 'tmp' | tee run.log
```

#### 特殊变量

| 变量 | 含义                                    |
| ---- | --------------------------------------- |
| $#   | 参数数量                                |
| $$   | 当前进程号                              |
| $*   | 所有参数                                |
| $@   | 所有参数                                |
| $?   | shell 运行返回值（正常运行，返回值为0） |
| $0   | 运行文件名称                            |
| $1   | 第一个参数                              |

示例脚本如下

```bash
$ cat variables.sh # 程序内容
#/bin/bash
echo '$# 参数数量'： $#
echo '$$ 当前进程号：' $$
echo '$* 所有参数：' $*
echo '$@ 所有参数：' $@

test 1 -eq 1
echo '$? 1 == 1 返回值：' $?
test 1 -eq 2
echo '$? 1 == 2 返回值：' $?

echo '$0 文件名称：' $0
echo '$1 第一个参数：' $1

$ bash variables.sh hello world # 执行
$# 参数数量： 2
$$ 当前进程号： 4323
$* 所有参数： hello world
$@ 所有参数： hello world
$? 1 == 1 返回值： 0
$? 1 == 2 返回值： 1
$0 文件名称： variables.sh
$1 第一个参数： hello
```

#### 操作符

加减乘除：+ - * /

比较：

- 字符串比较

  ==

  !==

  [ -z $string ] 字符串长度为0

  [ -n $string ] 字符串长度非0

- 整数比较

  [ $num1 -eq $num2 ] 两数是否相等

  [ $num1 -ge $num2 ] num1 >= num2

  [ $num1 -le $num2 ] num1 <= num2

- 文件比较

  [ -f $file ] file 存在且为常规文件

  [ -d $file ] file 存在且为文件夹

  [ -e $file ] file 存在

#### 程序结构

if 条件结构

```bash
$ cat if.sh
if [ 1 -le 1 ]
then
        echo '1 == 1'
else
        echo '1 !== 1'
fi
$ bash if.sh
1 == 1
```

while 循环结构

```bash
$ cat while.sh
x=1
while [ $x -le 5 ]
do
        echo $x
        let x=$x+1
done
$ bash while.sh
1
2
3
4
5
```

for 循环结构

```bash
$ cat for.sh
for v in `seq 5`
do
        echo $v
done
$ bash for.sh
1
2
3
4
5
```

break: 跳出循环体

continue: 跳出当前循环

exit: 退出程序，后跟返回码 exit 1

#### 函数

函数定义及调用

```bash
$ cat function.sh
# 函数声明
func1() {
        echo 'parameters number: ' $#
        echo 'parameters: ' $*
        echo 'parameter 1: ' $1
        echo 'process id: ' $$
}

# 函数调用
func1 $*
$ bash function.sh 1 2
parameters number:  2
parameters:  1 2
parameter 1:  1
process id:  897
```
