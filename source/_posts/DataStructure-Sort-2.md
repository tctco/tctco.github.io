---
title: DataStructure Sort 2
date: 2019-08-08 01:36:12
tags:
categories:
---

## Quick Sort

### Divide and Conquer

### Choosing the Principal Component

**Remark**: `rand()` is not very efficient!

One common approach is to use the median number at the head, tail and center of the array:

```c
ElementType Median3(ElementType A[], int Left, int Right) {   
  int Center = (Left + Right) / 2; 
  if (A[Left > A[Center]])     
    Swap(&A[Left], &A[Center]); 
  if (A[Left] > A[Rihgt])    
    Swap(&A[Left], &A[Right]);  
  if (A[Center] > A[Right]) 
    Swap(&A[Center], &A[Right]);  
  Swap(&A[Center], &A[Right - 1]); 
  return A[Right - 1];
}
```

### Separating Subsets

The best part of quick sort is that once the separating part is finished, the principal component is placed in the correct place!

When dealing with a relative small range of numbers, the quick sort method using recursion is not very fast. The solution is also very simple: using a hybrid method. (Setting a threshold called **Cutoff**)

### The Code

```c
void QuickSort(ElementType A[], int Left, int Right) {  
  if (Cutoff <= Right - Left) { 
    Pivot = Median3(A, Left, Right);        i = Left;    
    j = Right - 1;    
    while (1) {      
      while (A[++i] < Pivot) {} 
      while (A[++j] > Pivot) {}  
      if (i < j)    
        Swap(&A[i], &A[j]);  
      else           
        break;   
      QuickSort(A, Left, i - 1);
      QuickSort(A, i + 1, Right);        } 
  }   
  else  
    InsertionSort(A, Right - Left + 1);
}
```

## Table Sort

When we are not sorting simply numbers but some very large structs like a book, if we want to move this element, we cannot underestimate the cost. In this case, we need table sort.

### Indirect Sorting

| A     | [0]  | [1]  | [2]  | [3]  | [4]  | [5]  | [6]  | [7]  |
| ----- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| key   | f    | d    | e    | a    | g    | b    | h    | e    |
| table | 3    | 5    | 2    | 1    | 7    | 0    | 4    | 6    |

#### Physical Sorting

**Theorem**: The sequence of N numbers can be decomposed to several independent rings.

- The best case: all things are sorted
- The worst cast:
  - N/2 rings, each has 2 elements
  - 3N/2 moves

$$
T=O(mN)
$$



# Cardinal Sorting

## Bucket Sort

## Cardinal Sort

**Least Significant Digit**

#### Sorting with Many Keywords

**Most Significant Digit**

# Comparison
