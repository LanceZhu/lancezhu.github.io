---
title: docker cheatsheet
categories: cheatsheet
tags: 
date: 2020-02-05 16:24:00
---
# docker cheatsheet

## configuration

更换国内镜像源 - [中科大 docker 镜像源](https://lug.ustc.edu.cn/wiki/mirrors/help/docker)

## 镜像 image

``` shell
docker images // 查看本机镜像
docker pull ubuntu // 拉取镜像
docker rmi image_name // 删除镜像
docker run -it image_name /bin/bash // 交互式运行镜像，并进入 shell 环境， i interactive，t tty
```

``` ...shell
根据 Dockerfile 构建镜像
.Dockerfile
FROM nginx:latest
...
RUN ...
docker build -t docker-demo:v0.0.1 . // 在当前目录根据 Dockerfile 构建镜像， t tag
```

## 容器 container

``` shell
docker container ls // 查看本机容器
```

##  集群管理