---
title: RAG
date: 2025-11-15
tags:
  - Agent
---
## RAG 概念

### 什么是 RAG

RAG 是一种结合信息检索技术和 AI 内容生成的混合结构，可以解决大模型的知识时效性限制和幻读问题

简单来说就是让模型开卷考，让 AI 回答问题之前先查一下特定的知识库来获取信息，确保回答是基于资料而不是凭空捏造

RAG 和传统 AI 模型的区别

| 特性     | 传统大语言模型      | RAG 增强模型     |
| ------ | ------------ | ------------ |
| 知识时效性  | 受训练数据截止日期限制  | 可接入最新知识库     |
| 领域专业性  | 泛化知识⁠，专业深度有限 | 可接入专业领域知识    |
| 响应准‌确性 | 可能产生 “幻觉”    | 基于检索的事​实依据   |
| 可控性    | 依赖原始训练       | 可通过知‎识库定制输出  |
| 资源消耗   | 较高（需要大模型参‌数） | 模型可更小，结合外部知识 |
### RAG 的工作流程

- 文档收集和切割
- 向量转换和存储
- 文档过滤和检索
- 检查增强和关联

#### 文档收集和切割

文档收集：从各种来源（网页、PDF、数据库等）收集原始文档

文档预处理：清洗、标准化文本格式

文档切割：将长文档分割成适当大小的片段（俗称chunks）
- 基于固定大小（如1024个 token）
- 基于语义边界（如段落、文章）
- 基于递归分割策略（如递归字符 n-gram 切割）

#### 向量转换和存储

**向量转化**：使用 **Embedding** 模型将文本转换为高纬度向量表示，可以捕获到文本的语义特征
	
**向量存储**：将转换的向量和文本存入向量数据库，支持高效相似性搜索

![[Pasted image 20251117195905.png]]

#### 文档过滤和检索

查询处理：将用户的问题转换为向量表示

过滤机制：基于元数据、关键词或自定义规则进行过滤

相似度搜索：在向量数据库中查找与问题向量最相似的文档块，常用的相似度搜索算法有余弦相似度、欧式距离等

上下文组装：将检索出来的文档块组装成连贯的上下文

![[Pasted image 20251117200454.png]]
#### 查询增强和关联

提示词组装：将检索到的相关文档和用户的问题组合成增强提示词

上下文融合：大模型基于增强提示生成模型

源引用：在回答中添加信息来源引用

后处理：格式化、摘要或其他处理以优化最终输出

### RAG 的检索

RAG 的本质是 “**有依据才回答，没依据坦白**”， 所以检索失败的核心处理逻辑是：

- **先判断是不是真的没有答案**：并不是说 “没找到” 就等于 “知识库没有”，可能是检索器没搜对（比如关键词匹配差，embedding 模型不合适）

- **再给出不编造的响应**：明确告诉用户 “当前知识库没有相关内容”，并非强行生成

- **最后提供 “后续解决方案”**： 引导用户补充信息、或者触发知识库更新，完成闭环


具体实行策略：

- **在给大模型的 Prompt 中明确加入规则，直接告诉用户 “无匹配信息”**

```
规则1：仅基于提供的“检索到的知识库片段”回答问题； 
规则2：如果检索到的片段为空、或没有任何与问题相关的信息，直接回复：“抱歉，当前知识库中没有找到与您的问题相关的有效信息，无法提供准确回答。您可以尝试补充问题细节，或咨询其他相关话题。”； 
规则3：禁止在没有检索依据的情况下，编造任何来自“知识库”的信息。
```

- **结合大模型的 “通用知识”（但必须标注来源）**

```
规则4：如果检索失败（无相关知识库信息），可以基于你自身的通用知识简要回答，但必须在开头注明：“注意：以下回答来自模型的通用知识（非当前知识库），可能存在时效性或准确性问题，仅供参考：”； 
规则5：如果通用知识也无法回答，直接执行规则2。
```

注意：这种方式会牺牲 “绝对时效性”（因为大模型的通用知识截止到训练 cutoff 时间），但能提升用户体验，适合对时效性要求不极端的场景（比如常识类问题）。

- **引导用户 “补充信息”，提升检索成功率**

```
规则6：如果检索失败，且判断问题可能存在“信息模糊”（比如缺少关键条件、对象不明确），可以回复：“抱歉，当前知识库中没有找到相关信息。为了更准确地为您解答，建议补充以下细节：[举例说明需要补充的信息，如产品型号、时间范围、具体场景等]，我会为您重新查询。”
```

- **工程优化细节：避免 “假检索失败”**

	- **设置检索阈值**
		- 检索器（如 FAISS、Milvus）返回的结果会有 “相关性分数”（比如余弦相似度），设置一个阈值（如 0.7）：分数低于阈值，视为 “无相关信息”；分数高于阈值，才作为有效检索结果。
		- 避免 “为了检索而检索”：比如返回一堆不相关的文档，导致模型基于错误依据回答。
	- **优化检索策略**
		- 用「混合检索」（关键词检索 + 向量检索）
		- 关键词扩展
		- 调整 embedding 模型

## RAG 使用

首先，我们要对自己准备好的知识库文档进行处理，然后保存到向量数据库中。这个过程俗称 ETL（抽取、转换、加载），Spring AI 提供了对 ETL 的支持，参考 [官方文档](https://docs.spring.io/spring-ai/reference/api/etl-pipeline.html#_markdown)。

ETL 的 3 大核心组件，按照顺序执行：

- DocumentReader：读取文档，得到文档列表
- DocumentTransformer：转换文档，得到处理后的文档列表
- DocumentWriter：将文档列表保存到存储中（可以是向量数据库，也可以是其他存储）

 - 导入依赖

```xml
<dependency>
    <groupId>org.springframework.ai</groupId>
    <artifactId>spring-ai-markdown-document-reader</artifactId>
    <version>1.0.0-M6</version>
</dependency>
```

#### 本地知识库

- 编写文档加载器类 DocumentLoader，负责读取所有 Markdown 文档并转换为 Document 列表

```java
@Component  
@Slf4j  
public class DocumentLoader {  
  
    private ResourcePatternResolver resourcePatternResolver;  
  
    public LoveAppDocumentLoader(ResourcePatternResolver resourcePatternResolver){  
        this.resourcePatternResolver = resourcePatternResolver;  
    }  
  
    public List<Document> loadMarkdowns(){  
        List<Document> list = new ArrayList<>();  
        try {  
            Resource[] resources = resourcePatternResolver.getResources("classpath:document/*.md");  
            // 日志1：打印找到的 MD 文件数量  
            log.info("找到 {} 个 Markdown 文档", resources.length);  
            for (Resource resource : resources) {  
                String filename = resource.getFilename();  
                log.info("正在加载文档：{}", filename); // 日志2：打印具体文件名  
  
                MarkdownDocumentReaderConfig config = MarkdownDocumentReaderConfig.builder()  
                        .withHorizontalRuleCreateDocument(true) // 按水平线分割文档（没水平线则整个文档为1个Document）  
                        .withIncludeCodeBlock(false) // 不包含代码块  
                        .withIncludeBlockquote(false) // 不包含引用块  
                        .withAdditionalMetadata("filename", filename)  
                        .build();  
                MarkdownDocumentReader reader = new MarkdownDocumentReader(resource, config);  
                List<Document> docList = reader.get();  
                // 日志3：打印当前文档解析后的 Document 数量和内容  
                log.info("文档 {} 解析出 {} 个 Document",  
                        filename, docList.size());  
                list.addAll(docList);  
            }  
            // 日志4：打印总加载量  
            log.info("最终加载 Document 总数：{}", list.size());  
        } catch (IOException e) {  
            log.error("Markdown 文档加载失败", e);  
        }  
        return list;  
    }  
}
```

- 新建 VectorStoreConfig 类，实现初始化向量数据库并且保存文档的方法

```java
@Configuration  
public class VectorStoreConfig {  
  
    @Resource  
    private DocumentLoader DocumentLoader;  
  
    @Bean  
    VectorStore VectorStore(EmbeddingModel dashscopeEmbeddingModel){  
        SimpleVectorStore simpleVectorStore = SimpleVectorStore.builder(dashscopeEmbeddingModel)  
                .build();  
  
        List<Document> documents = DocumentLoader.loadMarkdowns();  
        simpleVectorStore.add(documents);  
        return simpleVectorStore;  
    }  
}
```

Spring AI 通过⁠ Advisor 特性提供了开箱即用的 RAG 功‌能。主要是 QuestionAnswerAdv​isor 问答拦截器和 RetrievalAug‎mentationAdvisor 检索增强拦截器‌，前者更简单易用、后者更灵活强大。

查询增强的原理其实很简单⁠。向量数据库存储着 AI 模型本身不知道的数据，当用户问题‌发送给 AI 模型时，QuestionAnswerAd​visor 会查询向量数据库，获取与用户问题相关的文档‎。然后从向量数据库返回的响应会被附加到用户文本中，为 ‌AI 模型提供上下文，帮助其生成回答。

```java
@Resource
private VectorStore loveAppVectorStore;

public String doChatWithRag(String message, String chatId) {
    ChatResponse chatResponse = chatClient
            .prompt()
            .user(message)
            .advisors(spec -> spec.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatId)
                    .param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))
            
            .advisors(new MyLoggerAdvisor())
            
            .advisors(new QuestionAnswerAdvisor(loveAppVectorStore))
            .call()
            .chatResponse();
    String content = chatResponse.getResult().getOutput().getText();
    log.info("content: {}", content);
    return content;
}
```

#### 云知识库

```java
/*  
* 自定义基于阿里云知识库服务的 RAG 增强顾问  
* */  
@Configuration  
@Slf4j  
public class LoveAppRagCloudAdvisorConfig {  
  
    @Value("${spring.ai.dashscope.api-key}")  
    private String dashScopeApiKey;  
  
    @Bean  
    public Advisor LoveAppRagCloudAdvisor(){  
        DashScopeApi dashScopeApi = new DashScopeApi(dashScopeApiKey);  
        final String KNOWLEDGE_INDEX = "知识库名称";  
        DashScopeDocumentRetriever dashScopeDocumentRetriever = new DashScopeDocumentRetriever(dashScopeApi,  
                DashScopeDocumentRetrieverOptions.builder()  
                        .withIndexName(KNOWLEDGE_INDEX)  
                        .build());  
        return RetrievalAugmentationAdvisor.builder()  
                .documentRetriever(dashScopeDocumentRetriever)  
                .build();  
    }  
}
```

```java
@Resource  
private VectorStore loveAppVectorStore;  

public String doChatWithRag(String message, String chatId){  
	ChatResponse chatResponse = chatClient  
			.prompt()  
			.user(message)  
			.advisors(spec -> spec.param(CHAT_MEMORY_CONVERSATION_ID_KEY, chatId)  
					.param(CHAT_MEMORY_RETRIEVE_SIZE_KEY, 10))  
			.advisors(new MyLoggerAdvisor())  
			// RAG 知识库问答（本地知识库）  
//                .advisors(new QuestionAnswerAdvisor(loveAppVectorStore))  
			// 应用 RAG 检索增强服务（基于云知识库服务）  
			.advisors(loveAppRagCloudAdvisor)  
			.call()  
			.chatResponse();  
	String text = chatResponse.getResult().getOutput().getText();  
	log.info("text: {}",text);  
	return text;  
}
```


















