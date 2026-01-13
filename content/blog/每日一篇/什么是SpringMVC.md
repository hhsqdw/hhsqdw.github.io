---
title: 什么是SpringMVC
date: 2025-05-19
tags:
  - 面试八股文
---
SpringMVC 是属于Spring Framework生态里面的一个模块，是在servlet的基础上构建并且使用了MVC模式涉及的web框架，目的是为了去简化传统的servlet+JSP模式下的web开发方式。
其次Spring MVC的架构设计是对Javaweb里面的mvc框架模式做了一些增强和扩展，主要体现在几个方面 ：
1. 把传统MVC框架里面的Controller控制器做了拆分，分为了前端控制器DispatcherServlet和后端控制器Controller
2. 把model模型拆分成业务层service和数据访问层Repository
3. 在视图层，可以支持不同的视图，比如Freemark、velocity、JSP等

所以，SpringMVC就是为了MVC模式设计的，因此在开发MVC应用时会更加方便灵活

SpringMVC整体工作流程：
1. 浏览器请求首先经过核心控制器DispatherServlet，把请求分发到对应的Controller里面
2. 然后等Controller调用业务逻辑进行处理完后返回Model And View
3. DispatcherServlet去寻找一个或多个ViewResolver视图解析器，找到Model And View指定的视图并且把数据展示到客户端