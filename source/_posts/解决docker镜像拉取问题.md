---
title: 解决docker镜像拉取问题
date: 2024-11-05T17:27:34.000Z
tags: null
categories: null
---

docker拉取镜像的时候经常断，之前解决过一次，结果忘了，又折腾一遍。所以写个短小的笔记记录一下

首先遇到了这个问题：

```error
ailed to solve: nginx:alpine: failed to copy: httpReadSeeker: failed open: failed to do request: Get "https://production.cloudflare.docker.com/registry-v2/docker/registry/v2/blobs/sha256/cb/cb8f91112b6b50ead202f48bbf81cec4b34c254417254efd94c803f7dd718045/data?verify=1730801617-FU3heZxDeHwA43OyZBn3i%2BkKwM0%3D": dialing production.cloudflare.docker.com:443 matches manual override exclude: connecting to 173.252.108.3:443: dial tcp 173.252.108.3:443: connectex: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond.
```

或者是此类问题

```error
ERROR: failed to solve: DeadlineExceeded: context deadline exceeded
```

一个比较容易想到的解决办法是在docker desktop里面设置

![docker engine desktop proxy settings](https://raw.githubusercontent.com/tctco/ImgHosting/master/20241105173052.png)

但是试了下不知道为啥不能用，可能是得在wsl里面设置？遂用如下代码

```bash
#!/bin/bash
host_ip=$(ip route show | grep -i default | awk '{ print $3}')
export ALL_PROXY="http://$host_ip:10809"
export HTTPS_PROXY="http://$host_ip:10809"
export HTTP_PROXY="http://$host_ip:10809"
echo $ALL_PROXY
alias proxy="export ALL_PROXY=http://$host_ip:10809; export HTTPS_PROXY=http://$host_ip:10809; export HTTP_PROXY=http://$host_ip:10809"
alias unproxy="unset ALL_PROXY; unset HTTPS_PROXY; unset HTTP_PROXY"
```

这里还有个需要注意的地方，就是只设置`ALL_PROXY`是不管用的，docker似乎会拉取`HTTP(S)_PROXY`的值，所以还必须把他俩设置了。
