---
title: orthanc
date: 2025-05-22 15:49:42
tags:
categories:
---

orthanc + keycloak组合的模式如何写脚本访问受保护的资源

这里的[文档](https://github.com/orthanc-team/orthanc-auth-service/tree/main/minimal-setup/keycloak)详细描述了配置过程。

为了让脚本能够自由登录orthanc，可以在orthanc realm里创建一个`script-bot`用户，给它对应的权限。

![用户管理-创建用户-属性](https://raw.githubusercontent.com/tctco/ImgHosting/master/20250522155542.png)

添加一个`api-key`，并给它一个强密码

随后就可以在脚本中通过`api-key`进行操作了

```python
import requests, urllib3
urllib3.disable_warnings()  # 如果用自签证书

ORTHANC = "https://imaging.122.205.51.104.nip.io/orthanc"
API_KEY = "123123123123"
r = requests.get(f"{ORTHANC}/patients", headers={"api-key": API_KEY}, verify=False) # 自签证书设置verify=False
r.raise_for_status()
print(r.text)

# [
#   "0c8c47b6-3b...",
#   "352b7141-3b...",
# ]
```