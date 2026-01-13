# JavaScript
### 概述

JavaScript是一门世界上流行的脚本编程语言，用来实现网页上的交互，实时更新内容等。

JavaScript的创建者因不喜欢Java，只想应付公司的任务，因此只花了十天时间就把JavaScript创建出来了。

## Hello World
每个语言都有其独特之处，身边人也经常会开玩笑的说“我们精通各种语言的Hello World”。

JavaScript和CSS一样，都可以直接在HTML文件里面搭个标签，在标签里面写语言。

__方法一：内标签写__
![这是一张图片](img\p1.png "可选的标题")
与Java相同，在写JavaScript时不要忘记每一行命令后的分号。
注释也和Java中使用的一样。

__方法二：外部引用__
首先，先创建一个JavaScript文件，里面只需写需要的JavaScript语句，然后再在HTML文件中引入进来即可。
注意，使用script标签必须成对出现，尽量不要用自闭合。
![这是一张图片](img\p3.png "可选的标题")

运行结果：
![这是一张图片](img\p2.png "可选的标题")

## 基础语法
JavaScript和一门弱类型语言，跟python或者其他解释型语言一样，无需强调其变量类型。

![这是一张图片](img\p4.png "可选的标题")

JavaScript语法与Java基本吻合，也是严格区分大小写，但JavaScript不强制限定语句末一定要使用分号，如果有两条语句，其中没有分号，则视为一条语句，一般使用上省略一两个分号对代码没有太大影响，但依然建议写上分号。

#### 浏览器调试
在浏览器上打开文件后，可以点击F12打开审查元素，在源代码那里可以看到自己的代码并进行调试。

![这是一张图片](img\p5.png "可选的标题")

## 简单数据类型
#### 变量
JS和Java的命名规则一样，用字母数字下划线和``$``组成的变量名，不可以用数字开头，可以用中文。
```
var 变量名 = 值
```

#### number
js不区分整数和小数
```
123      //整数
123.4    //小数
-1.234   //负数
1.23e4   //科学计数法
除此之外还有
NaN      //Not a number
Infinity //表示无穷大，数据太大JavaScript处理不来
```
#### 比较运算符
```
=      //赋值
==     //等于(类型不一样，值一样，判断为true)
===    //绝对等于(类型一样，值一样，判断为true)
一般情况下尽量使用绝对等于
```
上面提到的NaN与所有数值都不相等，包括自己，只能通过``isNaN``来判断NaN才为true
![这是一张图片](img\p6.png "可选的标题")

尽量避免使用浮点数进行运算，存在精度丢失问题
```
console.log((1/3) === (1-2/3))
答案为false
但我们可以使用绝对值来比较
Math.abs(1/3 - (1-2/3)) < 0.000000000001
```

#### Null和undefined
```
null     //空
undefined//未定义
```

#### 数组
一般在Java中数组每个元素的类型必须一致，但在JS中可以不用
```
var a = [1,2,3,4,'Hello',null,false];
```
数组越界会显示undefined

#### 对象
在Java中对象是new出来的，但在JS中生成或定义基本上都是使用var，每个属性之间使用逗号隔开，最后一个属性后不需要加逗号。

对象是大括号，数组是中括号。

![这是一张图片](img\p7.png "可选的标题")
![这是一张图片](img\p8.png "可选的标题")

## 严格检查模式
在我们书写代码时，会发现有时候不严谨的写法依然不会报错而导致无法运行。

例如在代码中直接写上 ``i = 1`` 如同python一样，但这时候i定义成是全局变量，以至于在其他JS文件中依然可以调用到这个变量，因此我们得想办法约束一下自己代码书写的严谨性。

我们在第一行写上 ``"use strict"`` (引号不能丢) __严格检查模式__，开启后如果出现以上 ``i = 1`` 的写法会直接报错，提升了代码的严谨性。

__严格检查模式__ 一般写在JS文件 (或者标签内) 的第一行写上，在其他地方写上在运行文件的时发现错误会报错，但在浏览器里调试中不会发生报错。

## 字符串
JS字符串可以用 __单引号__ 或者 __双引号__ 包裹，如果想输出引号，我们可以使用 ' __\\__ ' 转义符来进行转义引号。
```
常用的转义符:
\'
\"
\t      # 等效于tab键
\u4e2d  # '中'，Unicode字符，一般为\u####
\x41    # 'A'，ASCLL字符
```

#### 多行字符串编写
如果希望进行多行字符串编写，我们可以使用两个 `` ` ``  包裹起来
```
var 变量名 = `
        内容
        内容
        .....
`
```
或者我们在希望换行的位置打上换行符 `` \n `` 进行换行

#### 字符串拼接
在JS里，字符串拼接最常见有两种方式
```
var a = "abc";
var b = "cba";
方式一：
    用加号来拼接字符串
    console.log("abc"+"cba");    # abccba
    console.log(a+b);            # abccba
方式二：
    在字符串中穿插 '${变量名}'
    console.log(`早上好！${a}`)   # 早上好！abc 
                                 # 注意，括号内使用的是 ` 号
```

#### 字符串长度
```
var a = "abc";
console.log(abc.length);   # 3
```

#### 字符串的可变性
```JavaScript
var a = "abcdef";
console.log(a[1]);         # b
a[1] = 'b';                # 这里尝试把'b'赋值给a[1]
                           # 没有显示报错，赋值完成
console.log(a[1])          # a
                           # 发现虽然赋值完成，但值没有改变，赋值失败
```
![这是一张图片](img\p9.png "可选的标题")

#### 字符串截取
```
var a = "abcdef";
console.log(a.subString(1))      # bcdef   从下标1开始一直到最后
console.log(a.subString(1,3))    # bc      从下标1开始，到下标3结束(不包括下标3)
字符串截取是'[)'包左不包右
注意，当 '.'后面有括号说明是方法而不是属性
```

## 数组
数组Array可以包含任意的数据类型
```JavaScript
var arr01 = [1,2,3,4,5,6,7,8,9]; # 可以通过数组下标进行取值和赋值 
console.log(arr01);              # [1, 2, 3, 4, 5, 6, 7, 8, 9]
arr01[0] = 0;
console.log(arr01);              # 0, 2, 3, 4, 5, 6, 7, 8, 9]
```

#### 长度
```
arr01.length
```
注意，我们可以给``arr01.length``进行赋值，赋值后会改变数组的长度，如果赋的值大于原来，则以``empty``补全，如果赋的值小于原来，则超过的下标元素丢失，一般不建议去修改数组长度。

#### indexof()
我们可以用indexof()通过元素获得第一个元素出现的下标
```
arr01.indexof(1)
```
注意：字符串1和数字1是不一样的

#### slice()
slice()用来截取数组的一部分，返回一个新的数组
```
数组名.slice(3)     # 从下标3开始到最后
数组名.slice(1,3)   # 从下表1开始到下标3结束，不包括下标3，类似于String中的subString()
```

#### push()、pop()尾部
```
push()   压入到尾部
pop()    从尾部弹出一个元素
```

#### unshift()、shift()头部
```
unshift()   压入到头部
、shift()    从头部弹出一个元素
```

#### 排序sort()
```
['B','A','C'];
arr.sort();
['A','B','C']
```

#### 元素反转reverse()
```
['A','B','C'];
arr.reverse();
['C','B','A']
```

#### 数组拼接concat()
```
# ['A','B','C'];
arr.concat([1,2,3]);
# ['A','B','C',1,2,3];
console.log(arr);
# ['A','B','C']
```
注意：concat()并没有修改数组，而是返回一个新的数组

#### 连接符join()
```
['A','B','C'];
arr.join('-');
"A-B-C"
```

## 对象
#### 定义对象
在JS中，对象就是由若干个键值对组成的
JS中所有的键都是字符串，值可以是任意类型！
```
var 类名 = {
    属性名:值,
    属性名:值,
    属性名:值,
    属性名:值
}
```
定义对象中每个属性用逗号隔开，最后一个属性不加逗号

#### 对象赋值
```
对象名.属性名 = 值;
```
注意，使用一个不存在的属性不会报错

#### 动态的删减属性
通过delete删除对象的属性
```
delete 对象名.属性名
```
![这是一张图片](img\p10.png "可选的标题")

#### 动态的添加属性
直接给想要添加的属性名赋值即可
```
对象名.属性名 = 值
```
![这是一张图片](img\p11.png "可选的标题")

#### 判断属性值是否在这个对象中
```
属性名 in 对象名
```
注意：JS中属性名都为字符串，判断时要加上引号
![这是一张图片](img\p12.png "可选的标题")

我们在Java中对象一般都会设一个toString方法，在JS检查属性值时会发现，toString也在本对象中，这是因为继承性，JS和Java一样，对象都是默认继承object，属性也会一同继承下来。
![这是一张图片](img\p13.png "可选的标题")

#### hasOwnProperty()
如果我们只想看本对象中，不想看到继承下来的属性，我们可以使用hasOwnProperty()
```
对象名.hasOwnProperty(属性名)
```

## 流程控制
个人认为本质上和Java的流程判断没区别
#### if判断
```JavaScript
var age = 18;
if(age > 18){
    console.log("成年了");
}else if(age === 18){
    console.log("刚成年");
}else {
    console.log("未成年");
}
```

#### while判断
```JavaScript
var a = 0;
while(a < 100){
    a = a + 1;
    console.log(a);
}
var b = 0;
do{
    b = b + 1;
    console.log(b);
}while(b < 100)
```

#### for循环
```JavaScript
for(let i = 0; i < 100; i++){
    console.log(i);
}
```

#### for in 循环
```JavaScript
var arr = [1,2,3,4,5,6,7,8,9];

# for(var 下标 in 容器)

for(var num in arr){
    console.log(arr[num]);
}
```

#### for of 循环
for of和上面的for in 相似，for in产生的变量是下标，for of产生的变量是数值
但是for of不会遍历出手动添加的值，但for in会
```
for(var num of arr){
    console.log(num);
}
```

#### forEach循环
```
var age = [1,23,4,5,6,7,8];
age.forEach(function (value){
    console.log(value);
})
```

## Map 和 Set
#### Map
JS里和Java里Map使用方法一样，键是唯一的，值不是唯一的
```JavaScript
var map = new Map([["tom",99],["jerry",98],["alice",95],["bob",96]]);
// get方法通过键来找到值
console.log(map.get("tom"));
// set方法添加或者修改键值对
map.set("hhhhh",100);
// delete方法删除键值对
map.delete("tom");
```
个人感觉JS里面Map和上面提到的对象很相似，都是多对键值对，但不同处在于对象的键只能是字符串，而Map的键可以是任意类型

可以通过for of来遍历
```JavaScript
var map = new Map([["tom",99],["jerry",98],["alice",95],["bob",96]]);
for(var x of map){
    console.log(x);
}
```
#### Set
Set：无序不重复的集合
无序并不是说没有顺序，而是说没有像数组一样的索引
```JavaScript
var set = new Set([1,2,3,3,3,3,3,3]) 
set.add(2);                          //添加元素
set.delete(1);                       //删除元素
set.has(3);                          //判断是否包含
```
Set也可以通过for of来遍历
```
var set = new Set([1,2,3,3,3,3,3,3]) 
for(var x of set){
    console.log(x);
}
```

## 函数
#### 函数的定义
__方式__：
```JavaScript
function MyAbs(x){
    if(x >= 0){
        return x;
    }else{
        return -x;
    }
}
```
跟其他语言一样，执行到 ``return`` 即代表函数结束，无法运行 ``return`` 后面的代码
如果没有执行 ``return`` ，函数执行完也会返回结果 ``undefined``

__方式二__：
```
var MyAdd = function(a,b){
    return a+b;
}
```
function(a,b){...}是一个匿名函数。可以把结果赋值，通过被赋值名来调用函数

__方式一和方式二等价__

#### 调用函数
```
函数名(参数1,参数2,参数3....)
```
在调用函数的时候会发现一件事，你可以传任意多个参数，不会报错

如果我们只想接收一个参数，传多个参数就是非法调用，这种情况我们可以使用 `arguments` 

例如：
```JavaScript
var MyAdd = function(a,b){
    if(arguments.length !== 2){
        throw "Not a Number"
    }
    return a+b;
}
```
![这是一张图片](img\p14.png "可选的标题")
``arguments`` 是参数接收值的数组，每个方法内都有，用来存储每个方法的接收值

#### 可变参数
`rest`
用数组来接收函数体已经定义的参数之外的参数
例如：
```JavaScript
function abbb(a,b,...rest){
    函数体.....
}
abbb(1,2,3,4,5,6,7,8)       # 调用函数，传参
                         # a === 1
                         # b === 2
                         rest = [3,4,5,6,7,8]
```
rest参数只能写在参数最后，前面必须要有`...`表示

## 变量的作用域
#### this
JS里，如果我们在函数外和函数内都定义了一个同名的变量，我们将如何区分

首先，JS和Java一样，遇到相同的变量名时会优先调用最近的(最近原则)，在函数里面调用，则会优先调用到函数里面的变量，如果希望调用函数外的，我们可以用关键字this
```JavaScript
var a = 10;
function test() {
    var a = 20;
    console.log(this.a);
    console.log(a);
    console.log("====================");
}
console.log(a);
test();
a = 30;
console.log(a);
test();
```
![这是一张图片](img\p15.png "可选的标题")

#### var和let
在之前写代码时会发现，我们无论在变量或者是函数前，都会加一个var或者let，var和let有什么区别呢？

一开始我也分不清楚，后来查资料也懵懵懂懂，后来多写几行代码就有更深一点的领悟。

var 一般是用在全局作用域，而let用在局部作用域，什么是作用域，个人见解，每一个 `{}` 花括号括起来就是一个作用域
比如上面的this中的代码，我们在函数外部和函数内部都定义一个全局变量a，我们在函数内是能通过this或者window来调用到函数外的a
注：window只能调用全局变量，无法调用局部变量
但是如果我们用的是let定义的局部变量，我们会发现在函数内也无法调用到函数外的a
```JavaScript
let a = 10;
function test() {
    let a = 20;
    console.log(window.a);
    console.log(a);
    console.log("====================");
}
console.log(a);
test();
a = 30;
console.log(a);
test();
```
![这是一张图片](img\p17.png "可选的标题")

#### 常量const
有变量肯定也有常量，我们在编写代码的时候也希望有些值不允许被改变
```
const 变量名 = 值
```
用const修饰后的变量名是不允许被修改的

## 方法
函数定义在对象外就是函数，定义在对象内就是方法
```JavaScript
var hh = {
       name : "hs",
       ahe : 18,
       birth : 2005,
       // 方法
       age : function(){
           return new Date().getFullYear() - this.birth;
       }
}
// 属性
hh.name;
// 方法
hh.age();
```

#### apply
apply感觉像是Java里的反射，在JS中任何方法都用apply的属性
```
方法名.apply(对象名,参数)      # 参数用数组装，没有参数就传[]
```
例如
```JavaScript
function getAge(){
    return new Date().getFullYear() - this.birth;
}
var hh = {
    name : "hs",
    ahe : 18,
    birth : 2005,
    age : getAge
}
```
我们可以用 hh.age()，也可以用 getAge.apply(hh,[])

## JSON
#### JSON是什么
JSON（JavaScript Object Notation，JavaScript对象表示法）
JSON是一种常用的数据格式，在电子数据交换中有多种用途，包括与服务器之间的Web应用程序的数据交换。其简洁和清晰的层次结构有效地提升了网络传输效率，使其成为理想的数据交换语言。其文件通常使用扩展名.json。

#### JSON字符串和JS对象的转换
格式：
```
对象和方法用  {}
数组用       []
键值对用     key:value
```
```JavaScript
var person = {
            name: "John",
            age: 30,
            city: "New York"
        }
        // 对象转换为JSON字符串
        var json = JSON.stringify(person);
        console.log(json)
        // JSON字符串转换为对象
        var obj =JSON.parse(json);
        console.log(obj)
        // 也可以用 JSON.parse('{"name":"John","age":30,"city":"New York"}')
```
![这是一张图片](img\p18.png "可选的标题")

## 面向对象
在其他语言中，说起对象就想起类，类是模板，对象是实体，继承等等
在之前JS里还没有继承，但是有这个概念，于是出现了原型
```
A对象.__proto__ = B对象
A对象的原型是B对象
于是乎A对象就能使用B对象里面的属性
```

#### class
在ES6版本后，加入了一个新的关键字`class`
跟Java的区别在于构造器，在JS的class里，构造器是 `constructor` 
```JavaScript
class person01 {
    constructor(name, age){
    this.name = name;
    this.age = age;
    }
    run() {
        console.log(this.name + " is running");
    }
}
var xiaoming = new person01("xiaoming", 25);
var xiaohong = new person01("xiaohong", 20);
```
而且，在类里面构建的方法不需要在方法名前面加var
#### 继承
```JavaScript
class 子类名 extend 父类名{
    constructor(参数){
        super()
    }
}
```
例如：
```JavaScript
class person02 extends person01 {
    constructor(name, age, sex) {
        super(name, age);
        this.sex = sex;
    }
    sayHello() {
        console.log("Hello, my name is " + this.name + " and I am a " + this.sex);
    }
}
```
我们可以在浏览器调试中看到其实所谓的继承还是原型，我们能看到原型链，原型的尽头还是object
![这是一张图片](img\p19.png "可选的标题")

## 操作BOM对象
BOM：Browser Object Model（浏览器对象模型）
类似的还有一个叫 `DOM` : 是将HTML文档中的各个元素封装成一个对象，而 `BOM` 则是将一个浏览器的各个组成部分封装成对象供调用使用。

JavaScript诞生的目的就是为了能够在浏览器上运行

#### window
window对象代表着浏览器窗口
```JavaScript
window.alert(1)
undefined
window.innerHeight
358
window.innerWidth
1659
window.outerWidth
1707
window.outerWidth
1707
```

#### navigator
navigator对象代表浏览器的信息
```JavaScript
appName    # 浏览器的官方名称。通常是"Netscape"，
           # 这是因为Netscape是第一个支持JavaScript的浏览器。
appVersion # 提供了浏览器版本信息
userAgent  # 浏览器的用户代理字符串
platform   # 运行浏览器的操作系统平台
```
一般不建议使用 `navigator` 对象，因为里面的信息会被人为修改

#### screen
screen代表屏幕尺寸
```JavaScript
screen.width
1707 px
screen.height
960 px
```

#### location
location代表当前网页的URL信息
```JavaScript
host: "ntp.msn.cn"
protocol: "https:"
reload: ƒ reload()    // 刷新网页
```

#### document
document代表当前的页面，HTML，DOC文档树
```JavaScript
document.title
'新建标签页'
document.title = '呵帅'
'呵帅'
```
cookie劫持原理，引了一个含有获取cookie的文件
```
// 获取cookie
document.cookie
```

#### history
history代表浏览器的历史记录
```JavaScript
// 后退
history.back()
// 前进
history.forward()
```

## 操作DOM对象
DOM：文档对象模型

浏览器网页就是一个DOM树形结构，我们只需要做
1、更新：更新DOM节点
2、遍历：遍历每个DOM节点
3、删除：删除DOM节点
4、增加：增加DOM节点

乍一看像前端版的增删改查

#### 获取DOM节点
```JavaScript
<div id="father">
    <h1>标题</h1>
    <p id="p1">段落</p>
    <p class="p2">段落</p>
</div>
<script>
    //对应CSS选择器
    var h1 =document.getElementsByName('h1');
    var p = document.getElementsByName('p');
    var div = document.getElementsByName('div');
    var father = document.getElementById('father');
    var p2 = document.getElementsByClassName('p2');
    var p1 =document.getElementsByTagName('p1')
</script>
```
可以用 `getElementsByName` 通过属性名，或者 `getElementById` 通过选择器

#### 更新节点
```
<div id = 'id1'>

</div>
<script>
    var id1 = documents.getElementById('id1');
</script>
```
操作文本
```
id1.innerText='123456';
id1.innerHTML='<strong>123</strong>'

innerText和innerHTML的区别：
innerText修改文本的值
innerHTML可以解析HTML语句
```
操作JS
```
id1.style.color = 'red'
'red'
id1.style.fontSize = '20px'
'20px'
id1.style.padding = '30px'
'30px'
```

#### 删除节点
删除节点得先获取父节点，然后通过父节点删除

方法一
```JavaScript
<div id="father">
    <h1>标题</h1>
    <p id="p1">段落</p>
    <p class="p2">段落</p>
</div>
<script>
    var p1 = documents.getElementById('p1');
    var father = p1.parentElement;
    father.removeChild(p1)
</script>
```
方法二
```JavaScript
<div id="father">
    <h1>标题</h1>
    <p id="p1">段落</p>
    <p class="p2">段落</p>
</div>
<script>
    father.removeChild(father.children[0]);
    father.removeChild(father.children[0]);
    father.removeChild(father.children[0]);
</script>
```
注意：每次删除的时候，children都是在变化的

## 表单
#### 获取表单的值
表单有很多种：
文本框、下拉框、选项框、密码框、隐藏框等等
```JavaScript
<p>
    <span>输入内容:</span> <input type="text" id="input">
</p>
<p>
    <span>性别:</span>
    <input type="radio" value="man" name="sex" id="boy"> 男
    <input type="radio" value="woman" name="sex" id="girl"> 女
</p>

<script>
    var input_text = document.getElementById('input');
    var boy_radio = document.getElementById('boy');
    var girl_radio = document.getElementById('girl');
</script>
```
文本框我们会取其`document`然后用`.value`获得值
如果是选项框一般则会用 `.check`来判断是否被选择
```
input_text.value
'123456'
input_text.value = 456789
456789
boy_radio.value
'man'
girl_radio.value
'woman'
boy_radio.checked
true
girl_radio.checked
false
```

#### 表单提交验证及加密
在`button`中我们可以自定义按下按钮的触发效果
```JavaScript
<p>
    请输入用户名：<input type="text" id="username" name="username" placeholder="请输入用户名">
</p>
<p>
    请输入密码 ：<input type="password" id="password" name="password" placeholder="请输入密码">
</p>
<!--绑定事件 onclick-->
<button type="button" onclick="submit()">提交</button>
<script>
    function submit() {
        var username = document.getElementById("username");
        var password = document.getElementById("password");
        console.log(username.value);
        console.log(password.value);
    }
</script>
```
在平时使用的时候都是输入完按下提交按钮，数据就会被提交到数据库上面，但这样还是有一点隐患，非常容易被抓包，导致数据都被明文曝光，我们可以使用MD5加密
```
document名.value = md5(document名.value)
```
世上没有不透风的强，再怎么加密依然有曝光的风险，平时项目中建议在后端进行加密，不要在前端做加密


## jQuery
#### jQuery下载
目前jQuery官网直接打开不是文件而是原码
我们在官网上点开 `download`
![这是一张图片](img\p20.png "可选的标题")
点击 `download jQuery` 
![这是一张图片](img\p21.png "可选的标题")
然后我们会发现一整个网页都是字符，不要怀疑自己，这就是官网
![这是一张图片](img\p22.png "可选的标题")
方法一：
我们在项目的位置新建一个 `.txt` 文件，把网页的内容 `Ctrl+a` 全部复制到txt文件内，修改后缀为 `.js` 然后倒入进项目里


方法二：
右键另存为，就是一个 `.js` 文件了

或者，我们在网上查找jQuery的CDN，直接搜索就行，引入在线CND，就不需要去官网下载了

#### 导入
```
<script scr="lib/jquery-3.5.1.min.js"></script>
```
![这是一张图片](img\p23.png "可选的标题")
直接在`head`最下面插入导入语句

#### 实践
在网页上画一个小块，当鼠标在块中时可以显示鼠标在块内的坐标
```JavaScript
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script>
    <style>
        #div1 {
            width: 500px;
            height:500px;
            border: 1px solid red;
        }
    </style>
</head>
<body>
    <span id="span1"></span>
    <div id="div1">
        移动区域
    </div>
    <script>
        $(document).ready(function (){
            $("#div1").mousemove(function (e){
                $("#span1").text("x"+e.pageX+"y"+e.pageY);
            })
        })
    </script>
</body>
</html>
```
效果：
![这是一张图片](img\p24.png "可选的标题")
