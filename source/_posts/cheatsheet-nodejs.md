---
title: node.js cheatsheet
categories: cheatsheet
tags: cheatsheet
date: 2020-02-05 17:47:00
updated: 2020-02-05 17:47:00
---
# 	Node.js cheatsheet

## 版本管理工具 nvm

- [nvm - node version manager](https://github.com/nvm-sh/nvm)

  ``` shell
  nvm install node // 安装最新版 node.js
  nvm install 6.14.4 // 安装指定版本
  nvm ls // 查看已安装所有版本
  nvm use 4.14.1 // 使用指定版本
  ```

  

## 包管理工具 npm & yarn

- **`npm(node program manager)`**

  Node.js 内置包管理工具。 官方网站 [npm](https://www.npmjs.com/)

  可进行 代码包 的下载及发布。

  **常用命令列表**

  ```shell
  npm config set registry https://registry.npm.taobao.org // 更换软件源为淘宝镜像
  
  npm init // 当前文件夹初始化为 npm 包
  
  npm view lodash // 查看指定包信息
  npm repo lodash // 查看指定包仓库地址
  npm docs lodash // 查看指定包文档
  
  npm install lodash // 安装指定包
  npm install --save-dev // 安装指定包 作为开发时依赖
  npm install -g lodash // 全局安装指定包
  npm install lodash --registry=https://registry.npm.taobao.org // 通过指定镜像安装指定包
  
  npm link local-package // 链接本地包，用于开发时调试
  ```

  

- **`yarn`**

  官方网站 [yarn](https://github.com/yarnpkg/yarn)

