---
title: 'Operating Systems: The Process'
date: 2020-08-18 02:00:06
tags:
categories: OS
---

> Operating Systems: Three Easy Pieces

# The Abstraction: The Process

One of the most fundamental abstractions that the OS provides to users: the **process** (a running program).

The OS creates the illusion of nearly-endless supply of CPUs by **virtualizing** the CPU.

The basic technique, known as **time sharing** （分时） of the CPU, allows users to run many concurrent processes.

To implement virtualization of the CPU, and to implement it well, the OS will need both some low-level machinery and some high-level intelligence. The low-level machinery is called **mechanisms** (low-level methods or protocols that implement a needed piece of functionality). Eg: a **context switch** could give the OS the ability to stop running one program and start running another on a given CPU.

On top of these mechanisms resides some of the intelligence in the OS, in the form of **policies**. Policies are algorithms for making some kind of decision within the OS. Eg: a **scheduling policy** in the OS will make the decision of running one of the many queued programs.

## The Abstraction: A Process

**Machine State**: what a program can read or update when it is running?

- **address space**

- **register**: program counter/instruction pointer (PC/IP), stack pointer, associated frame pointer

  > 什么是Frame Pointer (FP)？
  >
  > 它指向本函数栈帧顶，通过它可以找到本函数在进程栈中的位置，有专门的寄存器保存该值。这一过程由编译器记录。
  >
  > 利用SP和FP可以回溯母函数的栈帧(Stack Frame)，从而得到母函数的SP和FP（它们会在母函数调用子函数的时候立即被压栈）。以此回溯可以得到所有函数的还采用顺序。
  >
  > 程序执行的过程中，不需要使用FP。因为汇编层面的每个函数内部执行push和pop操作。

## Process API

The following APIs are available on any modern operating system.

- **Create**: some method to create new processes. Eg: double-click an application icon or type a command into the shell, the OS is invoked to create a new process to run the program.
- **Destroy**: destroy processes forcefully, though many processes will run and exit by themselves.
- **Wait**: wait for a process to stop running.
- **Miscellaneous Control**: Eg: to suspend a process and then resume it.
- **Status**: get some status information about a process, such as how long it has run for, or what state it is in.

## Process Creation: A Little More Detail

1. **load** the code and static data into memory (the address space of the process) from **disk** or **flash-based SSDs** in some kind of **executable format**

2. allocate some memory for the program’s **run-time stack/stack**. The OS will also likely initialize the stack with arguments; specifically, it will fill the parameters to the `main` function, i.e., `argc` and the `argv` array.

   > C语言中，局部变量，函数参数，返回地址在栈中储存

3. may need to allocate some memory for the program’s **heap**. The heap is needed for data structures such as linked lists, hash tables, trees, and other interesting data structures.

   > C语言中，堆被用于储存显式请求得到的动态分配的数据，即 `malloc()` API。操作系统会介入分配内存以满足调用。
   >
   > 显式释放采用 `free()`

4. some other initialization tasks, particularly as related to I/O. Eg: in UNIX systems, each process by default has three open **file descriptors**, for standard input, output, and error.

5. last task: to start the program running at the entry point, namely the `main()`.

## Process States

Different **states** a process can be in at a given time.

- **Running**: a process is running on a processor, meaning it is executing instructions.
- **Ready**: a process is ready to run but for some reason the OS has chosen not to run it at this given moment.
- **Blocked**: a process has performed some kind of operation that makes it not ready to run until some other event takes place. Eg: a process initiates an I/O request to a disk.

From ready to running: **scheduled**

From running to ready: **descheduled**

Decisions are made by the OS **scheduler**.

## Data Structures

**Process list**: processes that are ready and some additional information to track which process is currently running. Each entry is found in what is sometimes called a **process control block (PCB)**, which is really just a structure that contains information about a specific process.

```c
// the register xv6 will save and restore
// to stop and subsequently restart a process
struct context {
  int eip;
  int esp;
  int ebx;
  int ecx;
  int edx;
  int esi;
  int edi;
  int ebp;
};
// the different states a process can be in
enum proc_state {UNUSED, EMBRYO, SLEEPING, RUNNABLE,
                 RUNNING, ZOMBIE};
// the information xv6 tracks about each process
// including its register context and state
struct proc {
  char *mem; // start of process memory
  uint sz; // size of process memory
  char *kstack; // Bottom of kernel stack
  enum proc_state state; // process state
  int pid; // process ID
  struct proc *parent; // parent process
  void *chan; // if !0, sleeping on chan
  int killed; // if !0, has been killed
  struct file *ofile[NOFILE]; // open files
  struct inode *cwd; // current directory
  struct context context; // switch here to run process
  struct trapframe *tf; //Trap frame for the current interrupt
}
```

The **register context** will hold the contents of a stopped process’s registers. When a process is stopped, its registers will be saved to this memory location. This tech is known as a **context switch**.

Sometimes a system will have an **initial** state that the process is in when it is being created. Also, a process could be placed in a **final** state where it has exited but has not yet been cleaned up (in UNIX-based systems, it is called the **zombie** state). The final state can be useful as it allows other processes (usually the **parent** that created the process) to examine the return code of the process and see if the just-finished process execute successfully accomplished a task and non-zero otherwise. When finished, the parent will make one final call (e.g., `wait()`) to wait for the completion of the child, and to also indicate to the OS that it can clean up any relevant data structures that referred to the now-extinct process.

## Homework

1. Run

   ```
   ·process-run.py
   ```

    

   with the following flags:

    

   ```
   -l 5:100,5:100
   ```

   . What should the CPU utilization be?

   - 100%

2. Now run with these flags:

    

   ```
   ./process-run.py -l 4:100,1:0
   ```

   . These flags specify one process with 4 instructions (all to use the CPU), and one that simply issues an I/O and waits for it to be done. How long does it take to complete both processes?

   - 10 ticks: 4 for task1, 1 for start I/O, 4 for waiting I/O, 1 for Done.

3. Switch the order of the processes:

    

   ```
   -l 1:0,4:100
   ```

   . What happens now? Does switching the order matter? Why?

   - 6 ticks. Yes, the CPU is working when waiting for I/O to complete.

4. What happens when you run the following two processes (

   ```
   -l 1:0,4:100 -c -S SWITCH_ON_END
   ```

   ), one doing I/O and the other doing CPU work?

   - The CPU waits until the I/O completes.

5. Now, run the same processes, but with the switching behavior set to switch to another process whenever one is WAITING for I/O (

   ```
   -l 1:0,4:100 -c -S SWITCH_ON_IO
   ```

   ). What happens now?

   - The same as the default settings.

6. One other important behavior is what to do when an I/O completes. With

    

   ```
   -I IO RUN_LATER
   ```

   , when an I/O completes, the process that issued it is not necessarily run right away; rather, whatever was running at the time keeps running. What happens when you run this combination of processes? (Run

    

   ```
   ./process-run.py -l 3:0,5:100,5:100,5:100 -S SWITCH_ON_IO -I IO_RUN_LATER -c -p
   ```

   ) Are system resources being effectively utilized?

   - No. The first process needs 3 I/O. The latter 2 processes will run one after another, meaning the first one needs to wait until all processes are completed before the next 2 I/O.

7. Now run the same processes, but with

    

   ```
   -I IO_RUN_IMMEDIATE
   ```

    

   set, which immediately runs the process that issued the I/O. How does this behavior differ? Why might running a process that just completed an I/O again be a good idea?

   - A process is likely to run several I/O. If the its next behavior is running on CPU, then nothing is lost. However, if the next move is another I/O, much time can be saved.
