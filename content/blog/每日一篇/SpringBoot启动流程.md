---
title: SpringBoot启动流程
date: 2025-05-11
tags:
  - 面试八股文
---
首先需要一个加了 `@SpringBootApplication` 注解的启动类，这个注解本质上就是由 `@EnableAutoConfiguration` 、`@SpringBootConfiguration` 和 `@ComponentScanner` 连起来构成。

- `@EnableAutoConfiguration` 的作用是在启动时自动加载一个类，这个类会将所有符合条件的 `@Configuration` 配置都进行加载，如果启动类中不需要添加配置内容，也不需要扫描路径，可以将 `@SpringBootApplication` 换成 `@EnableAutoConfiguration`

- `@SpringBootConfiguration` 等同于 `@Configuration`，就是将这个类标记为配置类，会被加载到容器中

- `@ComponentScanner` 就是自动扫描并加载所有符合条件的 Bean

注解完成后，运行的起点就是 `SpringApplication.run(类名.class, args)`，在 run 开始执行后会经历四个阶段：服务构建、环境准备、容器创建和填充容器

