---
title: wsl
date: 2020-05-10 19:43:46
tags:
---

# wsl

Details: [wsl - Windows Subsystem Linux](https://docs.microsoft.com/en-us/windows/wsl/about)

## Issues

**nginx + php5.6-fpm timeout**

walkaround: set `fastcgi_buffering: off` in nginx conf.

- [GitHub issue](https://github.com/Microsoft/WSL/issues/393#issuecomment-442498519)
- [fastcgi_buffering doc](https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html#fastcgi_buffering)

