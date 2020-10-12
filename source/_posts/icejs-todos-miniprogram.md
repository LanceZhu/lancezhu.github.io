---
title: icejs-todos-miniprogram
date: 2020-10-12 17:45:11
tags:
---
# 如何同时开发小程序+中后台应用(feat: icejs) - 小程序篇

> 知乎：[使用 React + icejs 开发一个完整的 Todo 应用 - 小程序篇](https://zhuanlan.zhihu.com/p/216507810)
语雀：[如何同时开发小程序+中后台应用(feat: icejs) - 小程序篇](https://www.yuque.com/f00bar/bsa44q/gfw19c)



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

- 小程序篇（本文）

使用 icejs 开发 Todo 小程序。

- 后台管理系统篇

使用 icejs 开发 Todo 小程序后台管理系统。

- 服务端篇

搭建服务 Todo 小程序及后台管理系统的服务端。
## 小程序


> 项目代码见：[miniprogram-materials/scaffolds/todos](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)
> 小程序开发基于icejs，详细内容见 [icejs 小程序开发文档](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)

### 项目初始化


创建文件夹存放代码


```bash
$ mkdir todos && cd todos
```


基于 icejs 小程序 JavaScript 模板初始化项目


```bash
$ npm init ice . # 在当前目录下初始项目
```


选择 JavaScript 小程序模板即 Lightweight JavaScript template with miniapp Program


![](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598521001177-8b125520-f5d4-46f2-a6f8-598e2150ffed.png#align=left&display=inline&height=192&margin=%5Bobject%20Object%5D&originHeight=192&originWidth=471&status=done&style=none&width=471)


启动项目


```bash
$ npm install && npm run start

# 从微信开发者工具中导入构建完成后的产物可以看到项目正常运行
# 构建产物位置位于 ./build 目录中。./build/miniapp 为支付宝小程序；./build/wechat-miniprogram 为微信小程序
```


> [微信开发者工具下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/devtools.html)
> [支付宝小程序开发工具下载](https://render.alipay.com/p/f/fd-jwq8nu2a/pages/home/index.html)



使用微信开发者工具管理小程序
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598931377928-a0bf4ffa-3dad-4bc7-81c7-18b5d0d8d087.png#align=left&display=inline&height=344&margin=%5Bobject%20Object%5D&name=image.png&originHeight=688&originWidth=1016&size=108179&status=done&style=none&width=508)
导入构建的小程序包
> 此处 AppID 应填写自己所申请的小程序 AppID 或使用 测试号

![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598931459380-01eb51a3-e13f-436b-9ff9-a7fe90111b59.png#align=left&display=inline&height=345&margin=%5Bobject%20Object%5D&name=image.png&originHeight=689&originWidth=1015&size=45416&status=done&style=none&width=507.5)
开发者工具中小程序编译成功
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598931572145-a4d6e362-5612-4fcb-87c9-b324ee4db9cb.png#align=left&display=inline&height=511&margin=%5Bobject%20Object%5D&name=image.png&originHeight=1022&originWidth=1916&size=170663&status=done&style=none&width=958)
项目目录结构为：


```
.
├── .ice/                          # 运行时生成的临时目录
├── build/                         # 构建产物目录
├── src/                           # 源码目录
│    ├── components                # 应用的公共组件
│    │     └── Logo             
│    │       ├── index.module.less # Logo 组件的样式文件
│    │       └── index.jsx         # Logo 组件 JSX 源码           
│    └── pages                     # 页面
│    │     └── Home                # home 页面
│    │         └── index.jsx
│    ├── app.js                    # 应用入口文件
│    └── app.json                  # 应用配置，包括路由配置，小程序 window 配置等
├── README.md                      # 项目说明
├── build.json                     # 项目构建配置
├── package.json
└── tsconfig.json
```


### 页面编写


页面编写与使用 React 开发基本一致。


对于小程序中的生命周期函数，可使用 `usePageShow`、`usePageHide` 或者 `withPageLifeCycle` 等方法进行监听。详细文档见[页面配置#生命周期]()。


#### Todos 列表页
**创建 src/pages/todos 编写 UI**
```jsx
import React, { useState } from 'react';

import { usePageShow } from 'ice';

import AddButton from '@/components/add-button'; // 组件：添加新 Todo按钮
import logo from '@/public/logo.svg';
import styles from './index.module.scss';

const Todos = () => {
  // state
  const [userInfo, setUserInfo] = useState({});
  const [todos, setTodos] = useState([]);

  // handlers
  const onTodoChange = async id => {
    let changedContent = {};
    const changedTodos = todos.map(todo => {
      const { id: curId } = todo;
      const { completed } = todo.content;
      if (id === curId) {
        changedContent = {
          ...todo.content,
          completed: id === curId ? !completed : completed
        };
      }

      return {
        ...todo,
        content: {
          ...todo.content,
          completed: id === curId ? !completed : completed
        }
      };
    });

    setTodos(changedTodos);
  };

  // lifecycle function
  usePageShow(async () => {
    const defaultTodos = [
      {
        content: { text: 'Learning Javascript', completed: true },
        id: 0
      },
      {
        content: { text: 'Learning ES2016', completed: true },
        id: 1
      },
      {
        content: { text: 'Learning 小程序', completed: false },
        id: 2
      },
    ]

    // 暂时使用默认 Todos 测试 UI
    setTodos(defaultTodos);
  })

  return (
    <div className={styles['page-todos']}>
      <div className={styles.user}>
        <button type='button' className={styles['login-button']} >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <img className={styles.avatar} src={userInfo.avatarUrl ? userInfo.avatarUrl : logo} alt="用户头像" />
            <span className={styles.nickname}>{userInfo.nickName ? `${userInfo.nickName}'s` : 'My' } Todo List</span>
          </div>
        </button>
      </div>
      
      <div className={styles['todo-items']}>
        <div className={styles['todo-items-group']}>
          {
            todos.map(todo => (
              <div style={{position: 'relative'}} key={todo.id}>
                <div
                  className={`${styles['todo-item']} ${todo.content.completed ? styles.checked : ''}`}
                  onClick={() => onTodoChange(todo.id)}
                >
                  <checkbox className={styles['todo-item-checkbox']} checked={todo.content.completed} />
                  <span className={styles['todo-item-text']}>{todo.content.text}</span>
                </div>
                <div
                  className={styles['close-wrapper']}
                  >
                  <div className={styles.close}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className={styles['todo-footer']}>
        <AddButton text="Add Todo" />
      </div>
    </div>
  );
};

export default Todos;

```
**添加样式**
```css
// src/pages/todos/index.module.scss
page {
  flex: 1;
  display: flex;
  background: #323239;
  font-family: "pingFang SC" "pingFang";
}

body {
  flex: 1;
  display: flex;
  background: #323239;
  font-family: "pingFang SC" "pingFang";
}

.page-todos {
  font-family: "pingFang SC" "pingFang";
  display: flex;
  flex-direction: column;
  width: 750rpx;
  max-height: 100vh;
}

.user {
  display: flex;
  flex-shrink: 0;
  padding: 30px;
  color: #FFF;
  flex-direction: column;
  align-items: center;
}

.login-button {
  display: inline-block;
  background: none;
  border: none;
  width: auto;
  height: auto;
}

.login-button:after{
  content: none;
}

.avatar {
  width: 130rpx;
  height: 130rpx;
  border-radius: 50%;
  background-color: #FFF;
  align-self: center;
}

.nickname {
  padding-top: 40rpx;
  text-align: center;
  font-size: 40rpx;
  font-weight: 100;
  color: #FFF;
}

.todo-items {
  flex-grow: 1;
  font-size: 34rpx;
  padding: 0 120rpx;
  color: #0EFFD6;
  overflow: auto;
}

.todo-items-group {
  display: flex;
  flex-direction: column;
}

.todo-item {
  position: relative;
  margin-bottom: 50rpx;
  padding-left:80rpx;
  line-height: 70rpx;
  height: 80rpx;
  box-sizing: border-box;
  border: 2px solid rgb(14, 255, 214);
  border-radius: 100rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  /* white-space:nowrap; */

  transition: border 0.2s;
}

.todo-item:last-child {
  margin-bottom: 0;
}

.todo-item::before {
  content: '';
  position: absolute;
  left: 12rpx;
  margin-right: 20rpx;
  width: 45rpx;
  height: 45rpx;
  background-color: rgba(14, 222, 255, 0.3);
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);

  transition: background-color 0.2s;
}

.todo-item::after {
  content: '';
  position: absolute;
  left: 29rpx;
  width: 8rpx;
  height: 18rpx;
  top: 50%;
  transform: translateY(-60%) rotate(38deg);
  border: 4rpx solid #FFF;
  border-width: 0 4rpx 4rpx 0;
  opacity: 0;

  transition: opacity 0.2s;
}

.todo-item-checkbox {
  display: none;
}

.checked .todo-item-text {
  text-decoration: line-through;
  color: #1AA0B8;
}

.checked.todo-item {
  border: 2px solid rgba(14, 222, 255, 0.2);
}

.checked.todo-item::before {
  background-color: rgba(14, 222, 255, 0.2);
}

.checked.todo-item::after {
  opacity: 1;
}

.todo-item-operation {
  display: inline-block;
  background: none;
  color: #FFF;
  border: none;
}

.todo-item-operation:after {
  content: none;
}

.close-wrapper {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  right: 0;
  width: 80rpx;
  height: 80rpx;
  padding-top: 20rpx;
  padding-left: 20rpx;
}

.close {
  box-sizing: border-box;
  position: relative;
  top: 0;
  right: 0;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background-color: rgba(14, 222, 255, 0.3);
}

.close::before {
    position: absolute;
    content: ' ';
    background-color: #2c2c2c;
    width: 8rpx;
    height: 30rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(45deg);
}
.close::after {
    position: absolute;
    content: ' ';
    background-color: #2c2c2c;
    width: 8rpx;
    height: 30rpx;
    border-radius: 4rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
}

.todo-footer {
  flex-shrink: 0;
  padding: 50rpx 0 100rpx;
  font-size: 48rpx;
  font-weight: 200;
  text-align: center;
}
```
**编写所需组件 add-button**
```jsx
// src/components/add-button/index.jsx
import React from 'react';
import styles from './index.module.scss';

function AddButton (props) {
  const { text, onClickMe } = props;

  return (
    <button type='button' className={styles['add-button']} onClick={onClickMe}>
      <span className={styles['add-icon']}>+</span>
      <span>{text}</span>
    </button>
  );
}

export default AddButton;
```
**为组件添加样式**
```jsx
// src/components/add-button/index.module.scss
.add-button {
  display: inline-block;
  background: none;
  color: #FFF;
  border: none;
  width: 300rpx;
}

.add-button:after {
  content: none;
}

.add-icon {
  font-size: 52rpx;
  color: #00FFD6;
  margin-right: 10rpx;
}
```
**添加 logo 图片**
src/public/logo.svg
```jsx
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348">
  <title>React Logo</title>
  <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
  <g stroke="#61dafb" stroke-width="1" fill="none">
    <ellipse rx="11" ry="4.2"/>
    <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
    <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
  </g>
</svg>
```
**添加路由**
编辑 src/app.json
```json
{
  "routes": [ // 页面路由数组
    {
      "path": "/todos",  // /todos 路由
      "source": "pages/todos/index" // 实际 React 组件，即上面所写组件
    },
  ]
}
```
**构建小程序**
```bash
$ npm run start # 构建小程序

# 将构建产物 ./build/wechat-miniprogram 导入至微信开发者工具中
```
小程序开发者工具进行编译，实际效果为：
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598962296957-1a3b3424-96af-4052-9b78-65457af2956b.png#align=left&display=inline&height=710&margin=%5Bobject%20Object%5D&name=image.png&originHeight=710&originWidth=399&size=45216&status=done&style=none&width=399)
切换 Todo 完成状态
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598962311241-f7112c35-8ea1-4ff4-b89c-add990a04713.png#align=left&display=inline&height=709&margin=%5Bobject%20Object%5D&name=image.png&originHeight=709&originWidth=400&size=45554&status=done&style=none&width=400)
Todos 列表页面样式完成。可切换 Todo 完成情况。
#### 添加 Todo 页
**编写 UI**
```jsx
// src/pages/add-todo/index.jsx
import React, { useState } from 'react';

import AddButton from '@/components/add-button';
import styles from './index.module.scss';

const AddTodo = () => {
  // state
  const [value, setValue] = useState('');

  // handlers
  const onChange = (e) => {
    setValue(e.target.value);
  };

  // 省略添加 Todo 逻辑
  const add = async () => {};

  return (
    <div className={styles['page-add-todo']}>
      <div className={styles['add-todo']}>
        <input
          className={styles['add-todo-input']}
          placeholder="What needs to be done?"
          value={value}
          onChange={() => {}}
          onInput={onChange} />
      </div>

      <div className={styles['todo-footer']}>
        <AddButton text="Add Todo" onClickMe={add}/>
      </div>
    </div>
  );
};

export default AddTodo;
```
**添加样式**
```css
// src/pages/add-todo/index.module.scss
page {
  background: #323239;
  font-family: "pingFang SC" "pingFang";
}

.page-add-todo {
  font-family: "pingFang SC" "pingFang";
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 750rpx;
}

.add-todo {
  padding: 40px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-todo-input {
  display: block;
  font-size: 50rpx;
  font-weight: 100;
  padding: 5px 5px;
  background: none;
  border:none;
  border-bottom: 1px solid #DFDFDF;
  color: #0EFFD6;
  width: 100%;
}

.todo-footer {
  padding: 50rpx 0 100rpx;
  font-size: 48rpx;
  font-weight: 200;
  text-align: center;
}
```
**配置路由**
```json
{
  "routes": [
  	{
      "path": "/add-todo",
      "source": "pages/add-todo/index"
    }，
    {
      "path": "/todos",
      "source": "pages/todos/index"
    }
  ]
}
```
**微信小程序开发者工具中执行自定义编译**

- 添加编译模式

![mp3.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598962397413-735fe7cc-aa62-4f6d-a057-2e684d6cd649.png#align=left&display=inline&height=1027&margin=%5Bobject%20Object%5D&name=mp3.png&originHeight=1027&originWidth=1916&size=190538&status=done&style=none&width=1916)

- 配置启动页面为 pages/add-todo/index

![mp4.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598962502120-9a9a2d4f-b951-479d-8652-477896eead25.png#align=left&display=inline&height=1023&margin=%5Bobject%20Object%5D&name=mp4.png&originHeight=1023&originWidth=1920&size=183598&status=done&style=none&width=1920)
编译后可看到添加 Todo 页面效果
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598962525365-97c4d6f9-d180-4bc8-bda7-f88518ac119d.png#align=left&display=inline&height=358&margin=%5Bobject%20Object%5D&name=image.png&originHeight=715&originWidth=397&size=25057&status=done&style=none&width=198.5)![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598962542690-911bb7a4-0ad6-4e75-9de7-a26687f3559a.png#align=left&display=inline&height=357&margin=%5Bobject%20Object%5D&name=image.png&originHeight=714&originWidth=403&size=21665&status=done&style=none&width=201.5)
**此时的目录结构为：**
> 原有 Logo 组件及 Home 页面未使用可删除。

```markdown
.
├── public
│   └── index.html
├── src
│   ├── components
│   │   └── add-button     // 新增组件 add-button
│   ├── pages
│   │   ├── add-todo       // 新增页面 add-todo
│   │   └── todos          // 新增页面 todos
│   ├── public
│   │   └── logo.svg       // 新增 logo 图片
│   ├── app.js
│   └── app.json
├── .eslintrc.js
├── .gitignore
├── README.md
├── build.json
├── mini.project.json
├── package-lock.json
├── package.json
└── tsconfig.json
```
### 项目配置


与编写 Web 应用不同的是，需要为小程序增加一些配置。如页面路由、tabBar、页面标题等小程序特有属性。


本程序配置如下：


```json
// app.json
{
  "routes": [ // 页面路由
    {
      "path": "/todos",
      "source": "pages/todos/index" // React 组件
    },
    {
      "path": "/add-todo",
      "source": "pages/add-todo/index"
    }
  ],
  "window": { // 页面标题、颜色
    "title": "Todo App",
    "titleBarColor": "#323239"
  }
}
```
可看到头部颜色及标题发生变化
![mp-window.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1598963028284-83c512f9-1fb0-4c72-b3c0-b79aa4c84006.png#align=left&display=inline&height=715&margin=%5Bobject%20Object%5D&name=mp-window.png&originHeight=715&originWidth=850&size=61654&status=done&style=none&width=850)
### 数据请求


通过与后台 API 接口交互将 Todos 同步到远程数据库中。需要用到 universal-request，该库对数据请求进行了封装，使得用户无需关心 web端、微信小程序、支付宝小程序等多平台差异。一套代码、多处运行。


#### 以获取某用户的 Todos 为例
> 相关接口见后文服务端

安装 universal-request
```bash
$ npm install universal-request
```
定义数据请求 service
```javascript
// src/services/todos.js
import request from 'universal-request';

// 此处为 mock 接口，仅包含查询固定 todos 列表。其他功能如对小程序的增删改查需要服务端
const URL_PREFIX = 'https://easy-mock.bookset.io/mock/5f4f05642ff5d50508b3d21b/todos_mock'

export default {
  // 根据用户 openId 获取对应 todo 列表
  async list ({ openId }) {
      let todos = [];
      try {
          // openId 未使用，可随意填写
          const URL = `${URL_PREFIX}/api/mp/todos?openId=${openId}`;
          const res = await request({
              url: URL
          });
          todos = res.data.data.todos;
      } catch (err) {
          console.error(err);
      }
      return todos;
  }
}

```
Todos 组件中调用该数据请求 service，移除默认 Todos
```diff
// src/pages/todos/index.jsx
+ import todosService from '@/services/todos'; // 引入 todos service

const Todos = () => {
  // ...
  // lifecycle function
  // usePageShow 函数修改如下
  usePageShow(async () => {
    // 通过数据请求获取 Todos 数据
    const todos = await todosService.list(1); // 1 为 openId，暂时未使用可随意填写
    setTodos(todos);
  })

  return (
    // 渲染 todos
  );
};
```
编译
> 注意应在微信开发者工具中开启**不校验合法域名**

![mp5.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599028238912-aa9c1d35-bdfd-4a63-8ff2-21bcfd95a90e.png#align=left&display=inline&height=1028&margin=%5Bobject%20Object%5D&name=mp5.png&originHeight=1028&originWidth=1913&size=181778&status=done&style=none&width=1913)
执行编译后可得
![image.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599028284047-baa3a7c1-4ffd-4b76-90d1-06ae6d034c71.png#align=left&display=inline&height=713&margin=%5Bobject%20Object%5D&name=image.png&originHeight=713&originWidth=401&size=44389&status=done&style=none&width=401)
对于 Todos 列表的增删改查操作需要服务端的支持，此处仅使用 Mock 接口验证数据请求。真实请求逻辑可在服务端篇查看。
### 数据存储
数据请求小节介绍了如何发起数据请求，但数据请求需要相应的服务端，服务端未完成的情况下，Todo 小程序无法完成 Todo 的增删改查。


本小节使用微信所提供的数据存储服务，将 Todos 持久化，实现 Todo 的增删改查。

- 新建数据存储 service
```javascript
const storageKey = {
  todos: 'todos',
  userInfo: 'userInfo'
};

// 获取存储的 Todos
async function getStoredTodos () {
  let todos;
  try {
    // eslint-disable-next-line
    const res = await wx.getStorage({
      key: storageKey.todos
    });
    todos = res.data.todos;
  } catch (err) {
    console.error(err);
  }
  return todos;
}

// 存储 Todos
async function storeTodos (todos) {
  // eslint-disable-next-line
  await wx.setStorage({
    key: storageKey.todos,
    data: {
      todos
    }
  });
}

// 获取存储的 userInfo
async function getUserInfo () {
  let userInfo;
  try {
    // eslint-disable-next-line
    const res = await wx.getStorage({
      key: storageKey.userInfo
    });
    userInfo = res.data.userInfo;
  } catch (err) {
    console.error(err);
  }
  return userInfo;
}

// 存储 userInfo
async function setUserInfo (userInfo) {
  // eslint-disable-next-line
  await wx.setStorage({
    key: storageKey.userInfo,
    data: {
      userInfo
    }
  });
}

export default {
  todos: {
    get: getStoredTodos,
    set: storeTodos
  },
  userInfo: {
    get: getUserInfo,
    set: setUserInfo
  }
};
```

- todos 组件和 add-todo 组件添加逻辑

todos 组件：

   - 增加获取用户信息函数 getUserInfo
   - 增加初始化 Todos 函数：initTodos
   - 增加添加 Todo 函数：addTodo
   - 增加删除 Todo 函数：delTodo
   - 修改编辑 Todo 函数：onTodoChange
```jsx
// src/pages/todos/index.jsx
import React, { useState } from 'react';
import { usePageShow } from 'ice';

// 引入 storage service
import storageService from '@/services/storage';

import AddButton from '@/components/add-button';
import logo from '@/public/logo.svg';
import styles from './index.module.scss';

const Todos = () => {
  // state
  const [userInfo, setUserInfo] = useState({});
  const [todos, setTodos] = useState([]);

  // handlers
  // user
  const getUserInfo = async () => {
    // eslint-disable-next-line
    const storedUserInfo = await storageService.userInfo.get();
    // eslint-disable-next-line
    const res = await wx.getUserInfo(); // 获取用户信息
    const userInfo = res.userInfo;

    setUserInfo(userInfo);

    await storageService.userInfo.set(userInfo);
  };

  // todos
  // 添加 Todo
  const addTodo = async () => {
    wx.redirectTo({
      url: '/pages/add-todo/index'
    });
  };

  // 修改 Todo 完成状态
  const onTodoChange = async id => {
    let changedContent = {};
    const changedTodos = todos.map(todo => {
      const { id: curId } = todo;
      const { completed } = todo.content;
      if (id === curId) {
        changedContent = {
          ...todo.content,
          completed: id === curId ? !completed : completed
        };
      }

      return {
        ...todo,
        content: {
          ...todo.content,
          completed: id === curId ? !completed : completed
        }
      };
    });

    setTodos(changedTodos);
  
    await storageService.todos.set(changedTodos);
  };

  // 删除 Todo
  async function delTodo (id) {
    const changedTodos = todos.filter(todo => {
      const { id: curId } = todo;
      return id !== curId;
    });

    setTodos(changedTodos);
    await storageService.todos.set(changedTodos);
  };

  // 初始化 Todos
  const initTodos = async () => {
    const storedTodos = await storageService.todos.get();

    const mergedTodos = storedTodos || [];

    console.log(storedTodos, mergedTodos);

    setTodos(mergedTodos);

    await storageService.todos.set(mergedTodos);
  };

  // lifecyle function
  usePageShow(async () => {
    console.log('page show');

    // eslint-disable-next-line
    const storedUserInfo = await storageService.userInfo.get();
    setUserInfo(storedUserInfo || {});

    await initTodos();
  });

  return (
    <div className={styles['page-todos']}>
      <div className={styles.user}>
        <button type='button' open-type="getUserInfo" onClick={getUserInfo} className={styles['login-button']} >
          <div style={{display: 'flex', flexDirection: 'column'}}>
            <img className={styles.avatar} src={userInfo.avatarUrl ? userInfo.avatarUrl : logo} alt="用户头像" />
            <span className={styles.nickname}>{userInfo.nickName ? `${userInfo.nickName}'s` : 'My' } Todo List</span>
          </div>
        </button>
      </div>
      
      <div className={styles['todo-items']}>
        <div className={styles['todo-items-group']}>
          {
            todos.map(todo => (
              <div style={{position: 'relative'}} key={todo.id}>
                <div
                  className={`${styles['todo-item']} ${todo.content.completed ? styles.checked : ''}`}
                  onClick={() => onTodoChange(todo.id)}
                >
                  <checkbox className={styles['todo-item-checkbox']} checked={todo.content.completed} />
                  <span className={styles['todo-item-text']}>{todo.content.text}</span>
                </div>
                <div
                  className={styles['close-wrapper']}
                  onClick={() => delTodo(todo.id)}>
                  <div className={styles.close}/>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className={styles['todo-footer']}>
        <AddButton text="Add Todo" onClickMe={addTodo} />
      </div>
    </div>
  );
};

export default Todos;
```
add-todo 组件

- 修改添加 Todo 函数：add
```jsx
// src/pages/add-todo/index.jsx
import React, { useState } from 'react';

// 引入 storage service
import storageService from '@/services/storage';

import AddButton from '@/components/add-button';
import styles from './index.module.scss';

const AddTodo = () => {
  // state
  const [value, setValue] = useState('');

  // handlers
  // 输入监听函数
  const onChange = (e) => {
    setValue(e.target.value);
  };

  // 添加 Todo
  const add = async () => {
    const curTodos = await storageService.todos.get();

    const todo = {
      id: (new Date()).getTime(),
      content: {
        text: value,
        completed: false
      }
    }

    const newTodos = curTodos.concat(todo);
    storageService.todos.set(newTodos);

    // eslint-disable-next-line
    wx.redirectTo({
      url: '/pages/todos/index'
    });
  };


  return (
    <div className={styles['page-add-todo']}>
      <div className={styles['add-todo']}>
        <input
          className={styles['add-todo-input']}
          placeholder="What needs to be done?"
          value={value}
          onChange={() => {}}
          onInput={onChange} />
      </div>

      <div className={styles['todo-footer']}>
        <AddButton text="Add Todo" onClickMe={add}/>
      </div>
    </div>
  );
};

export default AddTodo;
```
执行编译，运行项目
此时，本程序可获取用户基本信息，增加 Todo。


![mp11.png](https://cdn.nlark.com/yuque/0/2020/png/2070295/1599037234361-0165b321-d833-4de3-9ac4-75924cc989b5.png#align=left&display=inline&height=1559&margin=%5Bobject%20Object%5D&name=mp11.png&originHeight=1559&originWidth=1276&size=112351&status=done&style=none&width=1276)
### 小结


至此，小程序部分已基本完成。


本文介绍了使用 icejs开发小程序的基本流程，包括使用组件 UI 的编写；路由及其它小程序相关的项目配置；发起数据请求；调用微信小程序 API 获取用户信息和存储数据。


小程序同步 Todo 列表至服务端需要服务端的配合，故将该功能在服务端篇进行实现。


小程序代码见 [miniprogram-materials/scaffolds/todos](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)，可结合服务端 [icejs-miniapp-admin/server](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server) 一起运行查看效果。


## 推荐阅读


- [飞冰](https://ice.work/)
- [icejs 小程序官方文档](https://ice.work/docs/miniprogram/start)
- [Todos 小程序代码](https://github.com/ice-lab/miniprogram-materials/tree/master/scaffolds/todos)
- [Todos 后台管理系统代码](https://github.com/ice-lab/icejs-miniapp-admin/client)
- [Todos 服务端代码](https://github.com/ice-lab/icejs-miniapp-admin/tree/master/server)
