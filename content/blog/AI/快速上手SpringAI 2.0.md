---
title: 快速上手SpringAI 2.0
date: 2025-07-14
tags:
  - Agent
---
前面那篇1.0没用，一点用没有，还得是CSDN大佬啊

# 快速使用

## 创建项目

- 选择创建 Spring Initializr 项目，JDK最低要求17，不可低于17

- 依赖选择
	- SpringBoot版本需要高于3.X
- 需要的依赖项：
	- Lombok
	- Spring Web
	- MySQL Driver
	- openAI

最终的xml文件应为：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>SpringAI_Study</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>SpringAI_Study</name>
    <description>SpringAI_Study</description>

    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.5.3</spring-boot.version>
        <spring-ai.version>1.0.0</spring-ai.version>
    </properties>

    <!-- 添加仓库配置 -->
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
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.ai</groupId>
            <artifactId>spring-ai-starter-model-openai</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <!-- 关键：手动导入 BOM 管理版本 -->
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot BOM -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-dependencies</artifactId>
                <version>${spring-boot.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
            <!-- Spring AI BOM -->
            <dependency>
                <groupId>org.springframework.ai</groupId>
                <artifactId>spring-ai-bom</artifactId>
                <version>${spring-ai.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <version>${spring-boot.version}</version>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## 配置文件

application.yaml
```yaml
spring:  
  application:  
    name: SpringAI_Study  
  ai:  
    openai:  
      base-url: https://dashscope.aliyuncs.com/compatible-mode/v1  
      api-key: sk-ab194af7f1a9411396d4510c14******  
      chat:  
        options:  
          model: qwen-max  
          temperature: 0.9
```

## 开始编写代码

### 配置类

在项目内创建一个config包，在里面创建配置类，用于初始化使用指定的ChatClient模型

```java
import org.springframework.ai.chat.client.ChatClient;  
import org.springframework.ai.chat.model.ChatModel;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
  
@Configuration  
public class SpringAiConfig {  
  
    @Bean  
    public ChatClient chatClient(ChatModel chatModel) {  
        return ChatClient  
                .builder(chatModel)  
                .defaultSystem("你是一个Java大佬，精通各种框架和中间件，需要你解决用户的问题")  
                .build();  
    }  
}
```

- 在这里 `defaultSystem` 就可以用来设置系统提示词，不用像1.0那里搞得这么麻烦

### Controller 类

```java
@RestController  
@Slf4j  
@RequiredArgsConstructor  
public class ChatController {  
  
    private final ChatClient chatClient;  
  
    @RequestMapping(value = "/chat", produces = "text/html;charset=UTF-8")  
    public Flux<String> chat(String message){  
        log.info("用户问：{}", message);  
        return chatClient  
                .prompt()  
                .user(message)  
                .stream()  // 流式响应，可以换成call()  
                .content();  
    }  
}
```

- 如果使用了 stream，要添加上 `produces = "text/html;charset=UTF-8"`，如果用的是call就不用

# 实现连续对话
## ChatMemory 的配置

```java
@Configuration  
public class MemoryConfig {  
  
    @Bean  
    public ChatMemory chatMemory() {  
        return MessageWindowChatMemory  
                .builder()  
                .chatMemoryRepository(new InMemoryChatMemoryRepository())  
                .maxMessages(20)  
                .build();  
    }  
}
```

- 很眼熟啊这里，感觉用起来跟langchain4j一模一样

## 配置到ChatClient

在LangChain4j里我们可以通过 `@AIService` 来配置，但是 SpringAI还没有做这个注解，所以这里需要通过 **SpringAI** 的 **Advisor（顾问）** 机制

修改前面写的配置类
```java
@Configuration  
public class SpringAiConfig {  
  
    @Bean  
    public ChatClient chatClient(OpenAiChatModel chatModel, ChatMemory chatMemory) {  
        return ChatClient  
                .builder(chatModel)  
                .defaultSystem("你是一个Java大佬，精通各种框架和中间件，需要你解决用户的问题")  
                .defaultAdvisors(  
                        new SimpleLoggerAdvisor(),  
                        MessageChatMemoryAdvisor.builder(chatMemory).build()  
                )  
                .build();  
    }  
}
```

- 这里只加了两个Advisor，一个是记录大模型的请求、响应的日志 `SimpleLoggerAdvisor`
- 另一个是刚刚编写的 `ChatMemory`

因为配置了 `SimpleLoggerAdvisor`，所以需要在配置文件修改日志级别，不然看不到日志效果
```yaml
server:  
  port: 8080  
spring:  
  application:  
    name: SpringAI_Study  
  ai:  
    openai:  
      base-url: https://dashscope.aliyuncs.com/compatible-mode  
      api-key: sk-ab194af7f1a9411396d4510c14f6cc45  
      chat:  
        options:  
          model: qwen-max  
          temperature: 0.9  
logging:  
  level:  
    org.springframework.ai.chat.client.advisor: debug
```


## 根据会话id区分对话

上面我们配置了 ChatMemory 实现连续对话，但是我们换个浏览器问依旧还是同样的上下文

修改前面的controller
```java
@RestController  
@Slf4j  
@RequiredArgsConstructor  
public class ChatController {  
  
    private final ChatClient chatClient;  
  
    @RequestMapping(value = "/chat", produces = "text/html;charset=UTF-8")  
    public Flux<String> chat(@RequestParam("message") String message, @RequestParam("userId") String userId){  
        log.info("用户问：{}", message);  
        return chatClient  
                .prompt()  
                .user(message)  
                .advisors(a -> a.param(ChatMemory.CONVERSATION_ID, userId))  
                .stream()  // 流式响应，可以换成call()  
                .content();  
    }  
}
```




