---
title: homelab踩坑记
date: 2025-01-10 01:54:04
tags:
categories:
---

## docker与反向代理篇

- 没有域名！
  - 没有域名真的寸步难行……很多container默认在根目录`/`下工作，一旦redirect出来不带相对路径就寄了，所以还是老老实实的在内网开端口吧
  - 考虑使用cloudflare tunnel

## homepage

- docker container不显示widget状态（[链接](https://gethomepage.dev/configs/docker/)）
  - 首先，docker要能通过TCP提供docker本身的状态（比如[这样](https://gist.github.com/styblope/dc55e0ad2a9848f2cc3307d4819d819f)）。或者通过一个container反向代理只在docker内网里提供信息

```yaml
dockerproxy:
  image: ghcr.io/tecnativa/docker-socket-proxy:latest
  container_name: dockerproxy
  environment:
    - CONTAINERS=1 # Allow access to viewing containers
    - SERVICES=1 # Allow access to viewing services (necessary when using Docker Swarm)
    - TASKS=1 # Allow access to viewing tasks (necessary when using Docker Swarm)
    - POST=0 # Disallow any POST operations (effectively read-only)
  ports:
    - 127.0.0.1:2375:2375
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro # Mounted as read-only
  restart: unless-stopped

homepage:
  image: ghcr.io/gethomepage/homepage:latest
  container_name: homepage
  volumes:
    - /path/to/config:/app/config
  ports:
    - 3000:3000
  restart: unless-stopped
```

然后在`docker.yaml`文件里通过container name访问：

```yaml
my-docker:
  host: dockerproxy
  port: 2375
```

## 数据库篇

- mathesar不能链接到postgres
  - 似乎要从docker内网连接：localhost:5432是不会连上的，但是postgres:5432（service名为postgres）是可以的！