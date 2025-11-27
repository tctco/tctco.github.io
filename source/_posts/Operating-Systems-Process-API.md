---
title: 'Operating Systems: Process API'
date: 2020-08-18 02:02:10
tags:
categories: OS
---

# Interlude: Process API

##  The `fork` System Call

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(int argc, char *argvp[]) {
  printf("hello world (pid:%d)\n", (int) getpid());
  int rc = fork();
  if (rc < 0) {
    // fork failed
		fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    // child (new process)
    printf("hello, I am child (pid:%d)", (int) getpid());
  } else {
    // parent goes down this path (main)
    printf("hello, I am parent of %d (pid:%d)\n", 
           rc, (int) getpid());
  }
  return 0;
}
```

The interesting part begins. The process calls the `fork()` system call, which the OS provides as a way to create a new process. The odd part: the process that is created is an (almost) exact copy of the calling process. That means that to the OS, it now looks like there are two copies of the program running, and both are about to return from the `fork()` system call. The newly-created process (called the **child**, in contrast to the creating **parent**) doesn't start running at `main()`; rather, it just comes into life as if it had called `fork()` itself.

The child isn’t an exact copy. Specifically, although it now has its own copy of the address space (i.e., its own private memory), its own registers, its own PC, and so forth, the value it returns to the caller of `fork()` is different. . Specifically, while the parent receives the PID of the newly-created child, the child receives a return code of zero. 

The output is not **deterministic**. Assuming we are running on a system with a single CPU (for simplicity), then either the child or the parent might run at that point. The parent or the child can print message first.

> However, in my experiment, the parent always print first.

The CPU **scheduler** determines which process runs at a given moment in time; because the scheduler is complex, we cannot usually make strong assumptions about what it will choose to do, and hence which process will run first. This **non-determinism** , as it turns out, leads to some interesting problems, particularly in **multi-threaded programs**; hence, we'll see a lot more non-determinism when we study **concurrency**.

## The `wait()` System Call

Sometimes, as it turns out, it is quite useful for a parent to wait for a child process to finish what it has been doing. This task is accomplished with the `wait()` system call (or its more complete sibling `waitpid()`).

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(int argc, char *argv[]) {
  printf("hello world (pid:%d)\n", (int) getpid());
  int rc = fork();
  if (rc < 0) { 
    // fork failed; exit
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) { 
    // child (new process)
    printf("hello, I am child (pid:%d)\n", (int) getpid());
  } else { 
    // parent goes down this path (main)
    int rc_wait = wait(NULL);
    printf("hello, I am parent of %d (rc_wait:%d) (pid:%d)\n",
            rc, rc_wait, (int) getpid());
  }
  return 0;
}
```

The child might simply run first and print before the parent. However, if the parent does happen to run first, it will immediately call `wait()`; this system call won't return until the child has run and exited.

## The `exec()` System Call

The `exec()` is useful when you want to run a program that is different from the calling program.

```c
#include <stdlib.h>
#include <stdio.h>
#include <string.h>


int main(int argc, char* argv[]) {
  printf("hello world (pid:%d)\n", (int) getpid());
  int rc = fork();
  if (rc < 0) {
    // fork failed
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    printf("hello, I am child (pid:%d)\n", (int) getpid());
    char* myargs[3];
    myargs[0] = strdup("wc"); // copy string to the given address
    													// program "wc" (word count)
    myargs[1] = strdup("p3.c"); // argument: file to count
    myargs[2] = NULL; // marks end of array
    execvp(myargs[0], myargs); // run word count
    printf("this shouldn't print out");
  } else {
    int rc_wait = wait(NULL);
    print("hello, I am the parent of %d (rc_wait:%d) (pid:%d)\n"
          rc, rc_wait, (int) getpid());
  }
  return 0;
}
```

The `fork()` system call is strange; its partner in crime, `exec()`, is not so normal either. What it does: given the name of an executable (e.g., `wc`), and some arguments (e.g., `p3.c`), it **loads** code (and static data) from that executable and overwrites its current code segment (and current static data with it); the heap and stack and other parts of the memory space of the program are re-initialized. Then the OS simply runs that program, passing in any arguments, as the `argv` of that process. Thus, it does not create a new process; rather, it transforms the currently running program into a different running program (`wc`). After the `exec()` in the child, it is almost as if `p3.c` never ran; a successful call to `exec()` never returns.

## Why? Motivating The API

The separation of`fork()` and `exec()` is essential in building a UNIX shell, because it lets the shell run code after the call to `fork()` but before the call to `exec()`; this code can alter the environment of the about-to-be-run program, and thus enables a variety of interesting features to be readily built.

The shell is just a user program. It shows you a **prompt** and then waits for you to type something into it. You then a command (i.e., the name of an executable program, plus any arguments) into it; in most cases, the shell then figures out where in the file system the executable resides, calls `fork()` to create a new child process to run the command, calls some variant of `exec()` to run the command, and then waits for the command to complete by calling `wait()`. When the child completes, the shell returns from `wait()` and prints out a prompt again, ready for your next command.

The separation of `fork()`  and `exec()` allows the shell to do a whole bunch of useful things rather easily. For example:

```bash
wc p3.c > newfile.txt
```

The output of `wc` is **redirected** into the output file `newfile.txt` .  The way the shell accomplishes this task is quite simple: when the child is created, before calling `exec()`, the shell closes **standard output** and opens the file `newfile.txt`. By doing so, any output from the soon-to-be-running program `wc` are sent to the file instead of the screen.

```c
#include <sdtio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <fcntl.h>
#include <sys/wait.h>

int main(int argc, char* argv[]) {
  int rc = fork();
  if (rc < 0) {
    // fork failed
    fprintf(stderr, "fork failed\n");
    exit(1);
  } else if (rc == 0) {
    // child: redirect standard output to a file
    close(STDOUT_FILENO);
    open("./p4.output", O_CREAT|O_WRONGLY|O_TRUNC, S_IRWXU);
    
    // now exec "wc"
    char *myargs[3];
    myargs[0] = strdup("wc");
    myargs[1] = strdup("p4.c");
    myargs[2] = NULL;
    execvp(myargs[0], myargs);
  } else {
    // parent goes down this path (main)
    int rc_wait = wait(NULL);
  }
  return 0;
}
```

## Process Control and Users

There are a lot of other interfaces for interacting with processes in UNIX systems. For example, the `kill()` system call is used to send **signals** to a process, including directives to pause, die, and other useful imperatives.

The entire signals subsystem provides a rich infrastructure to deliver external events to processes, including ways to receive and process those signals within individual processes, and ways to send signals to individual processes as well as entire **process groups**. To use this form of communication, a process should use the `signal()` system call to "catch" various signals; doing so ensures that when a particular signal is delivered to a process, it will suspend its normal execution and run a particular piece of code in response to the signal. 

## Homework

### Simulation

1. One interesting thing to note is what happens when a child exits; what happens to its children in the process tree? To study this, let’s create a specific example: `./fork.py -A a+b,b+c,c+d,c+e,c-`. This example has process ’a’ create ’b’, which in turn creates ’c’, which then creates ’d’ and ’e’. However, then, ’c’ exits. What do you think the process tree should like after the exit? What if you use the `-R` flag? Learn more about what happens to orphaned processes on your own to add more context.

   - The process will be concatenated to the `a` init process. When `-R` flag is given, the process is re-attached to its ancestor `b`.

2. Use both `-t` and `-F` together. This shows the final process tree, but then asks you to fill in the actions that took place. By looking at the tree, can you determine the exact actions that took place? In which cases can you tell? In which can’t you tell? Try some different random seeds to delve into this question.


### Code

1. Write a program that calls `fork()`. Before calling `fork()`, have the main process access a variable (e.g., `x`) and set its value to something (e.g., 100). What value is the variable in the child process? What happens to the variable when both the child and parent change the value of `x`?

   - The value in the child is the same as the one in the main process. It seems that the child and the main process both have a copy of the original variable. They changed their own variable separately.

2. Write a program that opens a file (with the`open()` system call) and then calls` fork()` to create a new process. Can both the child and parent access the file descriptor returned by `open()`? What happens when they are writing to the file concurrently, i.e., at the same time?

   - Yes, both processes can access the file descriptor returned by `open()` and write to the file at the same time.

3. Write another program using `fork()`. The child process should print “hello”; the parent process should print “goodbye”. You should try to ensure that the child process always prints first; can you do this without calling `wait()` in the parent?

   - Use `sleep(1)` in the `<unistd.h>` library at the main process.

4. Write a program that calls fork() and then calls some form of `exec()` to run the program `/bin/ls`. See if you can try all of the variants of `exec()`, including (on Linux) `execl()`, `execle()`, `execlp()`, `execv()`, `execvp()`, and `execvpe()`. Why do you think there are so many variants of the same basic call?

   ```c
   #include <unistd.h>
   
   int execl(const char* path, const char* args, ...);
   int execlp(const char* file, const char* args, ...);
   int execle(const char* path, const char *args, ..., char* const envp[]);
   int execv(const char* path, char* const argv[]);
   int execvp(const char* file, char* const argv[]);
   ```

5. Now write a program that uses `wait()` to wait for the child process to finish in the parent. What does `wait()` return? What happens if you use `wait()` in the child?

   - The `wait()` will return the child `pid`. The `wait()` will return -1 in the child process.

6. Write a slight modification of the previous program, this time using `waitpid()` instead of `wait()`. When would `waitpid()` be useful?

   - When there are multiple children processes `waitpid` could be useful to wait for the specific child's state change.

7. Write a program that creates a child process, and then in the child closes standard output (`STDOUT FILENO`). What happens if the child calls `printf()` to print some output after closing the descriptor?

   - The child can no longer print anything on the screen while the parent can still print. However, if the `stdout` is closed in the parent process, the child is not able to print anything either.

8. Write a program that creates two children, and connects the standard output of one to the standard input of the other, using the `pipe()` system call.

   - The core code can be viewed with `man pipe` command.

