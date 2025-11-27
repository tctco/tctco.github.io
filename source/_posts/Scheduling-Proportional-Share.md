---
title: 'Scheduling: Proportional Share'
date: 2020-09-10
 02:06:39
tags:
categories:
---

> Operating Systems: Three Easy Pieces

We will examine a different type of scheduler known as a **proportional-share** scheduler, also sometimes referred to as a **fair-share** scheduler.

An early example of proportional-share scheduling is known as **lottery scheduling**. The crux is how can we design a scheduler to share the CPU in a proportional manner?

## Basic Concept: Tickets Represent Your Share

**tickets**: used to represent the share of a resource that a process (or user) should receive.

Lottery allocate resources probabilistically (but not deterministically) by holding a lottery every so often (say, every time slice). The scheduler must know how many total tickets there are. The scheduler then picks a winning ticket. One of the most beautiful aspects of lottery scheduling is its use of **randomness**. When you have to make a decision, using such a randomized approach is often a robust and simple way of doing so.

- random often avoids strange corner-case behaviors that a more traditional algorithm may have trouble handling.
- random also is lightweight, requiring little state to track alternatives.
- random can be quite fast

## Ticket Mechanisms

**ticket currency**: currency allows a user with a set of tickets to allocate tickets among their own jobs in whatever currency they would like; the system then automatically converts said currency into the correct global value.

**ticket transfer**: as process can temporarily hand off its tickets to another process. The ability is especially useful in a client/server setting, where a client process sends a message to a server asking it to do some work on the client’s behalf. To speed the work, the client can pass the tickets to the server and thus try to maximize the performance of the server while the server is handling the client’s request. When finished, the server then transfers the tickets back to the client and all is as before.

**ticket inflation**: With inflation, a process can temporarily raise or lower the number of tickets it owns. Inflation can be applied in an environment where a group of processes trust one another.

## Implementation

```c
// counter: used to track if we've found the winner yet
int counter = 0;
// winner: use some call to a random number generator to
// get a value, between 0 and the total # of tickets
int winner = getrandom(0, totaltickets);
// current: use this to walk through the list of jobs
node_t * current = head;
while (current) {
  counter = counter + current -> tickets;
  if (counter > winner)
    break;
  current = current -> next;
}
```

To make this process most efficient, it might generally be best to organize the list in sorted order, from the highest number of tickets to the lowest. The ordering does not affect the correctness of the algorithm; however, it does ensure in general that the fewest number of list iterations are taken, especially if there are a few processes that possess most of the tickets.

## Example

**fairness metric**: the time the first job completes divided by the time that the second job completes.

## How to Assign Tickets

One approach is to assume that the users know best; in such a case, each user is handed some number of tickets, and a user can allocate tickets to any jobs they run as desired. However, this solution is a non-solution: it really does not tell you what to do.

## Stride Scheduling

Why use randomness at all? It occasionally will not deliver the exact right proportions, especially over short time scales. For this reason, Waldspurger invented **stride scheduling**, a deterministic fair-share scheduler.

Stride scheduling is also straightforward. Each job in the system has a stride, which is inverse in proportion to the number of tickets it has. The strides can be calculated by dividing a large number by the number of tickets each process has been assigned. Every time a process runs, we will increment a counter for it (called its **pass** value) by its stride to track its global progress.

The scheduler then uses the stride and pass to determine which process should run next. The basic idea is simple: at any given time, pick the process to run that has the lowest pass value so far; when you run a process, increment its pass counter by its stride.

```c
curr = remove_min(queue); // pick clinet with min pass
schedule(curr); // run for quantum
curr -> pass = curr -> stride; // update pass using stride
insert(queue, curr); // return curr to queue
```

Why use the lottery scheduling at all? No global state! Imagine a new job enters in the middle of our stride scheduling example; what should its pass value be?

## The Linux Completely Fair Scheduler (CFS)

The **Completely Fair Scheduler (CFS)** implements fair-share scheduling, but does so in a highly efficient and scalable manner.

To achieve its efficiency goals, CFS aims to spend very little time making scheduling decisions, through both its inherent design and its clever use of data structures well-suited to the task. Recent studies have shown that scheduler efficiency is surprisingly important. A study shows that even after aggressive optimization, scheduling uses about 5% of overall datacenter CPU time. Reducing that overhead as much as possible is thus a key goal in modern scheduler architecture.

### Basic Operation

Whereas most schedulers are based around the concept of a fixed time slice, CFS operates a bit differently. Its goal is simple: to fairly divide a CPU evenly among all competing processes. It does so through a simple counting-based technique known as **virtual runtime (vruntime)**.

As each process runs, it accumulates vruntime. In the most basic case, each process’s vruntime increases at the same rate, in proportion with physical (real) time. When a scheduling decision occurs, CFS will pick the process with the lowest vruntime to run next.

How does the scheduler know when to stop the currently running process, and run the next one? The tension here is clear: if CFS switches too often, fairness is increased, as CFS will ensure that each process receives its share of CPU even over miniscule time windows, but at the cost of performance is increased (reduced context switching), but at the cost of near-term fairness.

CFS manages this tension through various control parameters: **sched_latency**: CFS uses this value to determine how long one process shoudl run before considering a switch (effectively determining its time slice but in a dynamic fashion). A typical sched_latency value is 46 (miliseconds); CFS divides this value by the number (n) of processes running on the CPU to determine the time slice for a process, and thus ensures that over this period of time, CFS will be completely fair.

But what if there are “too many” processes running? Wouldn’t that lead to too small of a time slice, and thus too many context switches? The answer is yes.

To address this issue, CFS adds another parameter, **min_granularity**, which is usually set to a value like 6ms. CFS will never set the time slice of a process to less than this value, ensuring that not too much time is spent in scheduling overhead.

Note that CFS utilizes a periodic timer interrupt, which means it can only make decisions at fixed time intervals. This interrupt goes off frequently (e.g., every 1 ms), giving CFS a chance to wake up and determine if the current job has reached the end of its run. If a job has a time slice that is not a perfect multiple of the timer interrupt interval, that is OK; CFS tracks vruntime precisely, which means that over the long haul, it will eventually approximate ideal sharing of the CPU.

### Weighting (Niceness)

CFS also enables control over process priority, enabling users or administrators to give some processes a higher share of the CPU. It does this not with tickets, but through a classic UNIX mechanism known as the **nice** level (-20 to +19, lowest) of a process.

> When you are too nice, you just don’t get as much (scheduling) attention, alas.

CFS maps the nice value of each process to a `weight`, as shown here:

```c
static const int prio_to_weight[40] = {
    /* -20 */ 88761, 71755, 56483, 46273, 36291,
    /* -15 */ 29154, 23254, 18705, 14949, 11916,
    /* -10 */ 9548, 7620, 6100, 4904, 3906,
    /* -5 */ 3121, 2501, 1991, 1586, 1277,
    /* 0 */ 1024, 820, 655, 526, 423,
    /* 5 */ 335, 272, 215, 172, 137,
    /* 10 */ 110, 87, 70, 56, 45,
    /* 15 */ 36, 29, 23, 18, 15,
};
```

These weights allow us to compute the effective time slice of each process, but now accounting for their priority differences.

### Using Red-Black Trees

Keep process in a **red-black tree**.

CFS does not keep all process in this structure; rather, only running (or runnable) processes are kept therein. If a process goes to sleep, it is removed from the tree and kept track of elsewhere.

### Dealing With I/O And Sleeping Processes

When a process wake up from an I/O, its vruntime will be much shorter than continuous jobs, causing monopoly of the CPU. CFS handles this case by altering the vruntime of a job when it wakes up. Specifically, CFS sets the vruntime of that job to the minimum value found in the tree. In this way, CFS avoids starvation but not without a cost: jobs that sleep for short periods of time frequently do not get their fair share of the CPU.

## Homework

1. Compute the solutions for simulations with 3 jobs and random seeds of 1, 2, and 3.
   - 2 0 1 2 2 2 1 1 1 1 1 1; 2 0 0 2 0 1 0 2 0 0 0 1 0 0 1 2 1 1 1 2 1 1 2; 1 1 0 1 0 2 2 2 2 2 2
2. Now run with two specific jobs: each of length 10, but one (job 0) with just 1 ticket and the other (job 1) with 100 (e.g., -l 10:1,10:100). What happens when the number of tickets is so imbalanced? Will job 0 ever run before job 1 completes? How often? In general, what does such a ticket imbalance do to the behavior of lottery scheduling?
   - Job 0 will have almost no opportunity to run when job 1 exists. It is still possible for job 0 to run before job 1. Prob: 0.1. Job 1 will run with priority.
3. When running with two jobs of length 100 and equal ticket allocations of 100 (-l 100:100,100:100), how unfair is the scheduler? Run with some different random seeds to determine the (probabilistic) answer; let unfairness be determined by how much earlier one job finishes than the other.
   - Expected time difference: $2\frac{\sum_{i=0}^{99}(100-i)C_{99+i}^i}{C_{200}^{100}} = 1.98$
4. How does your answer to the previous question change as the quantum size (-q) gets larger?
   - Unfairness should become lower.
5. Can you make a version of the graph that is found in the chapter? What else would be worth exploring? How would the graph look with a stride scheduler?
   - Seems that I have come up with an equation. However, I am not able to solve it.
