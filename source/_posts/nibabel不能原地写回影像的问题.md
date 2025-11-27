---
title: nibabel不能原地写回影像的问题
date: 2025-01-17 22:12:31
tags:
categories:
---

问题背景：因为我太菜了……为了图省事需要对一个nii文件反复读取、修改、写回磁盘。但是突然之间报这个问题：
> PermissionError: [WinError 32] 另一个程序正在使用此文件，进程无法访问。: 'centiloid_eval\\AV45\\iter_rigid\\ED05_PET.nii'

大概代码如下：
```python
    ...
    for path, affine in zip(paths, corrected_affines):
        nii = nib.load(path)
        new_nii = nib.Nifti1Image(nii.get_fdata(), affine, nii.header)
        os.remove(path) # PermissionError
        results.append(new_nii)
    ...
```

破案：numpy的mmap问题。

mmap解释：memory-mapped file，一个非常强大的操作系统功能，允许你将文件直接映射到内存中，使得程序可以像操作内存一样直接访问文件数据，而不需要显式地读取或写入文件。

上述代码改为
```python
nii = nib.load(path, mmap=False)
```

即可禁用mmap，然后删掉原始文件。