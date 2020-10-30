---
title: Vue 笔记
categories: Web 前端
tags: 
date: 2019-11-19 19:29:00
updated: 2019-11-19 19:29:00
---
# Vue 笔记

`vue` 一个组件化、响应式的前端框架

[官网](https://vuejs.org)  [GitHub](https://github.com/vuejs/vue)

## 介绍

不同于直接在 `.html` 文件中编写页面相关代码，`vue` 框架使得开发者以组件化的形式组织代码，增强代码的复用性。

编写的 `.vue` 代码再通过 [`babel`](https://babeljs.io/) 编译工具生成 `javascript`，[`eslint`](https://eslint.org/) 格式化代码，使用 [`webpack`](https://webpack.js.org/) 打包工具优化代码，自动化生成最终可部署的代码。

Tips: 

1. 前端路由。不同于在浏览器中输入链接就向后端请求对应的资源文件，`vue` 利用浏览器不会在 ` https://example.com/#/...` # 符号变化后发起网络请求的特性，将路由控制权交由开发者编写的  `javascript` 代码，从而实现 # 符号后面不同路径渲染不同页面，发起相应的网络请求。
2. 单页面应用(Single Page Application)。通过引入前端路由实现在单一页面内渲染不同业务组件。

## 开始上手

可通过两种方式使用 `vue`

1. 在 `.html` 文件中直接通过 `script` 标签引入 `vue` 运行时

2. 通过 `vue-cli` 脚手架生成项目文件结构

   ```shell
   npm install vue-cli // 通过 npm 包管理工具安装脚手架
   vue-cli create vue-demo // 通过脚手架生成项目文件
   // 修改相应文件实现不同逻辑
   npm run serve // 启动开发环境
   npm run build // 生成可部署的代码
   ```

   

## 相关资源

- [Element UI 前端组件库](https://element.eleme.cn/)
- [vue-quill-editor 在线编辑器](https://github.com/surmon-china/vue-quill-editor)


