---
title: 'Interlude: Memory API'
date: 2020-09-21 02:10:21
tags:
categories: OS
---

# Interlude: Memory API

CRUX: How to allocate and manage memory in UNIX/C programs?

## Types of Memory

**stack memory**: allocations and deallocations are managed implicitly by the compiler. For this reason it is sometimes called **automatic** memory.

Declaring memory on the stack in C is easy. For example, let's say you need some space in function `func()` for an integer, called `x`. To declare such a piece of memory, you just do something like this:

```c
void func() {
  int x;
}
```

The compiler does the rest, making sure to make space on the stack when you call into `func`. When you return form the function, the compiler deallocates the memory for you; thus, if you want some information to live beyond the call invocation, you had better not leave that information on the stack.

**heap memory**: all allocations and deallocations are explicitly handled.

```c
void func() {
  int *x = (int *) malloc(sizeof(int));
}
```

Both stack and heap allocation occur on this line: first the compiler knows to make room for a pointer to an integer when it sees your declaration of said pointer (`int *x`); subsequently, when the program calls `malloc()`, it requests space for an integer on the heap; the routine returns the address of such an integer.

## The `malloc` Call

Form man page for `malloc`, all you need to do is include the header file `stdlib.h`. In fact, you don't really need to even do this, as the C library, which all C programs link with by default, has the code for `malloc()` inside of it, adding the header just lets the compiler check whether you are calling `malloc` correctly.

The invocation of `malloc` uses the `sizeof()` operator to request the right amount of space; in C, this is generally thought of as a compile-time operator, meaning that the the actual size is known at compile time and thus a number is substituted as the argument to `malloc()`. For this reason, `sizeof()` is correctly thought of as an operator and not a function call.

You can also pass in the name of a variable.

```c
int *x = malloc(10 * sizeof(int));
printf("%d\n", sizeof(x)); // 4 on 32-bit machines or 8 on 64-bit machines

int x[10];
printf("%d\n", sizeof(x)); // 40 bytes
```

 Another place to be careful is with strings. When declaring space for a string, use the following idiom: `malloc(strlen(s) + 1)`, which gets the length of the string using the function `strlen()`, and adds 1 to it in order to make room for the end-of-string character. Using `sizeof()` may lead to trouble here.

`malloc()` returns a pointer to type `void`. Doing so is just the way in C to pass back an address and let the programmer decide what to do with it. The programmer further helps out by using what is called a **cast**.

## The `free` Call

The size of the allocated region is not passed in by the user, and must be tracked by the memory-allocation library itself.

## Common Errors

There are a number of common errors that arise in the use of `malloc()` and `free()`

- Forgetting to allocate memory

  ```c
  char *src = "hello";
  char *dst;
  strcpy(dst, src);
  ```

  **segmentation fault**

  Alternatively, you could use `strdup()` and make your life even easier.

- Not allocating enough memory

  ```c
  char *src = "hello";
  char *dst = (char *) malloc(strlen(src));
  strcpy(dst, src);
  ```

  In some cases, the malloc library allocated a little extra space anyhow, and thus your program actually doesn't scribble on some other variable's value and works quite fine. Even though it ran correctly once, doesn't mean it's correct!

- Forgetting to initialize allocated memory: your program will eventually encounter an **uninitialized read**, where it reads from the heap some data of unknown value.

- Forgetting to free memory: **memory leak**

- Freeing memory before you are done with it: **dangling pointer**

- Freeing memory repeatedly: **double free**

- Calling `free()` incorrectly: **invalid frees** are dangerous.

## Useful Debugging Tools for Memory

- **purify**
- **valgrind**

## Underlying OS Support

`malloc()` and `free()` are not system calls, but rather library calls. The malloc library manages space within your virtual address space, but itself is built on top of some system calls which call into the OS to ask for more memory or release some back to the system.

One such system call is called `brk`, which is used to change the location of the program's **break**: the location of the end of the heap. It takes one argument (the address of the new break), and thus either increases or decreases the size of the heap based on whether the new break is larger or smaller than the current break. An additional `sbrk` is passed an increment but otherwise serves a similar purpose.

Note that you should never directly call either `brk` or `sbrk`!

Finally, you can also obtain memory from the operating system via the `mmap()` call. By passing the correct arguments, `mmap()` can create an **anonymous** memory region within your program ---- a region which is not associated with any particular file but rather with **swap space**. This memory can then also be treated like a heap and managed as such.

## Other Calls

- `calloc()` allocates memory and also zeroes it before returning.
- `realloc()` makes a new larger region of memory, copies the old region into it, and returns the pointer to the new region.

## Homework

1. First, write a simple program called `null.c` that creates a pointer to an integer, sets it to `NULL`, and then tries to dereference it. Compile this into an executable called `null`. What happens when you run this program? 
   - segmentation fault
2. Next, compile this program with symbol information included (with the `-g` flag). Doing so let's put more information into the executable, enabling the debugger to access more useful information about variable names and the like. Run the program under the debugger by typing `gdb` null and then, once `gdb` is running, typing run. What does `gdb` show you?
   - Program received signal SIGSEGV, Segmentation fault.
     0x0000555555554655 in main (argc=1, argv=0x7fffffffea78) at null.c:9
     9         int x = *p;
3. Finally, use the `valgrind` tool on this program. We'll use the `memcheck` tool that is a part of `valgrind` to analyze what happens. Run this by typing in the following: `valgrind --leak-check=yes null`. What happens when you run this? Can you interpret the output from the tool? 
   - Invalid read of size 4. Address 0x0 is not stack'd, malloc'd or (recently) free'd.
4. Write a simple program that allocates memory using malloc() but forgets to free it before exiting. What happens when this program runs? Can you use `gdb` to find any problems with it? How about `valgrind` (again with the --leak-check=yes flag)? 
   - `gdb`: exited normally.
   - `valgrind`: HEAP SUMMAYR: in use at exit: 4 bytes in 1 blocks. LEAK SUMMARY: definitely lost: 4 bytes in 1 blocks.
5. Write a program that creates an array of integers called `data` of size 100 using `malloc`; then, set `data[100]` to zero. What happens when you run this program? What happens when you run this program using `valgrind`? Is the program correct? 
   - `gdb`: exited normally.
   - `valgrind`: LEAK SUMMARY: definitely lost: 400 bytes in 1 blocks.
6. Create a program that allocates an array of integers (as above), frees them, and then tries to print the value of one of the elements of the array. Does the program run? What happens when you use `valgrind` on it? 
   - `gdb`: exited normally.
   - `valgrind`: Invalid read of size 4 at 0xBLABLABLA
7. Now pass a funny value to free (e.g., a pointer in the middle of the array you allocated above). What happens? Do you need tools to find this type of problem?
   - Invalid pointer: the program won't exit normally.
8. Try out some of the other interfaces to memory allocation. For example, create a simple vector-like data structure and related routines that use `realloc()` to manage the vector. Use an array to store the vectors elements; when a user adds an entry to the vector, use `realloc()` to allocate more space for it. How well does such a vector perform? How does it compare to a linked list? Use `valgrind` to help you find bugs.
   - Much slower: need reallocation every time a new element is added.
9. Spend more time and read about using `gdb` and `valgrind`. Knowing your tools is critical; spend the time and learn how to become an expert debugger in the UNIX and C environment.
