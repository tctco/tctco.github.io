---
title: 记录一下常用Linux命令！
date: 2025-04-15 17:44:43
tags:
categories:
---

安装oh-my-zsh

```bash
git clone https://gitee.com/hailin_cool/zsh-autosuggestions.git $ZSH_CUSTOM/plugins/zsh-autosuggestions
git clone https://gitee.com/Annihilater/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting

ZSH_THEME="agnoster"

sudo apt install fonts-powerline
```

安装ssh

```bash
sudo apt install openssh-client openssh-server
```

系统级禁用密码登录

```bash
# /etc/ssh/sshd_config

PasswordAuthentication no
PubkeyAuthentication yes
systemctl restart ssh
# systemctl -l --type service --all|grep ssh看具体叫什么名字
```

```bash
# ~/.ssh/authorized_keys

# user pubkey here
```

创建新用户并加入sudo组
```bash
sudo adduser <username>
sudo adduser <username> sudo
# usermod -aG groupname username
```

WSL2端口转发

> 在windows防火墙-高级中添加允许22端口连接的入站规则

[Windows官方文档](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking)中有详细描述。

> 但是这里有一个巨坑的地方，(wsl hostname -I)返回回来的东西带一个空格，应该是(wsl hostname -I).Trim()...
> 这个问题可以通过这个方式验证

```ps1
$wslip = (wsl hostname -I);
echo "'$wslip'"
```

```powershell
netsh interface portproxy add v4tov4     \
    listenport=22 listenaddress=0.0.0.0  \
    connectport=22 connectaddress=(wsl hostname -I)

netsh interface portproxy show all
netsh interface portproxy delete v4tov4 listenport=22 listenaddress=0.0.0.0
```

如果希望每次开机自动启动这个功能，可以使用Task Scheduler/任务计划程序。
1. 在任务计划程序库中新建文件夹
2. 右键-创建基本任务，按操作进行即可
3. 操作栏填入`powershell.exe -File "path\to\script.ps1"`
4. 如果需要，可以勾选使用最高权限运行

![任务计划程序](https://raw.githubusercontent.com/tctco/ImgHosting/master/20250424230415.png)

> 另外关闭wsl窗口，wsl也会退出。



生成秘钥
```bash
ssh-keygen -t rsa -C "youremail@example.com"
```

## 用户管理

- 切换用户 `su <username>`
- `/etc/passwd` `/etc/shadow`
- 查看用户组 `groups` `/etc/group`
- 添加删除用户 `adduser` `deluser`
- 更改密码 `passwd <username>`

## 进程

- `ps aux`

## ufw

```bash
sudo ufw allow <port>/<protocol: e.g. TCP>
sudo ufw status
sudo ufw enable/disable
```


# Traefik

```yaml
# traefik_dynamic.yaml
http:
  routers:
    http-catchall:
      rule: "HostRegexp(`{host:.+}`)"
      entryPoints:
        - web
      middlewares:
        - redirect-to-https
      service: noop@internal

    traefik-dashboard:
      rule: Host(`traefik.domain.nip.io`)
      entryPoints: websecure            # 或 websecure
      service: api@internal
      middlewares:
        - auth
      tls: {}

  middlewares:
    auth:
      basicAuth:
        users:
          - "admin:$apr1$4h4WW8VF$LCZ0uI4NZdfU6tXPHqbzI1"
          # 这里存储的实际上是hash过的结果
          # 例如 printf "admin:$(openssl passwd -apr1 xxxxxxx)\n"
    redirect-to-https:
      redirectScheme:
        scheme: https
tls:
  certificates:
    - certFile: "/certs/selfsigned.crt"
      keyFile: "/certs/selfsigned.key"
```

# 操作网络

```bash
nmcli device status # Network-Manager
```

查看网卡接口信息

```bash
ip a # 没有以太网口？
```

- `lo`回环网口localhost，每个设备都有
- `wlp8s0`无线网卡

检查驱动是否加载流程

```bash
lspci | grep -i ethernet # -i不再区分大小写

# 07:00.0 Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8125 2.5GbE Controller (rev 0c)
```

检查是否安装驱动

```bash
sudo lshw -C network # list-hardware

# UNCLAIMED / driver=UNSET表示驱动没有成功安装
```

> Realtek 8125 是一款 2.5Gbps 有线网卡（RTL8125/RTL8125B），它不是内核默认支持的 8168/8111 系列，所以在 Ubuntu 上通常需要额外安装驱动。

在官网上下载解压后，通常有一个脚本文件

```bash
sudo ./authrun.sh

sudo reboot
```

即可自动安装


# 操作硬盘

```bash
lsblk -f # 查看磁盘文件系统
# NAME FSTYPE FSVER LABEL UUID FSAVAIL FSUSE% MOUNTPOINTS

# 只想看磁盘，不扫描网络
sudo lshw -disable network -C disk -C storage

lsblk -d -o NAME,MODEL,VENDOR,SIZE,UUID # -d只看整块磁盘

lsblk -o NAME,VENDOR,MODEL,SIZE,FSSIZE,FSUSED,FSUSE%,FSAVAIL,MOUNTPOINT

df -h


```

挂载与卸载

```bash
sudo mount -t ntfs3 /dev/sda1 /mnt/ntfs
```


# systemd

```ini
# /etc/systemd/system/rjsupplicant.service

[Unit]
Description=Ruijie Campus Network Auto Login
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
ExecStart=/path/to/rjsupplicant.sh -u your_username -p your_password
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
chmod +x /path/to/rjsupplicant.sh
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable rjsupplicant.service
# sudo systemctl restart rjsupplicant.service
```

# docker

> 阿里云[手动部署文档](https://help.aliyun.com/zh/simple-application-server/use-cases/manually-deploy-docker?spm=a2c4g.11186623.help-menu-58607.d_3_0_1_5_1.4f1c112dOO42xd#fa17f21316iu3)

```bash
sudo docker compose -f path/to/traefik/docker-compose.yaml logs --tail=50 traefik

# docker compose logs --since 30m traefik
```

临时安装curl

```bash
apk add --no-cache curl
apt update && apt install -y curl
```

记录一个奇妙的bug

1. 起因：keycloak正常拉起，并能从外网访问；随后将keycloak加入orthanc内网，结果keycloak挂掉
2. 特征：keycloak有时能访问上（尤其是刚docker compose up起来的时候），但有时候又报504 timeout
3. 解决：labels中添加`- "traefik.docker.network=traefik"`

> 或者或者在 Traefik 全局静态配置中设默认网络
> ```yaml
> command:
>  - "--providers.docker.network=traefik"
> ```


## mongodb authentication的各种问题

- ?authSource=admin
- docker删除mongodb volume再试一次


## rsync

```bash
rsync -av --delete /path/to/source/ /path/to/destination/
```

在路径后加`/`避免同步文件夹本身。

- a：归档模式，保留文件权限、时间等；
- v：显示详细信息；
- -delete：删除目标中源中已不存在的文件，实现真正意义的“同步”。
