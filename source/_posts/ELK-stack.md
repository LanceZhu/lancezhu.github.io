---
title: ELK-stack
date: 2020-10-12 17:48:22
tags:
---
# [Note] ELK Stack(Elasticsearch、Logstash、Kibana)

## 前言

ELK Stack 由 **E**lasticSearch、**L**ogstash、**K**ibana 组成，分别用来处理日志的检索、收集及可视化。本文的契机是为了替代原有的正则匹配字符串的检索方式，优化全文检索的效果。下面介绍 ELK 的安装及基本使用（以 MySQL 为数据源，使用 Logstash 导入至 ElasticSearch，最终通过 Kibana 验证查询效果）

## 基本要求

推荐硬件配置：内存 4G

## ELK Stack

以下安装适用于 Ubuntu 等 Debian 系操作系统。

### Elasticsearch

[**download**](https://www.elastic.co/guide/en/elasticsearch/reference/7.9/deb.html)

**配置软件源+安装依赖**

```bash
$ wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -
$ sudo apt-get install apt-transport-https
$ echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list
```

**安装 Elasticsearch**

```bash
$ sudo apt-get update && sudo apt-get install elasticsearch
$ sudo systemctl start elasticsearch.service
$ curl -X 'GET' 'http://localhost:9200' # 验证安装、启动是否成功
```

### Logstash

[**download**](https://www.elastic.co/guide/en/logstash/7.9/installing-logstash.html)

```bash
$ sudo apt-get update && sudo apt-get install logstash
$ cd /usr/share/logstash/bin
$ sudo chmod 777 -R /usr/share/logstash/data
$ bash logstash -f mp-analyzer-debug-list.conf # -f 选择配置文件
```

#### Mysql 输入插件

默认安装，可通过以下操作进行验证

```bash
$ cd /usr/share/logstash/bin
$ bash logstash-plugin list # 查看所有插件
$ bash logstash-plugin list | grep logstash-input-jdbc
```

**jdbc(Java database connector)**

用于连接 MySQL

[**download**](https://dev.mysql.com/downloads/connector/j/)

#### Elasticsearch 输出插件

默认安装，可通过以下操作进行验证

```bash
$ cd /usr/share/logstash/bin
$ bash logstash-plugin list # 查看所有插件
$ bash logstash-plugin list | grep logstash-output-elasticsearch
logstash-output-elasticsearch
```

#### kibana

[**download**](https://www.elastic.co/guide/en/kibana/7.9/deb.html)

```bash
$ sudo apt-get update && sudo apt-get install kibana
$ sudo systemctl start kibana
$ open http://localhost:5601 # 打开浏览器查看
```

## 基本使用

MySQL 作为数据源，使用 Logstash 导入至 Elasticsearch，并通过 kibana 可视化查询，验证查询效果

### 启动 ELK

```bash
# 直接启动 elasticsearch
$ sudo systemctl start elasticsearch.service

# 配置文件指定 MySQL、jdbc及输出格式
$ cd /usr/share/logstash/bin
$ bash logstash -f mp-analyzer-debug-list.conf # -f 选择配置文件，mp-analyzer-debug-list.conf 内容见下文

# 直接启动 kibana
$ sudo systemctl start kibana
$ open http://localhost:5601 # 打开浏览器查看
```

### 配置 ELK

#### logstash

mp-analyzer-debug-list.conf

```markdown
input {
  jdbc {
    jdbc_driver_library => "/home/ubuntu/projects/mysql-connector-java/mysql-connector-java-8.0.21/mysql-connector-java-8.0.21.jar"
    jdbc_driver_class => "com.mysql.jdbc.Driver"
    jdbc_connection_string => "jdbc:mysql://your_server_ip:3306/database"
    jdbc_user => "user"
    jdbc_password => "password"
    schedule => "* * * * *"
    statement => "SELECT * FROM movies WHERE id >= 0"
    use_column_value => true
    tracking_column_type => "numeric"
    tracking_column => "id"
    last_run_metadata_path => "syncpoint_table"
  }
}

output {
  elasticsearch {
    hosts => ["127.0.0.1"]
    index => "debug-list"
    document_id => "%{id}"
  }
}

```
