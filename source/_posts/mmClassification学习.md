---
title: mmClassification学习
date: 2023-02-04 12:14:24
tags: OpenMMLab
categories:
  - Algorithm
  - CV
  - Classification
---

## 课程

> `mim`很好用，感觉需要更多地研究一下

<div class="bilibili">
  <iframe src="//player.bilibili.com/player.html?aid=308794938&bvid=BV1MA411k7NT&cid=991943842&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>
</div>

## 流程

下载配置文件和模型

```bash
mim download mmcls --config mobilenetblablabla --dest .
```

使用API

```python
from mmcls.apis import init_model, inference_model
model = init_model('config.py', 'model.pth', device='cuda:0')
result = inference_model(model, 'pic.jpg')

from mmcls.apis import show_result_pyplot
show_result_pyplot(model, 'pic.jpg', result)
```

修改配置文件

```python
num_classes = 10
load_from = 'model_path.pth'
type = 'CustomDataset'
ann_file = None # 为空则按文件夹结构推断
lr = 0.005 # n卡至1k、微调训练均需降低lr
runner = dict(type='EpochBasedRunner', max_epochs=5)
checkpoint_config # 可适度升高避免频繁存储模型
log_config # 可适度提升
```

开始训练

```bash
mim train mmcls mobilenet-v2_fruit.py
```

## 作业记录

[作业](https://github.com/open-mmlab/OpenMMLabCamp/blob/main/AI%20%E5%AE%9E%E6%88%98%E8%90%A5%E5%9F%BA%E7%A1%80%E7%8F%AD/%E4%BD%9C%E4%B8%9A%E4%B8%80%20mmclassification)很简单。top-1能到95以上。进阶作业比较同质化，又没啥原创性的想法改网络结构，懒得做了。一些注意事项记录如下。

解决`ImportError: cannot import name 'blablabla' from 'mmcv'`问题：重装`mmcv-full`

1. `pip list | grep mmcv` 发现有`mmcv`和`mmcv-full`
2. 卸载`mmcv`
3. 重装`mmcv-full`：`mim uninstall mmcv-full` + `mim install mmcv-full`

更新pip包：`pip install -U`

`mim`命令行工具很好用，调config文件的时候用非常方便，且下载的config文件是完整而非基于`__base__`的。

```bash
mim download mmcls --config mobilenet-v2_8xb32_in1k --dest .
```

关于保存最好的一次，请见[issue和我的回答](https://github.com/open-mmlab/mmclassification/issues/125#issuecomment-1416742911)。

关于`evaluation`其实有一些令人迷惑的地方，比如这里的`metric='accuracy'`和`ClsHead`里的`topk=(1, 5)`之间有什么关系？config文件中是这样写的：

```python
evaluation = dict(interval=1, metric='accuracy', save_best='accuracy_top-1')
```

这里的`interval`和`save_best`是传给`EvalHook`的，而`metric`等其他参数则是传给`CustomDataset`（或其他数据集类）的。实际上还有别的metric，`base_dataset.py`代码文件中`evaluate`函数是这样写的

```python
# def evaluate(...):
  # ...
  if metric_options is None:
    metric_options = {'topk': (1, 5)}
  if isinstance(metric, str):
    metrics = [metric]
  else:
    metrics = metric
  allowed_metrics = [
    'accuracy', 'precision', 'recall', 'f1_score', 'support'
  ]
  # ...
  if 'accuracy' in metrics:
    if thrs is not None:
      acc = accuracy(results, gt_labels, topk=topk, thrs=thrs)
    else:
      acc = accuracy(results, gt_labels, topk=topk)
    if isinstance(topk, tuple):
      eval_results_ = {
          f'accuracy_top-{k}': a
          for k, a in zip(topk, acc)
      }
    else:
      eval_results_ = {'accuracy': acc}
  # ...
  return eval_results
```

所以这个`save_best`传递的`accuracy_top-1`实际上是`eval_result`的一个`key`。
