---
title: DataStructure File Transfer
date: 2019-07-28 01:16:04
tags:
categories: Algorithm
---

> Zhejiang University

# Two Methods of Optimization

## Merge by Rank

The tree can always grow higher and higher if it is not optimized properly! If we try to merge the higher tree to the lower one, the total height will increase by 1. Thus, we should avoid this kind of merging.

To realize this optimization, we can store the height of the tree to the root node, in a negative way.

Then the union function will be like:

```c
void Union(SetType s, SetName root1, SetName root2) {  
  if (s[root1] > s[root2])  
    s[root1] = root2;  
  else {     
    if (root1 == root2) // very important!         
      s[root1]--;  
    s[root2] = root1;  
  }
}
```

As we can see, the height of a tree will not change if the height of the 2 components are different from each other. Only when the height are the same does the height change.

Of course, we can also use store the number of elements in the 2 subtrees.

```c
void Union(SetType s, SetName root1, SetName root2) { 
  if (s[root1] > s[root2]){    
    s[root2] += s[root1]; 
    s[root1] = root2;   
  } else {   
    s[root1] += s[root2];  
    s[root2] = root1;  
  }
}
```

In the worst condition, the height of the tree will be:
$$
O(\log N)
$$


## Path Compression

```c
SetName Find(SetType s, int x) {  
  if (s[x] < 0)    
    return x;  
  else     
    return s[x] = Find(s, s[x]); // 3 things in this statement
}
```

1. Find the root of the parent of x (also the root of x)
2. Turn x to the parent of x
3. Return the root

### Tail Recursion

The recursion happens at the end of the function. Nothing needs to be done when the function is being called. The compiler will not push the whole function into stack. Instead, it will rewrite the frame in the stack.
