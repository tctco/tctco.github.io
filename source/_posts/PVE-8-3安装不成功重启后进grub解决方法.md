---
title: PVE 8.3安装不成功重启后进grub解决方法
date: 2025-01-15 23:06:01
tags:
categories:
---

问题：安装PVE 8.3重启后不能正确进入PVE，而是自动进入grub rescue模式（grub命令行）。

解决：主要[方案](https://tieba.baidu.com/p/9252438778)。解决思路为手动加载内核和启动文件，结合gpt具体解决步骤如下：
1. 查找内核文件（vmlinuz）、启动文件（initrd）位置
   ```bash
    ls
    # (proc) (pve-root) (pve-server) (hd0) (hd0,gpt3)...
   ```
   内核文件和启动文件都在`pve-root/boot`下。可以通过`ls (pve-root)/`查看里面有什么东西。要注意的是，括号`()`和分隔符`/`都不可以少！
2. 设置根分区
   ```bash
   set root=(lvm/pve-root)
   ```
3. 加载内核
   ```bash
   linux /boot/vmlinuz-<version> root=/dev/mapper/pve-root
   ```
   这里稍微解释一下：这条指令做两件事情，一个是加载内核到内存，再一个是指定内核应该挂载哪个根文件系统。如果是一个正常的OS，就应该挂载一个物理卷（Volume），比如/dev/sda1；如果是PVE，默认就是逻辑卷/dev/mapper/pve-root。可以回想一下hyper-v的操作，你需要指定vhdx内核和磁盘；在Linux启动时，虽然并没有像 VHDX 这样的单一文件封装整个系统，但内核和根文件系统的加载过程相当于为系统提供了类似的结构——内核加载文件，根文件系统提供整个操作系统环境。
4. 加载`initrd`文件
   ```bash
   initrd /boot/initrd.img-<version>
   ```
   initrd是Initial RAM Disk的缩写，它是一个临时的、压缩的文件系统映像，内核启动时会先加载它，执行一些初始化操作，再最终加载根文件系统。在启动时，内核需要一些额外的驱动程序和程序来帮助挂载根文件系统。特别是对于复杂的系统（例如使用 LVM、RAID、加密磁盘等），initrd 提供了必要的工具来加载这些文件系统或设备。它包括各种驱动程序、系统初始化程序（用于挂载真正的文件系统）还有一些系统工具。
5. 启动
   ```bash
   boot
   ```
6. 更新引导
   ```bash
   update-grub
   ```