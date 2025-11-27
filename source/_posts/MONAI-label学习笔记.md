---
title: MONAI label学习笔记
date: 2023-12-03T20:19:46.000Z
tags: null
categories: Radiomics
---

# 图片配准

> 模板记得选nii格式的。下面的代码可以帮助配准PET/MR图像，PET图像使用MR图像的相同变换模式。

```python
import ants

mr_image = ants.image_read('./abeta/mr.nrrd')
mni_template = ants.image_read('./mni305_lin_nifti/average305_t1_tal_lin.nii')
mr_to_mni_transform = ants.registration(fixed=mni_template, moving=mr_image, type_of_transform='Affine')

pet_image = ants.image_read('./abeta/pet.nrrd')
pet_to_mni = ants.apply_transforms(fixed=mni_template, moving=pet_image, transformlist=mr_to_mni_transform['fwdtransforms'])

ants.image_write(mr_to_mni_transform['warpedmovout'], './registered_mr_image.nii')
ants.image_write(pet_to_mni, './registered_pet_image.nii')
```

# MONAI

1. monailabel
2. 运行自定义模型（model zoo中的），需要先安装`bundleapp`：`monailabel apps --name monaibundle --download --output .`，这里的output可以选你希望的位置
3. 运行服务器：`monailabel start_server --app .\monaibundle\ --studies .\datasets\brain\ --conf models wholeBrainSeg_Large_UNEST_segmentation_v0.2.3`；其中`studies`是需要标注和检索的图像数据（可以是`nii`格式）
   1. `--port`以改变端口
4. 3dslicer中需要安装monailabel的插件。在`Modules->Active Learning`中可以找到，也可以在`Edit->Application Settings->Modules`把插件加入到快捷栏
5. 设置MONAI Label Server：本地的就是`http://127.0.0.1:8000/`
6. 选`Next Sample`从服务器端下载
7. 在`Auto Segmentation`里选择模型，并点击`Run`

# 读取mask

通过3DSlicer得到segm文件之后：

```python
import nrrd
data, header = nrrd.read('./mask.nii.seg.nrrd')
# print(header)

import monai
fig = monai.visualize.utils.matshow3d(volume=data.T, 
                                title='Brain Segm', 
                                figsize=(20,20),
                                frames_per_row=6, 
                                frame_dim=-3,
                                every_n=5,
                                vmin=0, vmax=133,
                                cmap='Greys',
                                fill_value=0)
```
