---
title: 快速上手SpringAI
date: 2025-07-13
tags:
  - Agent
---
# 快速入门

## 导入依赖

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <artifactId>springAi_deepseek</artifactId>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <!-- 明确指定Spring Boot和Spring AI版本 -->
        <spring-boot.version>3.2.0</spring-boot.version>
        <spring-ai.version>1.0.0-M5</spring-ai.version>
    </properties>

    <!-- 仓库配置：确保依赖可下载 -->
    <repositories>
        <repository>
            <id>maven-central</id>
            <url>https://repo1.maven.org/maven2</url>
        </repository>
        <repository>
            <id>spring-milestones</id>
            <url>https://repo.spring.io/milestone</url>
        </repository>
    </repositories>

    <dependencies>
        <!-- Spring Boot Web Starter（版本由下方BOM管理） -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 复用OpenAI Starter兼容DeepSeek（版本由Spring AI BOM管理） -->
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
        </dependency>

        <!-- Spring Boot Test Starter（版本由下方BOM管理） -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- 关键：手动导入Spring Boot和Spring AI的BOM管理版本 -->
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot的BOM，管理所有starter的版本 -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <!-- Spring AI的BOM，管理AI相关依赖版本 -->
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

</project>
```

## 配置文件

```properties
server.port=8899  
spring.application.name=spring-ai-deepseek-demo  
  
spring.ai.openai.api-key=sk-43745c46cd5a4d80821e998030******  
spring.ai.openai.base-url=https://api.deepseek.com  
spring.ai.openai.chat.options.model=deepseek-chat  
spring.ai.openai.chat.options.temperature=0.7
```

- - temperature参数用于控制生成文本的多样性。具体来说：
    
    ‌值越高‌，生成的文本越多样化，但也可能包含更多的随机性和不可预测的内容。 ‌值越低‌，生成的文本越接近于确定性的结果，即生成的文本会更加一致和可预测。


## 启动类

```java
@SpringBootApplication  
public class SpringAiDemoApplication {  
    public static void main(String[] args) {  
        SpringApplication.run(SpringAiDemoApplication.class, args);  
    }  
}
```

## controller

```java
@RestController  
public class ChatDeepSeekController {  
  
    @Autowired  
    private OpenAiChatModel openAiChatModel;  
  
    @GetMapping("/hello")  
    public String generate(@RequestParam(value = "message", defaultValue = "hello") String message){  
        String call = openAiChatModel.call(message);  
        System.out.println("call: " + call);  
        return call;  
    }  
}
```


# Spring AI的聊天模型

## ChatClient接口

- ChatClient 是一个接口，定义了与聊天服务交互的客户端。这个接口主要用于创建聊天客户端对象，设置请求规范，以及发起聊天请求。

### 实现简单的对话

- 用户输入设置用户消息的内容，通过SpringBoot AI封装的方法向 AI 模型发送请求，以字符串形式返回 AI 模型的响应。

```java
@RestController  
public class ChatDeepSeekController {  
  
    private final ChatClient chatClient;  
  
    public ChatDeepSeekController(ChatClient.Builder chatClientBuilder) {  
        chatClient = chatClientBuilder.build();  
    }  
  
    @GetMapping("/chat")  
    public String chat(@RequestParam(value = "msg", defaultValue = "hello") String message) {  
        return chatClient  
                .prompt()            // 提示词  
                .user(message)       // 用户输入  
                .call()              // 调用大模型  
                .content();          // 返回文本  
    }  
}
```


### 实现角色预设

- 配置默认角色
```java
@Configuration  
public class AiConfig {  
  
    @Bean  
    public ChatClient chatClient(ChatClient.Builder builder) {  
        return builder  
                .defaultSystem("你是一个已经毕业多年，有丰富工作经验的Java工程师，你的名字是呵帅")  
                .build();  
    }  
}
```

- 编写controller
```java
@RestController  
public class ChatDeepSeekController {  
  
    @Autowired  
    private ChatClient chatClient;  
  
    @GetMapping("chatai")  
    public String chatAi(@RequestParam("msg") String msg) {  
        return chatClient  
                .prompt()  
                .user(msg)  
                .call()  
                .content();  
    }  
}
```

### 实现流式响应

1. 非流式输出 call：等待大模型把回答结果全部生成后输出给用户；

2. 流式输出stream：逐个字符输出，一方面符合大模型生成方式的本质，另一方面当模型推理效率不是很高时，流式输出比起全部生成后再输出大大提高用户体验。

- controller=
```java
@GetMapping(value = "chatAiStream", produces = "text/html;charset=UTF-8")  
public Flux<String> chatAiStream(@RequestParam("msg") String msg){  
    return chatClient  
            .prompt()  
            .user(msg)  
            .stream()  
            .content();  
}
```

## ChatModel接口

- 在ChatModel接口中，带有String参数的call()方法简化了实际的使用，避免了更复杂的Prompt和 ChatResponse类的复杂性。

### 实现简单的对话

```java
@RestController  
public class ChatModelController {  
  
    @Autowired  
    private ChatModel chatModel;  
  
    @GetMapping("/chatModel01")  
    public String chatModel01(@RequestParam("msg") String msg) {  
        return chatModel.call(msg);  
    }  
  
    @GetMapping("/chatModel02")  
    public String chatModel02(@RequestParam("msg") String msg){  
        ChatResponse chatResponse = chatModel.call(  
                new Prompt(  
                        msg,  
                        ChatOptions.  
                                builder()  
                                .model("deepseek-chat")  
                                .temperature(0.8)  
                                .build()  
                )  
        );  
        return chatResponse.getResult().getOutput().getContent();  
    }  
}
```

### 提示词

评价：难用，不如langchain4j
```java
@GetMapping("/chatModel03")  
public String chatModel03(@RequestParam("name") String name,  
                          @RequestParam("voice") String voice) {  
    String userText = "给我推荐三个Java的框架";  
    UserMessage userMessage = new UserMessage(userText);  
    String systemText = "你是一个Java高手，在Java行业已经工作多年，你非常喜欢帮助别人来了解这个行业相关的内容，你的名字是{name}，推荐框架的难度是{voice}。";  
    SystemPromptTemplate systemPromptTemplate = new SystemPromptTemplate(systemText);  
    Message message = systemPromptTemplate.createMessage(Map.of("name", name, "voice", voice));  
    Prompt prompt = new Prompt(userMessage, message);  
    ChatResponse chatResponse = chatModel.call(prompt);  
    List<Generation> results = chatResponse.getResults();  
    return results.stream().map(x->x.getOutput().getContent()).collect(Collectors.joining(""));  
  
}
```

# Function Calling函数调用

- 函数调用功能允许大语言模型在生成回答时触发预定义的外部函数，从而实现动态数据获取或业务逻辑操作（如查询数据库、调用 API 等）

## 自定义Function

```java
@Configuration  
public class CalculatorService {  
    public record addOperation(int a, int b) {  
  
    }  
  
    public record subtractOperation(int n, int m) {  
  
    }  
  
    @Bean  
    @Description("加法运算")  
    public Function<addOperation, Integer> addOperation() {  
        return op -> {  
            return op.a + op.b;  
        };  
    }  
  
    @Bean  
    @Description("乘法运算")  
    public Function<subtractOperation, Integer> subtractOperation() {  
        return op -> {  
            return op.n * op.m;  
        };  
    }  
}
```

































