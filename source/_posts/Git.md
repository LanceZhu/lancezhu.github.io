---
title: Git
date: 2019-03-26 19:45:45
tags:
---

# 【笔记】Git
## 个人开发基本工作流
### 单分支工作
#### 创建版本库  

```
git init
```

#### 配置用户名及邮箱 

``` 
 git config --global user.name "Your Name"  // --global参数表示对本机所有仓库生效
 git config --global user.email "Your Email" 
```

#### 添加远程仓库

```
git remote add origin git@github.com:username/program.git
```

#### 从远程仓库克隆

```
git clone git@github.com:username/program.git
```

#### 添加到本地stage

```
git add test.txt // 添加指定文件
git add . //添加当前目录下所有修改文件
```

#### 提交到本地仓库

```
git commit -m "description about this commit"
```

#### 向远程仓库提交

```
git push origin local:remote // 其中remote可省略
git push origin :remote // 删除远程分支
```

### 多分支工作

#### 新建分支并切换到新分支

```
git branch dev
git checkout dev
```

or

```
git branch -b dev
```

#### 删除分支

```
git branch -d dev // 删除无新提交分支
git branch -D dev // 删除未 merge 分支
```

#### 查看分支

```
git branch // 查看本地分支
git branch -a // 查看本地+远程分支
git remote // 查看远程分支
git remote -v // 查看远程分支具体信息
```

#### 开发分支修改合并到主分支

```
git checkout master // 切换到主分支
git merge dev // 合并 dev 分支修改到 master 分支
```

### 版本回退 

#### 丢弃工作区修改
```
git checkout -- filename
```

#### 暂存区回退到工作区
```
git reset HEAD filename // 指定文件从暂存区回退到工作区
```

#### 版本回退
```
git reset --hard HEAD^ // 回退到上次 commit 版本
git reset --hard HEAD^ // 回退到上上次 commit 版本
git reset --hard asdfasdf // 回退到指定 commit 版本
```

#### commit 历史查看
```
git log // 查看 commit 历史，排列顺序由新到旧
git reflog // 查看分支所有操作，版本回退后根据版本号可恢复
git log --pretty=oneline // 单行显示 commit 历史
git log --graph --pretty=oneline --abbrev-commit // 图形显示 commit 历史，单行显示，缩略版本号
```

### Reference

[廖雪峰的官方网站-Git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000)

[常用Git命令清单-阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

[洁癖者用 Git：pull --rebase 和 merge --no-ff](http://hungyuhei.github.io/2012/08/07/better-git-commit-graph-using-pull---rebase-and-merge---no-ff.html)

## 遇到的问题


向远程仓库提交失败

```
git pull --rebase git@github.com:username/program.git
```

[一台电脑上使用两个github账户](https://blog.csdn.net/wolfking0608/article/details/78512171)

[git 使用ssh-add添加密钥](https://blog.csdn.net/u012900536/article/details/50951099)

[git merge和git rebase小结](https://blog.csdn.net/wh_19910525/article/details/7554489)

github 作为collaborators协作

```
将owner的仓库克隆到本地，开发，正常提交即可
```