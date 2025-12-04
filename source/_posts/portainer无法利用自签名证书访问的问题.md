---
title: portainer无法利用自签名证书访问的问题
date: 2025-12-02 16:28:35
tags:
categories:
---

portainer官网上给出的docker-compose文件如下

```yaml
services:
  portainer:
    container_name: portainer
    image: portainer/portainer-ce:lts
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    ports:
      - 9443:9443
      - 8000:8000  # Remove if you do not intend to use Edge Agents

volumes:
  portainer_data:
    name: portainer_data

networks:
  default:
    name: portainer_network
```

需改成下面的，才能接traefik

```yaml
services:
  portainer:
    container_name: portainer
    image: portainer/portainer-ce:lts
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data
    # 端口映射其实都可以去掉，Traefik 走内网网络就行
    # ports:
    #   - 9443:9443
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.portainer.rule=Host(`portainer.${HOST_DOMAIN}`)"
      - "traefik.http.routers.portainer.entrypoints=websecure"
      - "traefik.http.routers.portainer.tls=true"
      # 后端改为 HTTP 9000
      - "traefik.http.services.portainer.loadbalancer.server.port=9000"

```
