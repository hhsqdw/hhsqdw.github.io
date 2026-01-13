---
title: MongoDB
date: 2025-06-17
tags:
  - project
---
# 概述

- MongoDB 与传统关系型数据库相比更加简单，架构为key-value结构
- MySQL数据库：数据库-表-记录
  MongoDB      ：数据库-集合-文档（记录）
- 文档类似于JSON对象，结构成为BSON



# 安装与启动

## 1. 导入 MongoDB 官方 GPG 密钥

首先需要导入 MongoDB 官方的 GPG 密钥，以便系统能够验证下载包的完整性。

```bash
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
```

## 2. 添加 MongoDB 软件源

将 MongoDB 的软件源添加到系统的源列表中，这样就可以通过包管理器直接下载 MongoDB。

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

## 3. 更新包索引

添加完软件源后，需要更新本地的包索引，让系统知道有哪些新的软件包可以安装。

```bash
sudo apt-get update
```

## 4. 安装 MongoDB 7.0.0

使用包管理器安装指定版本的 MongoDB。

```bash
sudo apt-get install -y mongodb-org=7.0.0 mongodb-org-database=7.0.0 mongodb-org-server=7.0.0 mongodb-org-shell=7.0.0 mongodb-org-mongos=7.0.0 mongodb-org-tools=7.0.0
```

## 5. 锁定 MongoDB 版本

为了防止系统自动升级 MongoDB 版本，需要对其进行版本锁定。

```bash
echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-database hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections
```

  

## 6. 启动 MongoDB 服务

安装完成后，启动 MongoDB 服务并设置为开机自启动。

```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

  

## 7. 验证安装结果

通过以下命令检查 MongoDB 服务的运行状态，确认是否安装成功。

```bash
sudo systemctl status mongod
```

Linux进入MongoDB
```shell
mongosh
```

```mongosh
show dbs  # 查看数据库
db.version() # 查看版本  
db.getMongo()  # 查看当前db的链接机器地址
db.help()    # 帮助
quit()       # 退出
```

# 命令行操作MongoDB

### 数据库操作

创建数据库，如果数据库不存在，则创建数据库，否则切换数据库
```mongosh
use 库名
```

查看当前数据库
```
db.getName()
```

查看当前数据库状态
```
db.stats()
```

删除当前数据库
```
db.dropDatabase()
```


### 集合操作

创建集合
```
db.createCollection("User")
```

删除集合
```
db.集合名.drop()
```


### 文档操作

注意：
- MongoDB区分类型和大小写
- MongoDB文档不能有重复的键

insert，向集合插入一条记录。可以预先使用 `createCollection` 方法创建，也可以不先创建，直接插入，集合会自动创建
```
db.集合名.insert({name:'zhangsan',age:21,sex:true})
```

find，查询当前集合中name是zhangsan的数据，空参的话是查询全部
```
db.集合名.find({name:zhangsan})
```

update，只更新匹配到的第一条记录
```
db.集合名.update({age:21},{$set:{name:100})
```
更新匹配到的所有记录
```
db.集合名.update({age:21},{set:{name:100}},{multi:true})
```

remove，删除一个文档
```
db.集合名.remove(id)
```
删除所有文档
```
db.集合名.remove({})
```

# SpringBoot整合MongoDB

- spring-data-mongodb提供了两种方式

第一种 MongoTemplate（更灵活）

第二种 MongoRepository（操作简单）


## 准备工作

第一步 创建项目，导入依赖
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.0.5</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <artifactId>mongo_demo0</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!--mongodb-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

</project>
```

第二步 创建项目文件

application.yml
```yaml
spring:
  data:
    mongodb:
      database: daijia
      host: 47.107.42.25
      port: 27017
```

第三步 创建实体类

```java
@Data
@Document("user") //指定mongodb中的集合名字
public class User {

    @Id
    private ObjectId id;
    
    private String name;
    private Integer age;
    private String email;
    private Date createDate;
}
```

## MongoRepository

* 添加interface继承MongoRepository

```java
public interface UserRepository extends MongoRepository<User, ObjectId> {
}
```

#### 普通方法

* 编写测试类

```java
@SpringBootTest
public class MongoRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    //添加
    @Test
    public void add() {
        User user = new User();
        user.setName("mary");
        user.setAge(30);
        user.setCreateDate(new Date());
        userRepository.save(user);
    }

    //查询所有
    @Test
    public void findAll() {
        List<User> list = userRepository.findAll();
        System.out.println(list);
    }

    //根据id查询
    @Test
    public void testFindById() {
        Optional<User> optional =
                userRepository.findById(new ObjectId("666a9a85f5294513720647ff"));
        boolean present = optional.isPresent();
        if(present) {
            User user = optional.get();
            System.out.println(user);
        }
    }

    //条件查询 + 排序
    // age = 20
    @Test
    public void testFindCondition() {
        //封装条件
        User user = new User();
        user.setAge(20);
        Example<User> example = Example.of(user);

        Sort sort = Sort.by(Sort.Direction.DESC, "name");

        List<User> list = userRepository.findAll(example, sort);
        System.out.println(list);
    }

    //分页查询
    @Test
    public void testPage() {
        //第一页从0开始的
        PageRequest pageable = PageRequest.of(0,2);

        Page<User> page = userRepository.findAll(pageable);

        List<User> list = page.getContent();
        System.out.println(list);
    }

    //更新
    @Test
    public void testUpdateUser(){
        //注意：先查询，再更新
        Optional<User> optional = userRepository.findById(
                new ObjectId("64eee9dff317c823c62b4faf")
        );
        if(optional.isPresent()){
            User user = optional.get();
            user.setAge(100);
            //user中包含id，就会执行更新
            userRepository.save(user);
            System.out.println(user);
        }
    }

    //删除
    @Test
    public void testDeleteUser(){
        userRepository.deleteById(
                new ObjectId("64eee9dff317c823c62b4faf")
        );
    }
}
```

#### 命名方法

- MongoRepository也可以**按照规则**在把查询方法创建出来

总体规模：
- 查询方法 以  get   |   find   |   read开头
- 后面街上查询字段名称，满足大驼峰命名
- 字段查询条件添加关键字，比如like

比如：
```java
@Repository  
public interface OrderServiceLocationRepository extends MongoRepository<OrderServiceLocation, String> {  
  
    // 根据订单id获取位置信息，按照创建时间排序  
    List<OrderServiceLocation> findByOrderIdOrderByCreateTimeAsc(Long orderId);  
}
```

## MongoTemplate

```java
@SpringBootTest
public class MongoTemplateTest {

    @Autowired
    private MongoTemplate mongoTemplate;

    //添加
    @Test
    public void add() {
        User user = new User();
        user.setName("test");
        user.setAge(20);
        user.setCreateDate(new Date());
        mongoTemplate.insert(user);
    }

    //查询所有
    @Test
    public void findAll() {
        List<User> list = mongoTemplate.findAll(User.class);
        list.forEach(user->{
            System.out.println(user);
        });
    }

    //根据id查询
    @Test
    public void testFindId() {
        User user = mongoTemplate.findById("666a9b5e9a3653796627bb3c", User.class);
        System.out.println(user);
    }

    //条件查询
    @Test
    public void testCondition() {
        // where name=? and age=?
        Criteria criteria =
                Criteria.where("name").is("test").and("age").is(20);
        Query query = new Query(criteria);

        List<User> list = mongoTemplate.find(query,User.class);
        System.out.println(list);
    }

    //分页查询
    @Test
    public void testPage() {
        // limit 0,2
        Query query = new Query();
        List<User> list = mongoTemplate.find(query.skip(0).limit(2), User.class);
        list.forEach(user->{
            System.out.println(user);
        });
    }

    //修改和删除
    //修改
    @Test
    public void testUpdateUser() {
        Criteria criteria = Criteria.where("_id").is("64eeeae31711344f35635788");
        Query query = new Query(criteria);
        Update update = new Update();
        update.set("name", "zhangsan");
        update.set("age", 99);
        UpdateResult result = mongoTemplate.upsert(query, update, User.class);//改一条
        //UpdateResult result = mongoTemplate.updateMulti(query, update, User.class);//改多条
        long count = result.getModifiedCount();
        System.out.println(count);
    }

    //删除
    @Test
    public void testRemove() {
        Criteria criteria = Criteria.where("_id").is("64eeeae31711344f35635788");
        Query query = new Query(criteria);
        DeleteResult result = mongoTemplate.remove(query, User.class);
        long count = result.getDeletedCount();
        System.out.println(count);
    }
}
```

































