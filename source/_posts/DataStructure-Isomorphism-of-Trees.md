---
title: DataStructure Isomorphism of Trees
date: 2019-05-03 01:04:46
tags:
categories:
---

> Zhejiang University

#### Understanding of the Puzzle

We simply regard the trees as the same as long as they have the same children for every node.

## Divide and Conquer

- The representation of a binary tree
- Build a Binary Tree
- Judge whether they are Isomers.

### Representing a Binary Tree

Static Linked List: A Special Array.

### Structure of the Program

```c
BinTree Build();
bool Judge();
int main(){  
  Build tree1; 
  Build tree2;  
  Judge isomers;  
  return 0;
}
```

### Design the Functions

```c
#define ElementType char
#define Tree int
#define Null -1
struct TreeNode{ 
  ElementType Element; 
  Tree Left;  
  Tree Right;
}T1[MaxTree], T2[MaxTree];
```
