---
title: mybatis-plus 组件策略
date: 2025-04-18
tags:
  - project
---

## 默认的组件策略 ASSIGN_ID 雪花算法

- mp有默认的组件策略 `ASSIGN_ID`，会生成一个唯一的值，包含数字

- 雪花算法：使用一个64位的长型的数字作为全局唯一ID

- 表对应类型 bigint 或者 varchar类型

## ASSIGN_UUID

- `ASSIGN_ID` 还有另一个相近的策略 `ASSIGN_UUID`，生成唯一的uuid值，包含数字和字母

- 表对应字段的类型 varchar(32) 类型，实体类字段对应 String

## 自增策略 AUTO

- 想要主键自增需要配置以下操作

	- 需要创建表的时候给主键设置自增

	- 实体字段种配置 `@TableId(type=IdType.AUTO)`


## INPUT

- 普遍用法是需要自己手动设置主键ID值，有其他复杂用法，但是看着感觉运用不多，需要的时候再做了解


