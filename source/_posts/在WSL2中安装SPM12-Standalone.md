---
title: 在WSL2中安装SPM12 Standalone
date: 2024-10-30 01:24:28
tags:
categories:
---

1. 在[这个链接](https://www.fil.ion.ucl.ac.uk/spm/download/restricted/utopia/MCR/)下载MATLAB Compiler Runtime
2. 在[这个连接](https://www.fil.ion.ucl.ac.uk/spm/download/restricted/utopia/spm12/)下载SPM Standalone
3. 运行`./MCRInstaller.bin`的时候遇到 No Java Runtime Environment(JRE) was found on this system. 使用`sudo apt install openjdk-11-jre`尝试解决，发现解决不了！可以去看[这个讨论](https://www.jiscmail.ac.uk/cgi-bin/webadmin?A2=SPM;302f92a5.2002)
4. 

## Docker安装SPM

```docker 
FROM ghcr.io/spm/spm-docker:docker-matlab
...
```

需要覆盖`ENTRYPOINT`，否则会报这个错误：

```log
spm12-worker-1  | Error in spm_cli (line 56)
spm12-worker-1  | Error in spm_standalone (line 157)
spm12-worker-1  | Error using spm_cli (line 56)
spm12-worker-1  | Cannot find module python3.
```

原因是：基础镜像 ghcr.io/spm/spm-docker:docker-matlab 自带的 ENTRYPOINT 是类似
```
  /opt/spm12/run_spm12.sh /opt/mcr/v97/ script
```

Dockerfile只加CMD会产生

```
/opt/spm12/run_spm12.sh /opt/mcr/v97 script python3 main.py
```

另外，nipype的input/output节点最好都用上绝对路径`Path.resolve()`。
