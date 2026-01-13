---
title: 快速上手LangChain4j
date: 2025-07-04
tags:
  - Agent
---
# LangChain4j入门

## 创建一个Maven项目

### 创建空项目并且导入依赖
```xml
<properties>  
    <maven.compiler.source>17</maven.compiler.source>  
    <maven.compiler.target>17</maven.compiler.target>  
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>  
    <spring-boot.version>3.2.6</spring-boot.version>  
    <knife4j.version>4.3.0</knife4j.version>  
    <mybatis-plus.version>3.5.11</mybatis-plus.version>  
    <langchain4j.version>1.0.0-beta3</langchain4j.version>  
</properties>

<dependencies>
	<!-- web应用程序核心依赖 -->
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-web</artifactId>
	</dependency>
	<!-- 编写和运行测试用例 -->
	<dependency>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-test</artifactId>
		<scope>test</scope>
	</dependency>
	<!-- 前后端分离中的后端接口测试工具 -->
	<dependency>
		<groupId>com.github.xiaoymin</groupId>
		<artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
		<version>${knife4j.version}</version>
	</dependency>
</dependencies>

<dependencyManagement>
	<dependencies>
		<!--引入SpringBoot依赖管理清单-->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-dependencies</artifactId>
			<version>${spring-boot.version}</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
```

### 配置文件

先随便写点，写个端口让他跑起来先

application.properties
```properties
# web 服务端口  
server.port=8080
```


### 启动类

注意写 `@SpringBootApplication`
```java
@SpringBootApplication  
public class Main {  
    public static void main(String[] args) {  
        SpringApplication.run(Main.class, args);  
    }  
}
```

### 启动启动类

访问 http://localhost:8080/doc.html 查看程序能否成功运行

## 接入大模型

参考文档： https://docs.langchain4j.dev/get-started

### 导入依赖

```xml
<!-- 基于open-ai的langchain4j接口：ChatGPT、deepseek都是open-ai标准下的大模型 -->  
<dependency>  
    <groupId>dev.langchain4j</groupId>  
    <artifactId>langchain4j-open-ai</artifactId>  
    <version>1.1.0</version>  
</dependency>

 <dependencyManagement>
    <dependencies>
        <!--引入langchain4j依赖管理清单-->
        <dependency>
            <groupId>dev.langchain4j</groupId>
            <artifactId>langchain4j-bom</artifactId>
            <version>${langchain4j.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
 </dependencyManagement>
```

### 创建测试用例

```java
@SpringBootTest  
public class LangChain4jTest {  
  
    @Test  
    public void testGPTDemo() {  
        OpenAiChatModel model = OpenAiChatModel.builder()  
                .baseUrl("http://langchain4j.dev/demo/openai/v1")  
                .apiKey("demo")  
                .modelName("gpt-4o-mini")  
                .build();  
  
        String answer = model.chat("你是谁呀");  
        System.out.println(answer);  
    }  
}
```

### SpringBoot整合

参考文档： https://docs.langchain4j.dev/tutorials/spring-boot-integration

### 替换依赖

连接Springboot依赖是 `langchain4j-{integration-name}-spring-boot-starter`

我们这将原来的 `langchain4j-open-ai` 替换成 `langchain4j-open-ai-spring-boot-starter`
```xml
<!-- 基于open-ai的langchain4j接口：ChatGPT、deepseek都是open-ai标准下的大模型 -->  
<dependency>  
    <groupId>dev.langchain4j</groupId>  
    <artifactId>langchain4j-open-ai-spring-boot-starter</artifactId>  
</dependency>
```

### 编写配置文件

```properties
# web 端口  
server.port=8080  
  
langchain4j.open-ai.chat-model.base-url=http://langchain4j.dev/demo/openai/v1  
langchain4j.open-ai.chat-model.api-key=demo  
langchain4j.open-ai.chat-model.model-name=gpt-4o-mini  
# 应用程序发送给大模型的请求日志和响应日志  
langchain4j.open-ai.chat-model.log-requests=true  
langchain4j.open-ai.chat-model.log-responses=true  
# 设置系统日志为debug级别  
logging.level.root=debug
```

### 创建测试用例

```java
@Autowired  
private OpenAiChatModel openAiChatModel;  
  
@Test  
public void testSpringBoot() {  
    String answer = openAiChatModel.chat("我是谁？");  
    System.out.println(answer);  
}
```


# 介入其他大模型

大模型排行榜 https://superclueai.com/

LangChain4j支持接入的大模型 https://docs.langchain4j.dev/integrations/language-models/

注：deepseek和openAI使用的都是同一套标准，所以后续deepseek使用的是openAI的接口

## 接入DeepSeek

### 获取开发参数

- 访问官网： https://www.deepseek.com/ 右上角有个API 开放平台注册账号，注册后获取base_url（在接口文档找到）和api_key

* **`deepseek-chat` 模型指向 DeepSeek-V3-0324，** 通过指定 `model='deepseek-chat'` 调用。

* **`deepseek-reasoner` 模型指向 DeepSeek-R1-0528，** 通过指定 `model='deepseek-reasoner'` 调用。

### 修改配置文件

```properties
# web 端口  
server.port=8080  
  
langchain4j.open-ai.chat-model.base-url=https://api.deepseek.com  
langchain4j.open-ai.chat-model.api-key=[API key]
langchain4j.open-ai.chat-model.model-name=deepseek-chat  
# 应用程序发送给大模型的请求日志和响应日志  
langchain4j.open-ai.chat-model.log-requests=true  
langchain4j.open-ai.chat-model.log-responses=true  
# 设置系统日志为debug级别  
logging.level.root=debug
```

## 接入ollama

### 在ollama上部署DeepSeek

官网：https://ollama.com/

- 下载并安装ollama： OllamaSetup.exe
- 查看模型列表，选择要部署的模型，模型列表： https://ollama.com/search
- 执行命令：`ollama run deepseek-r1:1.5b` 运行大模型

### 引入依赖

```xml
<!-- 接入ollama -->
 <dependency>
	 <groupId>dev.langchain4j</groupId>
	 <artifactId>langchain4j-ollama-spring-boot-starter</artifactId>
 </dependency>
```

### 修改配置文件

```properties
langchain4j.ollama.chat-model.base-url=http://localhost:11434  
langchain4j.ollama.chat-model.model-name=deepseek-r1:1.5b  
langchain4j.ollama.chat-model.log-requests=true  
langchain4j.ollama.chat-model.log-responses=true
```
### 创建测试用例

```java
@Autowired  
private OllamaChatModel ollamaChatModel;  
  
@Test  
public void testOllama() {  
    String answer = ollamaChatModel.chat("你是谁？");  
    System.out.println(answer);  
}
```

## 接入阿里百炼

- 支持接入的模型列表： https://help.aliyun.com/zh/model-studio/models 
- 模型广场： https://bailian.console.aliyun.com/?productCode=p_efm#/model-market

### 导入依赖

LangChain4j参考文档： https://docs.langchain4j.dev/integrations/language-models/dashscope#plain-java

```xml
<!-- 接入阿里云百炼平台 -->  
<dependency>  
    <groupId>dev.langchain4j</groupId>  
    <artifactId>langchain4j-community-dashscope-spring-boot-starter</artifactId>  
</dependency>

		<!--引入百炼依赖管理清单-->
		<dependency>
			<groupId>dev.langchain4j</groupId>
			<artifactId>langchain4j-community-bom</artifactId>
			<version>${langchain4j.version}</version>
			<type>pom</type>
			<scope>import</scope>
		</dependency>
	</dependencies>
</dependencyManagement>
```

### 修改配置文件

```properties
#阿里百炼平台
langchain4j.community.dashscope.chat-model.api-key=API_KEY
langchain4j.community.dashscope.chat-model.model-name=qwen-max
```

### 测试通义千问

```java
@Autowired  
private QwenChatModel qwenChatModel;  
  
@Test  
public void testDashScopeQwen() {  
    String chat = qwenChatModel.chat("你是谁");  
    System.out.println(chat);  
}
```

### 测试通义万象

```java
@Test  
public void testDashScopeWanx() {  
    WanxImageModel model = WanxImageModel.builder()  
            .modelName("wanx2.1-t2i-plus")  
            .apiKey("sk-ab194af7f1a9411396d4510c14f6cc45")  
            .build();  
    Response<Image> generate = model.generate("学院二本的java程序员找不到实习工作而苦恼，" +  
            "而985、211的java程序员却找到了实习工作而在欢呼雀跃");  
    URI url = generate.content().url();  
    System.out.println(url);  
}
```

### 测试deepseek

配置文件
```properties
#集成百炼-deepseek  
langchain4j.open-ai.chat-model.base-url=https://dashscope.aliyuncs.com/compatible-mode/v1  
langchain4j.open-ai.chat-model.api-key=${DASH_SCOPE_API_KEY}  
langchain4j.open-ai.chat-model.model-name=deepseek-v3  
#温度系数：取值范围通常在 0 到 1 之间。值越高，模型的输出越随机、富有创造性；  
# 值越低，输出越确定、保守。这里设置为 0.9，意味着模型会有一定的随机性，生成的回复可能会比较多样化。  
langchain4j.open-ai.chat-model.temperature=0.9
```

# 人工智能服务AIService

- 为大语言模型格式化输入内容
- 解析大语言模型的输出结果
- 聊天记忆 Chat memory

## 创建AIService

### 导入依赖

```xml
<!--langchain4j高级功能-->  
<dependency>  
    <groupId>dev.langchain4j</groupId>  
    <artifactId>langchain4j-spring-boot-starter</artifactId>  
</dependency>
```

### 创建接口

```java
public interface Assistant {  
    String chat(String userMessage);  
}
```

### 测试用例

```java
@Autowired  
private QwenChatModel qwenChatModel;  
  
@Test  
public void testChat() {  
    Assistant assistant = AiServices.create(Assistant.class, qwenChatModel);  
    String answer = assistant.chat("你是谁？");  
    System.out.println(answer);  
}
```

### @AiService

- 使用注解开发

接口改成
```java
@AiService(wiringMode = EXPLICIT, chatModel = "qwenChatModel")  
public interface Assistant {  
    String chat(String userMessage);  
}
```

- 测试用例
```java
@Autowired  
private Assistant assistant;  
  
@Test  
public void testAssistant() {  
    String answer = assistant.chat("我是谁？");  
    System.out.println(answer);  
}
```

# 聊天记忆 Chat memory

## 聊天记忆的简单实现

- 就是把每一次的问问题都把上一次问的再问一遍

```java
@Autowired
private QwenChatModel qwenChatModel;
@Test
public void testChatMemory2() {
	//第一轮对话
	UserMessage userMessage1 = UserMessage.userMessage("我是环环");
	ChatResponse chatResponse1 = qwenChatModel.chat(userMessage1);
	AiMessage aiMessage1 = chatResponse1.aiMessage();
	//输出大语言模型的回复
	System.out.println(aiMessage1.text());
	//第二轮对话
	UserMessage userMessage2 = UserMessage.userMessage("你知道我是谁吗");
	ChatResponse chatResponse2 = qwenChatModel.chat(Arrays.asList(userMessage1, 
	aiMessage1, userMessage2));
	AiMessage aiMessage2 = chatResponse2.aiMessage();
	//输出大语言模型的回复
	System.out.println(aiMessage2.text());
}
```

## 使用ChatMemory实现聊天记忆

```java
@Test  
public void testChatMemory() {  
  
    MessageWindowChatMemory messageWindowChatMemory = MessageWindowChatMemory.withMaxMessages(10);  
  
    Assistant build = AiServices  
            .builder(Assistant.class)  
            .chatLanguageModel(qwenChatModel)  
            .chatMemory(messageWindowChatMemory)  
            .build();  
  
    String answer1 = build.chat("我是呵帅");  
    System.out.println(answer1);  
    String answer2 = build.chat("我是谁？");  
    System.out.println(answer2);  
}
```

## 使用AIService实现聊天记忆

### 编写接口

- 跟之前差不多，就是多了个 `chatMemory`，这个 `chatMemory` 需要我们注册成 bean

```java
@AiService(  
        wiringMode = EXPLICIT,  
        chatModel = "qwenChatModel",  
        chatMemory = "chatMemory")  
public interface MemoryChatAssistant {  
    String chat(String input);  
}
```

### 配置ChatMemory

```java
@Configuration  
public class MemoryChatAssistantConfig {  
    @Bean  
    MessageWindowChatMemory chatMemory() {  
        return MessageWindowChatMemory.withMaxMessages(10);  
    }  
}
```

### 测试用例

```java
@Autowired  
private MemoryChatAssistant memoryChatAssistant;  
  
@Test  
public void testChatMemory3() {  
    String answer = memoryChatAssistant.chat("我是呵帅");  
    System.out.println(answer);  
    String answer2 = memoryChatAssistant.chat("我是谁？");  
    System.out.println(answer2);  
  
}
```

## 隔离聊天记忆

- 在多并发情况下，聊天记录会混乱，因此我们需要为每个用户的新聊天或者不同的用户区分聊天记忆

### 编写接口

```java
@AiService(chatModel = "qwenChatModel",  
        wiringMode = EXPLICIT,  
        chatMemoryProvider = "chatMemoryProvider")  
public interface SeparateChatAssistant {  
    String chat(@MemoryId int memoryId, @UserMessage String userMessage);  
}
```
### 注册bean

因为 `ChatMemoryProvider` 是一个函数式接口，`memoryId` 是在 `ChatMemoryProvider` 里的方法参数
```java
@Bean  
ChatMemoryProvider chatMemoryProvider() {  
    return memoryId -> MessageWindowChatMemory.builder().id(memoryId).maxMessages(10).build();  
}
```
### 测试用例

```java
@Autowired  
private SeparateChatAssistant separateChatAssistant;  
  
@Test  
public void testSeparateChat() {  
    String answer = separateChatAssistant.chat(1, "我是呵帅");  
    System.out.println(answer);  
    String answer2 = separateChatAssistant.chat(2,"我是谁？");  
    System.out.println(answer2);  
    String answer3 = separateChatAssistant.chat(1,"我是谁？");  
    System.out.println(answer3);  
}
```


# 持久化聊天记忆 Persistence

## MongoDB

### 安装

- 服务器： mongodb-windows-x86_64-8.0.6-signed.msi https://www.mongodb.com/try/download/community 
- 命令行客户端 ： mongosh-2.5.0-win32-x64.zip https://www.mongodb.com/try/download/shell 
- 图形客户端： mongodb-compass-1.39.3-win32-x64.exe https://www.mongodb.com/try/download/compass

### 整合SpringBoot

### 导入依赖

```xml
<!-- Spring Boot Starter Data MongoDB -->  
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-data-mongodb</artifactId>  
</dependency>
```

### 添加配置

```properties
#MongoDB连接配置
spring.data.mongodb.uri=mongodb://localhost:27017/chat_memory_db
```

### 创建实体类

```java
@Data  
@AllArgsConstructor  
@NoArgsConstructor  
@Document("chat_messages")  
public class ChatMessages {  
    //唯一标识，映射到 MongoDB 文档的 _id 字段  
    @Id  
    private ObjectId messageId;  
  
    private String content; //存储当前聊天记录列表的json字符串  
}
```

### CRUD

```java
@SpringBootTest  
public class MongoCrudTest {  
  
    @Autowired  
    private MongoTemplate mongoTemplate;  
  
    @Test  
    public void testInsert() {  
        ChatMessages chatMessages = new ChatMessages();  
        chatMessages.setContent("Hello World!");  
        mongoTemplate.insert(chatMessages);  
    }  
  
    @Test  
    public void testFindById() {  
        ChatMessages byId = mongoTemplate.findById("686a34609919e078f94e57d6", ChatMessages.class);  
        System.out.println(byId);  
    }  
  
    @Test  
    public void testUpdate() {  
        Criteria criteria = Criteria.where("_id").is("686a34609919e078f94e57d6");  
        Query query = Query.query(criteria);  
        Update update = new Update();  
        update.set("content", "New Hello World!");  
  
        // 修改或新增  
        mongoTemplate.updateFirst(query, update, ChatMessages.class);  
    }  
  
    @Test  
    public void testRemove() {  
        Criteria criteria = Criteria.where("_id").is("686a34609919e078f94e57d6");  
        Query query = new Query(criteria);  
        mongoTemplate.remove(query, ChatMessages.class);  
    }  
}
```

## 持久化聊天

### 更改实体类

```java
@Data  
@AllArgsConstructor  
@NoArgsConstructor  
@Document("chat_messages")  
public class ChatMessages {  
    //唯一标识，映射到 MongoDB 文档的 _id 字段  
    @Id  
    private ObjectId messageId;  
  
    private String memoryId;  
  
    private String content; //存储当前聊天记录列表的json字符串  
}
```

### 创建持久化类

- 创建一个类实现ChatMemoryStore接口

```java
@Component  
public class MongoChatMemoryStore implements ChatMemoryStore { 

    @Autowired  
    private MongoTemplate mongoTemplate;  
    
    @Override  
    public List<ChatMessage> getMessages(Object memoryId) {  
        Criteria criteria = Criteria.where("memoryId").is(memoryId);  
        Query query = new Query(criteria);  
        ChatMessages chatMessages = mongoTemplate.findOne(query, ChatMessages.class);  
        if(chatMessages == null) return new LinkedList<>();  
        return ChatMessageDeserializer.messagesFromJson(chatMessages.getContent());  
    }  
    
    @Override  
    public void updateMessages(Object memoryId, List<ChatMessage> messages) {  
        Criteria criteria = Criteria.where("memoryId").is(memoryId);  
        Query query = new Query(criteria);  
        Update update = new Update();  
        update.set("content", ChatMessageSerializer.messagesToJson(messages));  
        //根据query条件能查询出文档，则修改文档；否则新增文档  
        mongoTemplate.upsert(query, update, ChatMessages.class);  
    }  
    
    @Override  
    public void deleteMessages(Object memoryId) {  
        Criteria criteria = Criteria.where("memoryId").is(memoryId);  
        Query query = new Query(criteria);  
        mongoTemplate.remove(query, ChatMessages.class);  
    }  
}
```

### 修改配置类

添加MongoChatMemoryStore对象的配置
```java
@Autowired  
private MongoChatMemoryStore mongoChatMemoryStore;  
  
@Bean  
ChatMemoryProvider chatMemoryProvider() {  
    return memoryId -> MessageWindowChatMemory  
            .builder()  
            .id(memoryId)  
            .maxMessages(10)  
            .chatMemoryStore(mongoChatMemoryStore)  
            .build();  
}
```

# 提示词 Prompt

## 系统提示词

- @SystemMessage 设定角色，塑造AI助手的专业身份，明确助手的能力范围

### @SystemMessage

在SeparateChatAssistant类的chat方法上添加@SystemMessage注解
```java
@SystemMessage("你是我的好朋友，请用东北话回答问题。")//系统消息提示词
String chat(@MemoryId int memoryId, @UserMessage String userMessage);
```

- `@SystemMessage` 的内容将在后台转换为 `SystemMessage` 对象，并与 `UserMessage` 一起发送给大语言模型（LLM）。
- `SystemMessaged` 的内容只会发送给大模型一次，如果你修改了 `SystemMessage` 的内容，新的`SystemMessage` 会被发送给大模型，之前的聊天记忆会失效。
- 如果要显示今天的日期，我们需要在提示词中添加当前日期的占位符{{current_date}}

```java
@SystemMessage("你是我的好朋友，请用粤语回答问题。今天是{{current_date}}")//系统消息提示词 String chat(@MemoryId int memoryId, @UserMessage String userMessage);
```

### 从资源中加载提示模板

- @SystemMessage 注解还可以从资源中加载提示模板：
```java
@SystemMessage(fromResource = "my-prompt-template.txt")
 String chat(@MemoryId int memoryId, @UserMessage String userMessage);
```

- my-prompt-template.txt
```java
你是我的好朋友，请用粤语回答问题，回答问题的时候适当添加表情符号。  
今天是 {{current_date}}。
```

## 用户提示词

- @UserMessage：获取用户输入

### @UserMessage

- 在 `MemoryChatAssistant` 的 `chat` 方法中添加注解
- 每次都会将问题作为提示词
```java
    @UserMessage("你是我的好朋友，请用上海话回答问题，并且添加一些表情符号。 {{it}}") //{{it}}表示这里
    String chat(String input);
```

### 测试
```java
@Autowired  
private MemoryChatAssistant memoryChatAssistant;  
  
@Test  
public void testChatMemory3() {  
    String answer = memoryChatAssistant.chat("我是呵帅");  
    System.out.println(answer);  
    String answer2 = memoryChatAssistant.chat("我18岁");  
    System.out.println(answer2);  
    String answer3 = memoryChatAssistant.chat("你知道我是谁吗");  
    System.out.println(answer3);  
}
```

## 指定参数名称

### 配置@V

- @V 明确指定传递的参数名称

```java
@UserMessage("你是我的好朋友，请用上海话回答问题，并且添加一些表情符号。{{message}}")
 String chat(@V("message") String userMessage);
```

### 多个参数的情况

- 如果有两个或两个以上的参数，我们必须要用@V
- 在 SeparateChatAssistant 中定义方法 `chat2`
```java
@UserMessage("你是我的好朋友，请用粤语跟我交谈，并且添加一些表情符号。 {{message}}")
String chat2(@MemoryId int memoryId, @V("message") String input);
```

- @UserMessage 中的内容每次都会被和用户问题组织在一起发送给大模型
```java
@Test  
public void testSeparateChat() {  
    String answer = separateChatAssistant.chat2(4, "我是呵帅");  
    System.out.println(answer);  
    String answer2 = separateChatAssistant.chat2(5,"我是谁？");  
    System.out.println(answer2);  
    String answer3 = separateChatAssistant.chat2(4,"我是谁？");  
    System.out.println(answer3);  
}
```


## @SystemMessage和@V

- 可以将 @SystemMessage 和 @V 结合使用
- 在 `SeparateChatAssistant` 中添加方法 `chat3`
```java
@SystemMessage(fromResource = "my-prompt-template2.txt")  
String chat3(  
        @MemoryId int memoryId,  
        @UserMessage String userMessage,  
        @V("username") String username,  
        @V("age") int age);
```

- 创建提示词模板my-prompt-template2.txt，添加占位符
```txt
你是我的好帮手，我是{{username}}，我的年龄是{{age}}，请用粤语回答问题，回答问题的时候适当添加表情符号，或者文字表情。  
今天是 {{current_date}}。
```

- 测试
```java
@Test  
public void testUserInfo() {  
    String answer = separateChatAssistant.chat3(6, "我是谁，我多大了", "小明", 18);  
    System.out.println(answer);  
}
```

# Function Calling 函数调用

- Function Calling 函数调用 也叫 Tools 工具

## 快速入门

### 创建工具类

```java
@Component  
public class CalculatorTools {  
  
    @Tool  
    double sum(double a, double b) {  
        System.out.println("调用加法运算");  
        return a + b;  
    }  
    @Tool  
    double squareRoot(double x) {  
        System.out.println("调用平方根运算");  
        return Math.sqrt(x);  
    }  
}
```

### 在接口配值工具类

```java
@AiService(chatModel = "qwenChatModel",  
        wiringMode = EXPLICIT,  
        chatMemoryProvider = "chatMemoryProvider",  
        tools = "calculatorTools")
```

## @Tool 注解的可选字段

@Tool 注解有两个可选字段：
- name（工具名称）：工具的名称。如果未提供该字段，方法名会作为工具的名称。
- value（工具描述）：工具的描述信息。

根据工具的不同，即使没有任何描述，大语言模型可能也能很好地理解它（例如， add(a, b) 就很直 观），但通常最好提供清晰且有意义的名称和描述。这样，大语言模型就能获得更多信息，以决定是否 调用给定的工具以及如何调用。

## @P 注解

方法参数可以选择使用 @P 注解进行标注，有两个字段：
- value：参数的描述信息。
- required：表示该参数是否为必需项，默认值为 true 。

## @ToolMemoryId

- 如果你的AIService方法中有一个参数使用 @MemoryId 注解，那么你也可以使用 @ToolMemoryId 注解 @Tool 方法中的一个参数。
- 简单来说就是就是在 @Tools 方法中获取 @MemoryId 的


# 检索增强生成 RAG

## 让大模型回答专业领域的知识

### 微调大模型

- 在现有大模型的基础上，使用小规模的特定任务数据进行再次训练，调整模型参数，让模型更精确地处 理特定领域或任务的数据。更新需重新训练，计算资源和时间成本高。

应用场景：适合知识库稳定、对生成内容准确性和风格要求高的场景，如对上下文理解和语言生成 质量要求高的文学创作、专业文档生成等。

### RAG

- Retrieval-Augmented Generation 检索增强生成

- 将原始问题以及提示词信息发送给大语言模型之前，先通过外部知识库检索相关信息，然后将检索结果 和原始问题一起发送给大模型，大模型依据外部知识库再结合自身的训练数据，组织自然语言回答问 题。通过这种方式，大语言模型可以获取到特定领域的相关信息，并能够利用这些信息进行回复。

应用场景：适用于知识库规模大且频繁更新的场景，如企业客服、实时新闻查询、法律和医疗领域 的最新知识问答等。

### RAG常用方法

- **全文（关键词）搜索**。这种方法通过将问题和提示词中的关键词与知识库文档数据库进行匹配来搜 索文档。根据这些关键词在每个文档中的出现频率和相关性对搜索结果进行排序。
- **向量搜索**，也被称为 “语义搜索”。文本通过 **嵌入模型** 被转换为 **数字向量**。然后，它根据查询向量 与文档向量之间的余弦相似度或其他相似性 / 距离度量来查找和排序文档，从而捕捉更深层次的语 义含义。
- **混合搜索**。结合多种搜索方法（例如，全文搜索 + 向量搜索）通常可以提高搜索的效果。

## 向量搜索 vector search

向量Vectors：

- 可以将向量理解为从空间中的一个点到另一个点的移动。例如，在下图中，我们可以看到一些二维空间中的向量

维度 Dimensions：

- 每个数值向量都有 x 和 y 坐标（或者在多维系统中是 x、y、z，...）。x、y、z... 是这个向量 空间的轴，称为维度。对于我们想要表示为向量的一些非数值实体，我们首先需要决定这些维度，并为 每个实体在每个维度上分配一个值
- 向量的每个维度代表数据的不同特性，维度越多对事务的描述越精确

相似度 Similarity：

- 如果用户搜索 “轿车Car” ，你希望能够返回所有与 结果。向量搜索就是实现这个目标的一种方法。
- 每个向量都有一个长度和方向。
- 由于向量通常用于描述语义意义，仅仅看长度通常无法满足需求。大多数相似度测量要么仅依赖于方 向，要么同时考虑方向和大小。

## 文档加载器 Document Loader

### 测试用例

```java
@SpringBootTest
public class RAGTest {
	@Test
	public void testReadDocument() {
		//使用FileSystemDocumentLoader读取指定目录下的知识库文档
		//并使用默认的文档解析器TextDocumentParser对文档进行解析
		Document document = FileSystemDocumentLoader.loadDocument("E:/knowledge/测试.txt");
		System.out.println(document.text());
	}
}
```

```java
// 加载单个文档
Document document = FileSystemDocumentLoader.loadDocument("E:/knowledge/file.txt", new 
TextDocumentParser());

 // 从一个目录中加载所有文档
List<Document> documents = FileSystemDocumentLoader.loadDocuments("E:/knowledge", new 
TextDocumentParser());

 // 从一个目录中加载所有的.txt文档
PathMatcher pathMatcher = FileSystems.getDefault().getPathMatcher("glob:*.txt");
 List<Document> documents = FileSystemDocumentLoader.loadDocuments("E:/knowledge", 
pathMatcher, new TextDocumentParser());

 // 从一个目录及其子目录中加载所有文档
List<Document> documents = FileSystemDocumentLoader.loadDocumentsRecursively("E:/knowledge", new 
TextDocumentParser());
```

## 文档解析器 Document Parser

文档可以是各种格式的文件，比如 PDF、DOC、TXT 等等。为了解析这些不同格式的文件，有一个 “文档 解析器”（DocumentParser）接口，并且我们的库中包含了该接口的几种实现方式：

### 导入依赖

```xml
<!--解析pdf文档-->
<dependency>
	<groupId>dev.langchain4j</groupId>
	<artifactId>langchain4j-document-parser-apache-pdfbox</artifactId>
</dependency>
```

### 测试用例

```java
@Test
public void testParsePDF() {
	Document document = FileSystemDocumentLoader.loadDocument("E:/knowledge/医院信息.pdf",new ApachePdfBoxDocumentParser());
	System.out.println(document);
}
```

## 文档分割器 Document Splitter

### 测试向量转换和向量存储

- Embedding (Vector) Stores 常见的意思是 “嵌入（向量）存储” 。
- 在机器学习和自然语言处理领域， Embedding 指的是将数据（如文本、图像等）转换为低维稠密向量表示的过程，这些向量能够保留数据 的关键特征。
- 而 Stores 表示存储，即用于存储这些嵌入向量的系统或工具。它们可以高效地存储和检索 向量数据，支持向量相似性搜索，在文本检索、推荐系统、图像识别等任务中发挥着重要作用。

Langchain4j支持的向量存储：https://docs.langchain4j.dev/integrations/embedding-stores/


导入依赖
```xml
<!--简单的rag实现-->
<dependency>
	<groupId>dev.langchain4j</groupId>
	<artifactId>langchain4j-easy-rag</artifactId>
</dependency>
```


```java
@Test  
public void testDocumentSplitter() {  
    // 读取文档  
    Document document = FileSystemDocumentLoader.loadDocument("D:/BaiduNetdiskDownload/资料(2)/knowledge/人工智能.md");  
    // 创建内存中的向量存储  
    InMemoryEmbeddingStore<TextSegment> embeddingStore = new InMemoryEmbeddingStore<>();  
  
    DocumentByParagraphSplitter documentSplitter = new DocumentByParagraphSplitter(  
            300,  
            30,  
            //token分词器：按token计算  
            new HuggingFaceTokenizer());  
  
    // 处理文档并存储  
    EmbeddingStoreIngestor  
            .builder()  
            .embeddingStore(embeddingStore)  
            .documentSplitter(documentSplitter)  
            .build()  
            .ingest(document);  
      
    System.out.println(embeddingStore);  
}
```

处理文档并存储里有三个子步骤：
- **分割文档**
	- 将长文档拆分成多个小片段（默认每个片段不超过 300 个单词，相邻片段重叠 30 个单词）。
- **文本向量化**
	- 将每个文本片段转换为数学向量（类似用坐标表示位置）。
- **存储向量**
	- 将每个文本片段和对应的向量存入内存数据库`embeddingStore`。

### token和token计算

```java
@Test  
public void testTokenCount() {  
	String text = "这是一个示例文本，用于测试 token 长度的计算。";  
	UserMessage userMessage = UserMessage.userMessage(text);  
	//计算 token 长度  
//QwenTokenizer tokenizer = new QwenTokenizer(System.getenv("DASH_SCOPE_API_KEY"),"qwen-max");  
	HuggingFaceTokenizer tokenizer = new HuggingFaceTokenizer();  
	int count = tokenizer.estimateTokenCountInMessage(userMessage);  
	System.out.println("token长度：" + count);  
}
```


