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
