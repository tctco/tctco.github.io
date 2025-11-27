---
title: Transport and Application Layers
date: 2019-06-05 01:08:36
tags:
categories: Network
---

> Google crash course

# Transport and Application Layers

## Intro

**Transport layer**: Allows traffic to be directed to specific network applications.

**Application layer**: Allows these applications to communicate in a way they understand.

## The Transport Layer

#### Multiplex and Demultiplex

| Processes | Multiplexer   | IP        |
| --------- | ------------- | --------- |
| IP        | Demultiplexer | Processes |

The transport layer handles this multiplexing and demultiplexing through **Ports**.

**Port**: A 16-bit number used to direct traffic to specific services running on a networked computer.

Different network services run while listening on specific ports for incoming requests.

*Eg: HTTP(Hypertext Transfer Protocol, unencrypted):80
FTP(File Transfer Protocol): 21*

**Socket Address**: Aka **Socket number** 10.1.1.100:8010.1.1.100:80

### Dissection of a TCP Segment

**TCP segment**: Made up of a TCP header and a data section (payload layer).

| Bit0~Bit15                                 | Bit15~Bit31               |
| ------------------------------------------ | ------------------------- |
| Source port(16)                            | Destination port(16)      |
| Sequence number(32)                        | Sequence number(32)       |
| Acknowledgment number(32)                  | Acknowledgment number(32) |
| Header Length(4) empty(6) Control flags(6) | Window(16)                |
| Checksum(16)                               | Urgent(16)                |
| Options (0 or 16 if any)                   | Padding                   |
| Data payload (varies)                      | …                         |

**Source port**: A high-numbered port chosen from a special section of ports known as **ephemeral ports**.

**Sequence number**: A 32-bit number used to keep track of where in a sequence of TCP segments this one is expected to be.

**Acknowledgement number**: The number of the next expected segment. *Eg: Sequence number 1 acknowledge number 2*

**Data offset field**: 4-bit communicates how long the TCP header for this segment is. The receiving device can understand where the actual data payload begins.

**Control flags**

**TCP window**: Specifies the range of sequence numbers that might be sent before an acknowledgement is required.

**Urgent pointer field**: Used in conjunction with one of the TCP control flags to point out particular segments that might be more important than others. Not common in modern networking.

**Options**: Also rare in the real world. Sometimes used for more complicated flow control protocols.

### TCP Control Flags and the Three-Way Handshake

The way TCP establishes a connection is through the use of different TCP Control Flags used in very specific order.

#### Control flags

- URG(urgent)
  - A value of one here indicates that the segment is considered urgent and that the urgent pointer field has more data about this.
- ACK(acknowledged)
  - A value of one in this field means that the acknowledgement number field should be examined.
- PSH(push)
  - The transmitting device wants the receiving device to push currently-buffered data to the application on the receiving end as soon as possible.
  - **buffer** is somewhere the data stored before it is sent.
- RST(reset)
  - One of the sides in a TCP connection has not been able to properly recover from a series of missing or malformed segments.
- SYN(synchronize)
  - It is used when first establishing a TCP connection and makes sure the receiving end knows to examine the sequence number field.
- FIN(finish)
  - When this flag is set to one, it means the transmitting computer doesn’t have any more data to send and the connection can be closed.

**A typical connecting process should be like this**:

1. A———SYN——>B
2. A<—-SYN/ACK—-B
3. A———ACK——>B

This process is also called **A Three-Way Handshake**

**Handshake**: A way for 2 devices to ensure that they are apeaking the same protocol and will be able to understand each other.

This process is operated in **Full Duplex**. Each segment sent in either direction should be responded by a TCP segment with the ACK. This way, the other side always knows what has been received.

When the connection is going to be closed, there will be the **Four-Way Handshake**:

1. A<——FIN——B
2. A——-ACK—->B
3. A——-FIN—->B
4. A<——ACK——B

### TCP Socket States

**Socket**: The **instantiation** of an end-point in a potential TCP connection.

**Instantiation**: The actual implementation of something defined elsewhere.

TCP Sockets require extra programs to instantiate them. **Ports** are more virtual descriptive. You can send info to any port you want, but you are only going to get a response if a program has opened a socket on that port.

#### TCP Socket States

**LISTEN**: A TCP socket is ready and listening for incoming connections. (Server side only)

**SYN_SENT**: A synchronization request has been sent, but the connection hasn’t been established yet. (Client side only)

**SYN-RECEIVED**: A socket previously in a LISTEN state has received a synchronization request and sent a SYN/ACK back. But it has not received the final ACK from client yet. (Server side only)

**ESTABLISHED**: The TCP connection is in working order and both sides are free to send each other data.

**FIN_WAIT**: A FIN has been sent, but the corresponding ACK from the other end has not been recieved yet.

**CLOSE_WAIT**: The connection has been closed at the TCP layer, but that the application that opened the socket has not released its hold on the socket yet.

**CLOSED**: The connection has been fully terminated and that no further communication is possible.

These TCP socket states can vary from operating system to OS. TCP is universal, but choosing different states to describe the states is not as universal.

### Connection-Oriented and Connectionless Protocols

**Connection-oriented protocol**: Establishes a connection, and uses this to ensure that all data has been properly transmitted.

When the data transmitting fails, resending will be determined on the **Transport Level** by **TCP** (to determine when to resend it), since TCP expect an ACK! Thus, sequence numbers is especially important!

**Connectionless protocols**: The most common one is called **UDP(User Datagram Protocol)**.

UDP doesn’t rely on connections and doesn’t support ACK. Just set a destination port and send the packet. *Eg: streaming video*.

### Firewalls

A device that blocks traffic that meets certain criteria. They are most frequently used in the transport layer. Block and allow ports.

## The Application layer

### The Application Layer and the OSI Model

**OSI(Open System Interconnection)**: 7 layers, adding **Session** and **Presentation** between **Transport** and **Application**.

**Session Layer**: Facilitating the communication between actual **applications** and the **transport layer**. Takes **application layer** data and hands it off to the **presentation layer**.

**Presentation Layer**: Responsible for making sure that the unencapsulated **application layer** data is able to be understood by the application in question. An OS might handle encryption or compression data.

### All the layers working in Unison!!!
