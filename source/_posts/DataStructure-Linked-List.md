---
title: DataStructure Linked List
date: 2019-04-02 00:11:47
tags:
categories: Algorithm
---

> Zhe Jiang University

### Design

Target: Find the sum and the product of 2 polynomials.

##### Data Structure

```c
typedef struct PolyNode *Polynomial;
struct PolyNode{
  int coef; 
  int expon; 
  Polynomial link;
};
```

##### Structure of the program

```c
Polynomial P1, P2, PP, PS;

P1 = ReadPoly();
P2 = ReadPoly();
PP = Multi(P1, P2);
PrintPoly(PP);
PS = Add(P1, P2);
PrintPoly(PS);
```

------

### Some New Ideas

1. If you want to pass in a variable and let the function change it, you have to pass in a more ‘fundamental’ thing - that is - a pointer to this variable. If passing the value itself, there will be a ‘shell’ to preent it from being changed.

2. (linked list) Getting the node just before the target node can be sometimes more flexible. It is easier to delete a node.

   ```c
   t = Rear->link;
   Rear->link = t->link;
   free(t);
   ```

3. Creating a linked list: in writing a connecting function, in order to avoid if-clauses to find whether it is the first node of a list, you can just create am empty node at the head of a linked list and in the end delete it.

   ```c
   P->link = NULL; 
   Rear = P; 
   while(N--){
     scanf("%d %d", &c, &e); 
     Attach(c, e, &Rear); 
   }
   ```

4. The usage of scanf is easier than expected. The computer will stop getting input every time it meets a space or an enter. The way to get input can simply be like the example below.

   ```c
   scanf("%d", &N); 
   P = (Polynomial)malloc(sizeof(struct PolyNode)); 
   P->link = NULL; 
   Rear = P; 
   while(N--){
     scanf("%d %d", &c, &e); 
     Attach(c, e, &Rear); 
   }
   ```

   REMARK: The pause enter or space will be dumped by the computer instead of being inputed.
