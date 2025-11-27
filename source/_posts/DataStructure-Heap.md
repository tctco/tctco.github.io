---
title: DataStructure Heap
date: 2019-04-23 00:21:50
tags:
categories:
---

> Zhejiang University

## Heap

#### What is heap?

When a computer is doing many things at the same time, different tasks will have different priorities.

Thus we have a special data structure: **Priority Queue**.

### Creating a heap

We need 2 functions: *insert and delete*

- Array
  difficult to delete a element
- linked list
- Ordered Array
  difficult to insert
- Ordered linked list
- Tree

### Tree

Tree has some great characteristics in realizing heap. The insert process is related to the height of a tree while the delete process involves the left or right node of a tree.

#### Binary Search Tree?

**Problem**: When you delete too many nodes, the tree won’t be balanced anymore.

Which is more important? Insert or delete?
**Delete**
Because deleting is much more difficult to do.

So, how can we arrange the structure of a tree?
**Place the largest one on the root**

What kind of tree should we use?

### Heap: Complete Binary Tree

#### Properties

1. Array
2. Ordered
   - MaxHeap
   - MinHeap

#### Operation Set

- MaxHeap Create(int MaxSize)
- Boolean IsFull(MaxHeap H)
- Insert(MaxHeap H, ElementType item)
- Boolean IsEmpty(MaxHeap H)
- ElementType DeleteMax(MaxHeap H) //Return the maxium element

#### Creating a Heap

```c
typedef struct HeapStruct *MaxHeap;
struct HeapStruct{  
  ElementType *Elements;   
  int Size;   
  int Capacity;
}
```

*Review: Properties of tree stored in an array.*

#### Insert

**REMARK**: We usually store data begin with index 1. The index 0 will be used to store a sentinel(max).

#### Delete

Put the last element on the root and check whether the tree is still ordered.

#### Creating the MaxHeap

- Insert to an empty heap O(NlogN)
- O(N)
  1. Insert in order to meet the requirements of a complete binary tree.
  2. Adjusting the positions to meet the requirements of a ordered tree.(From the bottom)
