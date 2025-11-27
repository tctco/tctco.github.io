---
title: The Network Layer
date: 2019-06-04 01:06:20
tags:
categories: Network
---

This is going to be a completely new part of my study in CS. This part won’t last long because I haven’t finished DataStructure and I’m going to learn assembly language.

I learn this simply because my server was banned by the GFW and I need some extra knowledge to prevent this from happening again.

Good Luck!

> Google Crash Course

# The Network Layer

Describing the IP addressing scheme and subnetingworks.

## The Network Layer

MAC addresses are useful in a small scale. But they are **not ordered**.
**Address resolution protocol**

### IP Address

8 digits **Dotted decimal notation**: 11111111.11111111.11111111.11111111

IP Addresses are distributed in large areas and companies and organizations. IP addresses belong to networks, not to the devices attached to those networks. But the **MAC** address will not change.

Eg: You laptop’s IP will change if you change the network it connects from your home to a cafe. The MAC won’t.

**Dynamic Host Configuration Protocol**: For a modern device, once it connects to a router, it will automatically be assigned an IP Address(**Dynamic IP address**).

**Static IP address**: It has to be configured mannually. In most cases, static IP addresses are reserved for servers and network devices, while dynamic IP addresses are reserved for clients.

### IP Datagrams and Encapsulation

Packet in this layer is called **IP datagram**.

**IP datagram**: A highly structured series of fields that are strictly defined.

| 0~4            | 4~8            | 8~16                   | 16~19           | 19~31           |
| -------------- | -------------- | ---------------------- | --------------- | --------------- |
| Version        | Header Length  | Service Type           | Total Length    | Total Length    |
| Identification | Identification | Identification         | Flags           | Fragment Offset |
| TTL            | TTL            | Protocol               | Header Checksum | Header Checksum |
| -              | -              | Source IP Address      | -               | -               |
| -              | -              | Destination IP Address | -               | -               |
| Options        | Options        | Options                | Options         | Padding         |

**Remark**: The most common version of IP is version 4, **IPv4**.

**Header Length field**: Almost always 20 bytes in length when dealing with IPv4.

**Service Type field**: These 8 digits can be used to specify details about quality of service, or **QoS**(to make routers choose which IP datagram is more important), technologies.

**Total Length field**:Indicates the total length of the IP datagram it’s attached to. Thus the maximum size of a single datagram: **65535**.

**Identification field**: 16-bit number used to group messages together.

If the data is larger than 65535, the IP layer needs to split this data up into many invidual packets.

**Flag field**: Used to indicate if a datagram is allowed to be fragmented, or to indicate that the datagram has already been fragmented.

**Fragmentation**: Process of taking a single IP datagram and splitting it up into several smaller datagrams.

**Time to Live (TTL) field**: indicate how many router hops a datagram can traverse before it’s thrown away. In case of a loop, the routers needn’t to continue transfering the data.

**Protocol field**: Contains data about what transport layer protocol is being used (TCP/UDP).

**Header checksum field**: A checksum of the contents of the entire IP datagram header (as TTL changes, the checksum changes too!).

**Source IP Address and Destination IP Address**:32 bits

**IP options field**: Optional. Used to set special characteristics for datagrams primarily used for testing purposes.

**Padding**: A series of 0 to ensure the header is the correct total size. (Since the size of IP optional fields is unknown).

#### Data payload section

This is what IP datagram is. And this process is called **Encapsulation**.

## Encapsulation

> > > > Message > Application
> > >
> > > (TCP/UDP header)Message > Transport
> >
> > (IP header)TCP segment or UDP datagram > Network
>
> (Ethernet header)IP datagram(ethernet footer) > Data-link

### IP Address Classes

2 sections: **network ID** and **host ID**.

Eg: 9.100.100.100
9 will be network ID, and 100.100.100 will be the host ID.

**Address class system**: A way of defining how the global IP address space is split up.
*Network ID and Host ID*
**Class A**:1+3(0~126, 0)
**Class B**:2+2(128~191, 10)
**Class C**:3+1(192~224, 110)
There are also Class D and E(used for testing purposes).

Inpractice, these classes have been replaced by **CIDR**: Classless inter-domain routing.

### Addresses Resolution Protocol (ARP)

A protocol used to discover the hardware address of a node with a certain IP address.

**ARP table**: a list of IP addresses and the MAC addresses associated with them.

A Eg should be like this:

1. Host A wants to send a message to 10.20.30.40 but this is not in its ARP table.
2. Host A broadcast FF: FF: FF: FF: FF: FF
3. ARP broadcast is received and ARP response is sent back. This will contain the MAC address in question.

ARP table entries generally expire after a short amount of time to ensure changes in the network are accounted for.

## Subnetting

### Subnet masks

We have already know that IP addresses can be splitted into 2 sections. The Host ID and the Network ID.

If we go deeper into the IP addresses, we will need: **Subnet ID**.

In the Internet level, the core routers only care about the network ID and use it to send datagram to the **gateway routers**. Then the gateway routers (with some additional information) can send the datagram to the destination machine or the next router.

The Host ID is used for the last router to send the datagram to the recipient machine.

Subnet IDs are calculated by using **Subnet masks**: 32-bit numbers that are normally written out as 4 octets in decimal.

------

*How does it work?*
IP address: 9.100.100.1009.100.100.100
Then in binary: 00001001.01100100.01100100.0110010000001001.01100100.01100100.01100100
Subnet mask: 11111111.11111111.11111111.0000000011111111.11111111.11111111.00000000

The “1” parts is to tell a router what part is the subnet ID.

In this case, only the last octect is available for the Host ID. Since 0 is not used and 255 is reserved for broadcast, only 1~254 are available to assign to the host.

This is the famous Subnet mask: 255.255.255.0255.255.255.0

Another example:
Subnet mask: 255.255.255.224255.255.255.224
also written by: 11111111.11111111.11111111.1110000011111111.11111111.11111111.11100000
In this case, the host ID space will be 5 bits.

Since this Subnet ID is consists of 27 “1”s and 5 “0”s, a quicker way to represent this should be: 9.100.100.100/279.100.100.100/27

Subnet mask is a way for a computer to use **AND operators** to determine if an IP address exists on the same network.

The computer that runs this operation can compare the result with its own network ID to determine if the address is on the same network.

### CIDR

A even more flexible way to describe blocks of IP addresses. It expands on the concept that subneting by using subnet masks to **Demarcate** networks.

**Demarcate**: to demarcate sth means to set sth off.

**Demarcation point**: To describe where one network or system ends and another one begins.

**CIDR notation**: 9.100.100.100/249.100.100.100/24

If a company wants 2 Class C, it can simply use Subnet mask of 255.255.254.0/23255.255.254.0/23. This also saves 2 IP addressed since 256∗2−2=510256∗2−2=510.

## Routers

### Basic Concepts

**Router**: A network device that forwards traffic depending on the destination address of that traffic.

1. Receive data packet
2. Examines destination IP
3. Looks up IP destination network in routing table
4. Forward traffic to destination

### Routing table

4 Coulumns:

- Destination network(IP and Subnet address / CIDR)
- Next hop
- Total hops
- Interface

### Interior Gateway Protocol

Problem: Quickest path?
**Routing protocols**: Routers communicates to each other. It can be divided into 2 categories: **interior gateway protocols** and **exterior gateway protocols**.

**Interior gateway protocols**: Used by routers to share info within a single **autonomous system**, which is a collection of networks all fall under the control of a single network operator. Eg: Many routers employed by a internet service provider who is usually in reaches or usually national scale.

**Interior gateway protocols** are further split into 2 categories: **Link state routing protocols** and **distance-vector protocols**.

**Distance-vector protocols** are older of standard, list of networks are how far away in terms of hubs. Then the router will send this list to every routers it connects. In CS, a list is called a **vector**.

> Distance-vector protocols care about the neighbors while Link state routing protocols are more complex(more data and a strong algorithm).

### Exterior gateway protocols

Exchange info between different organizations.

**Internet Assigned Numbers Authority (IANA)**: NGO that helps manage things like IP address allocation and **ASN, Autonomous System Number** allocation.

**ASN**: Numbers assigned to indicidual autonomous systems.

### Non-Routable Address Space

The establishment of RFC, Request for Comments.

Not all computers on the internet need to connect to other computers on the internet! Non-Routabnle Address Space allows for nodes on such a network to communicate with each other but no gateway router will attend to forward traffic to this type of network.
$$
10.0.0.0/810.0.0.0/8\\

172.16.0.0/12172.16.0.0/12\\

192.168.0.0/16192.168.0.0/16\\
$$


This Non-routable address space is also related to **NAT, Network Address Translation**.
