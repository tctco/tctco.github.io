---
title: DataStructure Set
date: 2019-04-27 00:55:13
tags:
categories:
---

> Zhejiang University

## Set

### Operations

There are some basic operations about sets. Eg: Union, Intersection, Set Difference…

### Union-Find Set

**Problem**: There are n nodes. Some of them are connected. How do we know whether arbitrary 2 of them are connected?

*Answer: Make n sets to include n nodes. Then union those connected. Find whether 2 given nodes are in the same set.*

### Creating Union-Find Set

#### How to Store a Set?

Tree. The root will be a set. Each node will be an element.

**Parental Representation**: The child point to the parents. In a set, we wish to find the root more easily.

```c
typedef struct{   
  ElementType Data;  
  int Parent;
}SetType;
```

#### Operation Set

- int Find(SetType S[], ElementType X)
- void Union(SetType S[], ElementType X1, ElementType X2)
  - Sometimes the tree will be higher and the Find function may not be as efficient. We need to Union the relative small set to the larger one.
  - We can change Parent part of the structure. Using -2, -7 etc instead of -1!
