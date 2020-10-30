---
title: DoH 和 DoT
categories: 默认分类
tags: DNS
date: 2019-10-05 18:24:00
updated: 2019-10-05 18:24:00
---
# DoH 和 DoT

## 基本概念

DNS(Domain Name Server)

DoH(DNS over HTTPS) 基于 HTTPS 和 HTTP2，使用端口443。协议标准 [RFC 7858](https://datatracker.ietf.org/doc/rfc7858/)、[RFC 8310](https://tools.ietf.org/html/rfc8310)

DoT(DNS over TLS) 基于 TCP，使用端口853。协议标准 [RFC 8484](https://tools.ietf.org/html/rfc8484)

DoH 和 DoT 均起到了加密 DNS 请求的作用。

## 使用

iOS：cloudflare 提供的 1.1.1.1

## 参考

- [A cartoon intro to DNS over HTTPS - Lin Clark](https://hacks.mozilla.org/2018/05/a-cartoon-intro-to-dns-over-https)