---
title: DataStructure Queue
date: 2019-04-06 00:15:20
tags:
categories:
---

> Zhejiang University

## Queue

> A restricted linear table.

Queue and Round-robin Queue

### Properties

- AddQ
- DeleteQ
- FIFO

### Operation Set

- Queue CreateQueue(int Maxsize)
- int IsFull(Queue Q, int MaxSize)
- void AddQ(Queue Q, ElementType item)
- int IsEmpty(Queue Q)
- ElementType DeleteQ(Queue Q)
- indicators
  - front(begins with -1)
  - rear(begins with -1)

### Round-robin Queue

A more efficient way to make use of space.

**Questions:**

- *How to tell whether a queue is full?*
- *Why is it difficult to tell whther it is full? What are the reasons?*

**Answer:**

- *There are n results of rear - front while there are n+1 conditions about a round-robin queue*

**Solutions:**

- *Use another indicator(Size(0 or n)/tag(the last move is add or delete?))*
- (Common)*Use only n-1 blocks*

### Creating Round-robin Queue

#### Array

1. Add
   1. Check if the queue is full by `(rear + 1) % MaxSize == front`
   2. Use Mod function to move the rear to the next block.
2. Delete:
   1. Check if the queue is empty by `front == rear`
   2. Use Mod function to move the front to the next block.

#### Linked List

Front at the head of the linked list, Rear at the end of the linked list.

**Structure**

```C
struct Node{    
  ElementType Data;   
  struct Node *Next;
};
struct QNode{ 
  struct Node *rear;  
  struct Node *front;
};
typedef struct QNode *Queue;
Queue PtrQ;
```

### Exerciese

*Q: How to use 2 stacks to create a queue?*

1. *Fill Stack 1*
2. *Once Stack 1 is full, get all items to Stack 2*
3. *Fill Stack 1*
4. *The head of the queue will be the top of Stack 2 and the rear of the queue will be the top of Stack1*
