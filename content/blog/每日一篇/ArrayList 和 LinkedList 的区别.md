---
title: ArrayList 和 LinkedList 的区别
date: 2025-05-21
tags:
  - 面试八股文
---
- ArrayList基于动态数组实现的非线程安全的集合；LinkedList基于链表实现的非线程安全的集合。

- 对于随机index访问的get和set方法，一般ArrayList的速度要优于LinkedList。因为ArrayList直接通过数组下标直接找到元素；LinkedList要移动指针遍历每个元素直到找到为止。

- 新增和删除元素，一般LinkedList的速度要优于ArrayList。因为ArrayList在新增和删除元素时，可能扩容和复制数组；LinkedList实例化对象需要时间外，只需要修改指针即可。

- LinkedList集合不支持 高效的随机随机访问（RandomAccess）

- ArrayList的空间浪费主要体现在在list列表的结尾预留一定的容量空间，而LinkedList的空间花费则体现在它的每一个元素都需要消耗相当的空间