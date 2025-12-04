---
title: SOP
date: 2025-12-02 16:37:39
tags:
categories:
---

## 开发

接口规范：

```json
{
  "code": 0,
  "data": {
    "list": [],
    "total": 0,
    "xxx": "xxx"
  },
  "message": "success"
}
```

```json
{
  "code": 0,
  "data": {},
  "message": "success"
}
```

- data不能为null
- 必须返回message，前端可以直接提供结果
- code为业务与http code不能一致


## 实验

- 子实验以 `exp_{expName}` 文件夹管理
- 子实验内部分成：data_prepare和plot两个部分
- 每次修回单独创建文件夹，如 `revision1`
- ❓死亡时间未知的，按最后一次随访算（cox）
