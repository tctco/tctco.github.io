---
title: mmClassification实战
date: 2023-02-06 20:48:43
tags: OpenMMLab
categories:
  - Algorithm
  - CV
  - Classification
---

# 笔记

## 训练注意事项

对Evaluation部分

```python
evaluation = dict(
  interval=1,
  metric='accuracy', 
  save_best='accuracy_top-1', 
  metric_options={'topk':(1,)} # 由于总类为4，这里必须指明metric_options
)
```

启用标签平滑：

```python
# 在head中修改loss
loss=dict(type='LabelSmoothLoss', label_smooth_val=0.2, mode='original')
```

`load_from`用于加载模型，`resume_from`用于重启训练，两者不同。

想要启用Wandb，可以用

```python
log_config = dict(
  interval=10, 
  hooks=[
    dict(type='TextLoggerHook'), 
    dict(type='MMClsWandbHook', init_kwargs=dict(project='mice-cls'))
  ]
)
```

> 但是不知道为什么不能在wandb上看数据集和eval的结果。

## 评估注意事项

首先需要产生`result.pkl`

```bash
mim test mmcls config.py \
  --checkpoint model.pth \
  --metrics accuracy \
  --metric-options 'topk=(1,)' \
  --out result.pkl
```

然后可以观察结果，在指定目录下会生成一些成功和失败案例，默认为20个

```bash
python tools/analysis_tools/analyze_results.py config.py result.pkl \
  --out-dir out_img_dir
```

计算acc precision recall等指标，具体可以[看这里](https://mmclassification.readthedocs.io/en/latest/api/core.html#id1)，或者在`base_dataset.py`及其他数据集定义文件里找

```bash
python tools/analysis_tools/eval_metric.py config.py result.pkl \
  --metrics accuracy precision recall f1_score support ... \
  --metric-options 'topk=(1,)'
```

如果要计算混淆矩阵，可以[看这里](https://github.com/open-mmlab/mmclassification/issues/598)

```python
import mmcv
from mmcls.datasets import build_dataset
from mmcls.core.evaluation import calculate_confusion_matrix
cfg = mmcv.Config.fromfile("your_config_file")
dataset = build_dataset(cfg.data.test)
pred = mmcv.load("./result.pkl")['class_scores']
matrix = calculate_confusion_matrix(pred, dataset.get_gt_labels())
import matplotlib.pyplot as plt
plt.imshow(matrix)
plt.savefig('confusion_matrix.png')
```

> 注意，不需要`--out-items class_scores`也能行

观察CAM激活图

```bash
python tools/visualizations/vis_cam.py pic.jpg config.py \
  model.pth --method layercam --save-path cam.png \
  --target-layer 'backbone.norm3'
```

不知道观察哪一层可以用`--preview-model`来看，关于某类则可指明`--target-categ`。


# 实验

[传送门](https://github.com/tctco/mmlab/tree/main/classification-mice)

## 4小鼠实验动物Classification

这是一个自制的数据集，裁切自MOT，来源于真实的4只C57小鼠社交实验，不仅四至小鼠长得一模一样，有时候挤在一起形变和干扰非常多，难度可以说是相当变态了。

|mouse1|mouse2|mouse3|mouse4|
|-|-|-|-|
|![1](https://github.com/tctco/mmlab/blob/main/classification-mice/imgs/mouse1.png?raw=true)|![2](https://github.com/tctco/mmlab/blob/main/classification-mice/imgs/mouse2.png?raw=true)|![3](https://github.com/tctco/mmlab/blob/main/classification-mice/imgs/mouse3.png?raw=true)|![4](https://github.com/tctco/mmlab/blob/main/classification-mice/imgs/mouse4.png?raw=true)|

使用`hornet-tiny`和`densenet121`，相对来说前者看上去更稳定一些（也可能与优化器、数据增强等其他因素有关）。DenseNet是[SIPEC](https://github.com/SIPEC-Animal-Data-Analysis/SIPEC)给出的解决方案，但是波动非常大，最高可以到54%，低的时候只有45%左右。

![acc_curve](https://raw.githubusercontent.com/tctco/mmlab/main/classification-mice/imgs/acc_curve.png)

最终在测试集的精度可以达到59%左右，感觉已经算是意外之喜了……

## 混淆矩阵

![confusion_matrix](https://raw.githubusercontent.com/tctco/mmlab/main/classification-mice/imgs/confusion_matrix.png)

## EigenGardCAM

小鼠的尾部确实做了一点标记。

![cam](https://raw.githubusercontent.com/tctco/mmlab/main/classification-mice/imgs/cam.png)