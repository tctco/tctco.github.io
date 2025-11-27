---
title: DataStructure Tree
date: 2019-04-07 00:16:29
tags:
categories:
---

> Zhejiang University

## Tree

A Structure used for managing and organizing different levels of data.

### Properties

- A special node: Root(r)
- The rest nodes can be divided into m nonoverlapping subsets called SubTree.
- SubTrees do not overlap.
- Every Node has one parent except r.
- A tree with N nodes has N-1 sides.

### Terms

1. Degree: The number of SubTrees for a Node.
2. Degree of a Tree: The maximum Degree for all nodes of a tree.
3. Leaf
4. Parent
5. Child
6. Sibling
7. Path and the Distance of Path: From Node n1 to Node nk, the sequence of n1, n2, n3… is a path. The number of sides it contains is called the distance of Path.
8. Ancestor: All nodes in the path from r to a certain node.
9. Descendant: All nodes contained by all SubTrees of a certain node.
10. Level: level of r is 1. The level of a certain node is the level of its parent +1.
11. Depth: the largest level.

### Creating a Tree

A new method: Child-Sibling Method.
One pointer to the Child, the other pointer to the Child’s Sibling.

This is called **Binary Tree**

### Basic Operations

- Search efficiently
  - Static Search: only searching, without inserting or deleting.
  - Dynamic Search: including inserting and deleting

#### Static Search

**Sequential Search**

**Binary Search**
Requirements: stored in order and stored in an array.

When the L and R get reversed in order, search failed.

```C
while (left < right){  
  mid = (left+right)/2;   
  if(K < Tbl->ELement[mid])  right = mid-1;  
  else if(K > Tbl->Element[mid])  left = mid+1;  
  else return mid;
}
```

**Why is binary search so fast?**

We got a decision tree!
The time we search will not surpass the depth of a tree.
For a tree with n Nodes, the ultimate time will be [logn] + 1

**ASL = SUM(time required to search every node)/node_number**

### New Ideas

- Setting Sentinel: In a loop, we need to check whether we have meet the boundary every time. To set a sentinel, we make the boundary value to be what we need to search and abandon the traditional boundary check, so when the loop is at its end, it will meet the sentinel and break.

```c
int SequentialSearch (List Tbl, ElementType K){ 
  int i;   
  Tbl->Element[0] = K;  
  for(i = Tbl->Length; Tbl->Element[i] != K, i--); 
  return i;
}
```
