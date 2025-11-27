---
title: DataStructure Sort
date: 2019-08-08 01:32:43
tags:
categories:
---

### Lower Bound of Time Complexity

#### Inversion

For index i and j, if A[i] > A[j] then (i, j) is an inversion.

For insertion sort:
$$
T(N, I)=O(N+I)
$$
**Theorem A**: For N different elements, the average number of inversions are
$$
I=N(N-1)/4
$$
**Theorem B**: For any algorithm which only swaps the adjacent 2 elements, the average time complexity is:

From B we know that if we want to make our algorithms more efficient, we should eliminate more than one inversions each time! One solution is to swap 2 elements as far as possible.

## Shell Sort

Define a decreasing sequence. This sequence is used to separate the whole sequence. The latter ones will not spoil the result of the former ones.

However, the worst case of Shell Sort will be:
$$
T = \Theta(N^2)
$$
From some of the worst cases we know that if the increments are not coprime to each other, the sequence may not be effective.

There are, of course, some other **incremental sequences**:

- Hibbard: $D_k = 2^k - 1$
  The worst case: $T = \Theta(N^{3/2})$
- Sedgewick

## Heap Sort

This is based on **Selection Sort**. By using minHeap, we can find the minimum element quickly.
$$
T(N) = O(N\log N)
$$
This algorithm, however, needs an extra space and it also needs some extra time to copy the elements.
$$
O(N)
$$
In reality, the algorithm uses the maxHeap and then adjust this heap

```c
void HeapSort(ElementType A[], int N) { 
  for (i = N / 2; i >= 0; i--)  
    PercDown(A, i, N);   
  for (i = N - 1; i > 0; i--) {
    Swap(&A[0], &A[i]);
    PercDown(A, 0. i); 
  }
}
```

**Theorem**: The average time consumed for heap sort is:
$$
2N\log N - O(N\log \log N)
$$
**Remark**: Although this sorting method looks more efficient, it may not perform better than Shell sorting using **Sedgewick increment sequence**.

## Merge Sort

The core concept is merging 2 sub sequence.

### Divide and Conquer

```c
void MSort(ElementType A[], ElementType TmpA[], int L, int RightEnd) {  
  int Center; 
  if (L < RightEnd) {   
    Center = (L + RightEnd) / 2; 
    MSort(A, TmpA, L, Center);  
    MSort(A, TmpA, Center + 1, RightEnd);      
    Merge(A, TmpA, L, Center + 1, RightEnd);   
  }
}
```

$$
T(N) = T(N/2) + T(N/2) + O(N)\\
T(N) = O(NlogN)
$$

### Non-recursive algorithm

```c
void MergePass(ElementType A[], ElementType TmpA[], int N, int length) {   
  for (i = 0; i < N-2*length; i += 2*length)   
    Merge1(A, TmpA, i, i + length, i + 2*length-1);  
  if (i + length < N)    
    Merge(A, TmpA, i, i + length, N - 1);  
  else  
    for (j = i; j < N; j++) TmpA[j] = A[j];
}
```
