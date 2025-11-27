---
title: mmDetection实战
date: 2023-02-08 18:48:19
tags: OpenMMLab
categories:
  - Algorithm
  - CV
  - Detection
---

## 课程

<div class="bilibili">
  <iframe src="//player.bilibili.com/player.html?aid=566509200&bvid=BV1Av4y1475i&cid=998465317&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

## YOLOv3模型

- 主干网络：Darknet53
- 颈部：FPN
- 检测头

## 技巧

搜索模型：

```bash
mim search mmdet --model "mask r-cnn"
```

推理
```python
from mmdet.apis import init_detector, inference_detector, show_result_pyplot

model = init_detector('config_path', 'checkpoint_path')
result = inference_detector(model, 'img_path')
show_result_pyplot(model, 'img_path', result)
```

## 推理

简单的推理

```python
from mmdet.apis import init_detector, inference_detetor, show_result_pyplot
model = init_detector(cfg, checkpoint)
result = inference_detector(model, img_path)
show_result_pyplot(model, img_path, result)
```

## 配置文件

- 模型结构
  - model
- 数据集
  - data
- 训练策略
  - optimizer
  - lr_config
- 运行时：GPU、分布式环境配置等
- 辅助功能：日志等

使用**继承**来修改配置文件：

```python
_base_ = ['config.py']
```

对应的，有

```python
from mmcv import Config
cfg = Config('path')
print(cfg.pretty_text)
```

用于测试（`--show-dir`用于绘制全部结果）

```bash
mim test mmdet config.py --checkpoint checkpoint.pth --show-dir dir
```

一些注意事项
- `repeat`用于重复数据集，对应的epoch可以降低
- `lr_config`在从头训练的时候比较重要，在微调中也许可以省去
- SGD算法配合不同学习率策略表

| 学习率策略 | 第一次降低 | 第二次降低 | 总轮数 |
| :--------: | :--------: | :--------: | :----: |
|     1x     |    8轮     |    11轮    |  12轮  |
|     2x     |    16轮    |    22轮    |  24轮  |
|    20e     |    16轮    |    19轮    |  20轮  |

## 笔记

- 注意`data`中如果不是默认的80 classes，需要设置`classes=('balloon',)`

有关`python -m pip install`和`pip install`的区别，可以看[这里](https://stackoverflow.com/questions/25749621/whats-the-difference-between-pip-install-and-python-m-pip-install)。

由于`h264`是GPL协议，与`opencv-python`的MIT协议不匹配，所以需要参考[这个](https://github.com/opencv/opencv-python/issues/100#issuecomment-554870068)从源码编译。也可以像[这样](https://blog.csdn.net/weixin_44359953/article/details/127257534)直接通过`pip`进行编译

```python
python -m pip install --no-binary opencv-python opencv-python -U
```

但是这步之后发现opencv不再能读取视频，可用下面的代码查看

```python
print(cv2.getBuildInformation())
```

注意到Video下的全是NO。

`/etc/apt/sources.list.d`文件夹下也有apt的source