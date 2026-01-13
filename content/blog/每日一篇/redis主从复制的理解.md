---
title: redis主从复制的理解
date: 2025-05-22
tags:
  - 面试八股文
---
主从复制本质上就是从一台服务器master上的数据拷贝到另一台服务器slave上，**数据的复制是单向的，只能由主节点到从节点**，redis里提供了全量复制和增量复制两种方法：

- 全量复制：一般用于slave新构建的时候，slave会向master发送全量复制请求，然后master会拷贝当前数据快照给slave，slave丢弃旧的数据来加载新的数据，但需要注意**redis并没有采用强一致性，所以会出现数据同步延迟导致数据不一致问题**

- 增量复制：当master节点收到数据改动，master会把变更的数据同步给所有的slave节点，主要原理是master和slave会共同维护一个偏移量offset，用来表示master向slave传递的字节数量，每一次进行增量数据的传递，offset都会对应增加数量

主从连接后master 接收命令，判断runid是否匹配，判定offset是否在复制缓冲区中，runid和offset有一个不满足，执行全量复制


**心跳机制**：进入命令传播阶段候，master与slave间需要进行信息交换，使用心跳机制进行维护，实现**双方连接保持在线**
- master会去`ping slave`，默认每十秒一次，来获取slave最后一次连接时间间隔，一般在0或1为正常
- slave会用`REPLCONF ACK {offset}`，每一秒一次，汇报slave自己的复制偏移量，获取最新的数据变更指令以及判断master是否在线