---
title: SpringBoot学习笔记
date: 2025-01-25
tags:
---
# 体验SpringBoot

## 创建项目

所有的SpringBoot依赖都是以starter的形式命名的，之后我们需要导入其他模块也是导入 `spring boot-starter-xxxx` 这种名称格式的依赖。

SpringBoot为我们提供了包含内置Tomcat服务器的Web模块，我们只需要导入依赖就能直接运行服务器
把原来的
```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter</artifactId>  
</dependency>
```
换成
```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-web</artifactId>  
</dependency>
```
![](SpringBoot/p1.png)
点击启动后可以看到已经启动了内置的 tomcat

在浏览器上打开 `localhost:8080` 可以访问
![](p2.png)
可以看到成功响应了404页面，相比之前的大量配置，可以说方便了很多，我们到目前为止仅仅是导入了一个依赖，就可以做到直接启动我们的Web服务器并正常访问

SpringBoot支持自动包妇描，我们不需要编写任何配置，直接在任意路径(但是不能跑到主类所在包外面去了)下创建的组件(如Controller、Service、Component、Configuration等)都可以生效

比如创建一个Controller
```java
package com.example.demo.controller;  
  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.GetMapping;  
import org.springframework.web.bind.annotation.ResponseBody;  
  
@Controller  
public class TestController {  
  
    @ResponseBody  
    @GetMapping("/")  
    public String index() {  
        return "Hello World!";  
    }  
}
```

然后我们不需要扫描，直接启动
![](p3.png)


包括一个对象现在也可以直接以JSON形式返回给客户端，无需任何配置，如果启动不成功或者页面没有显示，请检查Lombok是否有正确启动（我用的时候就是没有找到构造方法和getter/setter，推测原因是Lombok）
```java
@Controller  
public class TestController {  
  
    @ResponseBody  
    @GetMapping("/")  
    public Student index() {  
        return new Student(1, "呵帅", "男");  
    }  
}
```

![](p4.png)


## 常用模块整合

spring-boot-starter-web包含了以下依赖
```xml
<dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter</artifactId>
      <version>3.4.2</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-json</artifactId>
      <version>3.4.2</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-tomcat</artifactId>
      <version>3.4.2</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-web</artifactId>
      <version>6.2.2</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>6.2.2</version>
      <scope>compile</scope>
    </dependency>
  </dependencies>
```

里面包含了以下内容
- spring-boot-starter 基础依赖starter
- spring-boot-starter-json 配置JSON转换的starter
- spring-boot-starter-tomcat 内置Tomcat服务器
- spring-web、spring-webmvc 之前mvc的内容

如果需要像之前一样添加WebMvc配置类，方法是一样的，直接创建
```java
package com.example.demo.config;  
  
import jakarta.servlet.http.HttpServletRequest;  
import jakarta.servlet.http.HttpServletResponse;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.web.servlet.HandlerInterceptor;  
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;  
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;  
  
//只需要添加Configuration用于注册配置类，不需要其他任何注解，已经自动配置好了  
@Configuration  
public class WebConfiguration implements WebMvcConfigurer {  
    @Override  
    public void addInterceptors(InterceptorRegistry registry) {  
        registry.addInterceptor(new HandlerInterceptor() {  
            @Override  
            public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {  
                System.out.println("请求被拦截");  
                return HandlerInterceptor.super.preHandle(request, response, handler);  
            }  
        });  
    }  
}
```

同样security也是一样的，首先添加依赖
```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-security</artifactId>  
</dependency>
```

导入完依赖直接启动
![](p5.png)

我们没有进行任何配置，而是对应的Starter帮助我们完成了默认的配置，并且在启动时，就已经帮助我们配置了一个随机密码的用户可以直接登录使用（Username是user）
![](SpringBoot/p6.png)

如果需要额外进行配置，只需要添加配置类即可
```java
package com.example.demo.config;  
  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.security.config.annotation.web.builders.HttpSecurity;  
import org.springframework.security.web.SecurityFilterChain;  
  
@Configuration  
public class SecurityConfiguration {  
  
    @Bean  
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {  
        return http  
                .authorizeHttpRequests(auth -> {  
                    auth.anyRequest().authenticated();  
                })  
                .formLogin(conf -> {  
                    conf.loginPage("/login");  
                    conf.loginProcessingUrl("/doLogin");  
                    conf.defaultSuccessUrl("/");  
                    conf.permitAll();  
                })  
                .build();  
    }  
}
```

同样的，我们也可以快速整合之前使用的模版引擎，比如Thymeleaf框架，直接上对应的Starter即可
```xml
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-thymeleaf</artifactId>  
</dependency>
```

## 自定义运行器

在项目中，可能会遇到这样一个问题:我们需要在项目启动完成之后，紧接着执行一段代码，我们可以编写自定义的ApplicationRunner，会在项目启动完成后执行
```java
@Component  
public class TestRunner implements ApplicationRunner {  
    @Override  
    public void run(ApplicationArguments args) throws Exception {  
        System.out.println("自定义执行");  
    }  
}
```

当然也可以使用CommandLineRunner，它也支持使用@Order或是实现Ordered接口来支持优先级执行

## 配置文件

虽然SpringBoot快捷开发确实很方便，不过我们发现有些东西还是需要我们自己来编写配置才可以，不然SpringBoot项目无法正常启动。我们可以直接在application.properties 中进行配置编写，它是整个SpringBoot的配置文件，比如要修改服务器的默认端口:

![](p7.png)

这些配置其实都是各种Starter提供的，部分配置在Starter中具有默认值，我们即使不配置也会使用默认值，比如这里的8080就是我们服务器的默认端口，我们也可以手动修改它，来变成我们需要的。

除了配置已经存在的选项，我们也可以添加自定义的配置，来方便我们程序中使用，比如我们这里创建一个测试数据:
```properties
test.hello=8080
```

```java
@Controller  
public class TestController {  
  
    @Value("${test.hello}")  
    String hello;  
  
    @GetMapping("/login")  
    public String login() {  
        System.out.println(hello);  
        return "login";  
    }  
}
```

配置文件除了使用 `properties` 格式以外，还有一种叫做 `yaml` 格式，它的语法如下
```yml
一级目录:
	二级目录:
		三级目录1:值
		三级目录2:值
		三级目录List:
	- 元素1
	- 元素2
	- 元素3
```
我们可以看到，每一级目录都是通过缩进(不能使用Tab，只能使用空格)区分，并且键和值之间需要添加冒号+空格来表示

例如:
```yml
server:  
  port: 8080  
Spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/test  
    username: root  
    password: Abc123  
    driver-class-name: com.mysql.cj.jdbc.Driver
```

注意如果你的数据库密码是以0开头或者0x开头会被默认转义为八进制和十六进制,要用引号把密码引起来

### 常见的配置项

SpringSecurity和SpringBootMvc配置
```yml
spring:  
  # Spring Mvc相关配置  
  mvc:  
    static-path-pattern: /static/**  # 静态资源访问路径  
  # Spring Security相关配置  
  security:  
    filter:  
      order: -100  # 过滤优先级，数字越小优先级越高  
    user:  
      name: 'admin'  # 登录用户名  
      password: '123456'  # 登录密码  
      roles:   # 登录用户角色  
        - admin  
        - user
```

## mybatis

整合Mybatis需要把本身的驱动加上
```xml
<dependency>  
    <groupId>org.mybatis.spring.boot</groupId>  
    <artifactId>mybatis-spring-boot-starter</artifactId>  
    <version>3.0.2</version>  
</dependency>  
<dependency>  
    <groupId>com.mysql</groupId>  
    <artifactId>mysql-connector-j</artifactId>  
    <scope>runtime</scope>  
</dependency>
```

```yml
server:  
  port: 8080  
Spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/test  
    username: root  
    password: Abc123  
    driver-class-name: com.mysql.cj.jdbc.Driver
```

这里我们接续来测试一下MyBatis的配置，想要在SpringBoot中使用Mybatis也很简单，不需要进行任何配置，我们直接编写Mapper即可
直接为需要注册为Mapper的接口添加 @Mapper 注解，来表示这个接口作为Mapper使用
```java
@Mapper  
public interface UserMapper {  
    @Select("select * from test where id = #{id}")  
    User findUserById(int id);  
}
```

测试：
```java
@Resource  
UserMapper mapper;

@ResponseBody  
@GetMapping("/test")  
public User test() {  
    return mapper.findUserById(1);  
}
```

注：**如果运行失败，检查是否是maven依赖版本不兼容**


## 打包运行

我们可以使用maven工具

![](p8.png)

然后在当前目录下的命令行中输入：`java -jar 包名.jar`

### GraalVM

我们SpringBoot项目除了打包为传统的Jar包基于JVM运行之外，我们也可以将其直接编译为操作系统原生的程序来进行使用(这样会大幅提升程序的运行效率，但是由于编译为操作系统原生程序，这将无法支持跨平台)

具体内容：[十分钟带你了解 Oracle 最新的 JVM 技術——GraalVM - 知乎](https://zhuanlan.zhihu.com/p/106555993)

**还未广泛运用，了解为主**

## 日志系统

我们在之前学习SSM时，如果不配置日志，就会报错，但是到了SpringBoot阶段之后日志打印得也非常统一，不会出现这个问题

### 日志门面和日志实现

日志门面，如Slf4j，是把不同的日志系统的实现进行了具体的抽象化，只提供了统一的日志使用接口，使用时只需要按照其提供的接口方法进行调用即可，由于它只是一个接口，并不是一个具体的可以直接单独使用的日志框架，所以最终日志的格式、记录级别、输出方式等都要通过接口绑定的具体的日志系统来实现，这些具体的日志系统就有lqg4j、logback、java.util.logging等，它们才实现了具体的日志系统的功能。
日志门面和日志实现就像JDBC和数据库驱动一样，一个是画大饼的，一个是真的去做饼的。

SpringBoot为了统一日志框架的使用，做了这些事情
- 直接将其他依赖以前的日志框架剔除
- 导入对应日志框架的Slf4i中间包
- 导入自己官方指定的日志实现，并作为Slf4j的日志实现层

日志级别从低到高分为TRACE<DEBUG<INFO<WARN<ERROR<FATAL， SpringBoot默认只会打印INFO以上级别的信息

如果想要输出日志信息像之前JUL一样就行了
```java
@Slf4j  
@Controller  
public class TestController {  
@PostConstruct  
    public void init() {  
        log.info("日志信息");  
    }  
}
```

### 配置 logback日志

和JUL一样，Logback也能实现定制化，我们可以编写对应的配置文件，SpringBoot推荐将配置文件名称命名为表示这是SpringBoot下Logback专用的配置，可以使用SpringBoot 的高级Profile功能，它的内容类似于这样:`logback-spring.xml`

最外层由 configuration 包裹，一旦编写，那么就会替换默认的配置，所以如果内部什么都不写的话，那么会导致我们的SpringBoot项目没有配置任何日志输出方式，控制台也不会打印日志。
在org/springframework/boot/logging/logback/defaults.xml 中已经帮我们把日志的输出格式定义好了，我们只需要设置对应的appender 即可:
```xml
<configuration>  
    <!--  导入其他配置文件，作为预设  -->  
    <include resource="org/springframework/boot/logging/logback/defaults.xml" />  
  
    <property name="CONSOLE_LOG_PATTERN" value="%clr(%d{${LOG_DATEFORMAT_PATTERN:-yyyy-MM-dd}}){faint} %clr([%X{reqId}]){faint} %clr(${LOG_LEVEL_PATTERN:-%5p}){} %clr(${PID:-}){magenta} %clr(--- %esb(){APPLICATION_NAME}%esb{APPLICATION_GROUP}[%15.15t] ${LOG_CORRELATION_PATTERN:-}){faint}%clr(%-40.40logger{39}){cyan} %clr(:){faint} %m%n${LOG_EXCEPTION_CONVERSION_WORD:-%wEx}"/>  
  
    <!--  Appender作为日志打印器配置，这里命名随意  -->  
    <!--  ch.qos.logback.core.ConsoleAppender是专用于控制台的Appender  -->  
    <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">  
        <encoder>            <pattern>${CONSOLE_LOG_PATTERN}</pattern>  
            <charset>${CONSOLE_LOG_CHARSET}</charset>  
        </encoder>    </appender>  
    <!--  ch.qos.logback.core.rolling.RollingFileAppender用于文件日志记录，它支持滚动  -->  
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">  
        <encoder>            <pattern>${FILE_LOG_PATTERN}</pattern>  
            <charset>${FILE_LOG_CHARSET}</charset>  
        </encoder>        <!--  自定义滚动策略，防止日志文件无限变大，也就是日志文件写到什么时候为止，重新创建一个新的日志文件开始写  -->  
        <rollingPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedRollingPolicy">  
            <!--  文件保存位置以及文件命名规则，这里用到了%d{yyyy-MM-dd}表示当前日期，%i表示这一天的第N个日志  -->  
            <FileNamePattern>log/%d{yyyy-MM-dd}-spring-%i.log</FileNamePattern>  
            <!--  到期自动清理日志文件  -->  
            <cleanHistoryOnStart>true</cleanHistoryOnStart>  
            <!--  最大日志保留时间  -->  
            <maxHistory>7</maxHistory>  
            <!--  最大单个日志文件大小  -->  
            <maxFileSize>10MB</maxFileSize>  
        </rollingPolicy>    </appender>  
    <!--  指定日志输出级别，以及启用的Appender，这里就使用了我们上面的ConsoleAppender  -->  
    <root level="INFO">  
        <appender-ref ref="CONSOLE"/>  
        <appender-ref ref="FILE"/>  
    </root></configuration>
```

配置完，运行就会生成一个日志文件

比如我们现在需要记录是哪个用户访问我们网站的日志，只要是此用户访问我们网站，都会在日志中携带该用户的ID，我们希望每条日志中都携带这样一段信息文本，而官方提供的字段无法实现此功能，这时就需要使用MDC机制“Mapped Diagnostic Context”（映射诊断上下文）：
```java
@Slf4j  
@Controller  
public class TestController {  
  
    @GetMapping("/")  
    @ResponseBody  
    public String hello(HttpSession session) {  
        MDC.put("reqId", session.getId());  
        log.info("访问了一次测试接口");  
        return "Hello World";  
    }  
}
```

### 自定义Banner展示

可以直接来配置文件所在目录下创建一个名为`banner.txt`的文本文档，内容随便
```txt
${AnsiColor.yellow}  
//                          _ooOoo_                               //  
//                         o8888888o                              //  
//                         88" . "88                              //  
//                         (| ^_^ |)                              //  
//                         O\  =  /O                              //  
//                      ____/`---'\____                           //  
//                    .'  \\|     |//  `.                         //  
//                   /  \\|||  :  |||//  \                        //  
//                  /  _||||| -:- |||||-  \                       //  
//                  |   | \\\  -  /// |   |                       //  
//                  | \_|  ''\---/''  |   |                       //  
//                  \  .-\__  `-`  ___/-. /                       //  
//                ___`. .'  /--.--\  `. . ___                     //  
//              ."" '<  `.___\_<|>_/___.'  >'"".                  //  
//            | | :  `- \`.;`\ _ /`;.`/ - ` : | |                 //  
//            \  \ `-.   \_ __\ /__ _/   .-` /  /                 //  
//      ========`-.____`-.___\_____/___.-`____.-'========         //  
//                           `=---='                              //  
//      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^        //  
//             佛祖保佑          永无BUG         永不修改             //  
${AnsiColor.black}
```

可以使用在线生成网站进行生成自己的个性Banner：[https://www.bootschool.net/ascii](https://www.bootschool.net/ascii)

切换颜色
```xml
${AnsiColor.BRIGHT_GREEN} //绿色
```

常用配置
```xml
${AnsiColor.YELLOW} 当前 Spring Boot 版本：${spring-boot.version}
```

## 多环境配置

在日常开发中，我们项目会有多个环境。不同的环境下，可能我们的配置文件也存在不同，但是我们不可能切换环境的时候又去重新写一次配置文件，所以我们可以将多个环境的配置文件提前写好，进行自由切换。

SpringBoot给我们提供了一种方式，在 `application.yml`下，我们可以通过配置文件指定

```yml
spring:
  profiles:
    active: dev
```

我们分别创建两个环境的配置文件，`application-dev.yml`和`application-prod.yml`分别表示开发环境和生产环境的配置文件，比如开发环境我们使用的服务器端口为8080，而生产环境下可能就需要设置为80或是443端口，那么这个时候就需要不同环境下的配置文件进行区分：
```yml
server: port: 8080
```

```yml
server: port: 8888
```

SpringBoot自带的Logback日志系统也是支持多环境配置的，比如我们想在开发环境下输出日志到控制台，而生产环境下只需要输出到文件即可，这时就需要进行环境配置：
```xml
<springProfile name="dev">
    <root level="INFO">
        <appender-ref ref="CONSOLE"/>
        <appender-ref ref="FILE"/>
    </root>
</springProfile>

<springProfile name="prod">
    <root level="INFO">
        <appender-ref ref="FILE"/>
    </root>
</springProfile>
```

我们希望生产环境中不要打包开发环境下的配置文件呢，打包的问题就只能找Maven解决了，Maven也可以设置多环境：
在 `pom.xml` 中 project 里任意位置
```xml
<!--分别设置开发，生产环境-->
<profiles>
    <!-- 开发环境 -->
    <profile>
        <id>dev</id>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
        <properties>
            <environment>dev</environment>
        </properties>
    </profile>
    <!-- 生产环境 -->
    <profile>
        <id>prod</id>
        <activation>
            <activeByDefault>false</activeByDefault>
        </activation>
        <properties>
            <environment>prod</environment>
        </properties>
    </profile>
</profiles>
```

在 `pom.xml` 中的 build 中
```xml
<resources>
<!--排除配置文件-->
    <resource>
        <directory>src/main/resources</directory>
        <!--先排除所有的配置文件-->
        <excludes>
            <!--使用通配符，当然可以定义多个exclude标签进行排除-->
            <exclude>application*.yml</exclude>
        </excludes>
    </resource>

    <!--根据激活条件引入打包所需的配置和文件-->
    <resource>
        <directory>src/main/resources</directory>
        <!--引入所需环境的配置文件-->
        <filtering>true</filtering>
        <includes>
            <include>application.yml</include>
            <!--根据maven选择环境导入配置文件-->
            <include>application-${environment}.yml</include>
        </includes>
    </resource>
</resources>
```

接着，我们可以直接将Maven中的`environment`属性，传递给SpringBoot的配置文件，在构建时替换为对应的值：
```yml
spring:
  profiles:
    active: '@environment@'  #注意YAML配置文件需要加单引号，否则会报错
```

**注意切换环境之后要重新加载一下Maven项目，不然不会生效！**

## 常用框架

### 邮件发送模块

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>
```

比较常用的协议有两种：

1. SMTP协议（主要用于发送邮件 Simple Mail Transfer Protocol）
2. POP3协议（主要用于接收邮件 Post Office Protocol 3）

```yml
spring:  
  mail:  
    host: 去百度搜索该邮箱的smtp
    username: 邮箱  
    password: 密码（并非账号的密码）
```

```java
@SpringBootTest  
class Demo1ApplicationTests {  
  
    @Autowired  
    JavaMailSender sender;  
  
    @Test  
    void contextLoads() {  
        //SimpleMailMessage是一个比较简易的邮件封装，支持设置一些比较简单内容  
        SimpleMailMessage message = new SimpleMailMessage();  
        //设置邮件标题  
        message.setSubject("【广东白云学院教务处】关于近期学校对您的处分决定");  
        //设置邮件内容  
        message.setText("同学您好，完美校园数据显示您在本学期以来在本校食堂消费超过503次，积累消费金额超过3000元，您已被评为“校园大饭桶”，特此通知予以嘉奖。奖品将在3月1日西校区一品堂门口发放，感谢您对学校餐厅工作的支持！");  
        //设置邮件发送给谁，可以多个，这里就发给你的QQ邮箱  
        message.setTo("邮箱@qq.com");  
        //邮件发送者，这里要与配置文件中的保持一致  
        message.setFrom("发送的邮箱@qq.cn");  
          
        sender.send(message);  
    }  
}
```

如果需要添加附件等更多功能，可以使用MimeMessageHelper来帮助我们完成
```java
@Test
void contextLoads() throws MessagingException {
      //创建一个MimeMessage
    MimeMessage message = sender.createMimeMessage();
      //使用MimeMessageHelper来帮我们修改MimeMessage中的信息
    MimeMessageHelper helper = new MimeMessageHelper(message, true);
    helper.setSubject("Test");
    helper.setText("lbwnb");
    helper.setTo("你的QQ号@qq.com");
    helper.setFrom("发送的邮箱@163.com");
      //发送修改好的MimeMessage
    sender.send(message);
}
```

### 接口规则校验

**所需依赖**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

如下面代码所示，我们要将接收到的字符串作切割，但是如果接收的字符串长度不满足切割条件时，或者说用户没有按照我们所设想来传参，那么就会直接报错
```java
@ResponseBody
@PostMapping("/submit")
public String submit(String username,
                     String password){
    System.out.println(username.substring(3));
    System.out.println(password.substring(2, 10));
    return "请求成功!";
}
```

这是最简单的解决方法是做个判断：
```java
@ResponseBody
@PostMapping("/submit")
public String submit(String username,
                     String password){
    if(username.length() > 3 && password.length() > 10) {
        System.out.println(username.substring(3));
        System.out.println(password.substring(2, 10));
        return "请求成功!";
    } else {
        return "请求失败";
    }
}
```

虽然这样就能直接解决问题，但是如果我们的每一个接口都需要这样去进行配置就太麻烦了，Springboot 为我们提供了很方便的接口校验框架，我们可以使用注解开发完成全部接口的校验：
```java
@Slf4j
@Validated   //首先在Controller上开启接口校验
@Controller
public class TestController {

    ...

    @ResponseBody
    @PostMapping("/submit")
    public String submit(@Length(min = 3) String username,  //使用@Length注解一步到位
                         @Length(min = 10) String password){
        System.out.println(username.substring(3));
        System.out.println(password.substring(2, 10));
        return "请求成功!";
    }
}
```

不过这样依然会抛出一个异常，我们可以稍微处理一下，这里我们可以直接使用之前在SSM阶段中学习的异常处理Controller来自行处理这类异常：
```java
@ControllerAdvice
public class ValidationController {

    @ResponseBody
    @ExceptionHandler(ConstraintViolationException.class)
    public String error(ValidationException e){
        return e.getMessage();   //出现异常直接返回消息
    }
}
```

| 验证注解         | 验证的数据类型                                                                     | 说明                              |
|--------------|-----------------------------------------------------------------------------|---------------------------------|
| @AssertFalse | Boolean,boolean                                                             | 值必须是false                       |
| @AssertTrue  | Boolean,boolean                                                             | 值必须是true                        |
| @NotNull     | 任意类型                                                                        | 值不能是null                        |
| @Null        | 任意类型                                                                        | 值必须是null                        |
| @Min         | BigDecimal、BigInteger、byte、short、int、long、double 以及任何Number或CharSequence子类型 | 大于等于@Min指定的值                    |
| @Max         | 同上                                                                          | 小于等于@Max指定的值                    |
| @DecimalMin  | 同上                                                                          | 大于等于@DecimalMin指定的值（超高精度）       |
| @DecimalMax  | 同上                                                                          | 小于等于@DecimalMax指定的值（超高精度）       |
| @Digits      | 同上                                                                          | 限制整数位数和小数位数上限                   |
| @Size        | 字符串、Collection、Map、数组等                                                      | 长度在指定区间之内，如字符串长度、集合大小等          |
| @Past        | 如 java.util.Date, java.util.Calendar 等日期类型                                  | 值必须比当前时间早                       |
| @Future      | 同上                                                                          | 值必须比当前时间晚                       |
| @NotBlank    | CharSequence及其子类                                                            | 值不为空，在比较时会去除字符串的首位空格            |
| @Length      | CharSequence及其子类                                                            | 字符串长度在指定区间内                     |
| @NotEmpty    | CharSequence及其子类、Collection、Map、数组                                          | 值不为null且长度不为空（字符串长度不为0，集合大小不为0） |
| @Range       | BigDecimal、BigInteger、CharSequence、byte、short、int、long 以及原子类型和包装类型          | 值在指定区间内                         |
| @Email       | CharSequence及其子类                                                            | 值必须是邮件格式                        |
| @Pattern     | CharSequence及其子类                                                            | 值需要与指定的正则表达式匹配                  |
| @Valid       | 任何非原子类型                                                                     | 用于验证对象属性                        |

此时接口是以对象形式接收前端发送的表单数据的，这个时候就没办法向上面一样编写对应的校验规则了
```java
@Data
public class Account {
    @Length(min = 3)   //只需要在对应的字段上添加校验的注解即可
    String username;
    @Length(min = 10)
    String password;
}
```

```java
@ResponseBody
@PostMapping("/submit")  //在参数上添加@Valid注解表示需要验证
public String submit(@Valid Account account){
    System.out.println(account.getUsername().substring(3));
    System.out.println(account.getPassword().substring(2, 10));
    return "请求成功!";
}
```

然后修改之前的错误处理，对于实体类接收参数的验证，会抛出`MethodArgumentNotValidException `异常也加进去
```java
@ResponseBody
@ExceptionHandler({ConstraintViolationException.class, MethodArgumentNotValidException.class})
public String error(Exception e){
    if(e instanceof ConstraintViolationException exception) {
        return exception.getMessage();
    } else if(e instanceof MethodArgumentNotValidException exception){
        if (exception.getFieldError() == null) return "未知错误";
        return exception.getFieldError().getDefaultMessage();
    }
    return "未知错误";
}
```

### 接口文档生成（肥肠豪用）

**所需依赖**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.1.0</version>
</dependency>
```

Swagger的主要功能如下：

- 支持 API 自动生成同步的在线文档：使用 Swagger 后可以直接通过代码生成文档，不再需要自己手动编写接口文档了，对程序员来说非常方便，可以节约写文档的时间去学习新技术。
- 提供 Web 页面在线测试 API：光有文档还不够，Swagger 生成的文档还支持在线测试。参数和格式都定好了，直接在界面上输入参数对应的值即可在线测试接口。

结合Spring框架（Spring-doc，官网：`https://springdoc.org/`
Swagger可以很轻松地利用注解以及扫描机制，来快速生成在线文档，以实现当我们项目启动之后，前端开发人员就可以打开Swagger提供的前端页面，查看和测试接口。

项目启动之后，我们可以直接访问：`http://localhost:8080/swagger-ui/index.html` 就可以看到开发文档了

修改Swagger的UI界面
```java
@Configuration
public class SwaggerConfiguration {
    @Bean
    public OpenAPI springDocOpenAPI() {
        return new OpenAPI().info(new Info()
                .title("图书管理系统 - 在线API接口文档")   //设置API文档网站标题
                .description("这是一个图书管理系统的后端API文档，欢迎前端人员查阅！") //网站介绍
                .version("2.0")   //当前API版本
                .license(new License().name("我的B站个人主页")  //遵循的协议，这里拿来写其他的也行
                        .url("https://space.bilibili.com/288205652")));
    }
}
```

为Controller编写API描述信息
```java
//使用@Tag注解来添加Controller描述信息
@Tag(name = "账户验证相关", description = "包括用户登录、注册、验证码请求等操作。")
public class TestController {
	...
}
```

我们可以直接在类名称上面添加`@Tag`注解，并填写相关信息，来为当前的Controller设置描述信息。接着我们可以为所有的请求映射配置描述信息：
```java
@ApiResponses({
       @ApiResponse(responseCode = "200", description = "测试成功"),
       @ApiResponse(responseCode = "500", description = "测试失败")   //不同返回状态码描述
})
@Operation(summary = "请求用户数据测试接口")   //接口功能描述
@ResponseBody
@GetMapping("/hello")
//请求参数描述和样例
public String hello(@Parameter(description = "测试文本数据", example = "KFCvivo50") @RequestParam String text) {
    return "Hello World";
}
```

对于那些不需要展示在文档中的接口，我们也可以将其忽略掉：
```java
@Hidden
@ResponseBody
@GetMapping("/hello")
public String hello() {
    return "Hello World";
}
```

对于实体类，我们也可以编写对应的API接口文档：
```java
@Data
@Schema(description = "用户信息实体类")
public class User {
    @Schema(description = "用户编号")
    int id;
    @Schema(description = "用户名称")
    String name;
    @Schema(description = "用户邮箱")
    String email;
    @Schema(description = "用户密码")
    String password;
}
```

不过，这种文档只适合在开发环境下生成，如果是生产环境，我们需要关闭文档：
```java
springdoc:
  api-docs:
    enabled: false
```


# 数据交互

## JDBC交互框架

所需依赖
```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-jdbc</artifactId>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

```yml
spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/test  
    username: root  
    password: Abc123  
    driver-class-name: com.mysql.cj.jdbc.Driver
```

spring-jdbc 把所有的增删改查都加入到一个模板类里，并且已经注册好了
```java
@Resource  
JdbcTemplate template;
```

通过 template 调用已经封装好的方法，现在我们可以只写 SQL 语句了，相当于省略掉了 mapper
```java
@Test
void contextLoads() {
	int id = 1;
    Map<String, Object> map = template.queryForMap("select * from user where id = ?", id);
    System.out.println(map);
}
```

也可以自定义
```java
@Data
@AllArgsConstructor
public class User {
    int id;
    String name;
    String email;
    String password;
}
```

```java
@Test
void contextLoads() {
    User user = template.queryForObject("select * from user where id = ?",
        (r, i) -> new User(r.getInt(1), r.getString(2), r.getString(3), r.getString(4)), 1);
    System.out.println(user);
}
```

### 简单封装

对于一些插入操作，Spring JDBC为我们提供了更方便的SimpleJdbcInsert工具，比如我们的表是采用自增的ID，那么它支持插入后返回自动生成的ID
```java
@Configuration
public class WebConfiguration {

    @Resource
    DataSource source;

    @Test
    void contextLoads() {
      	//这个类需要自己创建对象
        SimpleJdbcInsert simple = new SimpleJdbcInsert(source)
                .withTableName("user")   //设置要操作的表名称
                .usingGeneratedKeyColumns("id");    //设置自增主键列
        Map<String, Object> user = new HashMap<>(2);  //插入操作需要传入一个Map作为数据
        user.put("name", "bob");
        user.put("email", "112233@qq.com");
        user.put("password", "123456");
        Number number = simple.executeAndReturnKey(user);   //最后得到的Numver就是得到的自增主键
        System.out.println(number);
    }
}
```


## JPA框架

官网：[https://spring.io/projects/spring-data-jpa](https://spring.io/projects/spring-data-jpa)

而实现JPA规范的框架一般最常用的就是`Hibernate`

所需依赖
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>
```

### 使用JPA快速上手

我们通过注解形式，在属性上添加数据库映射关系
```java
@Data
@Entity   //表示这个类是一个实体类
@Table(name = "account")    //对应的数据库中表名称
public class Account {

    @GeneratedValue(strategy = GenerationType.IDENTITY)   //生成策略，这里配置为自增
    @Column(name = "id")    //对应表中id这一列
    @Id     //此属性为主键
    int id;

    @Column(name = "username")   //对应表中username这一列
    String username;

    @Column(name = "password")   //对应表中password这一列
    String password;
}
```

修改配置文件，把日志打印打开
```yml
spring:
  jpa:
    #开启SQL语句执行日志信息
    show-sql: true
    hibernate:
      #配置为检查数据库表结构，没有时会自动创建
      ddl-auto: update
```

`ddl-auto`属性用于设置自动表定义，可以实现自动在数据库中为我们创建一个表，表的结构会根据我们定义的实体类决定，它有以下几种：

- `none`: 不执行任何操作，数据库表结构需要手动创建。
- `create`: 框架在每次运行时都会删除所有表，并重新创建。
- `create-drop`: 框架在每次运行时都会删除所有表，然后再创建，但在程序结束时会再次删除所有表。
- `update`: 框架会检查数据库表结构，如果与实体类定义不匹配，则会做相应的修改，以保持它们的一致性。
- `validate`: 框架会检查数据库表结构与实体类定义是否匹配，如果不匹配，则会抛出异常。

创建一个Repository接口来继承 `JpaRepository` 泛型，第一个参数是实体类，第二个是主键的类型 
```java
@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
}
```

直接调用方法即可
```java
@Resource
AccountRepository repository;

@Test
void contextLoads() {
    Account account = new Account();
    account.setUsername("小红");
    account.setPassword("1234567");
    System.out.println(repository.save(account).getId());   //使用save来快速插入数据，并且会返回插入的对象，如果存在自增ID，对象的自增id属性会自动被赋值，这就很方便了
}
```


### 方法名称拼接自定义SQL

超级帅，只需要在我们创建 `AccountRepository` 上通过方法名称的拼接来实现条件判断

| 关键字               | 方法名称示例                                                    | 执行的语句                                                          |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| Distinct          | findDistinctByLastnameAndFirstname                        | `select distinct … where x.lastname = ?1 and x.firstname = ?2` |
| And               | findByLastnameAndFirstname                                | `… where x.lastname = ?1 and x.firstname = ?2`                 |
| Or                | findByLastnameOrFirstname                                 | `… where x.lastname = ?1 or x.firstname = ?2`                  |
| Is，Equals         | findByFirstname, findByFirstnameIs, findByFirstnameEquals | `… where x.firstname = ?1`                                     |
| Between           | findByStartDateBetween                                    | `… where x.startDate between ?1 and ?2`                        |
| LessThan          | findByAgeLessThan                                         | `… where x.age < ?1`                                           |
| LessThanEqual     | findByAgeLessThanEqual                                    | `… where x.age <= ?1`                                          |
| GreaterThan       | findByAgeGreaterThan                                      | `… where x.age > ?1`                                           |
| GreaterThanEqual  | findByAgeGreaterThanEqual                                 | `… where x.age >= ?1`                                          |
| After             | findByStartDateAfter                                      | `… where x.startDate > ?1`                                     |
| Before            | findByStartDateBefore                                     | `… where x.startDate < ?1`                                     |
| IsNull，Null       | findByAge(Is)Null                                         | `… where x.age is null`                                        |
| IsNotNull，NotNull | findByAge(Is)NotNull                                      | `… where x.age not null`                                       |
| Like              | findByFirstnameLike                                       | `… where x.firstname like ?1`                                  |
| NotLike           | findByFirstnameNotLike                                    | `… where x.firstname not like ?1`                              |
| StartingWith      | findByFirstnameStartingWith                               | `… where x.firstname like ?1（参数与附加%绑定）`                        |
| EndingWith        | findByFirstnameEndingWith                                 | `… where x.firstname like ?1（参数与前缀%绑定）`                        |
| Containing        | findByFirstnameContaining                                 | `… where x.firstname like ?1（参数绑定以%包装）`                        |
| OrderBy           | findByAgeOrderByLastnameDesc                              | `… where x.age = ?1 order by x.lastname desc`                  |
| Not               | findByLastnameNot                                         | `… where x.lastname <> ?1`                                     |
| In                | findByAgeIn(Collection<Age> ages)                         | `… where x.age in ?1`                                          |
| NotIn             | findByAgeNotIn(Collection<Age> ages)                      | `… where x.age not in ?1`                                      |
| True              | findByActiveTrue                                          | `… where x.active = true`                                      |
| False             | findByActiveFalse                                         | `… where x.active = false`                                     |
| IgnoreCase        | findByFirstnameIgnoreCase                                 | `… where UPPER(x.firstname) = UPPER(?1)`                       |

比如我们想要实现根据用户名模糊匹配查找用户、根据大于这个ID并且降序查询、通过用户名和ID查询、判断数据库中是否存在某个ID的用户：
```java
@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Account findAccountByUsernameLike(String str);

    List<Account> findAccountsByIdGreaterThanOrderByIdDesc(int id);

    Account findAccountByUsernameAndId(String username, int id);

    boolean existsAccountById(int id);
}
```

```java
@SpringBootTest
class Demo2ApplicationTests {

    @Resource
    AccountRepository repository;

    @Test
    void contextLoads() {
        System.out.println(repository.findAccountByUsernameLike("%es%"));
        System.out.println("======================================");
        System.out.println(repository.findAccountsByIdGreaterThanOrderByIdDesc(0));
        System.out.println("======================================");
        System.out.println(repository.findAccountByUsernameAndId("test", 1));
        System.out.println("======================================");
        System.out.println(repository.existsAccountById(1));
        System.out.println(repository.existsAccountById(10));
        System.out.println("======================================");
    }
}
```

注意自定义条件操作的方法名称一定要遵循规则，不然会出现异常：
```sh
Caused by: org.springframework.data.repository.query.QueryCreationException: Could not create query for public abstract  ...
```

### 关联查询

#### 一对一

```java
@Data
@Entity
@Table(name = "users_detail")
public class AccountDetail {

    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    int id;

    @Column(name = "address")
    String address;

    @Column(name = "email")
    String email;

    @Column(name = "phone")
    String phone;

    @Column(name = "real_name")
    String realName;
}
```

```java
@Data
@Entity
@Table(name = "users")
public class Account {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Id
    int id;

    @Column(name = "username")
    String username;

    @Column(name = "password")
    String password;

    @JoinColumn(name = "detail_id")   //指定存储外键的字段名称
    @OneToOne    //声明为一对一关系
    AccountDetail detail;
}
```


添加数据时，利用实体类之间的关联信息，一次性添加两张表的数据
```java
@JoinColumn(name = "detail_id")
@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL) //设置关联操作为ALL
AccountDetail detail;
```

- ALL：所有操作都进行关联操作
- PERSIST：插入操作时才进行关联操作
- REMOVE：删除操作时才进行关联操作
- MERGE：修改操作时才进行关联操作

```java
@Test
void addAccount(){
    Account account = new Account();
    account.setUsername("Nike");
    account.setPassword("123456");
    AccountDetail detail = new AccountDetail();
    detail.setAddress("翻斗大街");
    detail.setPhone("1234567890");
    detail.setEmail("123456@qq.com");
    detail.setRealName("张三");
  	account.setDetail(detail);
    account = repository.save(account);
    System.out.println("插入时，自动生成的主键ID为："+account.getId()+"，外键ID为："+account.getDetail().getId());
}
```

#### 一对多

```java
@Data
@Entity
@Table(name = "users_score")   //成绩表，注意只存成绩，不存学科信息，学科信息id做外键
public class Score {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @Id
    int id;

    @OneToOne   //一对一对应到学科上
    @JoinColumn(name = "cid")
    Subject subject;

    @Column(name = "socre")
    double score;

    @Column(name = "uid")
    int uid;
}
```

```java
@Data
@Entity
@Table(name = "subjects")   //学科信息表
public class Subject {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cid")
    @Id
    int cid;

    @Column(name = "name")
    String name;

    @Column(name = "teacher")
    String teacher;

    @Column(name = "time")
    int time;
}
```

```java
@Data
@Entity
@Table(name = "account")
public class Account {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(name = "username")
    String username;

    @Column(name = "password")
    String password;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "detail_id")
    AccountDetail detail;

    @JoinColumn(name = "uid")  //注意这里的name指的是Score表中的uid字段对应的就是当前的主键，会将uid外键设置为当前的主键
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)   //在移除Account时，一并移除所有的成绩信息，依然使用懒加载
    List<Score> scoreList;
}
```

#### 多对多

```java
@ManyToMany(fetch = FetchType.LAZY)   //多对多场景
@JoinTable(name = "teach_relation",     //多对多中间关联表
        joinColumns = @JoinColumn(name = "cid"),    //当前实体主键在关联表中的字段名称
        inverseJoinColumns = @JoinColumn(name = "tid")   //教师实体主键在关联表中的字段名称
)
List<Teacher> teacher;
```

### JPQL自定义SQL语句

```java
@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {

    @Transactional    //DML操作需要事务环境，可以不在这里声明，但是调用时一定要处于事务环境下
    @Modifying     //表示这是一个DML操作
    @Query("update Account set password = ?2 where id = ?1") //这里操作的是一个实体类对应的表，参数使用?代表，后面接第n个参数
    int updatePasswordById(int id, String newPassword);
}
```

或者

```java
@Transactional
@Modifying
@Query(value = "update users set password = :pwd where username = :name", nativeQuery = true) //使用原生SQL，和Mybatis一样，这里使用 :名称 表示参数，当然也可以继续用上面那种方式。
int updatePasswordByUsername(@Param("name") String username,   //我们可以使用@Param指定名称
                             @Param("pwd") String newPassword);
```

## MybatisPlus框架

所需依赖
```xml
<dependency>  
    <groupId>com.baomidou</groupId>  
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>  
    <version>3.5.10.1</version>  
</dependency>  
<dependency>  
    <groupId>com.mysql</groupId>  
    <artifactId>mysql-connector-j</artifactId>  
    <version>9.1.0</version>  
</dependency>
<dependency>  
    <groupId>com.baomidou</groupId>  
    <artifactId>mybatis-plus-extension</artifactId>  
    <version>3.5.5</version>  
</dependency>
```

数据源
```yml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/test
    username: root
    password: Abc123
    driver-class-name: com.mysql.cj.jdbc.Driver
```

开启日志打印
```yml
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```
### 快速上手

实体类，可以直接映射到数据库中的表
```java
@Data
@TableName("user")  //对应的表名
public class User {
    @TableId(type = IdType.AUTO)   //对应的主键
    int id;
    @TableField("name")   //对应的字段
    String name;
    @TableField("email")
    String email;
    @TableField("password")
    String password;
}
```

跟 mybatis 一样，需要一个 mapper
```java
@Mapper
public interface UserMapper extends BaseMapper<User> {
  	//使用方式与JPA极其相似，同样是继承一个基础的模版Mapper
  	//这个模版里面提供了预设的大量方法直接使用，跟JPA如出一辙
}
```

```java
@SpringBootTest
class DemoApplicationTests {

    @Resource
    UserMapper mapper;

    @Test
    void contextLoads() {
        System.out.println(mapper.selectById(1));  //同样可以直接selectById，非常快速方便
    }
}
```


### 条件构造器

```java
@Test
void contextLoads() {
    QueryWrapper<User> wrapper = new QueryWrapper<>();    //复杂查询可以使用QueryWrapper来完成
  	wrapper
            .select("id", "name", "email", "password")    //可以自定义选择哪些字段
            .ge("id", 2)     			//选择判断id大于等于1的所有数据
            .orderByDesc("id");   //根据id字段进行降序排序
    System.out.println(mapper.selectList(wrapper));   //Mapper同样支持使用QueryWrapper进行查询
}
```
等同于
```mysql
select id,name,email,password from user where id >= 2 order by id desc
```


支持批处理操作，我们可以一次性删除多个指定ID的用户：
```java
    @Test
    void contextLoads() {
        mapper.deleteByIds(List.of(1, 3));
    }
```

更新：
```java
@Test
void contextLoads() {
    UpdateWrapper<User> wrapper = new UpdateWrapper<>();
    wrapper
            .set("name", "lbw")
            .eq("id", 1);
    System.out.println(mapper.update(null, wrapper));
}
```
#### 分页查询

先配置
```java
@Configuration
public class MybatisConfiguration {
    @Bean
    public MybatisPlusInterceptor paginationInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
      	//添加分页拦截器到MybatisPlusInterceptor中
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return interceptor;
    }
}
```

使用
```java
@Test
void contextLoads() {
    //这里我们将用户表分2页，并获取第一页的数据
    Page<User> page = mapper.selectPage(Page.of(1, 2), Wrappers.emptyWrapper());
    System.out.println(page.getRecords());   //获取分页之后的数据
}
```

#### Lambda表达式

```java
@Test
void contextLoads() {
        LambdaQueryWrapper<User> wrapper = Wrappers
                .<User>lambdaQuery()
                .eq(User::getId, 2)   //比如我们需要选择id为2的用户，前面传入方法引用，后面比的值
                .select(User::getName, User::getId);   //比如我们只需要选择name和id，那就传入对应的get方法引用
        System.out.println(mapper.selectOne(wrapper));
}
```

### 代码生成器

依赖
```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.3.1</version>
</dependency>
<dependency>
    <groupId>org.apache.velocity</groupId>
    <artifactId>velocity-engine-core</artifactId>
    <version>2.3</version>
</dependency>
<dependency>  
    <groupId>org.springframework.boot</groupId>  
    <artifactId>spring-boot-starter-web</artifactId>  
</dependency>
```

```java
package com.example;

import com.baomidou.mybatisplus.generator.FastAutoGenerator;
import com.baomidou.mybatisplus.generator.config.DataSourceConfig;
import jakarta.annotation.Resource;
import org.apache.ibatis.annotations.Mapper;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;

@SpringBootTest
class Demo4ApplicationTests {

    @Resource
    DataSource DataSource;

    @Test
    void contextLoads() {
        FastAutoGenerator
                .create(new DataSourceConfig.Builder(DataSource))
                .globalConfig(builder -> {
                    builder.author("hs");
                    builder.commentDate("2024-01-01");
                    builder.outputDir("src/main/java");
                })
                .packageConfig(builder -> builder.parent("com.example"))
                .strategyConfig(builder -> {
                    builder
                            .mapperBuilder()
                            .mapperAnnotation(Mapper.class)
                            .build();
                })
                .execute();
    }
}

```

# 前后端分离

## 基于 session 的分离

前后端分离，需要前端与后端各占一个服务器

### 环境搭建

- **创建前端文件**

勾选上spring web
![](p9.png)

在resources里创建一个web目录，把所有web相关的文件塞进去，然后修改配置文件
```yml
spring:
  web:
    resources:
      static-locations: classpath:/web
```

- **创建后端文件**

把右下角看到的依赖都勾选上
![](p10.png)

后端文件的resources中只需要保留一个配置文件即可，因为前端已经占用了8080端口，我们这里需要改成其他端口

```yml
server:  
  port: 8081  
spring:  
  datasource:  
    url: jdbc:mysql://localhost:3306/test  
    username: root  
    password: Abc123  
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 实现登录授权和跨域处理

还是跟之前security一样
```java
@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(conf -> {
                    conf.anyRequest().authenticated();
                })
                .formLogin(conf -> {
                  	//一般分离之后，为了统一规范接口，使用 /api/模块/功能 的形式命名接口
                    conf.loginProcessingUrl("/api/auth/login");
                    conf.permitAll();
                })
                .csrf(AbstractHttpConfigurer::disable)
                .build();
    }
}
```

手动设置SuccessHandler和FailureHandler来实现让SpringSecurity在登录成功之后返回一个JSON数据给前端而不是默认的重定向：
```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
	return http
			...
			.formLogin(conf -> {
				conf.loginProcessingUrl("/api/auth/login");
				//使用自定义的成功失败处理器
				conf.failureHandler(this::onAuthenticationFailure);
				conf.successHandler(this::onAuthenticationSuccess);
				conf.permitAll();
			})
			...
}

	//自定义成功失败处理器
void onAuthenticationFailure(HttpServletRequest request,
							 HttpServletResponse response,
							 AuthenticationException exception) {

}

void onAuthenticationSuccess(HttpServletRequest request, 
							 HttpServletResponse response, 
							 Authentication authentication) {
	
}
```

REST应答一般使用的格式为JSON，这里我们创建一个实体类来装载响应数据，两种写法：
- 1、基本写法：
```java
@Data
public class RestBean<T> {
    int code;
    T data;
    String message;

    private RestBean(int code, T data, String message) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    public static <T> RestBean<T> success(T data) {
        return new RestBean<>(200, data, "success");
    }

    public static <T> RestBean<T> failure(int code, String message) {
        return new RestBean<>(code, null, message);
    }

    public String asJsonString() {
        return JSONObject
                .from(this, JSONWriter.Feature.WriteNulls)
                .toString();
    }
}
```
或者
- 2、JDK的新特性：
```java
public record RestBean<T> (int code, T data, String message) {
		//写几个工具方法，用于快速创建RestBean对象
    public static <T> RestBean<T> success(T data){
        return new RestBean<>(200, data, "请求成功");
    }

    public static <T> RestBean<T> failure(int code, String message){
        return new RestBean<>(code, null, message);
    }

    public static <T> RestBean<T> failure(int code){
        return failure(code, "请求失败");
    }
		//将当前对象转换为JSON格式的字符串用于返回
    public String asJsonString() {
        return JSONObject.toJSONString(this, JSONWriter.Feature.WriteNulls);
    }
}
```

把handler补充完
```java
void onAuthenticationFailure(HttpServletRequest request,
                                 HttpServletResponse response,
                                 AuthenticationException exception) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.write(RestBean.failure(401, exception.getMessage()).asJsonString());
    }

    void onAuthenticationSuccess(HttpServletRequest request,
                                 HttpServletResponse response,
                                 Authentication authentication) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.write(RestBean.success(authentication.getName()).asJsonString());
    }
```

我们在发起登录请求时，前端得到了一个跨域请求错误，这是因为我们前端的站点和后端站点不一致导致的，我们只需要告诉浏览器那些站点发出的请求是安全的即可
```java
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                ...
                .cors(conf -> {
                    CorsConfiguration cors = new CorsConfiguration();
                  	//添加前端站点地址，这样就可以告诉浏览器信任了
                  	cors.addAllowedOrigin("http://localhost:8080");
                    //虽然也可以像这样允许所有 cors.addAllowedOriginPattern("*");
                  	//但是这样并不安全，我们应该只许可给我们信任的站点
                    cors.setAllowCredentials(true);  //允许跨域请求中携带Cookie
                    cors.addAllowedHeader("*");   //其他的也可以配置，为了方便这里就 * 了
                    cors.addAllowedMethod("*");
                    cors.addExposedHeader("*");
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", cors);  //直接针对于所有地址生效
                    conf.configurationSource(source);
                })
                ...
                .build();
    }
```

`SecurityConfiguration` 最终代码
```java
package com.example.config;

import com.example.entity.RestBean;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.io.PrintWriter;

@Configuration
public class SecurityConfiguration {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .authorizeHttpRequests(conf -> {
                    conf.anyRequest().authenticated();
                })
                .formLogin(conf -> {
                    //一般分离之后，为了统一规范接口，使用 /api/模块/功能 的形式命名接口
                    conf.loginProcessingUrl("/api/auth/login");
                    conf.successHandler(this::onAuthenticationSuccess);
                    conf.failureHandler(this::onAuthenticationFailure);
                    conf.permitAll();
                })
                .csrf(AbstractHttpConfigurer::disable)
                .cors(conf -> {
                    CorsConfiguration cors = new CorsConfiguration();
                    //添加前端站点地址，这样就可以告诉浏览器信任了
                    cors.addAllowedOrigin("http://localhost:8080");
                    //虽然也可以像这样允许所有 cors.addAllowedOriginPattern("*");
                    //但是这样并不安全，我们应该只许可给我们信任的站点
                    cors.setAllowCredentials(true);  //允许跨域请求中携带Cookie
                    cors.addAllowedHeader("*");   //其他的也可以配置，为了方便这里就 * 了
                    cors.addAllowedMethod("*");
                    cors.addExposedHeader("*");
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                    source.registerCorsConfiguration("/**", cors);  //直接针对于所有地址生效
                    conf.configurationSource(source);
                })
                .build();
    }
    //自定义成功失败处理器
    void onAuthenticationFailure(HttpServletRequest request,
                                 HttpServletResponse response,
                                 AuthenticationException exception) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.write(RestBean.failure(401, exception.getMessage()).asJsonString());
    }

    void onAuthenticationSuccess(HttpServletRequest request,
                                 HttpServletResponse response,
                                 Authentication authentication) throws IOException {
        response.setContentType("application/json;charset=utf-8");
        PrintWriter writer = response.getWriter();
        writer.write(RestBean.success(authentication.getName()).asJsonString());
    }
}
```

实体类最终代码
```java
package com.example.entity;

import com.alibaba.fastjson2.JSONObject;
import com.alibaba.fastjson2.JSONWriter;

public record RestBean<T> (int code, T data, String message) {
    //写几个工具方法，用于快速创建RestBean对象
    public static <T> RestBean<T> success(T data){
        return new RestBean<>(200, data, "请求成功");
    }

    public static <T> RestBean<T> failure(int code, String message){
        return new RestBean<>(code, null, message);
    }

    public static <T> RestBean<T> failure(int code){
        return failure(code, "请求失败");
    }
    //将当前对象转换为JSON格式的字符串用于返回
    public String asJsonString() {
        return JSONObject.toJSONString(this, JSONWriter.Feature.WriteNulls);
    }
}
```


## JWT

一个JWT令牌由3部分组成:标头(Header)、有效载荷(Payload)和签名(Signature)。

依赖：
```xml
<dependency>
     <groupId>com.auth0</groupId>
     <artifactId>java-jwt</artifactId>
     <version>4.3.0</version>
</dependency>
```

### 快速体验

生成一个JWT令牌
```java
public class Main {
    public static void main(String[] args) {
        String jwtKey = "abcdefghijklmn";                 //使用一个JWT秘钥进行加密
        Algorithm algorithm = Algorithm.HMAC256(jwtKey);  //创建HMAC256加密算法对象
        String jwtToken = JWT.create()
                .withClaim("id", 1)   //向令牌中塞入自定义的数据
                .withClaim("name", "lbw")
                .withClaim("role", "nb")
                .withExpiresAt(new Date(2024, Calendar.FEBRUARY, 1))  //JWT令牌的失效时间
                .withIssuedAt(new Date())   //JWT令牌的签发时间
                .sign(algorithm);    //使用上面的加密算法进行加密，完成签名
        System.out.println(jwtToken);   //得到最终的JWT令牌
    }
}
```

得到的令牌为：
```
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibmIiLCJuYW1lIjoibGJ3IiwiaWQiOjEsImV4cCI6NjE2NjQ4NjA4MDAsImlhdCI6MTc0MDA2OTA0N30.1IJCxw3HUmOy2qbEw--6Qnz5fub6dbnIv-u2GmZQam0
```

还原代码：
```java
public static void main(String[] args) {
        String jwtToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoibmIiLCJuYW1lIjoibGJ3IiwiaWQiOjEsImV4cCI6NjE2NjQ4NjA4MDAsImlhdCI6MTY5MDEzMTQ3OH0.KUuGKM0OynL_DEUnRIETDBlmGjoqbt_5dP2r21ZDE1s";
        String[] split = jwtToken.split("\\.");
        for (int i = 0; i < split.length - 1; i++) {
            String s = split[i];
            byte[] decode = Base64.getDecoder().decode(s);
            System.out.println(new String(decode));
        }
}
```

解码后：
```
{"typ":"JWT","alg":"HS256"}
{"role":"nb","name":"lbw","id":1,"exp":61664860800,"iat":1740069366}
```

### SpringSecurity 实现 JWT 校验

首先先创建处理JWT令牌的工具类
```java
public class JwtUtils {
  	//Jwt秘钥
    private static final String key = "abcdefghijklmn";

  	//根据用户信息创建Jwt令牌
    public static String createJwt(UserDetails user){
        Algorithm algorithm = Algorithm.HMAC256(key);
        Calendar calendar = Calendar.getInstance();
        Date now = calendar.getTime();
        calendar.add(Calendar.SECOND, 3600 * 24 * 7);
        return JWT.create()
                .withClaim("name", user.getUsername())  //配置JWT自定义信息
                .withClaim("authorities", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList())
                .withExpiresAt(calendar.getTime())  //设置过期时间
                .withIssuedAt(now)    //设置创建创建时间
                .sign(algorithm);   //最终签名
    }

  	//根据Jwt验证并解析用户信息
    public static UserDetails resolveJwt(String token){
        Algorithm algorithm = Algorithm.HMAC256(key);
        JWTVerifier jwtVerifier = JWT.require(algorithm).build();
        try {
            DecodedJWT verify = jwtVerifier.verify(token);  //对JWT令牌进行验证，看看是否被修改
            Map<String, Claim> claims = verify.getClaims();  //获取令牌中内容
            if(new Date().after(claims.get("exp").asDate())) //如果是过期令牌则返回null
                return null;
            else
              	//重新组装为UserDetails对象，包括用户名、授权信息等
                return User
                        .withUsername(claims.get("name").asString())
                        .password("")
                        .authorities(claims.get("authorities").asArray(String.class))
                        .build();
        } catch (JWTVerificationException e) {
            return null;
        }
    }
}
```

然后再编写 JwtAuthenticationFilter
```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {  
//继承OncePerRequestFilter表示每次请求过滤一次，用于快速编写JWT校验规则

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
      	//首先从Header中取出JWT
        String authorization = request.getHeader("Authorization");
      	//判断是否包含JWT且格式正确
        if (authorization != null && authorization.startsWith("Bearer ")) {
            String token = authorization.substring(7);	
          	//开始解析成UserDetails对象，如果得到的是null说明解析失败，JWT有问题
            UserDetails user = JwtUtils.resolveJwt(token);
            if(user != null) {
              	//验证没有问题，那么就可以开始创建Authentication了，这里我们跟默认情况保持一致
              	//使用UsernamePasswordAuthenticationToken作为实体，填写相关用户信息进去
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
              	//然后直接把配置好的Authentication塞给SecurityContext表示已经完成验证
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
      	//最后放行，继续下一个过滤器
      	//可能各位小伙伴会好奇，要是没验证成功不是应该拦截吗？这个其实没有关系的
      	//因为如果没有验证失败上面是不会给SecurityContext设置Authentication的，后面直接就被拦截掉了
      	//而且有可能用户发起的是用户名密码登录请求，这种情况也要放行的，不然怎么登录，所以说直接放行就好
        filterChain.doFilter(request, response);
    }
}
```

最后再修改 `SecurityConfiguration`
```java
package com.example.config;  
  
import com.example.entity.RestBean;  
import com.example.filter.JwtAuthenticationFilter;  
import com.example.util.JwtUtils;  
import jakarta.servlet.http.HttpServletRequest;  
import jakarta.servlet.http.HttpServletResponse;  
import org.springframework.context.annotation.Bean;  
import org.springframework.context.annotation.Configuration;  
import org.springframework.security.access.AccessDeniedException;  
import org.springframework.security.config.annotation.web.builders.HttpSecurity;  
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;  
import org.springframework.security.config.http.SessionCreationPolicy;  
import org.springframework.security.core.Authentication;  
import org.springframework.security.core.AuthenticationException;  
import org.springframework.security.core.userdetails.User;  
import org.springframework.security.web.SecurityFilterChain;  
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;  
import org.springframework.web.cors.CorsConfiguration;  
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;  
  
import java.io.IOException;  
import java.io.PrintWriter;  
  
@Configuration  
public class SecurityConfiguration {  
  
    @Bean  
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {  
        return http  
                .authorizeHttpRequests(conf -> {  
                    conf.anyRequest().authenticated();  
                })  
                .formLogin(conf -> {  
                    //一般分离之后，为了统一规范接口，使用 /api/模块/功能 的形式命名接口  
                    conf.loginProcessingUrl("/api/auth/login");  
                    conf.successHandler(this::handleProcess);  
                    conf.failureHandler(this::handleProcess);  
                    conf.permitAll();  
                })  
                .csrf(AbstractHttpConfigurer::disable)  
                .cors(conf -> {  
                    CorsConfiguration cors = new CorsConfiguration();  
                    //添加前端站点地址，这样就可以告诉浏览器信任了  
                    cors.addAllowedOrigin("http://localhost:8080");  
                    //虽然也可以像这样允许所有 cors.addAllowedOriginPattern("*");                    //但是这样并不安全，我们应该只许可给我们信任的站点  
                    cors.setAllowCredentials(true);  //允许跨域请求中携带Cookie  
                    cors.addAllowedHeader("*");   //其他的也可以配置，为了方便这里就 * 了  
                    cors.addAllowedMethod("*");  
                    cors.addExposedHeader("*");  
                    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();  
                    source.registerCorsConfiguration("/**", cors);  //直接针对于所有地址生效  
                    conf.configurationSource(source);  
                })  
                .exceptionHandling(conf -> {  
                    //配置授权相关异常处理器  
                    conf.accessDeniedHandler(this::handleProcess);  
                    //配置验证相关异常的处理器  
                    conf.authenticationEntryPoint(this::onAuthenticationFailure);  
                })  
                .sessionManagement(conf -> conf.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  
                .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)  
                .build();  
    }  
    //自定义成功失败处理器  
    void onAuthenticationFailure(HttpServletRequest request,  
                                 HttpServletResponse response,  
                                 AuthenticationException exception) throws IOException {  
        response.setContentType("application/json;charset=utf-8");  
        PrintWriter writer = response.getWriter();  
        writer.write(RestBean.failure(401, exception.getMessage()).asJsonString());  
    }  
  
    void onAuthenticationSuccess(HttpServletRequest request,  
                                 HttpServletResponse response,  
                                 Authentication authentication) throws IOException {  
        response.setContentType("application/json;charset=utf-8");  
        PrintWriter writer = response.getWriter();  
        writer.write(RestBean.success(authentication.getName()).asJsonString());  
    }  
  
    private void handleProcess(HttpServletRequest request,  
                               HttpServletResponse response,  
                               Object exceptionOrAuthentication) throws IOException {  
        response.setContentType("application/json;charset=utf-8");  
        PrintWriter writer = response.getWriter();  
        if(exceptionOrAuthentication instanceof AccessDeniedException exception) {  
            writer.write(RestBean.failure(403, exception.getMessage()).asJsonString());  
        } else if(exceptionOrAuthentication instanceof Exception exception) {  
            writer.write(RestBean.failure(401, exception.getMessage()).asJsonString());  
        }else if(exceptionOrAuthentication instanceof Authentication authentication){  
            //不过这里需要注意，在登录成功的时候需要返回我们生成的JWT令牌，这样客户端下次访问就可以携带这个令牌了，令牌过期之后就需要重新登录才可以  
            writer.write(RestBean.success(JwtUtils.createJwt((User) authentication.getPrincipal())).asJsonString());  
        }  
    }  
}
```












