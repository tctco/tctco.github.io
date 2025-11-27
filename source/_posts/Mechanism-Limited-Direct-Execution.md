---
title: 'Mechanism: Limited Direct Execution'
date: 2020-09-08 02:04:19
tags:
categories:
---

# Mechanism: Limited Direct Execution

A few challenges:

- Performance
- Control

## Basic Technique: Limited Direct Execution

1. **OS**: 
   1. Create entry for process list.
   2. Allocate memory for program. 
   3. Load program into memory. 
   4. Set up stack with argc/argv. 
   5. Clear registers. Execute **call** `main()`.
2. **Program**:
   1. Run `main()`.
   2. Execute **return** from main.
3. **OS**: 
   1. Free memory of process.
   2. Remove from process list.

## Problem \#1: Restricted Operations

What if the process wishes to perform some kind of restricted operation, such as issuing an I/O request to a disk, or gaining access to more system resources such as CPU or memory?

The approach we take is to introduce a new processor mode, known as the **user mode**; code that runs in user mode is restricted in what it can do. For example, when running  in user mode, a process can't issue I/O requests; doing so would result in the processor raising an exception; the OS would then likely kill the process.

In contrast to user mode is **kernel mode**, which the operating system (or kernel) runs in. In this mode, code that runs can do what it likes, including privileged operations such as issuing I/O requests and executing all types of restricted instructions.

To enable a user process to perform some kind of privileged operation, virtually all modern hardware provides the ability for user programs to perform a **system call**.

> USE PROTECTED CONTROL TRANSFER:
>
> The hardware assists the OS by providing different modes of execution. In user mode, applications do not have full access to hardware resources. In kernel mode, the OS has access to the full resources of the machine. Special instructions to **trap** into the kernel and **return-from-trap** back to user-mode programs are also provided, as well as instructions that allow the OS to tell the hardware where the **trap table** resides in memory.
>
> 中断(interrupt)也称陷阱(Trap)。Trap Table 也就是中断向量表。

To execute a system call, a program must executer a special **trap** instruction. This instruction simultaneously jumps into the kernel and raises the privilege level to kernel mode. Once in the kernel, the system can now perform whatever privileged operations are needed (if allowed), and thus do the required work for the calling process. When finished, the OS calls a special **return-from-trap** instruction, which returns into the calling user program while simultaneously reducing the privilege level back to user mode.

The hardware needs to be a bit careful when executing a trap, in that it must make sure to save enough of the caller's registers in order to be able to return correctly when the OS issues the return-from-trap instruction. An x86 the processor will push the program counter, flags, and a few other registers onto a per-process **kernel stack**; the return-from-trap will pop these values off the stack and resume execution of the user mode program.

1. **OS at boot (kernel mode)** : Initialize trap table
2. **Hardware**: remember address of syscall handler
3. **OS at run (kernel mode)**: 
   1. Create entry for process list
   2. Allocate memory for program
   3. Load program into memory
   4. Setup user stack with argv
   5. Fill kernel stack with reg/PC
   6. **return-from-trap**
4. **Hardware**:
   1. Restore regs (from kernel stack)
   2. Remove to user mode
   3. Jump to main
5. **Program (user mode)**:
   1. Run `main()`
   2. ...
   3. Call system call
   4. **Trap** into OS
6. **Hardware**:
   1. save regs (to kernel stack)
   2. move to kernel mode
   3. jump to trap handler
7. **OS**:
   1. Handle trap (Do work of syscall)
   2. **return-from-trap**
8. **Hardware**:
   1. Restore regs (from kernel stack)
   2. Move to user mode
   3. Jump to PC after trap
9. **Program (user mode)**:
   1. ...
   2. Return from main
   3. **trap** (via `exit()`)
10. **OS**:
    1. Free memory of process
    2. Remove from process list

## Problem #2: Switching Between Processes

Specifically, if a process is running on the CPU, this by definition means the OS is not running. If the OS is not running, how can it do anything at all? In other words: How to regain control of the CPU?

### A Cooperative Approach: Wait For System Calls

In this style, the OS trusts the processes of the system to behave reasonably. Processes that run for too long are assumed to periodically give up the CPU so that the OS can decide to run some other task. Most processes, as it turns out, transfer control of the CPU to the OS quite frequently by making **system calls**, for example, to open a file and subsequently read it, or to send a message to another machine, or to create a new process. Systems like this often include an explicit **yield** system call, which does nothing except to transfer control to the OS so it can run other processes.

Application also transfer control to the OS when they do something illegal. For example, if an application divides by zero, or tries to access memory that it shouldn't be able to access, it will generate a trap to the OS. The OS will then have control of the CPU again (and likely terminate the offending process).

### A Non-Cooperative Approach: The OS Takes Control

Without some additional help from the hardware, it turns out the OS can't do much at all when a process refuses to make system calls (or mistakes) and thus return control to the OS. In fact, in the cooperative approach, your only recourse when a process gets stuck in an infinite loop is to resort to the age-old solution to all problems in computer systems: **reboot the machine**. Thus, we again arrive at a subproblem of our general quest to gain control of the CPU.

Solution: **A timer interrupt**. A timer device can be programmed to raise an interrupt every so many milliseconds. When the interrupt is raised, the currently running process is halted, and a pre-configured **interrupt handler** in the OS runs. At this point, the OS has regained control of the CPU, and thus can do what it pleases: stop the current process, and start a different one.

Note that the hardware has some responsibility when an interrupt occurs, in particular to save enough of the state of the program that was running when the interrupt occurred such that a subsequent return-from-trap instruction will be able to resume the running program correctly. This set of actions is quite similar to the behavior of the hardware during an explicit system-call trap into the kernel, with various registers thus getting saved (e.g., onto a kernel stack) and thus easily restored by the return-from-trap instruction.

### Saving and Restoring Context

The decision of whether to continue running the currently-running process, or to a different one is made by a part of the operating system known as the **scheduler**.

If the decision is made to switch, the OS then executes a low-level piece of code which we refer to as a **context switch**. 

Note that there are 2 types of register saves/restores that happen during this protocol. The first is when the timer interrupt occurs; in this case, the user registers of the running process are implicitly saved by the hardware, using the kernel stack of that process. The second is when the OS decides to switch from A to B; in this case, the kernel registers are explicitly saved by the software (i.e., the OS), but this time into memory in the process structure of the process. The latter action moves the system from running as if it just trapped into the kernel from A to as if it just trapped into the kernel from B.

The following list shows the context switch code for vx6. The `context` structures `old` and `new` are found in the old and new process's process structures, respectively.

1. **OS at boot (kernel mode)**: Initialize trap table
2. **Hardware**: Remember addresses of syscall handler and timer handler
3. **OS at boot (kernel mode)**: Start interrupt timer
4. **Hardware**: 
   1. Start timer
   2. Interrupt CPU in Xms
   3. **timer interrupt!**
   4. save regs(A) to k-stack(A)
   5. move to kernel mode
   6. jump to trap handler
5. **OS (kernel mode)**:
   1. Handle the trap
   2. Call `switch()` routine: save regs(A) to proc_t(A), restore regs(B) from proc_t(B), switch to k-stack(B)
   3. **return-from-trap**
6. **Hardware**: 
   1. Restore regs(B) from k-stack(B)
   2. Move to user mode
   3. Jump to B's PC

## Worried About Concurrency?

Questions:

1. What happens when , during a system call, a timer interrupt occurs?
2. What happens when you are handling one interrupt and another one happens?

These questions will be handled in **concurrency**.

One simple thing an OS might do is **disable interrupts** during interrupt processing; doing so ensures that when one interrupt is being handled, no other one will be delivered to the CPU.

```assembly
# void swtch(struct context **old, struct context *new);
#
# Save current reister context in old
# and then load register context from new.
.globl swtch
swtch:
  # Save old registers
  movl 4(%esp), %eax # put old ptr into eax
  popl 0(%eax) # save the old IP
  movl %esp, 4(%eax) # and stack
  movl %ebx, 8(%eax) # and other registers
  movl %ecx, 12(%eax)
  movl %edx, 16(%eax)
  movl %esi, 20(%eax)
  movl %edi, 24(%eax)
  movl %ebp, 28(%eax)
  
  # Load new registers
  movl 4(%esp), %eax # put new ptr into eax
  movl 28(%eax), %ebp # restore other reigsters
  movl 24(%eax), %edi
  movl 20(%eax), %esi
  movl 16(%eax), %edx
  movl 12(%eax), %ecx
  movl 8(%eax), %ebx
  movl 4(%eax), %esp # stack is switched here
  pushl 0(%eax) # return addr put in place
  ret # finally return into new ctxt
```

Operating systems also have developed a number of sophisticated **locking** schemes to protect concurrent access to internal data structures.

## Homework: Measurement

- The use of `rdtsc` and mix of C and assembly language
- The use of `sched_setaffinity()`
- Measuring the cost of context switch by calling `write` and `read` from 2 different processes.

```c
// File:    homework_measurement.c
// Author:  C, Tang (u201810307@hust.edu.cn)
// Date:    2020/09/06 01:11:15

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/time.h>
#include <cmath>
#include <stdint.h>
#include <sched.h>

const unsigned long long ITER_NUM = 1000000;
const unsigned int SCALE = 1000000;

uint32_t currentcycles();

inline uint32_t currentcycles() {
// inline function : the inline function will replace all
//                   calls in the assembly language
  uint32_t result;
  __asm__ __volatile__ ("rdtsc" : "=A" (result));
 // __asm__ : start of asm
 // __volatile__ : tell the compiler not to modify my code
 // "rdtsc" : Instruction list. rdtsc gets CPU clock. Stores
 //           lower 32 bits TSC value into eax and higher 32
 //           bits TSC value into edx.
 // "=A" (result) : output operand. "=" means a write-only expression
 //                 "A" (or "a") is the abbreviation of eax/ex/al.
 //                 (result) is the output C variable.
 // Several output operands could be written: E.g.
 /*
 __asm__(
   "movl %%eax, %0\n\t"
   "pushl %%ebx \n\t"
   "popl %1, %2 \n\t"
   "movl %1, %2"
   : "+a"(cr0), "=b"(cr1), "=c"(cr2)
 );
 */

 // here is another example for input operands:
 /*
int main(int __argc, char* __argv[]) {
  int cr0 = 5;
  __asm__ __volatile__("movl %0, %%cr0"::"a"(cr0));
  return 0;
}
 */
 // with the compiling code: gcc -S example.c
  return result;
}


int main(int argv, char* argc[]) {
  char buf;
  uint32_t start, end, frequency;

// Measuring the CPU frequency
  start = currentcycles();
  sleep(1);
  end = currentcycles();
  frequency = end - start;
  printf("cpu MHZ\t:%11f\n", (double) frequency / 1e6);

// Measuring the cost of a system call
  start = currentcycles();
  for (int i = 0; i < ITER_NUM; i++) {
    read(STDIN_FILENO, &buf, 0);
  }
  end = currentcycles();
  printf("system call (read 0 byte %d times) total time: %f us, average: %f us\n", \ 
         ITER_NUM, (double) (end-start) / (frequency/1e6), \ 
         (double) (end-start) / (frequency/1e6) / ITER_NUM);

// Measuring the context switch
  int pipefd_1[2], pipefd_2[2];
  if (pipe(pipefd_1) < 0 or pipe(pipefd_2) < 0) {
    perror("pipe error!\n");
    exit(EXIT_FAILURE);
  }
  pid_t cpid = fork();
  cpu_set_t set;
  CPU_ZERO(&set);

  switch (cpid) {
    case -1:
      perror("fork failed!\n");
      exit(EXIT_FAILURE);
    case 0:
      CPU_SET(0, &set);
      switch(sched_setaffinity(getpid(), sizeof(set), &set)) {
        case -1:
          perror("sched_setaffinity failed\n");
          exit(EXIT_FAILURE);
        case 0:
          for (size_t i = 0; i < ITER_NUM; i++) {
            read(pipefd_1[0], NULL, 0);
            write(pipefd_2[0], NULL, 0);
          }
          exit(EXIT_SUCCESS);
      }
    default:
      CPU_SET(0, &set);
      switch(sched_setaffinity(getpid(), sizeof(set), &set)) {
        case -1:
          perror("sched_setaffinity failed\n");
          exit(EXIT_FAILURE);
        case 0:
          start = currentcycles();
          for (size_t i = 0; i < ITER_NUM; i++) {
            write(pipefd_1[1], NULL, 0);
            read(pipefd_2[0], NULL, 0);
          }
          end = currentcycles();
          printf("context switch (read & write 0 byte %d times) total time: %f us, average: %f us\n", \ 
                 ITER_NUM, (double) (end-start) / (frequency/1e6), \
                 (double) (end-start) / (frequency/1e6) / ITER_NUM);
          break;
      }
  }
  return 0;
}
```

