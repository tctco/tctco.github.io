---
title: 'The Abstraction: Address Spaces'
date: 2020-09-11 02:08:56
tags:
categories:
---

# The Abstraction: Address Spaces

## Early Systems

From the perspective of memory, early machine didn't provide much of an abstraction to users. The OS was a set of routines (a library, really) that sat in memory (starting at physical address 0, for example), and there would be one running program (a process) that currently sat in physical memory and used the rest of memory.

## Multiprogramming and Time Sharing

**multiprogramming**: multiple processes were ready to run at a given time, and the OS would switch between them. Doing so increased the effective **utilization** of the CPU. Such increases in **efficiency** were particularly important in the early days.

Soon enough, people began demanding more of machines, and the ear of **time sharing** was born. The notion of **interactivity** became important, as many users might be concurrently using a machine, each waiting for a timely response from their currently-executing tasks.

In particular, allowing multiple programs to reside concurrently in memory makes **protection** an important issue.

## The Address Space

The OS creates an **easy to use** abstraction of physical memory named **address space** and it is the running program's view of memory in the system.

The address space of a process contains all of the memory state of the running program. For example, the **code** of the program (the instructions) have to live in memory somewhere, and thus they are in the address space. The program, while it is running, uses a **stack** to keep track of where it is in the function call chain as well as to allocate local variables and pass parameters and return values to and from routines. Finally, the **heap** is used for dynamically-allocated, user-managed memory, such as that you might receive from a call to `malloc()` in C or `new` in an object-oriented language such as C++ or Java.

However, this placement of stack and heap is just a convention (when multiple **threads** co-exist in an address space, no nice way to divide the address space like this works anymore).

When we describe the address space, what we are describing is he **abstraction** that the OS is providing to the running program. The program is not in memory at physical addresses 0 through 16KB; rather it is loaded at some arbitrary physical address(es).

**Virtualizing memory** and **virtual address**

## Goals

**transparency**: the OS should implement virtual memory in a way that is invisible to the running program.

**efficiency**: the OS should strive to make the virtualization as **efficient** as possible, both in time and space.

**protection**: the OS should make sure to **protect** processes from one another as well as the OS itself from processes. Protection thus enables us to deliver the property of **isolation** among processes.

Ever write a C program that prints out a pointer? The value you see (some large number, often printed in hexadecimal), is a **virtual address**.

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
  printf("location of code : %p\n", main);
  printf("location of heap : %p\n", malloc(100e6));
  int x = 3;
  printf("location of stack :%p\n", &x);
  return x;
}
/*
location of code : 0x1095afe50
location of heap : 0x1096008c0
location of stack: 0x7fff691aea64
*/
// code comes first, then the heap, 
// and the stack is way at the other end of
// this large virtual space.
```

## Homework

```c
// File:    memory-user.c
// Author:  C, Tang (u201810307@hust.edu.cn)
// Date:    2020/09/11 15:03:54

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char * argv[]) {
  printf("pid: %d\n", (int) getpid());
  int size_MB = atoi(argv[1]);
  int *a = malloc(size_MB << 20);
  size_t arr_size = (size_MB << 20) / sizeof(int);
  int* p = a;
  while (1) {
    for (int i = 0; i < arr_size; i++, p++) {
      a[i] = 0;
    }
    p = a;
  }
  return 0;
}
```

