---
title: tmux
categories: Linux,cheatsheet
tags: Linux,tmux,Software
date: 2020-07-11 19:01:00
updated: 2020-07-11 19:01:00
---
# tmux

## tmux - terminal multiplexer

通过 session window pane 三个维度复用

## 工作流

```shell
tmux // 新建session

ctrl+b % // 左右分割为两个pane
ctrl+b " // 上下分割为两个pane

ctrl+b w // 显示 window
ctrl+b q // 显示pane对应序号

ctrl+b x // 关闭当前pane
ctrl+b d // detach 当前 session

tmux list-session // 列出所有session

tmux attach-session -t 序号 // attach到对应session

tmux kill-session -t 序号 // kill 对应 session
```

