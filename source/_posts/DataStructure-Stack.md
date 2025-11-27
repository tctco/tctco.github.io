---
title: DataStructure Stack
date: 2019-04-06 00:13:59
tags:
categories:
---

> Zhejiang University

# Stack

### Problem

How to make computer understand the priority of calculating?

### Expression

**Nifix Expression** is what we are customed to use. But **Postfix Expression** is easier for a computer to understand. We need a structure to store numbers and operators in order and get them out in the reverse order.
Eg:6 2 / 3 - 4 2 * +
store 6->store 2->6 2 out and divide store 3 in-> store 3->3 3 out and minus store 0 in……

### Properties of Stack

- It is a limited linear table.
- Push and Pop at the same end.
- LIFO.

### Operations Set

- CreateStack
- IsFull
- Push
- IsEmpty
- Pop

### Creating Stack

#### Array+indicator on top

Puzzle: How to create 2 Stacks and use their space most efficiently?

##### Example

| Stack1 | Stack2 |
| ------ | ------ |
| L TO R | R TO L |

##### Exercises

```C
#define MaxSize 100
ElementType S[MaxSize];
int top;
void Push(ElementType *S, int top, ElementType item){
  if (top==MaxSize-1) { 
    printf(“堆栈满”);  
    return;    
  }else {   
    S[++top] = item;  
    return; 
  }
}
```

Wrong: Top is a parameter. This will not change the value outside the function

#### Linked list (Linked Stack)

Choose the head will be easier to operator. It is more difficult to get the Node ahead of the Rear.

## Application

### Find the Value of an Expression

1. Convert postfix to nifix.
   - The sequence of number do not change. Output immediately.
   - The sequence of operators will change
     - Store the ‘waiting’ operators.
     - Compare the ‘waiting’ operators and the last operator. Pop all the ‘waiting operators’ of higher priority and then push the current operator.
     - If all objects are handled, pop all operators in the stack.
   - In case of brackets.
     - Outside the brackets, we need to calculate the result in the brackets. Inside the brackets, they(left bracket) have the lowest priority instead.
     - Once get the right bracket, pop out the operators in the stack until meeting the left bracket.
   - In case of 2 operators of the same priority, the first one will have a higher priority (calculate from left to right).
2. Calculate the nifix expression.

### Other utilities

**Call of a function and recursion**
**Depth first search**
**…**

### New Ideas

1. To request a piece of space:
   `Data = (int*)malloc(sizeof(int)*MaxSize);`
2. Be really careful about the boundary conditions.
3. Pay attentation: ‘\n’ at the end of a printf clause is needed.
