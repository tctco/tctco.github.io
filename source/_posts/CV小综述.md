---
title: CV小综述
date: 2023-02-03 13:20:27
tags: OpenMMLab
categories: 
  - Algorithm
  - CV
---

## 课程

<div class="bilibili">
  <iframe src="//player.bilibili.com/player.html?aid=948780698&bvid=BV1js4y1W7CN&cid=990930670&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

## 设计图像特征

可以看[这篇文章](https://www.bilibili.com/video/BV1js4y1W7CN/?spm_id_from=333.999.0.0&vd_source=3f3767872baffbcc76fdbe493846d77e)和[这篇文章](https://blog.csdn.net/gg13213/article/details/123762834)：
- 方向梯度直方图Histogram of Oriented Gradients/HOG，局部统计像素梯度的方向分布，将物体映射为低维特征向量，简化数据表达。
- Dense grid descriptor (HOG, LBP) => Coding: local coordinate, super-vector => Pooling, SPM => Linear SVM

## 深度学习

用于解决此前难以进行的特征提取

- 卷积
- 多头注意力：实现一步特征提取

## ResNet

有效性猜想
- 等同于多模型集成：路径之间的复杂组合，每种组合都视为一个新模型
- Loss Surface更加平滑，图很好玩（Visualizing the Loss Landscape of Neural Nets）


改良
- ResNet B/C/D：残差模块基部改进
- ResNeXt：分组卷积（将通道拆解成两部分，分别进行卷积，再将结果堆叠），降低参数量
- SEResNet：通道维度引入注意力机制

> 某些情况下分组卷积效果更好，可能是由于增强了通道之间的相关性（仅组内关联），同时也降低过拟合

## 其他网络结构

- 神经结构搜索NAS，基于强化学习方法：NASNet、MnasNet、EfficientNet、RegNet
- Transformer：Vision Transformer、Swin-Transformer
- ConvNeXt，将SwinTransformer模型元素迁移至卷积网络中性能反超

## 轻量化卷积网络

- GoogLeNet：Inception模块，将3个3x3卷积核改为3个不同大小的卷积核，输出按通道叠加
- ResNet：BottleNeck模块，通过1x1模块压缩通道
- MobileNet：可分离卷积（逐层卷积+逐点卷积），V2引入残差模块，V3引入SE模块
- ResNeXt：分组卷积（见上）

## Vision Transformer

- query向量查询key生成weight，与input组合生成下一层
- query可以来自input（自注意力），或其他位置（互注意力），但key和value都直接来源于input
- Multi-head多头注意力：类比Conv通道，使用不同注意力头产生多组特征进行拼接
- Swin-Transformer：将特征图划分为多个不相交的区域（Window）内，注意力被限制在窗口中，通过Shifted WindowsMulti-Head Self-Attention SW-MSA概念，将l+1层窗口偏移，使信息跨窗口流动

## 学习技巧

- 无监督学习需要辅助任务
- 初始化：Kaiming，预训练模型等
- 学习率：从头训练0.01-0.1，微调0.001-0.01
- 退火：按步长、比例、倒数、余弦函数下降
- 升温Warmup
- Linear Scaling Rule线性扩展原则：batchsize扩大到原来k倍，学习率也应扩大k倍（batchsize小，每轮更新单张图片会给模型大的影响）
- 自适应梯度：Adagrad、Adam/AdamW
- 权重衰减Weight Decay：损失函数正则化项在梯度更新策略中的体现，每轮更新都将旧权重乘一个小于1的系数（类似遗忘过程）
- 早停Early Stopping
- 权重平均：EMA，Stochastic Weight Averaging SWA（类似EMA，但训练末期用高学习率，在损失平面平坦区域进行更多探索）
- 数据增强：AutoAugment、RandAugment
- 图像组合：Mixup、CutMix
- 标签平滑Label Smoothing：在label中引入噪声，避免模型过于自信
- 自监督学习类型
- 基于代理任务：Image Colorization, Solving Jigsaw Puzzles（这脑洞……绝！）, Relative location
- 基于对比学习：SimCLR使用数据增强InfoNCE loss
- 基于掩码学习，Masked autoencoders MAE