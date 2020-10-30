---
title: 博客迁移
categories: 默认分类
tags: 
date: 2020-03-10 16:24:00
updated: 2020-03-10 16:24:00
---
# 博客迁移

[腾讯云 学生优惠服务器](https://cloud.tencent.com/act/campus) 将于 2020/7到期

腾讯云迁移至阿里云

---

## 迁移内容

- 博客 [typecho](http://typecho.org/)
- 图床 [chevereto](https://github.com/Chevereto/Chevereto-Free)

---

## 主机数据


### 系统级

```sh
top // 查看 CPU 内存占用
df // 查看磁盘占用
```

> CPU 平均占用率 3%
>
> 内存 总 1G 平均占用率 50%
>
> 磁盘 总 50G 占用 15G

### 应用级

```sh
ps // 查看进程 -aux  --sort=%mem --sort=%cpu
```

### 数据库

```sh
 mysqldump -u root -p database > database.sql // 备份
```

---

## 迁移过程

### 依赖安装

```sh
php-fpm // php fastcgi process manager
```

### 数据库

```sh
create user 'user'@'localhost' identified by 'password'; // 创建新用户
drop user 'username'@'localhost';
grant all privileges on `database`.* to 'user'@'localhost'; // 数据库授权
mysql -u user -p database < database.sql // 导入数据
```

### nginx

**nginx 配置支持 php**

```sh
location ~ .*\.(jpg|gif|png|bmp)$ {
                gzip on;
                gzip_http_version 1.1;
                gzip_comp_level 3;
                gzip_types text/plain application/json application/x-javascript application/css application/xml application/xml+rss text/javascript application/x-httpd-php image/jpeg image/gif image/png image/x-ms-bmp;
        }

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                #deal with fake static problems
                if (-f $request_filename/index.html){
                        rewrite (.*) $1/index.html break;
                }
                if (-f $request_filename/index.php){
                        rewrite (.*) $1/index.php;
                }
                if (!-f $request_filename){
                        rewrite (.*) /index.php;
                }
                try_files $uri $uri/ =404;


        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        location ~ \.php$ {
                include snippets/fastcgi-php.conf;
               # With php7.0-cgi alone:
        	   # fastcgi_pass 127.0.0.1:9000;
               # With php7.0-fpm:
                fastcgi_pass unix:/run/php/php7.0-fpm.sock;
        }
        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #       deny all;
        }
```
**fastcgi-php.conf**

```sh
# regex to split $uri to $fastcgi_script_name and $fastcgi_path
fastcgi_split_path_info ^(.+\.php)(/.+)$;

# Check that the PHP script exists before passing it
try_files $fastcgi_script_name =404;

# Bypass the fact that try_files resets $fastcgi_path_info
# see: http://trac.nginx.org/nginx/ticket/321
set $path_info $fastcgi_path_info;
fastcgi_param PATH_INFO $path_info;

fastcgi_index index.php;
include fastcgi.conf;
```
### typecho 主题、插件及上传内容

```sh
打包 typecho 中 usr 目录
usr
├── plugins
├── themes
└── uploads
```

### 推荐阅读

- [understanding and implementing fastcgi proxying in nginx](https://www.digitalocean.com/community/tutorials/understanding-and-implementing-fastcgi-proxying-in-nginx)
