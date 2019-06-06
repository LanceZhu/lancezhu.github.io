---
title: Ubuntu日常使用记录
date: 2019-05-26 21:50:33
tags:
---

- 文件编码格式转换： `iconv`  
    ```
    iconv [OPTION...] [FILE...]
    iconv caption.srt -f gbk -t utf8 -o new-caption.srt // 将gbk格式字幕文件转为utf8
    ```
- 双系统下，ubuntu 不能写进 windows10 分区磁盘， 有写权限
  windows10 系统未正常关机，对磁盘进行写保护，重新正常关机即可