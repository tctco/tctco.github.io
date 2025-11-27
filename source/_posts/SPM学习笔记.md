---
title: SPM学习笔记
date: 2023-02-20 20:45:13
tags: SPM
categories:
  - Medicine
  - Nuclear Medicine
---

开启`SPM12`

```matlab
spm pet
```

## 基本操作

```matlab
I = dicomread(dicomFile)
imshow(I, 'DisplayRange', []) % 显示DICOM图像

info = dicominfo(dicomFile) % 显示元信息
% info.AcquisitionTime较重要
```

计算SUV：使用`ImCalc`输入计算公式后，`Display`选中计算结果

## 图像预处理

1. Spatial Registration, Normalization
   1. Registration: Rigid Transformations (rotations, translations...)
   2. Normalization: Transform to Montreal Neurology Institute (MNI) Template
   3. Smoothing: e.g. Gaussian kernel, improve SNR, minimize differences between normalized images, increase validity of statistics (errors more likely to be normally distributed)
2. Creation of a Parametric Image (SUVRs, DVRs, BP...)
3. Statistical model

具体实施步骤

1. SPM导入DICOM文件并设置输出路径
2. 在Display中调整（一般将原点设置为前连合anterior commissure），点击reorient确认

## The Flanker Task

