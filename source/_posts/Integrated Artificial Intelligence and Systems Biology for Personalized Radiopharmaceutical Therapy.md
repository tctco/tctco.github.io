---
title: Personalized Treatment Planning for Radiopharmaceutical Therapy
tags: Nuclear Medicine
date: 2023-10-10 00:00:00
categories: Nuclear Medicine
---



## Personalized Treatment Planning for Radiopharmaceutical Therapy

1. Pre-therapy imaging (PET/CT)
2. Dose-estimation: Intensively investigated and partially solved (planar / SPECT/CT)
3. Treatment

> - Dose prediction
> - Dose effect
>   - Treatment outcome
>   - Adverse events

## Vitalize the virtual patient

### Physiologically-based pharmacokinetic (PBPK) model

- Simulate time-course of radioligand uptake in organs of virtual patient
- Organs & tumor: homogenous
- Simulate PET imaging using realistic PET simulator
- Dose calculation using the dose voxel kernel (DVK) method
- Simulate voxel-S-values matrices and convolved with phantoms organs

### Reaction-diffusion computational simulation

Difusion + Metabolism 偏微分方程

Quantitative interpretation of the tumor microenvironment

### Histology-driven convection-reaction-diffusion model

### Cell Automata Model

### Virtual Clone of a Patient / Whole body dynamic imaging & PBPK modelling

### Spatial Transcriptomics for Precise Modelling

## Accelerate Virtual Patient Clone using Artificial Intelligence

- machine learning for pre-therapy prediction of dosimetry
- development of voxel-wise pre-therapy dose prediction
  - integrate virtual patients to pretrain ai
  - PBPK-adapted deep learning

> The PBPK loss term
>
> $$
> L_{PBPK} = \sum_j [ReLU(b_{l,j}-G_{k, j}) + ReLU(G_{k, j}-b_{u,j})]\\
> G_{k,j} = \frac 1 N \sum_{i=1}^NG_i I(C_i,G_i)\\
> I(C_i,G_i) = \begin{cases}
> 1 & C_i=j\and 0 \le G_i\\
> 0 & otherwise
> \end{cases}
> $$
>
> Non-negative dose
>
> $$
> L_{nonneg}=\frac 1 N \sum_{i=1}^NReLU(-G_i)
> $$

## Deep learning on Dynamic Total-body PET for Pretherapy Dosimetry Prediction

- Seq2seq