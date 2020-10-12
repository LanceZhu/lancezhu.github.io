---
title: Java-cheatsheet
date: 2020-10-12 17:42:14
tags:
---
# Java

## Download

[java se](https://www.oracle.com/java/technologies/javase-downloads.html)

## Installation

```bash
$ tar -zxvf jdk.tar.gz   // 解压

$ mkdir /usr/java
$ cp jdk /usr/java -r    // 移动至安装目录

$ sudo vim /etc/profile // 配置环境变量
# or
$ sudo vim ~/.zshrc

# /etc/profile or ~/.zshrc
# export JAVA_HOME=/usr/java/jdk
# export JRE_HOME=$JAVA_HOME/jre
# export PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin

java // 安装验证
```

## 包管理

### Maven

#### Download

[maven apache](https://maven.apache.org/download.cgi)

#### Installation

```bash
# 安装方式为 tar.gz 压缩包形式
$ tar -zxvf apache-maven.tar.gz // 解压

$ mkdir /usr/maven
$ cp apache-maven /usr/maven -r    // 移动至安装目录

$ sudo vim /etc/profile // 配置环境变量
# or
$ sudo vim ~/.zshrc

# /etc/profile or ~/.zshrc
# export MAVEN_HOME=/usr/maven/apache-maven
# export PATH=$PATH:$MAVEN_HOME/bin

mvn -V // 安装验证
```

---

```bash
# Ubuntu openjdk
$ sudo apt install default-jre
java --version
$ sudo apt install default-jdk
javac --version
```

#### 换源

```bash
$ sudo vim $MAVEN_HOME/conf/setting.xml
```

添加 阿里云 源

```diff
<mirrors>
+  <mirror>
+    <id>nexus-aliyun</id>
+    <mirrorOf>central</mirrorOf>
+    <name>Nexus aliyun</name>
+    <url>http://maven.aliyun.com/nexus/content/groups/public</url>
+  </mirror>
<mirrors>
```

## Tomcat

[官网](https://tomcat.apache.org/)
