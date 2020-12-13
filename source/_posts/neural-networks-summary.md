---
title: neural-networks-summary
date: 2020-12-12 17:13:52
updated: 2020-12-12 17:13:52
tags:
---

# 神经网络总结

神经网络模拟人脑神经结构，获取某种智能，以类似人类的方式解决问题。

解决的问题包括回归问题、分类问题等。研究方向主要有人脸识别，文本翻译、目标检测等。对应的应用场景为智能安防、无人驾驶、多语言翻译等。

## 网络结构

神经网络的基本结构包括输入层、隐藏层、输出层。其中输入层类似于人类大脑神经元，感知外界信息，转化为向量；隐藏层对来自于输入层的向量进行加权处理，并进行激活以增加非线性；输出层对隐藏层的信息再次整合，进行输出。

深度神经网络中常见网络结构有：

- DNN(Deep Neural Network) 最基础的深度神经网络

- CNN(Convolution Neural Network) 卷积神经网络
- RNN(Recurrent Neural Network) 循环神经网络
- GAN(Generative Adversarial Network) 生成对抗网络
- ...

## 网络优化

### 数据操作

归一化（均值归零），批归一化，方差归一，主成分分析，白化

### 参数初始化

随机初始化，Xavier，MSRA初始化

### 参数更新

随机梯度下降，动量

### 激活函数

Sigmoid，tanh，ReLU，leakly ReLU

### 学习率调整

固定学习率，Adagrad，Adam

## 框架应用

[PyTorch](http://pytorch.org/)，[Tensorflow](https://github.com/tensorflow/tensorflow)

## 实践（手写数字识别）

TODO