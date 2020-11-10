---
title: Chrome 浏览器插件推荐
categories: Software
tags: 插件,Chrome
date: 2019-03-15 18:45:00
updated: 2020-11-10 18:45:00
---
# Chrome 浏览器插件推荐

随着互联网的发展，各种服务均以 Web 网站的形式出现，浏览器承载起越来越多的功能。搜索、视频浏览、文章阅读等等，浏览器成为日常办公、学习过程中不可或缺的一个工具。

本文将介绍几个浏览器插件，增强浏览器功能，提高使用效率。

> 插件适用于 Chrome 浏览器，或以 Chromium 为内核的其他浏览器，如搜狗浏览器、360浏览器。
>
> 插件均通过 Chrome 网上应用商店下载。

## 通用类

以下插件使用时间基本均大于1年，且高频使用，强烈推荐。

### Tampermonkey

油猴脚本。增强网站功能。	

该插件通过注入 JavaScript 代码的方式，对网站进行修改，功能强大。用户可安装自己编写或他人共享的代码，来增强网站功能，如移除广告、破解视频网站会员限制、修改页面 UI等。

脚本代码库：[https://www.tampermonkey.net/scripts.php](https://www.tampermonkey.net/scripts.php)。

### The Great Suspender

页面管理器。减少内存占用。

经常打开十几甚至几十个页面的人会发现 Chrome 高额的内存占用率，几百 MB 至几个 GB 不等。大量的内存占用导致浏览器本身甚至电脑的卡顿。这一插件就很好的解决了这一问题。该插件可自动对长时间未浏览的 Tab 页进行锁定，从而减少内存占用。

插件锁定长时间未访问页面：

![the-great-suspender](https://i.loli.net/2020/11/10/UYclJgHKTX8vdpE.png)

### Vimium

浏览器中的 Vim。使用键盘操作页面，摆脱鼠标，提高效率。

Vim 是 Linux 操作系统中的一个文本编辑神器。在 Vim 中，文本的各种编辑操作，增删改查、复制粘贴、跳转等全都可以通过键盘操作。 该插件使得对浏览器的操作获得和 Vim 中一致的体验。如果之前未使用过 Vim 的话，可能不适应使用快捷键操作页面，但熟练后效率肯定有所提升。

常用快捷键：

- `h j k l`可分别实现左右标签的切换，页面的上下滚动
- `gg` 连续两次按 `g` 键实现快速跳转至页面头部；`G` 快速跳转至页面结尾
- `F` 显示页面中可访问的链接，并以字符编码显示，输入对应字符即可访问对应链接
- `x` 关闭当前页面；`X` 重新打开刚关闭的页面
- `q`页面回退；`w` 页面前进
- `r` 刷新页面
- `/` 页面内搜索指定关键词，右下角出现输入框，可输入字符串进行搜索

对于其他高频操作，可绑定自定义快捷键。

使用插件查看当前页面可访问链接：

![image-20201110163811922.png](https://i.loli.net/2020/11/10/IRHGTx8Bz5YjbuS.png)

### Bitwarden

密码管理。

各种需要注册的网站越来越多，为了安全性，应避免对多个网站使用同一个密码。而对于每个网站均使用不同的密码又容易遗忘。

bitwarden 正好可以解决这一问题。bitwarden 可以用来生成、存储密码，并可根据当前访问网站的链接进行匹配，自动填充。

相比于 LastPass 和 1Password，bitwarden 为一款开源软件，允许用户自行部署服务器存储密码库，安全性更高。

而且，除了 Chrome 插件外，bitwarden 在主流平台上均有发行版。在移动端（iOS/Android）、桌面端（Windows/macOS/Linux）都可使用 bitwarden，获得相同的使用体验。

bitwarden 密码生成：

![bitwarden](https://i.loli.net/2020/11/10/IRXKgntaefEcTkq.png)

### Anything to QRcode

网页链接生成二维码。

对于电脑端打开的网页，有时有事无法继续查看，可通过该插件将对应的网站链接生成二维码后使用手机扫码后继续访问。

![image.png](https://i.loli.net/2020/11/10/u6mhOcMosIfkViS.png)

### 有道词典Chrome划词插件

划词翻译。

阅读英文文章时遇到生词时，可直接通过鼠标选中对应词触发插件翻译，省去在翻译软件里输出的步骤，方便快捷。

## 软件开发

### Octotree

辅助浏览 GitHub 仓库。

GitHub 在软件开发时会经常用到。然而在 GitHub 上浏览代码时非常不方便，GitHub 不提供仓库文件结构浏览，查看嵌套层级深的文件只能一级一级的跳转。该插件将代码仓库的文件结构在侧边栏显示出来，方便浏览。

插件生成代码库文件结构树（左侧）：

![octotree](https://i.loli.net/2020/11/10/I1mheStDVzZTROC.png)

### JSONView

解析网页直接返回的 JSON 格式数据，美化显示。

未使用插件：JSON 内容直接按行排列，无法直接看出相应字段。

未使用插件

![not-use-jsonview](https://i.loli.net/2020/11/10/CrKBdDlH4FyQaA8.png)

使用插件后：JSON 格式化输出，清晰显示字段名称。

![use-jsonview](https://i.loli.net/2020/11/10/Y2ycuGaxhOSRtpI.png)

## 其他

一些其他工具类插件。

### Wappalyzer

分析当前网站所使用到的技术。

### FireShot

网页截屏。

可选择截取页面可见部分，整个页面或手动剪裁，并可输出为多种格式。

### Shodan

网站信息查看。https://www.shodan.io/ 网站插件版。

分析当前网站 IP，开放端口，可能存在漏洞等。

### AutoPagerize

自动分页。

对于存在多个分页的页面，该插件可以使多个页面的结果汇总至首页，如将 bing 搜索结果汇总后省去手动翻页操作。
