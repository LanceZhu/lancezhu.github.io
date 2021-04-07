---
title: docker cheatsheet
categories: cheatsheet
tags: cheatsheet
date: 2020-02-05 16:24:00
updated: 2021-04-07 16:24:00
---
# docker cheatsheet

## configuration

更换国内镜像源 - [中科大 docker 镜像源](https://lug.ustc.edu.cn/wiki/mirrors/help/docker)

## 镜像 image

``` bash
$ docker images # 查看本机镜像
$ docker pull ubuntu # 拉取镜像
$ docker rmi image_name # 删除镜像

$ docker run -it image_name /bin/bash # 交互式运行镜像，并进入 shell 环境， i interactive，t tty
$ docker run -d image_name # 后台以 daemon 形式运行。注意 docker 1号进程不能以 daemon 状态运行，应前台运行
```

``` bash
# 根据 Dockerfile 构建镜像
$ cat Dockerfile
FROM nginx:latest
RUN apt-get update
$ docker build -t docker-demo:v0.0.1 . # 在当前目录根据 Dockerfile 构建镜像， t tag
```

## 容器 container

``` bash
$ docker container ls # 查看本机容器
$ docker ps -all # 查看本机容器，包含 stopped container
$ docker exec -it container_id /bin/bash # 进入容器 shell ctrl+p+q 退出容器
$ docker stop container_id # 关闭容器
$ docker rm container_id
$ docker start container_id
$ docker logs container_id # 查看容器运行日志
```

##  集群管理

### docker-compose

```bash
$ docker-compose up -d # 在 docker-compose.yaml 同目录下运行，启动多个容器
$ docker-compose ps # 查看所有 container
$ docker-compose down # 停止 -rmi all 移除 images
```

