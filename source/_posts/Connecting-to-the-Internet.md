---
title: Connecting to the Internet
date: 2019-06-07 01:13:54
tags:
categories: Network
---

> Google crash course

## Intro to Connecting to the Internet

### Intro to Connecting to the Internet

Various Internet connection technologies. Wans and wireless and Cellular networking.

## POTS and Dial-up

### Dial-up, Modems and Point-to-Point Protocols

**Public switched telephone network (PSTN)**: This is also refered to as **Plain old telephone service (POTS)**. The system is called **USENET** and still in use today. In the past, different organizations used the primitive form of **Dial-up connection** to exchange info. This depends on **POTS**. Connection is established by actually dialing a phone number.

**Dial-up** connection is done by **modems
(Modulator and Demodulator)**. Early modems had very low **Baud rates**, which is a measurement of how many bits can be passed across a phone line in a second. The advent of USENET, baud rates increased from 110bps to 300bps to 14.4kbps.

## Broadband Connection

### Broadband

Any connectivity techonology that is not dial-up internet.

**T-carrier techonologies**: Originally invented by AT&T in order to transmit multiple phone calls over a single link. This was later used to transmit data in a faster way.

This tech requires a dedicated line for connection which means it is more expensive. It is often used in business rather than consumers.

Solutions include:

- T-Carrier technologies
- DSL
- Cable broadband
- Fiber connections

### T-Carrier Technologies

**Transmission System 1**: T1 for short. AT&T invented a way to carry up tp 24 simutaneous phone calls across a piece of twisted pair copper. T1 comes to mean any twisted-pair copper connection capable of speed of 1.544 mbps.

### Digital Subscriber Lines

The existing telephone lines was capable of transmitting more data than just voice-to-voice calls

The main idea of this tech is to use a range of frequences to transmit data.

**DSLAMs (Digital Subscriber Line Access Multiplexers)**: The modems for DSL. They establish data connections across phone lines. Once the DSLAM is powered on the connection is established until the DSLAM is powered off.

**ADSL (Asymmetric Digital Subscriber Line)**: Features different speeds for outbound and incoming data.

**SDSL (Symmetric Digital Subscirber Line)**: Mainly used by businesses that hosted servers that needed to sent data to clients.

**HDSL (High Bit-rate Digital Subscriber Lines)**: Further development. These are technologies that provision speeds above 1.544 megabits per second.

### Cable Broadband

Television: Wireless—>Cable

**Cable Communications Policy Act**: Deregulated the cable business in the US and caused a massive boom in growth.

The principle of Cable Broadband is similar to the DSL. One of the main difference is that cable is generally known as a shared bandwidth technology.

Techs like DSL and dial up, the connection goes to **Central Office (CO)**. This later became smaller pieces of automated hardware.

Cable Internet connections are usually managed by cable modem. This device is at the edge of a comsumer’s network and connects it to the **cable modem termination system (CMTS)**, which connects lots of cable connections to an ISP’s core network.

### Fiber Connections

**FTTX: Fiber To The X**:

- FTTN: Fiber to the Neighborhood
- FTTB: Fiber to the Building
- FTTH: Fiber to the Home
- FTTB and FTTH may both be referred to as FTTP: Fiber to the premises

Instead of a modem, the demarcation point for fiber tech is known as **Optical Network Terminator (ONT)**, which converts data from protocols the fiber network can understand to those that are more traditional twisted pair copper networks that can understand.

### Broadband Protocols:

There are 2 main protocols over the data-link layer.
**PPP (Point-to-Point Protocol)**
**PPPoE (Point-to-Point over Ethernet)**

## WANs

### Wide Area Network Technologies

*Quick summary*: For a IT support specialist, you decide to use non-routable address sapce for internal IPs. You set up a router and configure it to perform NAT. You configure a local DNS server and a DHCP server to make metwork configuration easier. Some workers need to connect to resources on the LAN while they are on the road. You configure a VPN server and make sure it is accessible via port forwarding. The CEO decides to build another office in another region. **WAN** tech comes into play.

**Wide Area Networks (WAN)**: Acts like a single network, but spans across multiple physical locations.

### Point-to-Point VPNs

**Point-to-Point VPNs**: A popular alternation for WANs tech. Built to be **superfast**. Also called **Site-to-site VPN**.

## Wireless Networking

### Intro to Wireless Networking Techonologies

Difference between infrastructure networks and ad hoc networks. What is wireless channels and wireless security protocols.

**IEEE 802.11 standards**: also called the **802.11 family** made up the tech called **WiFi**.

**Frequency band**: A certain section of the radio spectrum that has been agreed upon to be used for certain communications. *Eg: FM frequency band*

The most frequently used frequency band are **2.4GHz and 5Ghz**. The frequently used specifications include **802.11b** , **802.11a**, **802.11g**, **802.11n**, **802.11ac**. The letter, the newer.

**Remark: 802.11 = physical and data link layers**
Dataframe:

| 2             | 2           | 6         | 6         | 6         |
| ------------- | ----------- | --------- | --------- | --------- |
| Frame Control | Duration/ID | Address 1 | Address 2 | Address 3 |

| 2                | 6         | 0~7951       | 4    |
| ---------------- | --------- | ------------ | ---- |
| Sequence Control | Address 4 | Data payload | FCS  |

**Frame Control field**: A number of subfields that describe how the frame should be processed, including what version of 802.11 was used.

**Duration field**: How long the total frame is.

**Wireless access point**: A device that bridges the wireless and wired portions of a network.

The 4 **addresses fields**:

1. source address (MAC address of the sending device)
2. intended destination on the network (MAC address)
3. receiving address (MAC of the access poing that should receive the frame)
4. transmitter address (MAC)

**Sequence control field**: A sequence contains the order of the frames.

**FCS (Frame Check Sequence)**: checksum of a cyclical redundancy check just like the ethernet.

### Wireless Network Configuration

Three types of wireless network:

- Ad-hoc networks

  : nodes speak to each other directly

  - all nodes help pass on the messages. no support infrustructure. *Eg: some smart phones and establish ad-hoc network with other smart phones so people can exchange photos, videos, etc.*
  - This can be a useful tool in disasterous situations.

- Wireless LANS (WLANS)

  : one or more access points act as a bridge between a wireless and a wired network.

  - Wireless devices will connect to the access point.

- Mesh networks

  : hybrid of the 2.

  - There will be only some wireless access points. Without having a cable to connect each of them.

### Wireless Channels

**Channels**: Individual, smaller sections of the overall frequency band used by a wireless network. This tech solves the problem of **collision domain**.

Quick review: Collision domain: Any one network segment where one computer can interrupt another.

2.4GHz = 2.400GHz ~ 2.500GHz with 13 channels

### Wireless Security

Any device in range can hypothetically intercept any transimission whether they are intended for them or not.

**Wired Equivvalent Privacy (WEP)**: An encryption technology that provides a very low level of privacy.

The more bits in a key, the longer the time it takes for someone to crack the encryption. **WEP** only uses **40 bits** of encryption keys, very easy to crack.

**Wifi Protected Access (WPA)**: uses a key of **128 bits.**

The most commonly used encryption algorithm is **WPA2**, **256 bits** key.

**MAC filtering**: Configure the access points to only allow for connections from a specific set of MAC addresses belonging to devices that are trusted.

### Cellular Networking

Also called **Mobile networking**. The frequences reserved for Cellular networking can travel longer distance. The frequencies in different cells are different and not overlapped.
