---
title: icejs-todos-server
date: 2020-10-12 17:46:39
updated: 2020-10-12 17:46:39
tags:
---
# 如何同时开发小程序+中后台应用(feat: icejs) - 服务端篇

> 知乎：[使用 React + icejs 开发一个完整的 Todo 应用 - 服务端篇](https://zhuanlan.zhihu.com/p/217932764)
语雀：[如何同时开发小程序+中后台应用(feat: icejs) - 服务端篇](https://www.yuque.com/f00bar/bsa44q/pt2tsh)


> [icejs](https://ice.work/) 主要应用场景为开发中后台应用。但 icejs@1.7.0 版本开始支持[小程序开发](https://ice.work/docs/miniprogram/start)。如果你想使用 React 同时开发中后台应用和小程序，那么 icejs 即可满足你。使用同一套技术体系，减少技术切换成本，提高研发效率。

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

- 后台管理系统篇

使用 icejs 开发 Todo 小程序后台管理系统。

- 服务端篇（本文）

搭建服务 Todo 小程序及后台管理系统的服务端。
## 服务端


> 项目代码见 [icejs-miniapp-admin/server](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server)
> 服务端基于 eggjs，详细文档参考[官网](https://eggjs.org/)



### 项目初始化


首先创建文件夹用于存放服务端代码


```bash
$ mkdir icejs-todos/server -p && cd icejs-todos/server
```


使用脚手架生成项目


```bash
$ npm init egg --type=simple
```


启动项目


```bash
$ npm install && npm run dev

# 浏览器打开 http://localhost:7001 可看到项目正常启动
```


![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598521003072-d6f23f24-2bff-4222-b240-7ef2e0559590.png#align=left&display=inline&height=1031&margin=%5Bobject%20Object%5D&originHeight=1031&originWidth=1927&status=done&style=none&width=1927)


### 数据库


下面设计数据表结构。数据库采用 MySQL 5.7。


> 可通过 [icejs-miniapp-admin#db/sql](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server/config/db/sql) 建库、建表、导入数据。



#### 创建数据库


首先连接 MySQL 数据库。


```bash
# 以 root 用户身份登录，密码在运行命令后按照提示输入
$ mysql -u root -p
```


连接到 MySQL 数据库后，在 MySQL 终端中通过以下命令，创建 icejs_todos 数据库。


```mysql
create database icejs_todos;
```


通过


```mysql
show databases;
```


查看所有数据库。


![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598521003846-722656db-7b93-4ee0-a149-edba4e7a031b.png#align=left&display=inline&height=175&margin=%5Bobject%20Object%5D&originHeight=175&originWidth=238&status=done&style=none&width=238)


#### 创建用户


创建 icejs_todos 用户并配置相应权限以管理数据。


```mysql
create user 'icejs_todos'@'%' identified by 'icejs_todos';
grant all privileges on icejs_todos.* to 'icejs_todos'@'%';
flush privileges;
```


在之后的数据库创建的操作中，切换为 icejs_todos 用户。
#### 创建数据表


本应用涉及三个实体：


- 管理员 admin
- 用户 users
- 代办事项 todos



分别对应三个表


![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598521004341-5923f3c1-b023-4816-89b9-171e0f4bc3a6.png#align=left&display=inline&height=186&margin=%5Bobject%20Object%5D&originHeight=186&originWidth=253&status=done&style=none&width=253)


admin 对应后台管理系统管理员


users 对应小程序用户


todos 对应代办事项


其中 users 与 todos 存在一对多关系，即一个用户对应多个 todo。


各表字段结构为


**admin**

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| id | int(11) | 管理员 id |
| username | varchar(63) | 管理员 用户名 |
| password | varchar(63) | 管理员密码 |



**users**

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| openId | varchar(45) | 用户 id，通过微信小程序认证获取 |
| username | varchar(45) | 用户名 |



**todos**

| 字段 | 类型 | 描述 |
| --- | --- | --- |
| id | varchar(45) | todo id |
| content | json | todo 内容 |
| openId | varchar(45) | 对应 users 表中的 openId |



可通过以下命令创建数据表：


```jsx
use icejs_todos; -- 选择数据库

CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(63) NOT NULL DEFAULT '' COMMENT '管理员名称',
  `password` varchar(63) NOT NULL DEFAULT '' COMMENT '管理员密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='管理员';

CREATE TABLE `todos` (
  `id` varchar(45) NOT NULL,
  `content` json DEFAULT NULL COMMENT 'TODO 内容',
  `openId` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='TODO 列表';

CREATE TABLE `users` (
  `openId` varchar(45) NOT NULL COMMENT '微信小程序 用户 openid',
  `username` varchar(45) DEFAULT '' COMMENT '用户名',
  PRIMARY KEY (`openId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户列表';
```


可通过 desc table_name 命令查看表字段


```mysql
desc admin; -- 查看 admin
```


![mysql-desc.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598862229820-6259535d-12bb-4865-8bc6-d0a241d484d0.png#align=left&display=inline&height=189&margin=%5Bobject%20Object%5D&name=mysql-desc.png&originHeight=189&originWidth=616&size=10780&status=done&style=none&width=616)
#### 添加数据
添加管理员
```sql
INSERT INTO `admin` VALUES (1,'user','password'); -- 管理员用户名：user 密码：password
```
添加测试 Todo
```sql
INSERT INTO `todos` VALUES ('14624e16-ba83-4fac-acb0-474502d0d18d','{\"text\": \"Learning ES2016\", \"completed\": true}','1'),('1e7158d5-c687-4a11-9a62-755e35a88491','{\"text\": \"Learning 小程序\", \"completed\": false}','1'),('f111d741-294b-44a2-8200-9f9b805fd9d2','{\"text\": \"Learning Javascript\", \"completed\": true}','1');
```
添加测试用户
```sql
INSERT INTO `users` VALUES ('1','测试用户1'),('2','测试用户2');
```
#### 管理数据库
可通过 [MySQL Workbench](https://www.mysql.com/products/workbench/) 管理数据库。
连接数据库
![server5.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599113402608-33d8a2e8-7e48-4d36-bb9c-c5cf322bb982.png#align=left&display=inline&height=1031&margin=%5Bobject%20Object%5D&name=server5.png&originHeight=1031&originWidth=1915&size=196824&status=done&style=none&width=1915)
查看数据表及表内容
![server6.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599113627138-ace00ace-aacc-41c6-8289-62ba702cc76e.png#align=left&display=inline&height=1028&margin=%5Bobject%20Object%5D&name=server6.png&originHeight=1028&originWidth=1918&size=234355&status=done&style=none&width=1918)
### 连接数据库


通过 egg-sequelize、mysql2 连接 MySQL 数据库。


#### 安装所需依赖


```bash
$ npm install --save egg-sequelize mysql2
```


#### 配置 egg-sequelize


- 首先启用 egg-sequelize 插件，即在 config/plugin.js 中配置
```javascript
// config/plugin.js
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  }
};
```

- 并在配置 egg-sequelize 以连接到 MySQL
```javascript
// config/config.default.js
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // ...

  // 配置 sequelize
  config.sequelize = {
    dialect: 'mysql',        // 所用数据库为 MySQL
    host: 'localhost',       // 连接配置
    port: 3306,
    username: 'icejs_todos',
    password: 'icejs_todos',
    database: 'icejs_todos',
    define: {
      freezeTableName: true,  // 保持数据库中表名不变，避免 admin 变为 admins
    }
  }

  // ...
};
```


#### 连接示例
下面以查询数据库中的所有 todos 为例演示如何查询数据。即访问 [http://localhost:3001/api/todos](http://localhost:3001/api/todos) 路由查看所有 todos。


1. 为 todos 表建立 model
建立 app/model/todos.js 文件，实现 model Todos 与 MySQL 数据表 todos 的对应。
```javascript
// app/model/todos.js
module.exports = app => {
  const { STRING } = app.Sequelize;

  const Todos = app.model.define('todos', {
    id: { type: STRING(45), primaryKey: true, allowNull: false },
    content: JSON,
    openId: STRING(45),
  }, {
    timestamps: false,
  });

  return Todos;
};
```

2. 具体查询
建立 app/controller/admin/todos.js 文件，通过 Todos model 查询相应数据，并添加到返回体中。
```javascript
// app/controller/admin/todos.js
const Controller = require('egg').Controller;

class TodosController extends Controller {
  async list() {
    const { ctx, app } = this;

    // 查询所有 todos
    const res = await app.model.Todos.findAndCountAll();

    // 添加到返回体上
    ctx.body = {
      code: 1000,
      data: {
        total: res.count,
        list: res.rows,
      },
    };
  }
}

module.exports = TodosController;
```

2. 添加路由 /api/todos 实现访问该路由返回所有 Todos 数据。
```javascript
// app/router.js
const ROUTER_PREFIX = '/api';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  
  // ...

  // todos 路由 /api/todos
  router.get(`${ROUTER_PREFIX}/todos`, controller.admin.todos.list);
};
```

2. 启动项目，查看效果

启动服务端
```bash
$ npm run dev
```
浏览器访问 [http://localhost:7001/api/todos](http://localhost:7001/api/todos) 可看到所有 Todos。
    ![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598861614362-e3ba787b-bd1a-4bc3-9b4d-95fcb13c3736.png#align=left&display=inline&height=1026&margin=%5Bobject%20Object%5D&originHeight=1026&originWidth=1920&status=done&style=none&width=1920)
### 账户管理
#### 后台管理系统
功能包括账户的登录/登出与对用户请求的权限验证。


**登录/登出**


首先添加 admin Model，实现到数据库表 admin 的映射。Controller 中可调用该 model 查询或添加管理员。
```javascript
// app/model/admin.js
'use strict';

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Admin = app.model.define('admin', {
    id: { type: INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    username: STRING(63),
    password: STRING(63),
  }, {
    timestamps: false,
  });

  return Admin;
};
```
配置 session，标识用户账户状态（登录态/登出态）
```javascript
// app/config/config.default.js
module.exports = appInfo => {
  // ...
  
  // disable csrf 避免前端跨域发起 POST 请求时，请求被拦截
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // session
  const authKey = 'icejs-todos';
  config.session = {
    key: authKey,
    maxAge: 24 * 3600 * 1000, // 有效期 1 天
    httpOnly: true,
    encrypt: true,            // 加密
  };
  
  // session auth key
  config.authKey = authKey;
  
  // ...
};

```
添加 controller 处理登录/登出逻辑
```javascript
// app/controller/admin/auth.js
'use strict';

const Controller = require('egg').Controller;

class AuthController extends Controller {
  async login() {
    const { ctx, app } = this;
    const { authKey } = app.config;
    const formData = ctx.request.body;
    const { name, password } = formData; // 获取用户名及密码

    // 查询用户是否存在
    const user = await app.model.Admin.findAll({
      where: {
        username: name,
        password,
      },
    });

    let code = 2000;

    if (user.length) {
      code = 1000;
      // 通过 session 保存登录状态
      ctx.session.auth = authKey;
    }

    ctx.body = {
      code,
    };
  }

  async logout() {
    const { ctx } = this;
    ctx.body = {
      code: 1000,
    };
    // 登出后清除登录状态
    ctx.session.auth = null;
  }
}

module.exports = AuthController;

```
配置路由，前端可通过 API 进行登录和登出
```javascript
'use strict';

const ROUTER_PREFIX = '/api';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // ############### admin #############
  // auth
  router.post(`${ROUTER_PREFIX}/auth/login`, controller.admin.auth.login);
  router.get(`${ROUTER_PREFIX}/auth/logout`, controller.admin.auth.logout);
  
  // ...
};
```
此时后台管理系统登录登出功能已完成。


**鉴权**


对于某些操作需要对用户进行鉴权，如添加 Todo（/api/todos/add）。
鉴权可通过中间件 middleware 的形式。
```javascript
// app/middleware/auth.js
module.exports = (options = {}) => {
  const { authKey } = options;
  return async function(ctx, next) {
    const auth = ctx.session.auth;
    // 根据 session 鉴权
    if (auth === authKey) {
      await next();
    } else {
      ctx.body = {
        code: 2000,
        msg: 'auth fail',
      };
      return;
    }
  };
};
```
对需要鉴权的操作启用该中间件
```javascript
// app/router.js
'use strict';

const ROUTER_PREFIX = '/api';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const authMiddleware = middleware.auth({
    authKey: app.config.authKey,
  });

  // /api/todos/add 路由启用 authMiddleware
  // 此处未编写 controller.admin.todos.add，仅做示例说明，可自行添加。
  router.post(`${ROUTER_PREFIX}/todos/add`, authMiddleware, controller.admin.todos.add);
};

```
后台管理系统的账户管理功能已完成。
主要使用情形包括：

- 前端发起登录请求（用户名，密码）->服务端验证用户信息->验证通过->返回登录凭证（session）
- 前端发起登出请求->服务端删除登录凭证（session）
- 前端访问需登录接口->服务端验证登录信息（session）->验证通过->返回数据
#### 小程序
小程序的登录凭证为 openId，从微信开放数据中获取。
具体逻辑为：
```javascript
// app/controller/miniapp/auth.js
'use strict';

const Controller = require('egg').Controller;

// 获取 openId
// https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
async function code2Session(ctx, { appId, appSecret, code, grantType = 'authorization_code' }) {
  const URL = 'https://api.weixin.qq.com/sns/jscode2session';
  const result = await ctx.curl(`${URL}?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=${grantType}`, {
    dataType: 'json',
  });
  return result.data;
}

class AuthController extends Controller {
  async login() {
    const { ctx, app } = this;
    const formData = ctx.request.body;
    const { code } = formData; // code 在小程序端通过 wx.login 获取

    const { appId, appSecret } = app.config.miniapp;

    const session = await code2Session(ctx, {
      appId,
      appSecret,
      code,
    });

    const { openid: openId } = session;

    // openId 保存至数据库
    await app.model.Users.findOrCreate({
      where: {
        openId,
      },
    });

    ctx.body = {
      code: 1000,
      data: {
        openId,
      },
    };
  }
}

module.exports = AuthController;
```
添加路由
```javascript
// app/router.js
'use strict';

const ROUTER_PREFIX = '/api';
const MINIAPP_PREFIX = '/mp';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // ############### miniapp #############
  // auth
  router.post(`${ROUTER_PREFIX}${MINIAPP_PREFIX}/auth/login`, controller.miniapp.auth.login);
  
  // ...
};

```
小程序的账户管理逻辑完成。
主要使用情形有：

- 用户发起登录请求（code wx.login 获取）-> 服务端获取 openId，并返回
- 用户发起操作请求（携带 openId）->服务端执行操作（依据 openId）
### API 设计


分别为后台管理系统和小程序设置不同 API 路由。
后台管理系统 API 前缀为  `/api`
小程序 API 前缀为 `/api/mp` 


#### API 路由列表

- 后台管理系统
   - `/api/auth/roles` 获取用户权限
   - `/api/auth/login` 登录
   - `/api/auth/logout` 登出
   - `/api/users` 获取用户列表
   - `/api/todos` 获取 Todo 列表
   - `/api/todos/add` 添加 Todo
   - `/api/todo/edit` 编辑 Todo
   - `/api/todo/del/:id` 删除 Todo
   - `/api/todo/view/:id` 查看 Todo
- 小程序
   - `/api/mp/auth/login` 登录
   - `/api/mp/todos` 获取 Todo 列表
   - `/api/mp/todos/add` 添加 Todo
   - `/api/mp/todo/edit` 编辑 Todo
   - `/api/mp/todo/del/:id` 删除 Todo
   - `/api/mp/todo/view/:id` 查看 Todo
   - `/api/mp/user/edit` 更改用户信息

![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598861644202-bc0e8bee-43fc-4f75-ad1b-78af4151dc98.png#align=left&display=inline&height=769&margin=%5Bobject%20Object%5D&originHeight=769&originWidth=949&status=done&style=none&width=949)


#### API 实现
连接数据库-连接示例小节介绍了 `/api/todos` 获取 Todo 列表的逻辑；账户管理小节介绍了 `/api/auth/login`
、 `/api/auth/logout` 及 `/api/mp/auth/login` 的逻辑。
其余 API 与以上所介绍内容类似，不再详细介绍。可查看 [icejs-miniapp-admin#/controller](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server/app/controller)
### 前后端联调
当服务端完成后，便可使用真实后端接口替换小程序篇及后台管理系统篇开发时使用的 Mock 接口。
#### 小程序
以获取 Todo 列表为例

- 修改 todos service
```javascript
// src/services/todos.js
import request from 'universal-request';

// 替换原有 mock 接口
const URL_PREFIX = 'http://localhost:7001/api/mp';

// // 此处为 mock 接口，仅包含查询固定 todos 列表。其他功能如对小程序的增删改查需要服务端
// const URL_PREFIX = 'https://easy-mock.bookset.io/mock/5f4f05642ff5d50508b3d21b/todos_mock'

export default {
  async list ({ openId }) {
    let todos = [];
    try {
      const URL = `${URL_PREFIX}/todos?openId=${openId}`;
      const res = await request({
        url: URL
      });
      todos = res.data.data.todos;
    } catch (err) {
      console.error(err);
    }
    return todos;
  }
};
```

- todos 页面中调用
```jsx
// src/pages/todos/index.jsx
+ import todosService from '@/services/todos'; // 引入 todos service

const Todos = () => {
  // ...
  // lifecycle function
  // usePageShow 函数修改如下
  usePageShow(async () => {
    // 通过数据请求获取 Todos 数据
    const openId = '1'; // 此处省略 openId 获取逻辑
    const todos = await todosService.list(openId);
    setTodos(todos);
  })

  return (
    // 渲染 todos
  );
};
```
Todo 的增删改查逻辑与获取 Todo 列表类似。可直接查看
#### 后台管理系统
后台管理系统篇已将各接口及调用逻辑编写完整，只需编辑 build.json 将接口地址指向服务端即可
```json
// build.json
{
  "proxy": {
    "/api": {
      "enable": true,
      "target": "http://localhost:7001"
    }
  }
}
```
### 小结


服务端已完成。数据存储在 MySQL 数据库中，前端应用可通过 API 接口与后端交互。


本文介绍了服务端的开发，主要包括数据库的设计及具体使用；账户系统的设计及实现；整体 API 的设计。


项目代码见 [icejs-miniapp-admin/server](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server)。
## 结语


到此为止，如何同时开发小程序+中后台应用（feat: icejs）内容已全部完成。


通过三篇文章

- 小程序篇
- 后台管理系统篇
- 服务端篇

进行说明。


以开发一个 Todo 小程序及后台管理系统为例，并提供相应的服务端，演示了如何使用 icejs 同时开发小程序和中后台应用。


项目代码包括：


- 小程序 [miniprogram-materials/scaffolds/todos](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)
- 后台管理系统 [icejs-miniapp-admin/client](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/client)
- 服务端 [icejs-miniapp-admin/server](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server)



文章中未详细描述的内容可直接查看以上代码。也可运行上述代码查看效果。


小程序已发布，可微信搜索** icejs todos 示例** 或直接扫描下方小程序码体验。


> 因微信小程序限制，个人主体无法发布备忘录性质小程序。该实例仅包含展示页面。



![](https://cdn.nlark.com/yuque/0/2020/jpeg/2070295/1598521000847-41b20dba-08f0-4248-be35-dc3cfaf4dc45.jpeg#align=left&display=inline&height=258&margin=%5Bobject%20Object%5D&originHeight=258&originWidth=258&status=done&style=none&width=258)


使用 icejs 开发小程序和中后台应用，使得开发者免于在不同技术栈中切换，减少学习成本和使用不同技术栈带来的切换成本，提升开发效率。

欢迎使用 icejs 开发小程序和提供反馈！


## 推荐阅读及参考


- [飞冰](https://ice.work/)
- [icejs 小程序官方文档](https://ice.work/docs/miniprogram/start)
- [eggjs](https://eggjs.org/)
- [eggjs sequelize 教程](https://eggjs.org/zh-cn/tutorials/sequelize.html)
- [Todos 小程序代码](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)
- [Todos 后台管理系统代码](https://github.com/ice-lab/icejs-miniapp-admin/client)
- [Todos 服务端代码](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server)
