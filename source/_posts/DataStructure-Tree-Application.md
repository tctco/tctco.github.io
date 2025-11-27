---
title: DataStructure Tree Application
date: 2019-04-13 00:20:33
tags:
categories:
---

> Zhejiang University

## Binary Search Tree (BST)

### Properties

- Left subTrees’s values are smaller than their roots
- Right subTrees’s values are larger than their roots
- Left and Right subTrees are all BSTs

### API

- Position Find(ElementType X, BinTree BST)
- Position FindMin(BinTree BST)
- Position FindMax(BinTree BST)
- BinTree Insert(ElementType X, BinTree BST)
- BinTree Delete(ElementType X, BinTree BST)

#### Find

1. Recursion

2. Loop

   ```c
   while(BST){ 
     if(X > BST->Data)
       BST = BST->Right; 
     else if(X < BST->Data)  
       BST = BST->Left; 
     else   
       return BST;
   }
   return NULL;
   ```

### Insert

Very Similar to Find. However, we should store the location of the root!

```c
if(!BST){   
  BST = malloc(sizeof  TreeNode); 
  BST->Data = X;  
  BST->Left = BST->Right = NULL;
}else{  
  if(X < BST->Data)  
    BST->Left = Insert(X, BST->Data)    else if(X>BST->Data)    
    BST->Right = Insert(X, BST->Right);
  return BST
}
```

### Delete

**Three Conditions**

- Leaf
- Only one child
- Two Cildren

------

**Two Children**

The main idea is to convert this condition into the other 2 simpler ones above.

**Methods**

- Replace it with the smallest in the left and convert it into deleting the smallest one in left (Only one child)
- Replace it with the largest in the right and convert it into deleting the largest one in the right (Only one child)

------

## Balanced Binary Tree

**Balance Factor**: BF(T) = h(left) - h(right)

For a **Balanced Binary Tree** (AVL tree), for every node in this tree the difference between any left and right subtree is no larger than 1.

------

**What is the least number of nodes for a Balanced Binary Tree?**
*Fibonacci sequence!*

------

### Adjusting Balance Binary Tree

1. Right right rotation
   - Because the trouble node is on the right subtree of the right subtree of the detector, this is called RR insert.
2. Left left rotation
3. Left right rotation
4. Right left rotation
   *Remark: When two detector-troublenode appear, we should handle the pair below the tree. This may also solve the upper problem.*
