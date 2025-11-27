---
title: DataStructure Binary Tree
date: 2019-04-07 00:17:38
tags:
categories:
---

> Zhejiang University

## Binary Tree

### Properties

- Degree = 2.
- L and R are different.
- Layer i has a maximum number of nodes 2^(i-1)
- Degree = K, node sum = 2^(k-1)
- For any not-null binary tree, n0 = leaf, n2 = nodes which have 2 non-leaf nodes, then **n0 = n2+1**

### Operation Set

- Boolean IsEmpty(BinTree BT)
- void Traversal(BinTree BT)
  - PreOrderTraversal:rLR
  - InOrderTraversal:LrR
  - PostOrderTraversal:LRr
  - LevelOrderTraversal:UD,LR
- BinTree CreatBinTree()

### Special Binary Tree

- Skewed Binary Tree
- Perfect Binary Tree(Full Binary Tree)
- Complete Binary Tree(Number every node from up to down and left to right, they will be the same as Perfect Binary Tree)

### Creating Binary Tree

#### Array: Complete Binary Tree

------

##### Properties

- Node i’s parent = [i/2]
- Left Child = 2i if 2i <= n
- Right Child = 2i+1 if 2i+1 <= n
- We can also convert a common Binary Tree into a Complete Binary Tree (wasting space).

#### Linked List: Binary Tree

------

##### Structure

```c
typedef struct TreeNode *BinTree;
typedef BinTree Position;
struct TreeNode{
  ElementTyle Data;  
  BinTree Left; 
  BinTree Right;
}
```

### Traversal

- PreOrderTraversal:rLR
  1. Accessing r
  2. PreOrderTraversal its left SubTree.
  3. PreOrderTraversal its right SubTree.

```C
void PreOrderTraversal(BinTree BT){   
  if(BT){      
    printf("%d", BT->Data);    
    PreOrderTraversal(BT->Left);  
    PreOrderTraversal(BT->Right);  
  }
}
```

- InOrderTraversal:LrR
  - Similar to PreOrderTraversal

```C
InOrderTraversal(BT->Left);
printf("%d", BT->Data);
InOrderTraversal(BT->Right);
```

- PostOrderTraversal:LrR
  - Similar to PreOrderTraversal

```c
PostOrderTraversal(BT->Left);
PostOrderTraversal(BT->Right);
printf("%d", BT->Data);
```

------

#### Problem: Can we avoid recursion?

Since all recursions are realized by Stack, we can use Stack to simulate this process.

1. Push every node encountered and traversal its left SubTree.
2. When the left SubTree traversal is finished, pop this node and access(print) it.
3. Traversal its right SubTree.

```C
void InOrderTraversal(BinTree BT){  
  BinTree T = BT;  
  Stack S = CreateStack(MaxSize); 
  while(T || !IsEmpty(S)){  
    while(T){     
      Push(S, T);         
      T = T->Left;     
    }       
    if(!IsEmpty(S)){   
      T = Pop(S);      
      printf("%5d", T->Data);  
      T = T->Right;   
    }  
  }
}
```

**Problem**

1. How about Pre?
2. How about Post?

------

**The key issue of Traversal of a Binary Tree is how to convert a 2d tree into a linear thing**
We have to access a node from its parent. The problem is if we access its left Child, we cannot access its right Child if we dump the parent node itself. So we need to store the right child or at least itself to access the right Child.

To store these Node temporarily unnecessary, we may use queue or stack.

- LevelOrderTraversal:UD,LR

  #### Queue

  Add left child and right child to the queue when accessing a node. Delete and access the node in the queue and then add its children into the queue.

  ```C
  void LevelOrderTraversal(BinTree BT){  
    Queue Q;
    BinTree T;
    if (!BT) return;
    Q = CreateQueue(MaxSize); 
    AddQ(Q, BT); 
    while(!IsEmptyQ(Q)){  
      T = DeleteQ(Q);   
      printf("%d\n", T->Data);  
      if(T->Left) AddQ(Q, T->Left);     
      if(T->Right) AddQ(Q, T->Right); 
    }
  }
  ```

### New Ideas

- All Pre, In, Post actually follow the same path (UD, LR). Every Node will be met 3 times. The only difference is when we decide to print it out.
  - In the recursion, the sub function will eventually turn to the function which called itself.
