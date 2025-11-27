---
title: 记录一次tf缺少cuDNN dll的问题
date: 2024-07-03T22:47:35.000Z
tags: null
categories: null
---

使用`tensorflow`的时候遇到了这个问题：Loaded cuDNN version 8302 Could not load library cudnn_cnn_infer64_8.dll. Error code 126

但实际上我已经把`cudnn_cnn_infer64_8.dll`加到环境变量中去了。

这可能是由于`tf`和`cuDNN`版本不匹配造成的问题。

可以考虑强行引入动态链接库：

```python
import ctypes
ctypes.WinDLL('path/to/cudnn_cnn_infer64_8.dll')
```

这样`tf`就可以正常训练啦！
