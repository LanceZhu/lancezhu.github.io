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