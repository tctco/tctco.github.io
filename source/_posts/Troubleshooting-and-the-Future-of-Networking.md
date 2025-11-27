---
title: Troubleshooting and the Future of Networking
date: 2019-06-08 01:14:44
tags:
categories: Network
---

## Intro to Troubleshooting and the Future of Networking

### Intro to Troubleshooting and the Future of Networking

**Error-detection**: The ability for a protocol or program to determine that something went wrong. *Eg: cyclic redundancy check*

**Error-recovery**: The ability for a protocol or program to attempt to fix it.

## Verifying Connectivity

### Pring: Internet Control Message Protocol

**Internet Control Message Protocol (ICMP)**: Mainly used for a router or a remote host to communicate why transmission has failed back to the origin of the transmission.

The ICMP packet is very simple: a header with a few fields, a data section that is used to figure out which of the transmission generated the error.

| 8 bit | 8    | 16       | 32                  | 32           |
| ----- | ---- | -------- | ------------------- | ------------ |
| type  | code | checksum | Reset of the header | data section |

**type**: what type of message is being delivered. *Eg: destination unreachable, time exceeded*

**Code**: indicate a more specific reason for the message than just type. *Eg: some individual codes for destination unreachable: destination network unreachable, destination port unreachable*

**Ping**: Ping lets you send a special type of ICMP message called an **Echo Request**. If the destination is up and running and able to communicate on the network, it will send back an ICMP **Echo Reply** message type.

### Traceroute

**Traceroute**: A utility that lets you discover the path between 2 nodes, and gives you information about each hop along the way.

The principle of traceroute is using **TTL**, once the TTL goes to 0, it will send an **ICMP Time Exceeded** message will be sent back to the originating host.

In Linux and MacOS, **traceroute** sends UDP packets to very high port numbers. On windows the command is **tracert**.

2 similar commands are **mtr-Linux/MacOS**, and **pathping-Windows**

### Testing Port Connectivity

2 important tools on transport layer: **netcat(nc)-Linux/MacOS**(2 parameters: a host and a portm other parameters: -z(zero input and output), -v(verbose)) and **Test-NetConnection-Windows**.

## Digging into DNS

### Name Resolution Tools

**nslookup**: domain name->host server and the resolution result.

**interaction mode**:

- server + address (*Eg: server 8.8.8.8*) all the following name resolution queries will be attempted to be made using that server instead the default name server.
- set type=*resource record type* (*Eg: set type=MX*) By default, nslookup will return A records, but this lets you explictly ask for Quad A or MX or even text record associated with the host.
- set debug. This allows you to display the full display packet including any intermediary requests and all of the contents.

### Public DNS Servers

An ISP almost always gives you access to a **recursive name server** as part of the service it provides.

**Public DNS Servers**: Name servers specifically set up so that anyone can use them, for free.

For many years, the most commonly used DNS servers are run by **Level 3 Communications**， one of the largest ISPs in the world. The DNS Servers are 4.2.2.1 to 4.2.2.6.

The DNS servers on google are 8.8.8.8 and 8.8.4.4.

Most public DNS servers are available globally through **anycast**.

Make sure the name server is run by a reputable company, and try to use the name servers provided by your ISP outside of troubleshooting scenarios.

Most public DNS servers are also respond to **ICMP Echo Request** so they are also a choice for testing general internet connectivity using **Ping**.

### DNS Registration and Expiration

**Registrar**: An organization responsible for assigning individual domain names to other organizations or individuals.

### Hosts Files

The original way that numbered network addresses were correlated with words was through **hosts files**.

**Hosts File**: A flat file that contains, on each line, a network address followed by the host name it can referred to as.

The Hosts File is still in use because of a special address, the **Loopback address**.

**Loopback Address**: A way of sending network traffic to yourself. For IPv4 it is **127.0.0.1**.

Almost every hosts file in existence will, in the very least, contain a line that reads 127.0.0.1 localhost, most likely followed by ::1 localhost, where ::1 is the loopback address for IPv6.

**Hosts files** are a popular way for computer viruses to disrupt and redirect users’ traffic.

## The Cloud

### What is the Cloud

**Cloud Computing**: A technological approach where computing resources are provisioned in a shareable way, so that lots of users get what they need, when they need it.

**Virtualization**: A single physical machine, called a host, could run many individual virtual instances, called guests.

**Hypervisor**: A piece of software that runs and manages virtual machines, while also offering these guests a virtual operating platform that is indistinguishable from actual hardware.

**Public Cloud**: A large cluster of machines run by another company.

**Private Cloud**: Used by a single large corporation and generally physically hosted on its own premises.

**Hybird cloud**: A term used to describe situations where companies might run things like their most sensitive proprietary techs on a private cloud, while entrusting their less-sensitive servers to a public cloud.

**Cloud Computing**: A new model in computing where large clusters of machines let us use the total resources available in a better way.

## IPv6

### IPv6 Addressing and Subnetting

IPv4 = 32 bits
IPv6 = 128 bits
There are 2 rules when it comes to shrotening an IPv6 address. The **first** is that you can remove any leading zeroes from a group. The **second** is that any number of consecutive groups composed of just zeroes can be replaced with two colons.

FF00:: reserved for multicast
FE80:: **Link-local unicast addresses**: Allow for local network segment communications and are configured based upon a host’s MAC address.

The first 64 bits are the Network ID and the last 64 bits are the Host ID.

### IPv6 Headers

Version(4 bits), Traffic Class(8 bits), Flow Label(20 bits), payload length(16 bits), Next Header, Hop Limit(8 bits (TTL)), Source Address(128 bits), Destination Address(128 bits), Datapayload.

### IPv6 and IPv4 Harmony

**IPv4 mapped address space**
**IPv6 tunnels**: Servers take incoming IPv6 traffic and encapsulate it within traditional IPv4 datagram.

**IPv6 tunnel broker**: Companies that provide IPv6 tunneling endpoints for you, so you do not have to introduce additional equipment to your network.
