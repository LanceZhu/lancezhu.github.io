---
title: Web开发工程质量保障
date: 2022-05-17 10:41:58
updated: 2022-05-21 10:41:58
tags:
---

# Web开发工程质量保障

> 本文根据个人实践总结了一些提高 Web 开发交付质量可复用的模块。

> 主要涉及到的技术领域为前端开发、后端开发。

> 主要涉及到的编程语言：JavaScript、Node.js、Golang、Python。

## 保证编码质量

Web前端开发最常用的编程语言为JavaScript，其作为一种弱类型语言，具有高度的灵活性。在带来编码灵活性的同时，也带来了维护和协作上的复杂度。为了提升编码质量，可通过统一代码风格、引入类型系统和合理抽象代码逻辑的方式进行保障。

### 统一代码风格

在多人协作的项目中，每个人代码风格各有不同，如在行尾加或不加`;`，这势必造成协作上的不协调。为了解决这一问题可引入[Eslint][Eslint]格式化代码。

Eslint通过设置各种规则来统一代码格式，如不能出现连续空行、每行长度不可过长等限制。将各种规则汇总起来便构成一种代码风格。Eslint中比较流行的有 [Airbnb][Airbnb_JavaScript]、[standard][standard_JavaScript]。Airbnb相比于stanard限制程度更高。

以下示例中，eslint提示对常量`num`重新赋值。
```shell
$ cat index.js
const num = 1
num = 2
$ eslint index.js

index.js
  2:1  error  'num' is constant                         no-const-assign
  2:1  error  'num' is assigned a value but never used  no-unused-vars

✖ 2 problems (2 errors, 0 warnings)
```

### 引入类型系统

JavaScript是一种弱类型语言，即某个变量的类型在运行过程中是可变的。

```javascript
let num = 1
num = '1' // 正常运行
```

弱类型提高了编码的灵活性，但也容易导致预期外的错误。

```javascript
1 == '1'
// 预期输出：false
// 实际输出：true
// 原因：未校验类型
```

为了解决这一问题，可通过引入类型系统，使用[TypeScript][TypeScript]。

以下示例TypeScript检测出类型错误。

```shell
$ cat index.ts 
type User = {
  name: string
}

let user1: User = {
  age: 18
}
$ tsc index.ts
index.ts:6:3 - error TS2322: Type '{ age: number; }' is not assignable to type 'User'.
  Object literal may only specify known properties, and 'age' does not exist in type 'User'.

6   age: 18
    ~~~~~~~


Found 1 error in index.ts:6
```

### 合理抽象代码逻辑

当业务逻辑变得复杂时，代码量增加，代码容易产生冗余和逻辑杂乱。此时可依据设计模式对代码逻辑合理抽象。

如Vue.js中实现数据在视图层和逻辑层的双向绑定便使用了观察者模式、后端维护单一的数据库连接即为单例模式、函数的编写应参考SOLID原则，做到单一职责、开闭原则等。

## 错误处理

程序在运行过程中不可避免的会产生错误，需要对可预期的错误做好处理，根据业务逻辑选择是否停止运行和对使用者的提示。

在Web开发中，HTTP接口调用随处可见，前端提交表单，后端根据表单处理业务逻辑返回数据给前端。

在这一过程中，可预期的错误有：

前端：后端接口出错（返回码非200）、后端接口正常但提交表单不符合业务逻辑（用户名格式不符合要求）、网络错误（断网）。

后端：前端提交表单不符合业务逻辑（缺少字段，字段格式不对）、依赖的其他服务出错（MySQL、Redis等）。

对于以上可预期的错误均需做好应对，并对用户提示。如后端遇到前端提交表单不符合业务逻辑的情形，需要将捕获到的错误对前端返回并退出之后的逻辑处理。

## 配置管理

在软件的研发至上线过程中一般存在本地开发、上线测试环境、上线生产环境三个阶段。

不同的环境下MySQL、Redis等服务往往需要不同的配置。

首先要做的是区别不同的环境，这一任务可通过配置环境变量实现，

```shell
$ cat .env
NODE_ENV='prod' # 生产环境
```

并根据不同的环境使用对应的配置，配置可放在环境变量中或者独立的配置文件中。

## 日志记录

软件上线后，在运行过程中产生的错误没有日志记录的话难以定位和调试。日志的存在也帮助理解用户对于软件的使用方式，方便之后的升级优化。

同时日志应注意分级记录（error、info等），不同级别方便日志筛选，错误排查。

## 可用性及并发性

要保障软件的可用性，一是要提高软件本身的可靠性，尽可能做到自检、出现错误可自行重启恢复，二是对于软件自身不可恢复的情形下，做好告警，第一时间可通知到负责人进行检修。

软件上线时应预估可能的用户量，确保具备足够的承载能力，对于软件中资源消耗严重的部分（计算密集、IO密集）做好优化。

[Eslint]: https://eslint.org/
[Airbnb_JavaScript]: https://github.com/airbnb/javascript/
[standard_JavaScript]: https://github.com/standard/standard
[TypeScript]: https://www.typescriptlang.org/