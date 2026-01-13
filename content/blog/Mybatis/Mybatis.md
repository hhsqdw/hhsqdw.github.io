---
title: Mybatis学习记录
date: 2024-09-20
tags:
---
# Mybatis
## 简介
Mybatis是一个持久层的框架，支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。可以使用XML或注解来配置和映射原始类型、接口和Java对象作为数据库中的记录。

## 下载
帮助文档
```
https://mybatis.org/mybatis-3/zh_CN/index.html
```
1、maven仓库
```
<!-- https://mvnrepository.com/artifact/org.mybatis/mybatis -->
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.16</version>
</dependency>
```
2、GitHub
```
https://github.com/mybatis/mybatis-3/releases
```

## 搭建环境
搭建好一个环境特别麻烦，做错一步就搭建失败报错
跟着官方文档一步步来：https://mybatis.org/mybatis-3/zh_CN/getting-started.html
### 1、搭建数据库
```MySQL
create database mybatis_lean;

use mybatis_lean;

create table user(
    id int not null primary key,
    name varchar(20) default null,
    pwd varchar(20) default null
)engine=INNODB default charset=utf8;

insert into user values(1,'zhangsan','123456'),(2,'lisi','123456'),(3,'wangwu','123456');
```
### 2、新建一个maven项目
![这是图片](imag\p1.png "Magic Gardens")
#### 导入依赖
在`pom.xml`文件中导入所需要的依赖以及配置resource来防止资源导出失败
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.example</groupId>
    <artifactId>MybatisStudy</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>pom</packaging>
    <modules>
        <module>mybatisStudy-01</module>
    </modules>

    <!--    导入依赖-->
    <dependencies>
<!--        mysql-->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>5.1.47</version>
        </dependency>

<!--        mybatis-->
        <dependency>
            <groupId>org.mybatis</groupId>
            <artifactId>mybatis</artifactId>
            <version>3.5.2</version>
        </dependency>

<!--        junit-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
    </dependencies>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <build>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
            </resource>

            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
            </resource>
        </resources>
    </build>
</project>
```
注意，在`.xml`文件中尽量不要使用中文注释
### 3、在原项目下新建一个maven项目
父级项目下创建一个子项目，子项目的`.xml`就不需要再配置了，方便我们以后使用
#### 创建resource下的文件
在子项目下的resource文件下创建一个`mybatis-config.xml`文件(叫什么无所谓，但但是尽量统一方便查看)
配置文件：
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "https://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver" value="${driver}"/>
        <property name="url" value="${url}"/>
        <property name="username" value="${username}"/>
        <property name="password" value="${password}"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <mapper resource="org/mybatis/example/BlogMapper.xml"/>
  </mappers>
</configuration>
```
把上面的 `${driver}、${url}、${username}、${password}` 都做修改
```
driver配置驱动，一般为：com.mysql.jdbc.Driver
url数据库的url，在idea里面打开已经配置好的数据库查看
username：数据库的用户名
password：数据库的密码
```
#### 新建一个包
新建三个包，包名分别为dao、utils、pojo
##### utils包
```
https://mybatis.org/mybatis-3/zh_CN/getting-started.html
原文档的话：
每个基于 MyBatis 的应用都是以一个 SqlSessionFactory 的实例为核心的。
SqlSessionFactory 的实例可以通过 SqlSessionFactoryBuilder 获得。
而 SqlSessionFactoryBuilder 则可以从 XML 配置文件或一个预先配置的 Configuration
实例来构建出 SqlSessionFactory 实例。
```
在包内新建一个名为 `MybatisUtils` 的java类，用来获取SqlSessionFactory
```java
package org.example.utils;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.IOException;
import java.io.InputStream;

public class MybatisUtils {
    private static SqlSessionFactory sqlSessionFactory;
        //获取sqlSessionFactory对象
    static {
        try {
            // 没有解析，背就行了
            // 死代码
            String resource = "mybatis-config.xml";
            InputStream inputStream = Resources.getResourceAsStream(resource);
            sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
    // 获取SqlSession
    public static SqlSession getSqlSession() {
        return sqlSessionFactory.openSession();
    }
}
```
##### pojo包
编写一个实体类的对象user
```java
package org.example.pojo;

public class User {
    private int id;
    private String name;
    private String pwd;

    public User() {
    }

    public User(int id, String name, String pwd) {
        this.id = id;
        this.name = name;
        this.pwd = pwd;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", pwd='" + pwd + '\'' +
                '}';
    }
}
```
##### dao包
在dao包下新建一个接口UserDao
```java
package org.example.Dao;

import org.example.pojo.User;

import java.util.List;

public interface UserDao {
    List<User> getUserList();
}
```
在dao包下新建一个`UserMapper.xml`
配置User的Mapper
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.example.Dao.UserDao">
    <select id="getUserList" resultType="org.example.pojo.User">
        select * from mybatis_lean.user
    </select>
</mapper>
```

## 运行
搭建完以上步骤后，在test文件夹下新建一个 `UserDaoTest` Java类文件
```java
package org.example.dao;

import org.apache.ibatis.session.SqlSession;
import org.example.Dao.UserDao;
import org.example.pojo.User;
import org.example.utils.MybatisUtils;
import org.junit.Test;

import java.util.List;

public class UserDaoTest {

    @Test
    public void test() {

        // 获得sqlSession对象
        SqlSession sqlSession = MybatisUtils.getSqlSession();
        UserDao mapper = sqlSession.getMapper(UserDao.class);
        List<User> userList = mapper.getUserList();

        for (User user : userList) {
            System.out.println(user);
        }
        sqlSession.close();
    }
}
```
运行结果：
![这是图片](imag\p2.png "Magic Gardens")
target文件夹是用来存放项目构建后的文件和目录、jar包、war包、编译的class文件，都是maven构建时生成的。
运行成功后查看左边的target文件下的`classes`文件夹，里面的内容与你项目的内容一致

## 增删改查
添加增删改查就在我们搭建的环境基础下改几个地方就行

首先来看Dao下的配置文件`UserMapper.xml`
```
在mapper标签里面有这么几个参数:
    namespace：指的是方法所在的接口包名
    id：所调用的方法名
    resultType：方法返回的类型
    parameterType：方法参数的类型
```
![这是图片](imag\p3.png "Magic Gardens")
用select标签标起来的就是我们所需要的sql命令
添加新的sql命令时，我们先需要在`UserDao`接口上新增方法，然后在配置文件里面的mapper标签里使用select标签，id换成新的方法名，resultType换成返回的参数，parameterType设置成方法参数的类型
如果没有参数和返回值resultType和parameterType可以不写
### 样例：查
首先在接口文件上填上方法
```java
User getUserById(int id);
```
然后新增配置文件
xml可以识别数据库里面的字段名，如果有参数我们使用`#{字段名}`
```xml
<select id="getUserById" parameterType="int" resultType="org.example.pojo.User">
        select * from mybatis_lean.user where id = #{id}
    </select>
```
最后就可以在Test测试了，步骤和之前一样
先用`MybatisUtils.getSqlSession`获取SqlSession，然后在获得接口`getMapper`，在mapper里面调用方法即可
```java
public void updateUser(){
        SqlSession sqlSession = MybatisUtils.getSqlSession();

        UserDao mapper = sqlSession.getMapper(UserDao.class);
        mapper.updateUser(new User(3, "tom", "123123"));

        sqlSession.commit();
        sqlSession.close();
    }
```

### 增删改查代码
查：getUserById
增：insertUser
删：deleteUser
改：updateUser
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="org.example.Dao.UserDao">
    <select id="getUserList" resultType="org.example.pojo.User">
        select * from mybatis_lean.user
    </select>

    <select id="getUserById" parameterType="int" resultType="org.example.pojo.User">
        select * from mybatis_lean.user where id = #{id}
    </select>

    <select id="insertUser" parameterType="org.example.pojo.User">
        insert into mybatis_lean.user values (#{id}, #{name}, #{pwd})
    </select>

    <select id="deleteUser" parameterType="int">
        delete from mybatis_lean.user where id = #{id}
    </select>

    <select id="updateUser" parameterType="org.example.pojo.User">
        update mybatis_lean.user set name = #{name}, pwd = #{pwd} where id = #{id}
    </select>
</mapper>
```
注意：配置文件里面不要用中文

接口文件：
```java
package org.example.Dao;

import org.example.pojo.User;

import java.util.List;

public interface UserDao {
    List<User> getUserList();
    User getUserById(int id);
    void insertUser(User user);

    void deleteUser(int id);

    void updateUser(User user);
}
```

## 模糊匹配
我们使用数据库大多数指令都是查询，但有时候我们会忘记我们查询目标的全称，这时候我们就可以使用模糊比配
首先，模糊匹配有两种常用的通配符"`%`"和"`_`"
```
"%" 百分号通配符: 表示任何字符出现0次或者多次
例如：%李%        # 查找带有"李"的字符串，无论"李"出现在字符串的哪里
"_" 下划线通配符:表示只能匹配单个字符。当然，也可以使用多个"_"
例如：李__        # 查找开头是"李"，长度为3的字符串
```
使用关键字`like`即为模糊匹配
```java
User getUserLikeName(String value);
```
```xml
<select id="getUserLikeName" parameterType="String" resultType="org.example.pojo.User">
        select * from mybatis_lean.user where name like "%"#{value}"%"
</select>
```
使用模糊匹配时要注意防范[SQL注入](https://blog.csdn.net/weixin_45840241/article/details/139106947)

## 配置解析
### 核心配置文件
一般用到mybatis的配置文件官方都建议命名为`mybatis-config.xml`，当然也可以不接受这个建议

配置文件里面有一下几个组成部分
```
configuration（配置）
properties（属性）
settings（设置）
typeAliases（类型别名）
typeHandlers（类型处理器）
objectFactory（对象工厂）
plugins（插件）
environments（环境配置）
environment（环境变量）
transactionManager（事务管理器）
dataSource（数据源）
databaseIdProvider（数据库厂商标识）
mappers（映射器）
```
先后顺序是：
properties，settings，typeAliases，typeHandlers，objectfactory，objectwrapperfactory，
reflectorFactory，plugins，environments，databaseldProvider，mappers
#### 事务管理器 transactionManager
在 MyBatis 中有两种类型的事务管理器：JDBC 和 MANAGED(基本不用)
Mybatis 默认的事务管理器是 JDBC

JDBC – 这个配置直接使用了 JDBC 的提交和回滚功能，它依赖从数据源获得的连接来管理事务作用域。默认情况下，为了与某些驱动程序兼容，它在关闭连接时启用自动提交

MANAGED - 等价于 EJB (Enterprise Java Beans)， 这个配置几乎没做什么。它从不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如 JEE 应用服务器的上下文）

#### 数据源 dataSource
dataSource 元素使用标准的 JDBC 数据源接口来配置 JDBC 连接对象的资源。
有三种内建的数据源类型：UNPOOLED、POOLED 和 JNDI
Mybatis默认数据源是POOLED

POOLED 可以理解成数据池，可以理解成 new 了一块空间出来，用完可以回收，即使数据传输完毕，这块空间也不会解散，只有等到代码跑完了才会自动解散。
JNDI – 这个数据源实现是为了能在如 EJB 或应用服务器这类容器中使用

#### 属性
我们可以通过 `properties` 属性来实现引用配置文件
这些属性可以在外部进行配置，并可以进行动态替换。你既可以在典型的 Java 属性文件中配置这些属性，也可以在 properties 元素的子元素中设置。

我们在 `resource` 文件夹下新建一个 `dp.properties` 文件，里面写入替换的值
例如：
```properties
driver=com.mysql.jdbc.Driver
url=jdbc:mysql://localhost:3306/mybatis_lean?allowPublicKeyRetrieval=true&useSSL=false&useUnicode=true&characteEncoding=UTF8
username=root
password=123456
```
然后回到 `mybatis-config.xml` 文件，编写 properties 标签
```xml
<properties resource="dp.properties"/>
```
然后修改 environment 
```xml
<environments default="development">
        <environment id="development">
            <transactionManager type="JDBC"/>
            <dataSource type="POOLED">
                <property name="driver" value="${driver}"/>
                <property name="url" value="${url}"/>
                <property name="username" value="${username}"/>
                <property name="password" value="${password}"/>
            </dataSource>
        </environment>
    </environments>
```
注意：properties 标签必须在 configuration 里的最上面，先解释 properties 标签

当然，我们也可以在 mybatis-config.xml 里面改变值，但如果内部文件和外部文件都有动态配置的属性值，先运行内部的，后运行的外部会覆盖内部
```xml
<properties resource="dp.properties">
    <property name="username" value="root"/>
    <property name="password" value="123456"/>
</properties>
```

#### 类型别名 typeAliases
类型别名可为 Java 类型设置一个缩写名字。它仅用于 XML 配置，意在降低冗余的全限定类名书写。
在 configuration 的书写顺序为第三位
例如：
```
<typeAliases>
        <typeAlias alias="User" type="org.example.pojo.User"/>
</typeAliases>
上面这种配置可以让 org.example.pojo.User 替换成 User

也可以指定一个包名，MyBatis 会在包名下面搜索需要的 Java Bean
<typeAliases>
        <package name="org.example.pojo"/>
</typeAliases>
如果我们指定的包名 org.example.pojo 中的 JavaBean 没有注释，会使用类名的首字母小写作
为别名
我们也可以作注释
@Alias("hhhh")
public class User {
    ...
}
如上， hhhh 则作为此 JavaBean的类型别名
```

#### 映射器 mappers
```
方式一：
<mappers>
    <mapper resource="org/example/Dao/UserMapper.xml"/
</mappers>
方式二：
<mappers>
    <mapper class="org.example.Dao.UserMapper"/>
</mappers>
方式三：
<mappers>
    <package name="org.example.Dao"/>
</mappers>
```

### 作用域和生命周期
![这是图片](imag\p4.png "Magic Gardens")
SqlSessionFactoryBuilder
SqlSessionFactory 创建完 SqlSessionFactory 就不再需要它了。 因此最佳作用域是方法作用域（也就是局部方法变量）。 你可以重用 SqlSessionFactoryBuilder 来创建多个 SqlSessionFactory 实例，但最好不要一直保留着它，以保证所有的 XML 解析资源可以被释放给更重要的事情。

SqlSessionFactory
SqlSessionFactory 一旦被创建就应该在应用的运行期间一直存在，没有任何理由丢弃它或重新创建另一个实例。因此 SqlSessionFactory 的最佳作用域是应用作用域。可以把 SqlSessionFactory 看作一个资源池，一直都存在，只需要创建 SqlSession 和回收 SqlSession。

SqlSession
SqlSession 的实例不是线程安全的，因此是不能被共享的，所以它的最佳的作用域是请求或方法作用域。绝对不能将 SqlSession 实例的引用放在一个类的静态域，甚至一个类的实例变量也不行。可以看作资源池里面的资源，每次用完都要被回收，以便于下次使用。

### 结果映射 resultMap
resultMap 元素是 MyBatis 中最重要最强大的元素。它可以让你从 90% 的 JDBC ResultSets 数据提取代码中解放出来，并在一些情形下允许你进行一些 JDBC 不支持的操作

让我们想象一个场景，多个人做一个项目，当做 JavaBean 的人与做数据库的不是同一个人，在起名上有一定的不同，我们无法做到将 JavaBean 或者数据库的字段名修改，这时我们就可以使用 resultMap

例如，我们数据库上有三个字段："id","name","pwd"；JavaBean 中有三个参数："id","name","password"，这时我们就不能用上面的 `resultType`
我们在 mapper 标签里面加上：
```
<resultMap id="UserMap" type="org.example.pojo.User2">
    <result property="id" column="id"/>
    <result property="name" column="name"/>
    <result property="password" column="pwd"/>
</resultMap>
```
`column` 是数据库里面的字段名，`property` 是 JavaBean 里面的参数名，如果参数名和字段名相同时可以省略不写
然后把 resultType 修改成 resultMap
```
<select id="getUserById" parameterType="int" resultMap="UserMap">
    select * from mybatis_lean.user where id = #{id}
</select>
```

## 日志
### 日志工厂
日志在我们平时运维或者查找报错中非常实用，我们只需要在日志中查看是哪部分出问题

在官方文档中，我们可以查看到如何开启日志，以及日志的种类
![这是图片](imag\p5.png "Magic Gardens")
SLF4J
LOG4J（3.5.9 起废弃）
LOG4J2
JDK_LOGGING
COMMONS_LOGGING
STDOUT_LOGGING
NO_LOGGING

### STDOUT_LOGGING
STDOUT_LOGGING 是标准日志输出，不需要再注入其他依赖，直接就能跑起来

在 setting 标签里面配置（注意 setting 的位置）
```
<settings>
    <setting name="logImpl" value="STDOUT_LOGGING"/>
</settings>
```
配置好后运行代码
![这是图片](imag\p6.png "Magic Gardens")

### Log4j
Log4j 在2021年12月8号被爆出堪称 __史诗级核弹__ 漏洞，学习 Log4j 的原因很简单，因为使用的人多，例如 Apache Struts2、Apache Solr、Apache Druid、Apache Flink等，都用了 Log4j 或者 Log4j2

Log4j 是 Apache 的一个开源项目，通过使用 Log4j，我们可以控制日志信息输送的目的地是控制台、文件、GUI组件，我们可以控制每条日志的输出格式；只需要通过一个配置文件就可以灵活的配置，而不需要修改任何代码

第一步，先得导入 Log4j 的依赖
https://mvnrepository.com/artifact/log4j/log4j/1.2.17
```properties
<!-- https://mvnrepository.com/artifact/log4j/log4j -->
<dependency>
    <groupId>log4j</groupId>
    <artifactId>log4j</artifactId>
    <version>1.2.17</version>
</dependency>
```

第二步，创建 Log4j 的配置文件
```properties
log4j.rootLogger=DEBUG,console,file

log4j.appender.console = org.apache.log4j.ConsoleAppender
log4j.appender.console.Target = System.out
log4j.appender.console.Threshold=DEBUG
log4j.appender.console.layout = org.apache.log4j.PatternLayout
log4j.appender.console.layout.ConversionPattern=[%c]-%m%n

log4j.appender.file = org.apache.log4j.RollingFileAppender
log4j.appender.file.File=./log/StudyLog4j.log
log4j.appender.file.MaxFileSize=10mb
log4j.appender.file.Threshold=DEBUG
log4j.appender.file.layout=org.apache.log4j.PatternLayout
log4j.appender.file.layout.ConversionPattern=[%p][%d{yy-MM-dd}][%c]%m%n

log4j.logger.org.mybatis=DEBUG
log4j.logger.java.sql=DEBUG
log4j.logger.java.sql.Statement=DEBUG
log4j.logger.java.sql.ResultSet=DEBUG
log4j.logger.java.sql.PreparedStatement=DEBUG
```

第三步，生成 日志对象Logger，参数为当前类的 class 对象
```java
static Logger logger = Logger.getLogger(UserMapperTest.class);
```

第四步，使用 Log4j

三个级别，info、debug 和 error
```java
logger.info("info:测试使用Log4j记录日志");
logger.debug("debug:测试使用Log4j记录日志");
logger.error("error:测试使用Log4j记录日志");
```

结果：
![这是图片](imag\p7.png "Magic Gardens")

## 分页
### limit 实现分页
```
语法：
select * from 表名 limit startIndex,pageSize;
```

与之前的一样，在 UserMapper 接口里面声明新方法
```java
List<User> getUserByLimit(Map<String, Integer> map);
```
然后再 UserMapper.xml 里定义
```xml
<select id="getUserByLimit" parameterType="map" resultType="org.example.pojo.User">
    select * from mybatis_lean.user limit #{startIndex},#{pageSize}
</select>
```

最后就可以测试了
```java
SqlSession sqlSession = MybatisUtils.getSqlSession();
UserMapper mapper = sqlSession.getMapper(UserMapper.class);

HashMap<String, Integer> map = new HashMap<>();
map.put("startIndex", 0);
map.put("pageSize", 2);

List<User> userByLimit = mapper.getUserByLimit(map);

for (User user : userByLimit) {
    System.out.println(user);
}

sqlSession.close();
```

### RowBounds 实现分页
limit 分页是物理分页，Rowbounds 分页是逻辑分页，Rowbounds 因为要把全部数据都跑一遍，效率比较慢，不推荐使用。

Rowbounds 可以通过 java 代码来实现

第一步，在接口里声明
```java
List<User> getUserByRowBounds();
```
第二部，在 xml 文件里定义
```xml
<select id="getUserByRowBounds" resultType="org.example.pojo.User">
    select * from mybatis_lean.user
</select>
```
第三步，使用
```java
@Test
public void getUserByRowBounds(){
    SqlSession sqlSession = MybatisUtils.getSqlSession();

    RowBounds rowBounds = new RowBounds(1, 2);

    List<User> User = sqlSession.selectList("org.example.Dao.UserMapper.getUserByRowBounds",null,rowBounds);
    for (org.example.pojo.User user : User) {
        System.out.println(user);
    }

    sqlSession.close();
}
```
创建一个 RowBounds 对象时，两个参数分别为初始索引和长度

### 插件实现分页
https://pagehelper.github.io/#:~:text=MyBatis%20%E5%88%86%E9%A1%B5
我们可以使用第三方插件进行分页，例如：PageHelper，这里不做过多的介绍，用到再了解。


## 使用注解开发
ok，前面的配置文件编写已经特别熟练了
但是，通通白学，接下来是特别简单，步骤没有这么繁琐的注解开发

我们可以把配置文件删了，只需要一个接口文件，在接口文件里面声明的方法的头上写上注解
```java
@Select("select * from user")
List<User> getUser();
```
然后在类像之前一样里面正常使用，不需要搞配置文件
```java
@Test
public void testSelect() {
    SqlSession sqlSession = MybatisUtils.getSqlSession();

    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> user = mapper.getUser();

    for (User user1 : user) {
        System.out.println(user1);
    }

    sqlSession.close();
}
```
使用注解来映射简单语句会使代码显得更加简洁，但对于稍微复杂一点的语句，Java 注解不仅力不从心，还会让你本就复杂的 SQL 语句更加混乱不堪。 因此，如果你需要做一些很复杂的操作，最好用 XML 来映射语句。

### 用注解开发做增删改查
只需要变动接口文件 UserMapper ，配置文件 `UserMapper.xml` 可以删去
```java
@Select("select * from user")
List<User> getUser();

@Select("insert into user values(#{id},#{name},#{pwd})")
void insertUser(User user);

@Select("delete from user where id=#{id}")
void deleteUser(@Param("id") int id);

@Select("update user set name=#{name},pwd=#{pwd} where id=#{id}")
void updateUser(User user);

@Select("select * from user where id=#{id}")
User getUserById(int id);
```
我们在删除方法 deleteUser 的参数框里写了一个 @Param("id") ，当我们使用注解开发时，如果有基本类型参数，尽量在每一个参数前加上 @Param("")

以 deleteUser(@Param("id") int id) 为例，如果我们把后面的 id 改成其他比如 id2 ，代码正常运行，但如果我们改 @Param("id") 改成 为  @Param("id2") 则会报错，这时因为我们在SQL中引用的就是 @Param("") 中定义的属性名，外面的 id 变成一个形参，形参叫什么都无所谓

如果把 @Select 改成其他，例如 @Update 代码，则需要手动提交
或者我们在 MybatisUtils 类里面把
```java
openSession里的参数填 true
return sqlSessionFactory.openSession(true)

public static SqlSession getSqlSession() {
        return sqlSessionFactory.openSession();
}
```

## 联合查询
### 多对一
假设环境，我们希望查询所有学生的信息，包括学生元素下的老师信息（学生的老师）
1、创建表
```SQL
CREATE TABLE `teacher` (
  `id` INT(10) NOT NULL,
  `name` VARCHAR(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO teacher(`id`, `name`) VALUES (1, '秦老师'); 

CREATE TABLE `student` (
  `id` INT(10) NOT NULL,
  `name` VARCHAR(30) DEFAULT NULL,
  `tid` INT(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fktid` (`tid`),
  CONSTRAINT `fktid` FOREIGN KEY (`tid`) REFERENCES `teacher` (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8INSERT INTO `student` (`id`, `name`, `tid`) VALUES ('1', '小明', '1'); 
INSERT INTO student VALUES ('2', '小红', '1'); 
INSERT INTO student VALUES ('3', '小张', '1'); 
INSERT INTO student VALUES ('4', '小李', '1'); 
INSERT INTO student VALUES ('5', '小王', '1');
```
2、创建接口
在 Dao 包下创建接口文件
```java
package org.example.Dao;

import org.example.pojo.Student;

import java.util.List;

public interface StudentMapper {
    List<Student> getStudent();
}
```


3、配置文件
在 resource 下创建一个文件，路径与接口文件路径一致
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
        "https://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="org.example.Dao.StudentMapper">

    <select id="getStudent" resultMap="StudentTeacher">
        select * from mybatis_lean.student
    </select>
    
    <resultMap id="StudentTeacher" type="org.example.pojo.Student">
        <result property="id" column="id"/>
        <result property="name" column="name"/>

        <association property="teacher" column="tid" javaType="org.example.pojo.Teacher" select="getTeacher"/>
    </resultMap>
    
    <select id="getTeacher" resultType="org.example.pojo.Teacher">
        select * from mybatis_lean.teacher where id = #{tid}
    </select>
</mapper>
```
resultMap 是用来定义数据库查询结果到Java对象的映射关系
如上：
在 resultMap 里`association`的作用是通过 getTeacher 来筛选出老师，然后进行匹配

运行结果：
![这是图片](imag\p8.png "Magic Gardens")

### 一对多
假设环境，我们希望查询所老师的信息，包括老师元素下的学生信息
#### 按照结果嵌套
```java
List<Teacher> getTeachers(@Param("tid") int id);
```
```xml
<select id="getTeachers" resultMap="TeacherStudent">
    select s.id sid, s.name sname, t.name tname, t.id tid
    from mybatis_lean.student s, mybatis_lean.teacher t
    where s.tid = t.id
    and t.id = #{tid}
</select>

<resultMap id="TeacherStudent" type="org.example.pojo.Teacher">
    <result property="id" column="tid"/>
    <result property="name" column="tname"/>

    <collection property="students" ofType="org.example.pojo.Student">
        <result property="id" column="sid"/>
        <result property="name" column="sname"/>
        <result property="tid" column="tid"/>
    </collection>
</resultMap>
```

#### 按照查询嵌套
```xml
<select id="getTeachers" resultMap="TeacherStudent">
    select * from mybatis_lean.teacher where id = #{tid}
</select>

<resultMap id="TeacherStudent" type="org.example.pojo.Teacher">
    <collection property="students" javaType="ArrayList"
     ofType="org.example.pojo.Student" select="getStudentByTId" column="id"/>
</resultMap>

<select id="getStudentByTId" resultType="org.example.pojo.Student">
    select * from mybatis_lean.student where id = #{tid}
</select>
```

## 动态SQL
动态SQL是指根据不同条件生成不同的SQL语句
### 创建环境
这里主要展示表格和 JavaBean 实体类
```sql
CREATE TABLE `blog`(
`id` VARCHAR(50) NOT NULL COMMENT '博客id',
`title` VARCHAR(100) NOT NULL COMMENT '博客标题',
`author` VARCHAR(30) NOT NULL COMMENT '博客作者',
`create_time` DATETIME NOT NULL COMMENT '创建时间',
`views` INT(30) NOT NULL COMMENT '浏览量'
)ENGINE=INNODB DEFAULT CHARSET=utf8;
```
```java
public Blog(String id, String title, String author, Date createTime, int views) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.createTime = createTime;
    this.views = views;
}
```
### IF
假设条件，以上面为例，我们需要用一条 SQL 语句来实现，如果我们传的参数有 title 或者 author ，则返回含有参数的数据，如果参数没有，则返回全部数据

这时候，就体现到动态规划的好处了
首先，我们先编写接口方法，我们需要拿一个 map 来装数据
```java
List<Blog> queryBlog(Map map);
```
然后就是最重要的配置文件了
```xml
<select id="queryBlog" resultType="org.example.pojo.Blog" parameterType="map" >
    select * from mybatis_lean.blog where 1=1
    <if test="title != null">
        and title = #{title}
    </if>
    <if test="author != null">
        and author = #{author}
    </if>
</select>
```
如上所示，想要完成开头提到的需求，那我们必不可少的需要判断来处理 `<if test="">` 这个当成固定格式就行了，因为那你每次使用 IF 的时候都少不了 `test=""`
test 里面装的就是我们的判断条件了，当然，我们也可以嵌套判断

为什么 where 后面要跟一个 `1=1` 呢，其实不跟也可以，但是我们需要在每一个 IF 判断里面的开头写上 where 那就显得太麻烦了，加上一个 `1=1` 也丝毫不会影响原来的语句

### where
或者，我们也可以使用 `<where>` 标签， `<where>` 标签可以自动检查后面跟随的子语句前有没有 AND 或者 OR，例如： 
```xml
<select id="queryBlog" resultType="org.example.pojo.Blog" parameterType="map" >
    select * from mybatis_lean.blog where 
    <where>
        <if test="title != null">
            title = #{title}
        </if>
        <if test="author != null">
            and author = #{author}
        </if>
    </where>
</select>
```
如上，最理想的情况是第一个和第二个都满足，程序继续运行，但是，如果只满足第二个而不满足第一个，我们会发现 where 后面直接跟 and ，这怎么看都是错的，我们的 `<where>` 标签就可以判断后面的子语句前是否有 AND 或 OR ，如果发现及删去，如果 IF 一个都不满足，后面没有跟子语句了， `<where>` 标签就会把 where 删去

### set
`set` 标签和 `where` 标签差不多，但是可以每一个条件都满足， `set` 标签是用于 `update` 语句里面的，例如：
```xml
<update id="updateBlog" parameterType="map">
    update mybatis_lean.blog
    <set>
        <if test="title != null">
            title = #{title},
        </if>
        <if test="author != null">
                author = #{author},
        </if>
    </set>
    where id = #{id}
</update>
```
我们需要更新当 `id` 等于我们所传的 `id` ，这时我们唯一一个需要确定的条件，标签里面的两个条件 `title` 和 `author` 不输入也不会报错
`set` 标签主要的功能是如果有子语句，那么将会在最前面加上（或删除） `set` ，然后在每一个需要子语句加逗号的子语句后面加上（或删除）逗号


### choose
choose 的选择是互斥的，满足了第一个就不会去看后面的判断

choose 与 when 和 otherwise 搭配
当 when 条件满足时进入 when 里的子语句，如果有多个 when 都满足条件，只进入第一个，otherwise 是当所有 when 条件都没有满足时则进入，相当于是 Java 里 if 的 else

假设，我们现在需要一个方法，当我们传的参数有 title 并且不为空，则从表格里查找出所在一行；如果没有传 title 而是传了 author ，我们也需要找出 author ；如果都没有传，我们需要把表格所有内容返回
```xml
<select id="queryBlogChoose" parameterType="map" resultType="org.example.pojo.Blog">
    select * from mybatis_lean.blog where
    <choose>
        <when test="title != null">
            title = #{title}
        </when>
        <when test="author != null">
            author = #{author}
        </when>
        <otherwise>
            1=1
        </otherwise>
    </choose>
</select>
```

### sql
上面的配置文件里面，我们会发现有很多地方的有杂糅，每个标签里面都有相同的地方，为了减少代码杂糅，我们可以使用 `sql` 标签，把相同的地方提出来
以上面为例，我们会发现 `if` 标签里面的 `title` 和 `author` ，我们使用的频率很大，那么我们就可以使用 `sql` 标签提出来 
```xml
<sql id="if-title-author">
    <if test="title != null">
        title = #{title}
    </if>
    <if test="author != null">
        and author = #{author}
    </if>
</sql>
```
提取后需要用 `include` 标签来使用
```xml
<select id="queryBlog" resultType="org.example.pojo.Blog" parameterType="map" >
    select * from mybatis_lean.blog
    <where>
        <include refid="if-title-author"/>
    </where>
</select>
```

### foreach
动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）
![替代文字](\imag\p10.png "可选的标题")

案例：我们现在需要一个方法，需要返回我们传的 ID 所对应的信息
```xml
<select id="queryBlogById" resultType="org.example.pojo.Blog" parameterType="map">
    select * from mybatis_lean.blog
    <where>
        <foreach collection="ids" item="id" open="(" close=")" separator="or">
            id = #{id}
        </foreach>
    </where>
</select>
```

## 缓存
mybatis 为了提高数据库性能和减少数据压力提供一级缓存和二级缓存

### 一级缓存
一级缓存是 SqlSession 级别的缓存，作用域是同一个 SqlSession ，在同一个 sqlSession 中连续两次执行相同的sql语句，第一次执行完毕会将数据写到缓存，第二次会从缓存中获取数据将不再从数据库查询，从而提高查询效率。当一个sqlSession结束后该sqlSession中的一级缓存也就不存在了。

Mybatis默认开启一级缓存

一级缓存只是相对于同一个 SqlSession 而言。所以在参数和 SQL 完全一样的情况下，我们使用同一个 SqlSession 对象调用一个 Mapper 方法，往往只执行一次 SQL ，因为使用 SelSession 第一次查询后，MyBatis会将其放在缓存中，以后再查询的时候，如果没有声明需要刷新，并且缓存没有超时的情况下，SqlSession都会取出当前缓存的数据，而不会再次发送SQL到数据库。

例如：
```java
// 通过ID来查询
User selectById(@Param("id") int id);
// 更新数据
int updateUser(User user);
```
```java
SqlSession sqlSession = MybatisUtils.getSqlSession();

UserMapper mapper = sqlSession.getMapper(UserMapper.class);
User user = mapper.selectById(1);
System.out.println(user);

System.out.println("==============================");

User user2 = mapper.selectById(1);
System.out.println(user2);

sqlSession.close();
```
![替代文字](\imag\p11.png "可选的标题")
我们会发现，明明查询语句跑了两遍，但日志里面却只跑了一边，第二次进行查询语句的时候并没有想第一次一样在数据库中查找，而是第一次跑完的记录存在缓存里面，第二次直接在缓存里面读取

样例二：
我们在两次查询语句中插入一条修改语句，缓存是否还能够使用
```java
SqlSession sqlSession = MybatisUtils.getSqlSession();

UserMapper mapper = sqlSession.getMapper(UserMapper.class);
User user = mapper.selectById(1);
System.out.println(user);

System.out.println("==============================");

mapper.updateUser(new User(5, "Lily", "202020"));

System.out.println("==============================");

User user2 = mapper.selectById(1);
System.out.println(user2);

sqlSession.close();
```
运行结果：
![替代文字](\imag\p12.png "可选的标题")

通过日志我们可得知，三条语句都进入了数据库中查找

### 二级缓存
二级缓存也叫全局缓存，二级缓存是基于 namespace ，一个命名空间对应着一个二级缓存
开启二级缓存后，释放完一个 sqlsession 后，一级缓存将会存入二级缓存内，重新开启一个相同 mapper 将会读取二级缓存 

1、开启全局缓存

在 mybatis-config.xml 下的 setting 标签内加入
```xml
<setting name="cacheEnabled" value="true"/>
```

2、在 Mapper 文件里面开启
```xml
<cache eviction="FIFO" flushInterval="60000" size="512" readOnly="true"/>
```
注：FIFO (first in first out)











