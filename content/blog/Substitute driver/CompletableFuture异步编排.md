---
title: CompletableFuture异步编排
date: 2025-06-23
tags:
  - project
---
#### 简介

- CompletableFuture是java.utils.concurrent里的一个类

- 作用：把串行执行的代码变为并行执行，提高代码执行速度

### 快速上手

#### 创建异步编排对象

```java
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier);
public static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor);

public static CompletableFuture<Void> runAsync(Runnable runnable);
public static CompletableFuture<Void> runAsync(Runnable runnable, Executor executor);
```



#### 线程串行方法

```java
// 使线程串行执行，无入参，无返回值
public CompletableFuture<Void> thenRun(Runnable action);
public CompletableFuture<Void> thenRunAsync(Runnable action);
public CompletableFuture<Void> thenRunAsync(Runnable action, Executor executor);

// 使线程串行执行，有入参，无返回值
public CompletableFuture<Void> thenAccept(Consumer<? super T> action);
public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action);
public CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action, Executor executor);

// 使线程串行执行，有入参，有返回值
public <U> CompletableFuture<U> thenApply(Function<? super T,? extends U> fn);
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn);
public <U> CompletableFuture<U> thenApplyAsync(Function<? super T,? extends U> fn, Executor executor);
```

#### 多任务组合

```java
public static CompletableFuture<Void> allOf(CompletableFuture<?>... cfs);
```

#### 代码实例

```java
public class CompletableFutureTest5 {

    @SneakyThrows
    public static void main(String[] args) {
        //动态获取服务器核数
        int processors = Runtime.getRuntime().availableProcessors();
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                processors+1, // 核心线程个数 io:2n ,cpu: n+1  n:内核数据
                processors+1,
                0,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(10),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy()
        );

        CompletableFuture<String> future01 = CompletableFuture.supplyAsync(() -> "任务1", executor);
        CompletableFuture<String> future02 = CompletableFuture.supplyAsync(() -> "任务2", executor);
        CompletableFuture<String> future03 = CompletableFuture.supplyAsync(() -> {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            return "任务3";
        }, executor);

        // 串联起若干个线程任务, 没有返回值
        CompletableFuture<Void> all = CompletableFuture.allOf(future01, future02, future03);
        // 等待所有线程执行完成
        // .join()和.get()都会阻塞并获取线程的执行情况
        // .join()会抛出未经检查的异常，不会强制开发者处理异常 .get()会抛出检查异常，需要开发者处理
        all.join();
        all.get();
    }
}  
```