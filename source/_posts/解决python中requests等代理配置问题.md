---
title: 解决python中requests等代理配置问题
date: 2025-12-14 22:56:44
tags:
categories:
---

由于一些原因，在hugging face中拉取model可能会遇到问题：

```log
python .\infer.py
Loading DLC 3.0.0rc13...
Loading.... superanimal_topviewmouse_resnet_50
'[WinError 10061] 由于目标计算机积极拒绝，无法连接。' thrown while requesting HEAD https://huggingface.co/mwmathis/DeepLabCutModelZoo-SuperAnimal-TopViewMouse/resolve/main/superanimal_topviewmouse_resnet_50.pt
Retrying in 1s [Retry 1/5].
```

可以在代码头添加proxy（win下一样可用）

```python
os.environ['HTTP_PROXY'] = 'http://127.0.0.1:10809'
os.environ['HTTPS_PROXY'] = 'http://127.0.0.1:10809'
```
