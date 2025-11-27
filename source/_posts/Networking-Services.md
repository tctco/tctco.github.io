---
title: Networking Services
date: 2019-06-06 01:09:49
tags:
categories: Network
---

> Google crash course

# Networking Service

## Name Resolution

**DNS(Domain Name System)**: A global and highly distributed network service that resolves strings of letters into IP addresses for you.

**Domain Name**: The term we use for something that can be resolved by DNS.

*Eg: Domian Name: www.weather.com IP address: 186.192.1.1*

If the company wants to shift their original data center to another place, by using DNS, it can change what IP the domain resolves to and users will not know.

DNS is of global structure, so it lets organizations to decide which IP it will resolves to.

### The Many Steps of Name Resolution

DNS servers are one of the things that need to be specifically configured at a node on a network.

> For a computer to operate on a modern network, a few things need to be configured.
>
> > MAC addresses are hard coded and tied to specific pieces of hardware.
> >
> > IP address, Subnet mask and Gateway for a host also need to be specific configured.
> >
> > The DNS server will be the last one. The computer will also operate on network without a DNS server but this is not convenient.

There are 5 different types of DNS servers:

- Caching names servers
- Recursive name servers
  - Recursive name servers perform full DNS resolution requests.
    1. User-query->Cashing/Recursive Name Server-query->13 Root Server(Anycast tech, today we can regard these 13 servers as 13 authoritives, not 13 computers)
    2. 13 Root Servers-**TLD** name server->Caching/Recursive Name Server
    3. Caching/Recursive Name Server-query->TLD Name Servers(can be globally distributed which are responsible for each TLD)
    4. TLD Name Servers-**Authoritive Name Server**->Caching/Recursive Name Server. **Authoritive Name Servers** are responsible for the last 2 parts of any domain name, which is the resolution at which a single organization might be responsible for DNS looks ups.
    5. Caching/Recursive Name Server-query->Name Servers
  - Caching and recursive name servers are to store known domain name lookups for a certain amount of time.
  - These 2 are usually privided by ISP.
- Root name servers
- TLD name servers
- Authoritative name servers

**Remark**: All domain names in a global DNS system have a **TTL**.

**TTL(Time to live)**: A value, in seconds, that can be configured by the owner of a doman name for how long a name server is allowed to cache an entry before it should discard it and perform a full resolution again.

**Anycast**: A technique that is used to route traffic to different destinations depending on factors like location, congestion, or link health.

**TLD(Top-level domain)**: Represents the top of hierarchal DNS name resolution system. The last part of any domain name. *Eg: www . facebook . **com***

This strictly hierarchal system prevent malicious parties from redirecting, since your computer will send info to the IP it receives. We rely on the hierarchy system controled by trusted entities.

Normal phones and computers also store some temporary DNS cache as well. Thus they will not bother their Local Name Server for every TCP connection.

### DNS and UDP

**UDP is connectionless**, if using DNS with TCP, there will be too much packets(setting up and shutting down). A DNS server cares only about responding the incoming look ups, and a DNS resolvers simply needs to perform look ups and redo them if not succeed.

In modern network, the DNS look ups responses might be too large to fit in a UDP datagram. In this situation, a DNS name server will respond with a packet explaining that the response is too large. The DNS client will then establish a TCP connection.

## Name Resolution in Practice

### Resource Record Types

DNS in practice operates with a set of defined resource record types. This allows different kinds of DNS resolutions to take place.

An **A record** is used to point a certain domain name at a certain IPv4 IP address.

An IP address is connected to a domain name but a domain name may contain many IP addresses. This needs a technique called **DNS Round robin**. It helps to balance traffic between multiple IPs.

**AAAA - Quad A record**: Very similar to an A record except it returns an IPv6 address.

A **CNAME record** is used to redirect traffic from one domain name to another. *Eg: www . microsoft . com the company also wants that if someone types microsoft . com in the browser, he will be properly redirected. By configuring a CNAME microsoft.com resolve to www . microsoft . com, the resolving client will know to perform another resolution attempt. This time for www . microsoft . com*. CNAME is also called **Canonical Name**.

**MX record - mail exchange**: This resource record is used to deliver Email to the correct server. Many companies run their web service and email service on different machines with different IPs. **MX record** makes sure that the web traffic goes to the web server and email traffic to the email server.

**SRV record - service record**: Similar to MX resource record type except that **SRV record** can be defined to return the specific of many different service types (MX only for email). *Eg: SRV records are often used to return the records like calendar and scheduling service*

**TXT record - text**: Often used to communicate configuration preferences about network services that user has trusted other organizations to handle for his domain. *Eg: TXT record used to convey additional info to an email as a service provider. A company handle the email delivery for the user!*

### Anatomy of a Domain Name

Every domain name consists 3 main parts: www.google.com
**Top level domain (TLD)**: The last part of a doamin name (com). As the internet getting more crowded, more TLDs are added. This is organized by **ICANN**, The Internet Corporation for Assigned Names and Numbers.

**Domain**: The second part (google).
**Domains**: Used to demarcate where control moves from a TLD name server to an authoritative name server.

**Subdomain**: The “www” part, sometimes also referred to as **host name** if it is assigned to only one host. People can have many subdomain names like: host.sub.sub.subdomain.domain.com. DNS can technically support up to **127 levels** of domain in total for a **single fully qualified domain name**.

Combine all these, **Fully qualified domain name (FQDN)**.

### DNS Zones

A authoritive name server is responsible for a specific **DNS zone**.

**DNS zones** are hierarcal concepts. Root name server: root zone. TLD namer server: zone covering its specific TLD. Authoritive name server: finer grain zones underneath. Zones **do not overlap**. This technique allows for easier control over multiple levels of a domain.

Zones are configured by **Zone files**, simple configuration files that declare all resource records for a particular zone. It has to contain **SOA**.

**Start of authority (SOA)**: Declares the zone and the name of the name server that is authoritative for it. Along with **SOA**, **NS** is often found.

**NS records**: Indicate other name servers that might also be responsible for this zone.

**Reverse lookup zone files**: These let DNS resolvers ask for an IP and get the FQDN associated with it returned.

**Pointer resource record (PTR)**: Resolves and IP to a name.

## Dynamic Host Configuration Protocol

### Overview of DHCP

4 things need to be configured:

- IP address
- Subnet Mask
- Gateway
- Name server
  The letter 3 are almost the same on all the nodes in the same network. The IP address, however, is different. This configuration process requires a technique called **DHCP**.

**Dynamic Host Configuration Protocol (DHCP)**: An application layer protocol that automates the configuration process of hosts on a network.

A machine can query a DHCP server when the computer connects to the network and receives all the configurations in one go. DHCP reduces the administritive overhead and help to configure lots of devices. It also helps to address the problem of having to choose what IP to assign to what device.

**Dynamic allocation** is the most common. A range of IP addresses is set aside for client devices and one of these IPs is issued to these devices when they request one.

**Automatic allocation**: A range of IPaddresses is set aside for assignment purposes. The main difference is the DHCP server is asked to keep track of which IP is assigned to certain devices in the past. It will assign the same IP to the same device each time if posiible.

**Fixed allocation**: Requires a manually specified list of MAC address and their corresponding IPs. If MAC not found, it may fall back to **Dynamic** or **Automatic** allocation or even refuse to assign an IP. (Security measure)

Along with things like IP addresses and othre configurations, **NHCP** is also used to assign things like **Network time protocol (NTP) servers**: Used to keep all computer on a network synchronized in time.

### DHCP in Action

DHCP is an application layer protocol which relies on transport, network, data-link and physical layers. Interestingly, the main purpose for DHCP is to configure network layer itself. How can it complete this process without the network layer.

**DHCP discovery**: The process by which a client configured to use DHCP attempts to get network configuration info.

1. Server discovery: the DHCP client sends a

    DHCP discover message on to the network. Both the machine’s IP and the DHCP server’s IP are unknown. A specially crafted broadcast message is formed instead.

   - DHCP server listens on UDP port 67 and the DHCP discover message is sent from port 68.
   - Encapsulated in a UDP datagram, source port 68, destination port 67.
   - Encapsulated in an IP datagram, destination IP: 255.255.255.255, source IP: 0.0.0.0.

2. DHCP server will respond according to its configurations. The respond will be sent as DHCPOFFER message.

   - source port 67, destination port 68
   - destination 255.255.255.255, source IP its actual IP.
   - This is also a broadcast and will reach every machine on the network. The client will know it is for him because the DHCPOFFER has the field that specifies the MAC addresses of the client machine.

3. The client process the DHCPOFFER.

   - Sometimes rejects when multiple DHCP servers respond. Maybe accept the IP in a certain range (rare).

4. The client responds with a DHCPREQUEST message.

   - source: 0.0.0.0:68, destination IP:255.255.255.255:67.

5. The server responds with a DHCPACK message.

   - source actual IP of the server, port 67, destination: 255.255.255.255:68

All these configurations are called **DHCP lease**. Once it is expired, the DHCP client will need to negotiate with a new lease. When a client disconnects the network, it also releases the DHCP lease.

## Network Address Translation

### Basics of NAT

**Network Address Translation (NAT)** is a technique instead of a defined standard. It takes one IP address and translates it to another. Reasons: security safe guards, preserving limited amount of IPv4 space.

**NAT** is a technology that allows a geteway, usually a router or firewall, to rewrite the source IP of an outgoing IP datagram while retaining the original IP in order to rewrite it into the response.

**IP masquerading**: Many computers on a network and their IPs being translated into the router’s IP. This is also known as **One-to-many NAT**. It is used in lots of LANS today.

### NAT and the Transport Layer

NAT on the network layer is simply translating one IP into another. In the transport layer, serveral additional techs is introduced, however.

One-to-many NAT is easy for outbound traffic but difficult for inbound traffic. One easy way to realize this is through **Port preservation**.

**Port preservation**: A technique where the source port chosen by a client is the same port used by the router. When 2 machines choose the same port, the router will choose another random port instead.

**Port forwarding**: A technique where specific destination ports can be configured to always be delivered to specific nodes.

### NAT, Non-Routable Address Space, and Limits of IPv4

IANA was responsible to assign address blocks to the 5 **Regional internet registries (RIRs)**. The IPv4 addresses will run out. To solve this problem, we need NAT and Non-Routable Address Spcae.

The main idea of this solution is that, many machines can use the Non-Routable Address Space inside a network with a router with a IPv4 address to represent them.

## VPNs and Proxies

### Virtual Private Networks

**Virtual Private Networks (VPN)**: A tech that allows for the extension of a private or local network to hosts that might not be on that local network. Like NAT, VPN is also a general technology concept instead of a strictly defined protocol.

Most VPNs use the payload section on the transport layer to carry an encrpted payload that actually contains the entire payload of the entire second set of packets (the network, the tranport and the application layers of a packet) intended to traverse the remote network.

**Two-factor authentication**: A technique where more than just a username and password are required to authenticate.

Usually, a short-lived numeric token is generated by the user through a specialized piece of hardware or software.

### Proxy Services

**Proxy service**: A server that acts on behalf of a client in order to access another service. Benefits: Anonymity, Security, Content filtering, Increased performance.

The main idea of proxy is an intermidiate server between a client and another server.

Gateway routers are some sort of Proxy.

**Web Proxies**: The most common one, used for Web services. Nowadays, web proxy can censor the traffic through it and stopped the unwanted ones. *Eg: prevent workers browsing twitter during working hours by denying the access*.

**Reverse proxy**: A service that might appear to be a single server to external clients, but actually represents many servers living behind it. Just like **DNS round-robin**, this is used as another kind of load-balancing. Another application is in encrypting and decrypting process.
