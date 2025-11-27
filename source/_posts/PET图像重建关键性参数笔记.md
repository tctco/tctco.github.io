---
title: PET图像重建关键性参数笔记
date: 2023-11-20 16:42:45
tags:
categories: Nuclear Medicine
---

`template_sinogram.hs`文件用于配置重建参数。

```interfile
!INTERFILE  :=
!imaging modality := PT
name of data file := template_sinogram.hs
originating system := userdefined
!version of keys := STIR3.0
!GENERAL DATA :=
!GENERAL IMAGE DATA :=
!type of data := PET
imagedata byte order := LITTLEENDIAN
!PET STUDY (General) :=
!PET data type := Emission
applied corrections := {None}
!number format := float
!number of bytes per pixel := 4
number of dimensions := 4
matrix axis label [4] := segment
!matrix size [4] := 1
matrix axis label [3] := view
!matrix size [3] := 64
matrix axis label [2] := axial coordinate
!matrix size [2] := { 15}
matrix axis label [1] := tangential coordinate
!matrix size [1] := 90
minimum ring difference per segment := { -1}
maximum ring difference per segment := { 1}
Scanner parameters:= 
Scanner type := Unknown
Number of rings                          := 8
Number of detectors per ring             := 512
Inner ring diameter (cm)                 := 102
Average depth of interaction (cm)        := 0.7
Distance between rings (cm)              := 1.35
Default bin size (cm)                    := 0.3129
View offset (degrees)                    := 0
Maximum number of non-arc-corrected bins := 192
Default number of arc-corrected bins     := 192
Number of blocks per bucket in transaxial direction         := 1
Number of blocks per bucket in axial direction              := 1
Number of crystals per block in axial direction             := 1
Number of crystals per block in transaxial direction        := 8
Number of detector layers                                   := 1
Number of crystals per singles unit in axial direction      := 1
Number of crystals per singles unit in transaxial direction := 8
end scanner parameters:=
effective central bin size (cm) := 0.317225
number of time frames := 1
!END OF INTERFILE :=
```

- `interfile`文件格式：专门用于医学成像数据，包含文本头文件`.hdr`和二进制数据文件`.img`/`.s`。STIR的命名规范里是`.hs`和`.s`
- `applied corrections := {None}` - 应用的校正，这里没有应用任何校正
- `matrix axis label [4] := segment` - 第四维的轴标签是“segment”（段）。
  - `segment`：表示环差相同的一组数据，例如环差为0表示的就是事件探测器在同一个环上，这些数据被组织成一个段
- 
