---
title: DataStructure Hashing
date: 2019-08-08 01:37:40
tags:
categories:
---

When compiling, computer needs to manage variables:

- Inserting (new variables)
- Searching (references of variables)

**Dynamic Searching Problems**

Two main problems about Hashing:

- Calculating positions: creating a hashing function to locate the keyword
- Dealing with Collisions

## Hashing Table

Name: SymbolTable

Data Object Set: Name-Attribute

Operation Set:

```c
SymbolTable InitializeTable(int TableSize);
bool IsIn(SymbolTable Table, NameType Name);
AttributeType Find(SymbolTable Table, NameType Name);
SymbolTable Modefy(SymbolTable Table, NameType Name, AttributeType Attr);
SymbolTable Insert(SymbolTable Table, NameType Name, AttributeType Attr);
SymbolTable Delete(SymbolTbale Table, NameType Name);
```

**Loading Factor**: total space of a hashing table m, the number of blocks filled by numbers is n then:

## How to Create a Hashing Function?

A good hashing function must be:

- Easy enough
- The result must be distributed uniformly

Some methods:

- Direct Addressing
- Linear Congruential Method
- Digit Analysis: find the most random digits and combine them
- Folding Method: compress different parts in to a single one
- Mid-square Method

When the keyword is a char or string:

- ASCII checksum: cannot deal with palindrome, vulnerable to collisions

  - One improvement is to move some digits forward (give them weight)

  - Another improvement is to transform the string into a number like **Base Sort**

    - QinJiuShao algorithm

    - Moving digits

      ```c
      Index Hash(const char *Key, int TableSize) { 
        unsigned int h = 0;   
        while (*Key != '\0')  
          h = (h << 5) + *Key++;
        return h % TableSize;
      }
      ```

## How to Deal with Collisions?

- Open Addressing
  - Switch to another position!
- Separate Chaining
  - Store things in the same place

### Open Addressing

$$
h_i(key) = (h(key) + d_i) \ \mod \ \rm TableSize
$$

For different *i*, there are different solutions:

- Linear Probing: $ d_i=i $

**ASL s** and **ASL u**

- Quadratic Probing: $ d_i = \pm i^2 $

**Theorem**: if the table length is **4k+3** and is prime number, the quadratic probing can search the whole table space.

- Double Hashing: $ d_i = i\times h_2(key)\
  h_2(key) = p - (key\ \mod\ p) $

## Code

```c
HashTable InitializeTable(int TableSize) { 
  HashTable H; 
  int i;  
  if (TableSize < MinTableSize) {
    Error("too small");       
    return NULL;   
  }  
  H = (HashTable)malloc(sizeof(struct HashTbl));  
  if (H == NULL)        FatalError("overflow");  
  H->TableSize = NextPrime(TableSize); 
  H->TheCells = (Cell*)malloc(sizeof(Cell)*H->TableSize);   
  if (H->TheCells == NULL)        FatalError("overflow");   
  for (i = 0; i < H->TableSize; i++)
    H->TheCells[i].info = Empty;    return H;
}

Position Find(ElementType Key, HashTable H) {   
  Position CurrentPos, NewPos;  
  int CNum;    
  CNum = 0;  
  NewPos = CurrentPos = Hash(Key, H->TableSize); 
  while(H->TheCells[Newpos].Info != Empty && H->TheCells[NewPos].Element != Key) {   
    if (++CNum % 2) {    
      NewPos = CurrentPos + (CNum + 1) / 2 * (CNum + 1) / 2;   
      while(NewPos >= H->TableSize)             
        NewPos -= H->TableSize;        
    } else {  
      NewPos = CurrentPos - CNum / 2 * CNum/2;    
      while (NewPos < 0)          
        NewPos += H->TableSize;  
    } 
  }   
  return NewPos;
}

void Insert(ElementType Key, HashTable H) {  
  Position Pos; 
  Pos = Find(Key, H); 
  if (H->TheCells[Pos].Info != Legitimate) { 
    H->TheCells[Pos].Info = Legitimate;   
    H->TheCells[Pos].Element = Key;  
  }
}
```

### Rehashing

When the hash table is too large, the search efficiency will decrease.

0.5 < \alpha < 0.85

One solution is to double the size of the Hash Table and re calculate the whole table. This is called **rehashing**.

### Separate Chaining

```c
typedef struct ListNode * Position, *List;
struct ListNode {  
  ElementType Element; 
  Position Next;
};
typedef struct HashTbl *HashTable;
struct HashTbl { 
  int TableSize; 
  List TheLists;
};

Position Find(ElementType Key, HashTable H) {   
  Position P;   
  int Pos;   
  Pos = Hash(Key, H->TableSize);
  P = H->Thelists[Pos].Next; 
  while (P != NULL && strcmp(P->Element, Key))  
    P = P->Next; 
  return P;
}
```

## The Efficiency of Hash Table

The factors that influence the efficiency of a hashing table can be divided into 3 parts:

- The Hashing function (uniformly)
- The way to deal with collisions
- The α

For linear probing: (insertion and unsuccessful search \ successful search)
$$
p = \frac{1}{2}[1 + \frac{1}{(1-\alpha)^2}]\\
p = \frac{1}{2}(1 + \frac{1}{1-\alpha})
$$

For Quadratic probing and double hashing
$$
p = \frac{1}{1-\alpha}\\
p = -\frac{1}{\alpha}ln(1 - \alpha)
$$
For Separate Chaining:
$$
p = \alpha + e^{-\alpha} \\
p = 1 + \frac{\alpha}{2}
$$


## Summary

The hashing method is actually consuming space for time.

The hashing method are not suitable for searching things in order and search in some scope or max or min.
