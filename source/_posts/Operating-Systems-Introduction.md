---
title: 'Operating Systems: Introduction'
date: 2020-08-17 01:45:29
tags:
categories:
---

# Introduction

>  Computer Systems: Three Easy Pieces

**Virtualization**: the OS takes a **physical** resource and transforms it into a more general, powerful, and easy-to-use **virtual** form of itself. Thus, the OS is sometimes referred to as a **virtual machine**.

A typical OS exports a few hundred **system calls** that are available to applications. The OS provides a **standard library** to applications.

The OS is sometimes known as a **resource manager** for CPU, memory, and disk.

## Virtualizing

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <assert.h>
#include "common.h"

int main(int argc, char *argv[]) {  // argc is the number of input 
  if (argc != 2) {				    // e.g. notepad.exe t.txt has 2 params, argc=2
    fprintf(stderr, "usage: cpu <string>\n");  // print to standard error
    exit(1);
  }
  char *str = argv[1];
  while (1) {
    Spin(1);  // a function that repeatedly checks the time and returns
    printf("%s\n", str); // once it has run for a second
  }
  return 0;
}
```

```bash
gcc -o cpu cpu.c -Wall # -Wall 打开警告
./cpu "A"
```

```bash
./cpu A & ./cpu B & ./cpu C & ./cpu D &
```

**Virtualizing the CPU**

**Policy** of the OS.

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int main(int argc, char *argv[]) {
  int *p = malloc(sizeof(int));
  assert(p != NULL);
  printf("(%d) address pointed to by p: %p\n", getpid(), p);  // %p to print pointer
  *p = 0;
  while (1) {
    Spin(1);
    *p = *p + 1;
    printf("(%d) p: %d\n", getpid(), *p);  // the process identifier (PID)
  }
  return 0;
}
```

```bash
./mem &; ./mem &
```

**Virtualizing memory**: each process accesses its own private **virtual address space**.

## Concurrency

```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

volatile int counter = 0;  // Keyword volatile is an extreme opposite of const.
													 // It indicates that a variable may be changed in a 
													 // way which is absolutely unpredictable by analysing
 													 // the normal program flow. Every reference to the 
													 // variable will reload the contents from memory 
													 // rather than take advantage of situations where a
													 // copy can be in a register.
int loops;

void *worker(void *arg) {
  int i;
  for (i = 0; i < loops; i++) {
    counter ++;
  }
  return NULL;
}

int main(int argc, char* argv[]) {
  if (argc != 2) {
    fprintf(stderr, "usage: threads <value>\n");
    exit(1);
  }
  loops = atoi(argv[1]);  // ascii to integer
  pthread_t p1, p2;
  printf("Initial value : %d\n", counter);
  
  Pthread_create(&p1, NULL, worker, NULL);
  Pthread_create(&p2, NULL, worker, NULL);
  Pthread_join(p1, NULL);
  Pthread_join(p2, NULL);
  printf("Final value: %d\n", counter);
  return 0;
}
```

**Concurrency** and **multi-threaded**

```bash
gcc -o thread thread.c -Wall -pthread
./thread 1000
# output > 2000
./thread 100000
# output > 143012 // huh??
```

Instructions do not execute **atomically** (all at once)!

## Persistence

DRAM store values in a **volatile** manner, therefore we need hardware and software to be able to store data **persistently**.

- Hardware: **I/O** device: hard drive, solid-state drives
- Software: **file system**

```c
#include <stdio.h>
#include <unistd.h>
#include <assert.h>
#include <fcntl.h>
#include <sys/types.h>

int main(int argc, char *argv[]) {
  int fd = open("/tmp/file", O_WRONLY|O_CREAT|O_TRUNC, S_IRWXU); // system call!
  assert(fd > -1);
  int rc = write(fd, "hello world\n", 13);  // system call!
  assert(rc == 13);
  close(fd);  // system call to the file system!
  return 0;
}
```

**Device driver**

The OS provides a standard and simple way to access devices through its system calls. Thus, the OS is sometimes seen as a **standard library**.

For performance reasons, most file systems first delay such writes for a while, hoping to batch them into larger groups. To handle the problems of system crashes during writes, most file systems incorporate some kind of intricate write protocol, such as **journaling** or **copy-on-write**, carefully ordering writes to disk to ensure that if a failure occurs during the write sequence, the system can recover to reasonable state afterwards.

## Design Goals

Build up some **abstractions** in order to make the system convenient and easy to use.

**High performance** and **Minimize the overheads** of the OS.

Provide **protection** between applications, as well as between the OS and applications. **Isolation** is the heart of one of the main principles underlying an operating system.

A high degree of **reliability** is required.

Other goals include **energy-efficiency**, **security**, **mobility**.
