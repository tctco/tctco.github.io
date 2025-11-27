---
title: DataStructure Huffman Tree
date: 2019-04-26 00:22:33
tags:
categories:
katex: true
---

> Zhejiang University

## Huffman Tree

Question: How can we fit a 100 mark test into a 5 standards judging system?

We need to carefully arrange our if clauses in accordance with the frequency of the actual result. **(Decision Tree)**

**Cost:** $\sum\rm ratio\times layers$

### Definition

**Weighed Path Length**: A binary tree with n nodes with weight w. The distance between root and each leaf is l. Then the WPL for each leaf node will be 
$$
WPL = \sum_{i=1}^nw_kl_k
$$
Huffman Tree is also called Optimal Binary Tree with the least WPL.

### Creating a Huffman Tree

Merge the two binary tree with the least weight every time.

Structure of a Huffman Tree

```
typedef struct TreeNode *HuffmanTree;struct TreeNode{    int Weight;    HuffmanTree Left, Right;}
```

The new problem will be: **How to find the 2 binary tree with the least weight?**

*A: Heap.*

### Properties

- Without a node with degree 1.
- A Huffman Tree with n nodes has 2n-1 nodes.

$$
n_2=n_0-1
$$



- After swaping the left and right tree of a Huffman Tree, it is still a Huffman Tree.
- It is possible to build 2 Huffman Trees with the same WPL (1,2,3,3).

### Huffman Encoding

To avoid ambiguity, we introduce **prefix code**.

As long as all the characters are placed on the leaf nodes, there will not be a character which is the prefix code of another character.

Then we build a Huffman Tree (**NOTE: we do not need to make each leaf have the same degree!**).
