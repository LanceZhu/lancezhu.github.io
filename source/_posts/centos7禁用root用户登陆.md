---
title: centos7禁用root用户登陆
categories: Linux
tags: 
date: 2018-01-20 12:43:00
---
**添加新用户**

`useradd test`
`passwd test`


**编辑配置文件/etc/ssh/sshd_config**

    PermitRootLogin no
    MaxAuthTries 6
**重启sshd服务**

    systemctl restart sshd.service