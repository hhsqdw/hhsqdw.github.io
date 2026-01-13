# Mybatis的小笔记
## association 与 collection
### association
用于一对一或多对一，当一个对象包含另一个对象作为其属性时，可以使用association
例如：一个User类有一个Address类的属性，表示用户有一个地址

### collection
用于一对多，当一个对象包含多个相同类型的对象作为其属性时，可以使用collection
例如：一个User类有一个Order列表的属性，表示一个用户可以有多个订单

## javaType 与 ofType
在MyBatis的映射文件中，javaType和ofType是两个经常与association和collection元素一起使用的属性，它们用于指定映射的目标类型，但它们的使用场景和含义有所不同。

javaType：用来指定实体类（JavaBean）中属性的类型
ofType：用来指定映射容器里面实体类（JavaBean）中的类型，泛型中的约束类型

