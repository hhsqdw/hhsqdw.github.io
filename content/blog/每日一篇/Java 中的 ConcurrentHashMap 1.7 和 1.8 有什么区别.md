---
title: Java 中的 ConcurrentHashMap 1.7 和 1.8 有什么区别
date: 2025-12-04
tags:
  - 面试八股文
---
这两个版本的区别重点在**锁的粒度**

#### ConcurrentHashMap 1.7

Java 7 里使用的是分段锁 (Segment)，底层依旧是数组，将数组分成 16 个 `Segment`，每个 `Segment` 下都有一个 `HashMap` 和 一个 `ReentrantLock`

不同线程访问不同 `Segment` 并不会触发锁，多线程访问同一个才会竞争，理论并发数默认 16

#### ConcurrentHashMap 1.8

Java 8 里去除了 `Segment`，采用跟 `HashMap` 相同的数据结构，`数组 + 链表 + 红黑树` ，并且将 `ReentrantLock` 换成了 `Synchronized`

##### CAS

`CAS` 能够保证无锁操作下的原子性，具体是三个参数：地址（V）、原本值（A）、修改值（B）

- 线程先读取内存地址（V）获取值，记录到原本值（A）里

- 当线程准备更新地址（V）时，会先检查地址（V）当前值是否为记录的原本值（A）
	
	- 当前值和记录的原本值（A）相同，说明其他线程没有操作过，直接将地址值修改为修改值（B）
	
	- 当前值和记录的原本值（A）不同，说明其他线程修改过 V 的值，当前线程更新失败，通常尝试自旋或者放弃

##### 1.8 插入

插入时采用 `CAS` 插入方法，冲突才会使用 `Synchronized`，但只对链表/红黑树的头节点上锁

因为锁住了头节点基本等于锁住了整个链表/红黑树，其他线程依旧可以对其他 `bucket` 进行操作，并发度大大提升

#### 扩容的区别

##### Java 7 中的扩容

- **基于 `Segment`**：`ConcurrentHashMap` 是由多个 `Segment` 组成的，每个 `Segment` 里面都包含着一个 `HashMap`，但 `Segment` 的数量并不会扩容，扩容的是 `Segement` 内的 `HashMap`，当 `HashMap` 达到扩容因子时，会单独为这个 `Segment` 进行扩容，并不会对整个 `ConcurrentHashMap` 进行扩容
- **扩容过程**：每个 `Segment` 维护自己的扩容因子，当 `Segment` 里面的元素超过阈值时对该 `Segment` 进行扩容，扩容过程跟 `HashMap` 一致，不会影响整个 `ConcurrentHashMap`

##### Java 8 中的扩容

- **全局扩容**：整个 `ConcurrentHashMap` 的元素总数超过阈值时，整个 `ConcurrentHashMap` 进行扩容
- **基于CAS进行扩容**：`ConcurrentHashMap` 扩容跟 `HashMap` 基本一致，但是加上了 `CAS` 操作确保了线程安全。在扩容时，多个线程可以同时帮助扩容
- **渐进式扩容**：在 **JDK 1.8** 中引入了渐进式扩容，扩容时并不是一次将所有数据重新分配，而是多个线程共同参与，逐步迁移旧数据到新数组中，减低扩容开销。
	- 扩容时先把 `transferIndex`  **待迁移的旧数组下标范围标记** 设为旧数组长度，线程通过 `CAS` “抢占” 一段下标范围（比如从 `transferIndex` 取 16 个下标）；
	- 线程迁移自己抢占的下标范围内的元素，迁移完后再 CAS 抢占新的范围，直到所有下标迁移完成；
	-  “分段抢占、并行迁移”，避免单线程一次性迁移所有数据的开销。
	- 简单来说就算维护一个 `transferIndex`，线程循环 `CAS` 争夺下标，如果下标已经分配完了说明已经扩容完成