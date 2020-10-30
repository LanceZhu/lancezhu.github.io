---
title: ssh 访问日志分析
categories: Linux
tags: SSH,Linux
date: 2020-08-01 13:31:00
updated: 2020-08-01 13:31:00
---

# SSH 访问日志分析

## 前言

本科毕业，[腾讯云 + 校园](https://cloud.tencent.com/act/campus) 学生认证身份过期，无法享用之前每月仅需一元的优惠，[博客迁移](blog-migration) 至 [阿里云](https://promotion.aliyun.com/ntms/act/campus2018.html?userCode=zxog1qrs&tag=share_component&share_source=copy_link)。之前有看到过对服务器 `SSH`日志分析的一篇文章，故也想做些类似的分析。

## 分析内容

`SSH` 访问数据

- [x] 访问日志总量
- [x] 用户名 top10
- [x] 访问 IP top10
- [ ] 访问 IP 分布，借助[纯真数据库](https://github.com/animalize/qqwry-python3)
- [ ] ~~访问时间分布~~

## 具体分析

> 本部分比较混乱，可不看，结论见 `分析结果`。

#### 未清洗数据

```sh
// 统计所有日志文件及文件行数
$ ls | xargs wc -l | awk '{print $2, $1}'

auth.log 70039
auth.log-201905101557440703 444627
auth.log-201905231558563904 419331
auth.log-201906071559859904 417979
auth.log-201906241561328703 412512
auth.log-201907041562192703 415592
auth.log-201907171563315904 426805
auth.log-201907271564179903 422477
auth.log-201908081565216703 405232
auth.log-201908211566339904 408350
auth.log-201909061567722303 426589
auth.log-201909171568672705 400635
auth.log-201910021569968703 390301
auth.log-201910141571005504 393317
auth.log-201910261572042303 414514
auth.log-201911031572733505 401419
auth.log-201911171573943103 410552
auth.log-201911301575066303 420348
auth.log-201912071575671103 423932
auth.log-201912121576103103 395790
auth.log-201912181576621504 453579
auth.log-201912271577399104 403452
auth.log-202001081578435903 469772
auth.log-202001211579559103 399332
auth.log-202002061580941504 409619
auth.log-202003041583274305 390374
total 10446469
```

```sh
// 统计文件大小
$ ls -l | awk 'BEGIN {sum=0} NR!=1 {sum+=$5; print $9, $5} END {print "total " sum " " sum/1024/1024 "M"}'
auth.log 7235504
auth.log-201905101557440703 46798951
auth.log-201905231558563904 42868529
auth.log-201906071559859904 42887760
auth.log-201906241561328703 43018812
auth.log-201907041562192703 43343508
auth.log-201907171563315904 44048692
auth.log-201907271564179903 43478168
auth.log-201908081565216703 42309178
auth.log-201908211566339904 42010693
auth.log-201909061567722303 45996353
auth.log-201909171568672705 42921548
auth.log-201910021569968703 42086718
auth.log-201910141571005504 42284091
auth.log-201910261572042303 44426083
auth.log-201911031572733505 43654955
auth.log-201911171573943103 43578151
auth.log-201911301575066303 44902797
auth.log-201912071575671103 45356384
auth.log-201912121576103103 41986986
auth.log-201912181576621504 48834325
auth.log-201912271577399104 42789719
auth.log-202001081578435903 49508107
auth.log-202001211579559103 42864190
auth.log-202002061580941504 44967557
auth.log-202003041583274305 41996783
total 1106154542 1054.91M
```

#### 清洗数据

**合并文件**

```sh
$ ls | awk '/^auth.log*/' | xargs cat >> total.log
```

**筛选无效登录**

```sh
$ grep 'Failed' total.log > failed_auth/total.log
```

**统计数据量**

```sh
$ wc -l failed_auth/total.log
1977438 failed_auth/total.log
```

筛选无效登录

```sh
$ grep 'invalid' failed_auth/total.log > failed_auth/failed.log
```

**统计无效用户名**

```sh
$ wc -l failed_auth/invalid.log
870098 failed_auth/invalid.log
```

```sh
$ cat failed_auth/invalid.log | awk '{print $11}' | sort -r | uniq -c | sort -rn | head -10
  59789 admin
  19975 test
  10894 user
   9207 oracle
   7733 guest
   7318 postgres
   5374 git
   5089 ubnt
   4851 nagios
   4473 support
```

```sh
  10691 45.136.108.85
   9469 43.248.189.33
   6728 95.110.201.243
   4232 139.217.230.232
   4187 45.141.86.128
   3139 193.105.134.96
   3128 103.82.28.2
   3032 185.153.199.155
   2987 185.153.199.125
   2889 109.89.51.159
```

**统计有效用户名**

```sh
$ grep -v 'invalid' failed_auth/total.log > failed_auth/valid.log
```

```sh
$ wc -l failed_auth/valid.log
1107340 failed_auth/valid.log
```

```sh
$ grep -v 'repeated' failed_auth/valid.log > failed_auth/valid_without_repeated_message.log
```

```sh
$ wc -l failed_auth/valid_without_repeated_message.log
1041122 failed_auth/valid_without_repeated_message.log 
```

```sh
$ cat failed_auth/valid_without_repeated_message.log | awk '{print $11}' | sort -r | uniq -c | sort -rn | head -10
  40537 139.198.122.90
  32721 139.198.17.33
  25118 43.248.189.33
  23543 139.198.13.87
  23540 139.219.236.62
  23536 139.199.132.175
  23528 139.199.19.153
  22029 139.217.233.36
  19751 139.219.3.80
  14781 139.198.18.152
```

## 分析结果

**日志基本数据**

- 时间：2019/05 - 2020/03

- 大小：1.1G

- 数据量：
  - 10446469 条

**用户名 top10**

统计访问日志中登录失败用户名 top10。

```shell
admin
test
user
oracle
guest
postgres
git
ubnt
nagios
support
```

**访问 IP top10**

统计访问日志中登录失败对应 IP top10.

```shell
139.198.122.90
139.198.17.33
43.248.189.33
139.198.13.87
139.219.236.62
139.199.132.175
139.199.19.153
139.217.233.36
139.219.3.80
139.198.18.152
```

## 推荐阅读

- [打造高效的工作环境 – SHELL 篇](https://coolshell.cn/articles/19219.html)