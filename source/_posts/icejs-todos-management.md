---
title: icejs-todos-management
date: 2020-10-12 17:46:07
tags:
---
# 如何同时开发小程序+中后台应用(feat: icejs) - 后台管理系统篇

> 知乎：[使用 React + icejs 开发一个完整的 Todo 应用 - 后台系统篇](https://zhuanlan.zhihu.com/p/217929230)
语雀：[如何同时开发小程序+中后台应用(feat: icejs) - 后台管理系统篇](https://www.yuque.com/f00bar/bsa44q/qov20h)



> [icejs](https://ice.work/) 主要应用场景为开发中后台应用。但 icejs@1.7.0 版本开始支持[小程序开发](https://ice.work/docs/miniprogram/start) 。如果你想使用 React 同时开发中后台应用和小程序，那么 icejs 即可满足你。使用同一套技术体系，减少技术切换成本，提高研发效率。

## 介绍


本文将演示如何使用 icejs 构建 Todo 小程序 + 后台管理系统，同时包括相应服务端。


Todo 应用的功能或需求为：

- 小程序端：展示 Todo 列表，支持增删改查，以及同步数据到服务端。
- 后台管理系统：小程序用户信息和增删改查的管理系统。



整体的技术栈设计如下：

- **小程序 **
   - icejs 框架
   - universal-request 数据请求
- **后台管理系统**
   - icejs 框架
   - icejs build-plugin-ice-auth 插件，权限管理
   - fusion design UI 组件库
- **服务端** + **数据库**
   - eggjs 服务端框架
   - egg-sequelize + mysql2 用于 eggjs 连接 MySQL 数据库
   - MySQL 数据库
   - uuid 唯一 id 生成



因篇幅较长，如何同时开发小程序+中后台应用（feat: icejs）将分为三篇分别介绍。

- 小程序篇

使用 icejs 开发 Todo 小程序。

- 后台管理系统篇（本文）

使用 icejs 开发 Todo 小程序后台管理系统。

- 服务端篇

搭建服务 Todo 小程序及后台管理系统的服务端。
## 后台管理系统


> 项目代码见 [icejs-miniapp-admin/client](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/client)
> 后台管理系统基于 [icejs](https://ice.work/docs/guide/about)



后台管理系统实现对小程序内容的管理。


具体功能包括：


- 账户登录/登出
- 用户列表查看、查看某个用户所有代办事项（Todo）
- 代办事项列表查看、增删改查



### 项目初始化
#### 起步


创建文件夹存放后台管理系统代码


```bash
$ mkdir icejs-todos/client -p && cd icejs-todos/client
```


基于 React 模板 [Fusion Design Pro - JS](https://ice.work/scaffold) 创建项目
> 后台管理系统绝大部分内容基于该模板，可先尝试熟悉该模板。



```bash
$ npm init ice . @alifd/fusion-design-pro-js # 当前目录初始化项目
```


启动项目


```bash
$ npm install && npm run start

# 打开浏览器 http://localhost:3333 可看到项目正常启动
```


![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598520996962-f9a09e46-d343-4862-b277-51cd5be73f17.png#align=left&display=inline&height=900&margin=%5Bobject%20Object%5D&originHeight=900&originWidth=1890&status=done&style=none&width=1890)


#### 目录结构


```markdown
.
├── .ice                                // icejs 运行时临时目录
├── public
│   ├── favicon.png                     // favicon
│   └── index.html                      // 应用入口
├── src                                 // 源码目录
│   ├── components                      // 全局组件
│   │   ├── LocaleProvider              // 多语言
│   │   │   └── index.jsx
│   │   └── PageHeader                  // 页首
│   │       ├── index.jsx
│   │       └── index.module.scss
│   ├── layouts                         // 布局组件
│   │   ├── BasicLayout                 // 基本布局
│   │   │   ├── components
│   │   │   ├── index.jsx
│   │   │   └── menuConfig.js           // 侧边栏配置
│   │   └── UserLayout                  // 登录/注册页布局
│   │       ├── index.jsx
│   │       └── index.module.scss
│   ├── locales                         // 多语言
│   │   ├── en-US
│   │   │   └── index.js
│   │   └── zh-CN
│   │       └── index.js
│   ├── models                          // 全局状态
│   │   └── user.js
│   ├── pages                           // 页面组件 包含较多页面，此处省略
│   ├── utils                           // 工具函数
│   │   └── locale.js
│   ├── app.jsx                         // 应用入口
│   ├── global.scss                     // 全局样式
│   └── routes.js                       // 路由配置
├── .editorconfig
├── .eslintignore
├── .eslintrc.js
├── .gitignore
├── .prettierignore
├── .prettierrc.js
├── .stylelintignore
├── .stylelintrc.js
├── README.md                            // README
├── build.json                           // icejs 工程配置
├── jsconfig.json
├── package-lock.json
├── package.json
├── screenshot.png
└── tsconfig.json
```


### 页面编写


根据 Todo 应用需求对 Fusion Design Pro - JS 模板加以修改，编写相应页面，通过 API 接口与服务端交互。

调整目录结构：

- 删除 src/pages 未使用页面
- 添加用户管理页和代办事项页（基于 src/pages/FusionDialogTable）
- 修改基本页面布局组件 src/layouts/BasicLayout
- 添加数据请求文件夹 src/services



调整后的页面主要包括：

- 登录页 src/pages/Login

该页用于账户登录

- 首页 src/pages/Home

该页用于介绍后台管理系统

- 用户管理页：src/pages/Users
该页面实现用户的展示及查看用户所创建的 Todo。
- 代办事项页：src/pages/Todos
该页面提供对于 Todo 的增删改查操作。



调整后的目录结构如下：
```diff
  .
  ├── .ice
  ├── public
  │   ├── favicon.png
  │   └── index.html
  ├── src
  │   ├── components
  │   │   ├── LocaleProvider
  │   │   └── PageHeader
  │   ├── layouts
  │   │   ├── BasicLayout
  │   │   └── UserLayout
  │   ├── locales
  │   │   ├── en-US
  │   │   └── zh-CN
  │   ├── models
  │   │   └── user.js
  │   ├── pages                  // 移除无用页面，只保留 Home Login Register
  │   │   ├── Home
  │   │   ├── Login
  │   │   ├── Register
+ │   │   ├── Todos              // 代办事项页
+ │   │   └── Users              // 用户页
+ │   ├── services               // 数据请求
+ │   │   ├── auth.js            // 登录登出
+ │   │   ├── todos.js           // 代码事项
+ │   │   └── users.js           // 用户
  │   ├── utils
  │   │   └── locale.js
  │   ├── app.jsx
  │   ├── global.scss
  │   └── routes.js
  ├── .editorconfig
  ├── .eslintcache
  ├── .eslintignore
  ├── .eslintrc.js
  ├── .prettierignore
  ├── .prettierrc.js
  ├── .stylelintignore
  ├── .stylelintrc.js
  ├── README.md
  ├── build.json
  ├── jsconfig.json
  ├── package-lock.json
  ├── package.json
  └── tsconfig.json
```


UI 主要基于 Fusion Design Pro - JS 模板修改。故不在进行具体介绍。可直接查看项目代码。
可将 Todos、Users、Home 页从此处复制到本项目中，完成页面编写。

页面编写完成后，可配置对应路由和配置侧边栏
#### 路由配置
```javascript
// route.js
// 引入路由组件
import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login';
import BasicLayout from '@/layouts/BasicLayout';
import Home from '@/pages/Home';
import Users from '@/pages/Users';
import Todos from '@/pages/Todos';

const routerConfig = [
  {
    path: '/user',         // 配置路由
    component: UserLayout, // 配置路由对应组件
    children: [            // 配置子路由
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/home',
        component: Home,
      },
      {
        path: '/users/:openId',
        component: Todos,
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/todos',
        component: Todos
      },
      {
        path: '/',
        redirect: '/home',
      },
    ],
  },
];
export default routerConfig;
```
#### 侧边栏配置
侧边栏通过 menuConfig.js 进行配置
```javascript
// src/layouts/BasicLayout/menuConfig.js
const headerMenuConfig = [];
// 侧边栏配置
const asideMenuConfig = [
  {
    name: '首页',
    path: '/home',
    icon: 'chart-pie'
  },
  {
    name: '代办事项',
    path: '/todos',
    icon: 'calendar'
  },
  {
    name: '用户列表',
    path: '/users',
    icon: 'account'
  }
];
export { headerMenuConfig, asideMenuConfig };
```
到现在为止，页面编写已完成。此时还不能查看页面效果。各页面中有调用数据请求服务，下面需要添加数据请求。
### 数据请求


数据请求直接采用 icejs 中的[数据请求方案](https://ice.work/docs/guide/basic/request)。用户只需从 ice 中导出 request 模块即可发起数据请求。
即：
```javascript
import { request } from 'ice'; // 引入数据请求库

export default {
  // 发起 GET 请求
	async list () {
  	const res = await request.get('/todos');
    return res;
  },
  // 发起 POST 请求
  async del (id) {
  	const res = await request.post('/todos/del', {
      id
    })
    return res;
  }
}
```
#### service 编写
本项目中的数据请求主要包括


- 账户登录、登出
- 用户列表展示
- Todo 列表展示及增删改查



具体的逻辑在 src/services 中。


```markdown
src/services
├── auth.js   // 账户登录登出
├── todos.js  // Todo 列表查询及增删改查
└── users.js  // 用户列表查询
```
auth 包括获取用户角色，登录，登出
```javascript
import { request } from 'ice';

export default {
  // 获取用户角色
  async getRoles () {
    let roles = [];
    try {
      const res = await request.get('/auth/roles');
      roles = res.data.roles;
    } catch (err) {
      console.error(err);
    }
    return roles;
  },
  // 登录
  async login (data) {
    return await request.post('/auth/login', data)
  },
  // 登出
  async logout () {
    return await request.get('/auth/logout');
  }
}
```
users 包括用户列表的获取
```javascript
import { request } from 'ice';

export default {
  // 获取用户列表，支持分页查询
  async list({ current, pageSize }) {
    let data = {};
    try {
      const res = await request.get(`/users?current=${current}&size=${pageSize}`);
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  }
}

```
todos 包括查询 Todo 列表，及对 Todo 的增删改查
```jsx
import { request } from 'ice';

export default {
  // 根据分页数据及用户 id 查询 Todo 列表
  async list ({ current, pageSize, openId }) {
    let data = {};
    try {
      let URL = `/todos?current=${current}&size=${pageSize}`
      if (openId) {
        URL = `${URL}&openId=${openId}`
      }
      const res = await request.get(URL);
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  },
  // 为用户添加 Todo
  async add ({ content, openId }) {
    let data = {};
    try {
      const res = await request.post('/todos/add', {
        openId,
        content
      })
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  },
  // 根据 id 删除 Todo
  async del (id) {
    let data = {};
    try {
      const res = await request.get(`/todos/del/${id}`)
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  },
  // 编辑 Todo
  async edit (id, { openId, content }) {
    let data = {};
    try {
      const res = await request.post('/todos/edit', {
        id,
        openId,
        content
      })
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  },
  // 查看 Todo
  async view (id) {
    let data = {};
    try {
      const res = await request.get(`/todos/view/${id}`)
      data = res.data;
    } catch (err) {
      console.error(err);
    }
    return data;
  },
}
```


可对 request 请求进行全局配置，使各请求均以 /api 开头。编辑 src/app.jsx
```jsx
// src/app.jsx
const appConfig = {
  app: {
    rootId: 'ice-container',
    addProvider: ({ children }) => <LocaleProvider locale={locale}>{children}</LocaleProvider>,
  },
  // 配置 request
  request: {
    baseURL: '/api'
  }
};
```
此时运行项目查看效果
```bash
$ npm run start
```
![icejs8.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599104099586-e35c0a8b-7384-4deb-9dad-6c867635a0e4.png#align=left&display=inline&height=2079&margin=%5Bobject%20Object%5D&name=icejs8.png&originHeight=2079&originWidth=3874&size=450837&status=done&style=none&width=3874)
#### Mock 数据
此时数据均为空，service 发起的请求均为 404 not found。因具体的数据需要服务端支持，暂时可通过 mock 数据查看效果。
编辑 build.json 使得 request 指向 mock 服务 [https://easy-mock.bookset.io/mock/5f4f05642ff5d50508b3d21b/todos_mock](https://easy-mock.bookset.io/mock/5f4f05642ff5d50508b3d21b/todos_mock)
> 该 mock 服务只提供 Todo 及用户列表查询，Todo 增删改查无效。

```json
// build.json
{
	"proxy": {
    "/api": {
      "enable": true,
      "target": "https://easy-mock.bookset.io/mock/5f4f05642ff5d50508b3d21b/todos_mock"
    }
  }
}
```


查看效果
![icejs11.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599104513719-ac84fda3-8b1f-4c5d-8f84-3b59e52cd94f.png#align=left&display=inline&height=1984&margin=%5Bobject%20Object%5D&name=icejs11.png&originHeight=1984&originWidth=1920&size=171944&status=done&style=none&width=1920)
### 权限管理


只有登录用户才能访问用户管理页和 Todo 页，未登录用户应重定向到登录页。要实现该逻辑，需要对各页面设置权限。


权限管理主要通过 icejs 插件 [build-plugin-ice-auth](https://ice.work/docs/guide/advance/auth) 实现。


需要安装该插件


```bash
$ npm install build-plugin-ice-auth --save-dev
```


并配置


```json
// build.json
{
  "plugins": [
    "build-plugin-ice-auth"
  ]
}
```


#### 项目逻辑
在本项目中权限管理的逻辑主要包括：


1. [页面加载时从服务端获取权限数据](https://github.com/ice-lab/miniapp-admin/blob/master/client/src/app.jsx#L12)
```jsx
// app.jsx
import authService from '@/services/auth';

const appConfig = {
  app: {
    // 页面初始化时获取权限数据
    getInitialData: async () => {
      const roles = await authService.getRoles();
      return {
        auth: {
          roles
        }
      }
    }
    // ...
  }
};
```

2. 创建[权限管理组件](https://github.com/ice-lab/miniapp-admin/blob/master/client/src/components/Auth/index.jsx)，并[管理相应页面](https://github.com/ice-lab/miniapp-admin/blob/master/client/src/layouts/BasicLayout/index.jsx#L92)
权限管理组件 src/components/Auth
```jsx
// src/components/Auth/index.jsx
import React from 'react';
import { useAuth, Redirect } from 'ice';

const WrapperPage = (PageComponent) => {

  const WrappedPage = (props) => {
    const [auth] = useAuth();
    // 页面鉴权 根据权限进行页面跳转
    const needAuth = !auth.roles.includes('user');
    return (
      needAuth ? <Redirect to="/user/login" /> : <PageComponent {...props} />
    )
  };
  return WrappedPage;
};

export default WrapperPage;
```

3. 使用 Auth 组件管理 BasicLayout
```jsx
// src/layouts/BasicLayout/index.jsx
import Auth from '@/components/Auth';

// 具体布局组件
function BasicLayout(){
  return (
    // ... 省略逻辑
  )
}

// 使用 Auth 组件包装 BasicLayout
export default Auth(BasicLayout)
```

4. 添加登录/登出逻辑

从[后台管理系统代码](https://github.com/ice-lab/icejs-miniapp-admin/client)中复制相应页面
替换 src/pages/Login：接入登录接口
替换 src/layouts/BasicLayout：接入登出接口，更改UI

5. 运行项目查看效果
- 访问 [http://localhost:3333](http://localhost:3333/#/user/login) 跳转至 [http://localhost:3333/#/user/login](http://localhost:3333/#/user/login)
- 登录->首页

![icejs15.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599106556546-bd8421c8-8900-4934-8c4a-0f39bb83da70.png#align=left&display=inline&height=2079&margin=%5Bobject%20Object%5D&name=icejs15.png&originHeight=2079&originWidth=1917&size=257208&status=done&style=none&width=1917)

- 登出->登录页

![icejs16.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599106580084-e23119f8-0f77-49b1-956a-803061c6abec.png#align=left&display=inline&height=2079&margin=%5Bobject%20Object%5D&name=icejs16.png&originHeight=2079&originWidth=1918&size=265517&status=done&style=none&width=1918)
### 小结


本文介绍了后台管理系统的搭建。内容主要包括页面权限管理方案的实现，渲染通过数据请求获取到的数据。


Todo 的增删改查功能需要搭配服务端使用，该部分内容详见服务端篇。


后台管理系统代码见 [icejs-miniapp-admin/client](https://github.com/ice-lab/icejs-miniapp-admin/client)，可结合服务端 [icejs-miniapp-admin/server](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server) 一起运行查看效果。
## 推荐阅读


- [飞冰](https://ice.work/)
- [icejs 小程序官方文档](https://ice.work/docs/miniprogram/start)
- [Todos 小程序代码](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)
- [Todos 后台管理系统代码](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/client)
- [Todos 服务端代码](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server)
