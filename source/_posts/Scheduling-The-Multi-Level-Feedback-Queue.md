---
title: 'Scheduling: The Multi-Level Feedback Queue'
date: 2020-09-10 02:05:40
tags:
categories: OS
---

# Scheduling: Introduction

## Workload Assumptions

A number of simplifying simplifying assumptions about the process running in the system, sometimes collectively called the **workload**. We will make the following assumptions about the processes, sometimes called **jobs**, that are running in the system:

1. Each job runs for the same amount of time.
2. All jobs arrive at the same time.
3. Once started, each job runs to completion.
4. All jobs only use the CPU.
5. The run-time of each job is known.



## Scheduling Metrics

**Turnaround time**: the time at which the job completes minus the time at which the job arrived in the system.
$$
T_{turnaround} = T_{completion} - T_{arrival}
$$


Turnaround time is a **performance** metric, which will be the primary focus.

**Fairness**: E.g.: **Jain's Fairness Index**

Performance and fairness are often at odds in scheduling

## First In, First Out (FIFO)

**Convoy effect**: A number of relatively-short potential consumers of a resource get queued behind a heavy weight resource consumer.

## Shortest Job First (SJF)

Another convoy effect: light jobs arrive just a short time after the heavy job.

## Shortest Time-to-Completion First (STCF)

SJF by our definition is a **non-preemptive** scheduler. Add preemption to SJF, known as the **shortest time-to-completion first** or **preemptive shortest job first (PSJF)** scheduler.

## A New Metric: Response Time

The introduction of time-shared machines changed all that. Now users would sit at a terminal and demand interactive performance from the system as well. A new metric was born: **response time**.
$$
T_{response} = T_{firstrun} - T_{arrival}
$$

## Round Robin (轮询调度, RR)

Instead of running jobs to completion, RR runs a job for a **time slice** (**scheduling quantum**). RR is sometimes called **time-slicing**. 

**Amortization can reduce costs**. Thus, deciding on the length of the time slice presents a trade-off to a system designer, making it long enough to **amortize** the cost of switching without making it so long that the system is no longer responsive.

Note that the cost of context switching does not arise solely from the OS actions of saving and restoring a few registers. When programs run, they build up a great deal of state in CPU caches, TLBs (Translation Lookaside Buffer, 转译后备缓冲区，CPU的一种缓存，由存储器管理单元用于改进虚拟地址到物理地址的转译速度), branch predictors, and other on-chip hardware. Switching to another job causes this state to be flushed and new state relevant to the currently-running job to be brought in, which may exact a noticeable performance cost.

The RR is indeed one of the worst policies if turnaround time is our metric. Because turnaround time only cares about when jobs finish, RR is nearly pessimal, even worse than simple FIFO in many cases.

More generally, any policy (such as RR) that is **fair**, i.e., that evenly divides the CPU among active processes on a small time scale, will perform poorly on metrics such as turnaround time. Indeed, this is an inherent trade-off.

**Overlap enables higher utilization**

## Incorporating I/O

A scheduler clearly has a decision to make when a job initiates an I/O request, because the currently-running job won't be using the CPU during the I/O; it is **blocked** waiting for I/O completion. The scheduler also has to make a decision when the I/O completes. When that occurs, an interrupt is raised, and the OS runs and moves the process that issued the I/O from blocked back to the ready state or even decide to run the job at that point.

By treating each CPU burst as a job, the scheduler makes sure processes that are "interactive" get run frequently. While those interactive jobs are performing I/O, other CPU-intensive jobs run, thus better utilizing the processor.

## No More Oracle

The OS usually knows very little about the length of each job. Thus, how can we build an approach that behaves like SJF/STCF without such a priori knowledge? Further, how can we incorporate some of the ideas we have seen with the RR scheduler so that response time is also quite good?

## Homework

1. Compute the response time and turnaround time when running three jobs of length 200 with the SJF and FIFO schedulers.
   - SJF: response: 200, turnaround: 400, FIFO: response: 200, turnaround: 400
2. Now do the same but with jobs of different lengths: 100, 200, and 300. 
   - SJF: response: 133, turnaround: 333, FIFO: response:  133, turnaround: 333
3. Now do the same, but also with the RR scheduler and a time-slice of 1.
   - response: 1, turnaround: 467
4. For what types of workloads does SJF deliver the same turnaround times as FIFO? 
   - The jobs are sorted by the time required in ascending order.
5. For what types of workloads and quantum lengths does SJF deliver the same response times as RR? 
   - The length of a job is the same as a time interval.
6. What happens to response time with SJF as job lengths increase? Can you use the simulator to demonstrate the trend? 
   - The response time increases the same as the the increase of the shortest time consumed.
7. What happens to response time with RR as quantum lengths increase? Can you write an equation that gives the worst-case response time, given N jobs?
   - The response time increases as quantum lengths increase. $\overline{\Delta T} = \frac{N-1}{2}\Delta t$

