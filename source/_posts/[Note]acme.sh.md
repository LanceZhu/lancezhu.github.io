---
title: [Note]acme.sh
categories: 默认分类
tags: Linux,Web,en
date: 2020-05-14 18:02:00
updated: 2020-05-14 18:02:00
---
# [acme.sh](https://github.com/acmesh-official/acme.sh)

## About

[acme.sh](https://github.com/acmesh-official/acme.sh). A pure Unix shell script implementing ACME client protocol.

acme.sh issue a [Let's Encrypt](https://letsencrypt.org/) certificate for you. See [How Let's Encrypt works](https://letsencrypt.org/how-it-works/).

## Usage

### Nginx + [Cloudflare](https://www.cloudflare.com/)

#### Prerequisites

A domain & use Cloudflare nameserver

#### Install acme.sh

`curl https://get.acme.sh | sh`

#### Configure

dns api

```shell
export CF_Key="sdfsdfsdfljlbjkljlkjsdfoiwje"
export CF_Email="xxxx@sss.com"
````

#### Issue cert

```shell
acme.sh --issue --dns dns_cf -d f00bar.cn -d '*.f00bar.cn'
```

#### Install cert

```shell
acme.sh --install-cert -d f00bar.cn --cert-file /etc/nginx/ssl/f00bar.cer --key-file /etc/nginx/ssl/f00bar.key --fullchain-file /etc/nginx/ssl/fullchain.cer --reloadcmd "service nginx force-reload"
```

#### Other

**Renew**

```acme.sh  --renew-all```

**Add cron job**

```acme.sh --install-cronjob```

**Add alias**

```alias acme.sh="~/.acme.sh/acme.sh"```
