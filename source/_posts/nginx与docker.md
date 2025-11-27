---
title: nginx与docker
date: 2025-01-08 11:00:26
tags:
categories:
---

# Nginx

nginx的作用
- 多server的负载均衡
- 加密：HTTPS

术语
- directives（指令？）: key-value
- context：{...}

serve static files

```nginx
http {
    server {
        listen 8080;
        root /path/to/static/file/folder;
    }
}

events {}
```

然后reload
```bash
nginx -s reload
```
## MIME Types

在不配置的情况下，css不能成功应用到html文件中
- 检查Response headers - Content-Type: `text/plain`

```nginx
http {
    types {
        text/css    css; # 斜杠就代表文件名中的.
        text/html   html;
    }
    server {...}
}
```

但是MIME Type太多了！`mime.types`有对应的映射表！

```
http {
    include mime.types;
    server {...}
}
```

## Location block / context

```nginx
http {
    include mime.types;
    server {
        listen 8080;
        root /path/to/static/files/folder;

        location /fruits {
            root /path/to/static/files/folder; # location会自动拼接路径
        }

        location /carbs {
            alias /path/to/static/files/fruits; # alias不会自动拼接路径
        }
    }
}

events {...}
```

nginx默认只提供index.html，但可以通过try_files指定

```nginx
http {
    include mime.types;
    server {
        ...

        location /vegetables {
            root /path/to/static/files/folder;
            try_files /vegetables/veggies.html /index.html =404 # 会先尝试root/vegetables/veggies.html，如果不行就root/index.html，如果全没有就404
        }
    }
}
...
```

location也可以使用regex

```nginx
http {
    ...
    server {
        ...
        location ~* /count/[0-9] { # ~*声明了一个regex
            root /path/to/static/files/folder;
            try_files /index.html =404;
        }
    }
}
...
```

## Redirect与Rewrite

重定向redirect

```
location /crops {
    return 307 /fruits # 重定向码，但浏览器会显示/fruits
}
```

如果不希望浏览器url变化，应该使用rewrite

```nginx
http {
    ...
    server {
        ...
        rewrite ^/number/(\w+) /count/$1; # 定义你的重写规则，把number转换成count

        location ~* /count/[0-9] { 
            root /path/to/static/files/folder;
            try_files /index.html =404;
        }
    }
}
```

## 负载均衡

```nginx
http {
    ...
    upstream backendserver { # 首先开启4个backend server用于轮询
        server 127.0.0.1:1111;
        server 127.0.0.1:2222;
        server 127.0.0.1:3333;
        server 127.0.0.1:4444;
    }

    server {
        listen 8080;
        root /path/to/static/files/folder;
        
        location / {
            proxy_pass http://backendserver/; # 执行轮询
        }
        ...
    }
}
...
```

# docker

遇到的小问题：docker compose up拉起服务的时候，如果某个container挂掉了，想进去debug的话用这个指令

```bash
docker compose run --entrypoint /bin/bash <service-name>
```

注意！这里的service name是docker-compose文件里的！例如，一个docker-compose文件长这样

```yaml
service:
  postgres: # 这是service name
    image: postgres:latest
    ...
```

如果postgres不明原因挂了而且起不来，就可以用上面的指令进去看什么情况。

每个service都对应一个container name，但是在使用docker compose命令的时候一般用service名而不是container名，尽管在后台docker还是拉起了container。

docker-compose的`expose:`字段在traefik中不占用宿主机端口，而`ports:`则占用。

traefik主要还是http(s)协议代理，rtmp等还是直接端口映射或nginx-rtmp比较好。

docker-compose进入容器调试可以用

```bash
sudo docker compose exec [service-name] /bin/bash
```

