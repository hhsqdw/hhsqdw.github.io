---
title: Go语言
date: 2025-01-21
tags:
  - 字节青训营
---
# 基础语法

- 变量
	- var 变量名 = 值
	- int（数据类型） 变量名 = 值
	- 变量名 := 值
- 常量
	- const 变量名 = 值
	- const 变量名 数据类型 = 值

## 判断 IF

```go
package main  
  
import "fmt"  
  
func main() {  
    if 7%2 == 0 {  
       fmt.Println("7 is even")  
    } else {  
       fmt.Println("7 is odd")  
    }  
  
    if 8%4 == 0 {  
       fmt.Println("8 is divisible by 4")  
    }  
  
    if num := 9; num < 0 {  
       fmt.Println(num, "is negative")  
    } else if num < 10 {  
       fmt.Println(num, "has l digit")  
    } else {  
       fmt.Println(num, "has multiple digits")  
    }  
}
```

## 循环 For

在 Go 中没有 while 和 do while，只有 for 循环

```go
package main  
  
import "fmt"  
  
func main() {  
    i := 1  
    for {  
       fmt.Println("loop")  
       break  
    }  
  
    for j := 7; j < 9; j++ {  
       fmt.Println(j)  
    }  
  
    for n := 0; n < 5; n++ {  
       if n%2 == 0 {  
          continue  
       }  
       fmt.Println(n)  
    }  
  
    for i <= 3 {  
       fmt.Println(i)  
       i++  
    }  
}
```

## 选择 Switch

相较于C++、Java，Go中的 switch 不需要在每个 case 后都加 break

```go
package main  
  
import (  
    "fmt"  
    "time")  
  
func main() {  
    a := 2  
    switch a {  
    case 1:  
       fmt.Println("one")  
    case 2:  
       {  
          fmt.Println("two")  
       }  
    case 3:  
       fmt.Println("three")  
    case 4, 5:  
       fmt.Println("four or five")  
    default:  
       fmt.Println("other")  
    }  
  
    t := time.Now()  
    switch {  
    case t.Hour() < 12:  
       fmt.Println("It's before noon")  
    default:  
       fmt.Println("It's after noon")  
    }  
}
```

如上 a = 2，进入 switch 后 进入 case 2，跑完 case 2 的事件后就到 t := time.Now() 

而且，Go 的 switch 可以用任意的变量类型，比如字符串，结构体等

## 数组

一样，数组长度是固定的

```go
package main  
  
import "fmt"  
  
func main() {  
    var a [5]int  
    a[4] = 100  
    fmt.Println(a[4], len(a))  
  
    b := [5]int{1, 2, 3, 4, 5}  
    fmt.Println(b)  
  
    var twoD [2][3]int  
    for i := 0; i < 2; i++ {  
       for j := 0; j < 3; j++ {  
          twoD[i][j] = i + j  
       }  
    }  
    fmt.Println(twoD)  
}
```

## 切片

个人感觉就是链表

```go
package main  
  
import "fmt"  
  
func main() {  
    s := make([]string, 3)  
    s[0] = "a"  
    s[1] = "b"  
    s[2] = "c"  
    fmt.Println(s[2])  
    fmt.Println(len(s))  
  
    s = append(s, "d")  
    s = append(s, "e", "f")  
    fmt.Println(s)  
  
    c := make([]string, len(s))  
    copy(c, s)  
    fmt.Println(c)  
  
    fmt.Println(s[2:5]) // [c d e]  
    fmt.Println(s[:5])  // [a b c d e]  
    fmt.Println(s[2:])  // [c d e f]  
  
    good := []string{"g", "o", "o", "d"}  
    fmt.Println(good)  
}
```

## map

`变量名 := make(map[键]值)`

`接收值1, 接收值2 := map变量名["键"]`  第二个接收值可以查看map中是否有这个键，有返回true，反之false

```go
package main  
  
import "fmt"  
  
func main() {  
    m := make(map[string]int)  
    m["one"] = 1  
    m["two"] = 2  
    fmt.Println(m)            // Output: map[one:1 two:2]  
    fmt.Println(len(m))       // Output: 2  
    fmt.Println(m["one"])     // Output: 1  
    fmt.Println(m["unknown"]) // Output: 0  
  
    r, ok := m["unknown"]  
    fmt.Println(r, ok) // Output: 0 false  
  
    delete(m, "one")  
  
    m2 := map[string]int{"three": 3, "four": 4}  
    var m3 = map[string]int{"three": 3, "four": 4}  
    fmt.Println(m2, m3) // Output: map[three:3 four:4] map[three:3 four:4]  
}
```

## range

`for 变量1, 变量2 := range 数组（容器） {}`  变量1是索引 index， 变量2是索引对照的值val

如果不需要索引就用下划线 `_` 代替

```go
package main  
  
import "fmt"  
  
func main() {  
    nums := []int{1, 2, 3, 4, 5}  
    sum := 0  
    for i, num := range nums {  
       sum += num  
       if num == 2 {  
          fmt.Println("index: ", i, "nums: ", num)  
       }  
    }  
    fmt.Println("sum: ", sum)  
  
    m := map[string]string{"a": "A", "b": "B", "c": "C"}  
    for k, v := range m {  
       fmt.Println(k, v) // prints "a A", "b B", "c C"  
    }  
    for k := range m {  
       fmt.Println("key ", k) // prints "a", "b", "c"  
    }  
}
```

## 函数

```go
package main  
  
import "fmt"  
  
func add(a int, b int) int {  
    return a + b  
}  
  
func add2(a, b int) int {  
    return a + b  
}  
  
func exists(m map[string]string, key string) (v string, ok bool) {  
    v, ok = m[key]  
    return v, ok  
}  
  
func main() {  
    res := add(1, 2)  
    fmt.Println(res)  
  
    v, ok := exists(map[string]string{"a": "A"}, "a")  
    fmt.Println(v, ok)  
}
```

## 指针

相较于 C/C++，这里的指针操作有限，主要用途是对传入的参数进行修改

```go
package main  
  
import "fmt"  
  
func add2(n int) {  
    n += 2  
}  
  
func add2ptr(n *int) {  
    *n += 2  
}  
  
func main() {  
    n := 5  
    add2(n)  
    fmt.Println(n) // Output: 5  
    add2ptr(&n)  
    fmt.Println(n) // Output: 7  
}
```

## 结构体

```go
package main  
  
import "fmt"  
  
type user struct {  
    name     string  
    password string  
}  
  
func main() {  
    a := user{name: "John", password: "12345"}  
    b := user{"Mary", "67890"}  
    c := user{name: "Mike"}  
    c.password = "98765"  
    var d user  
    d.name = "Peter"  
    d.password = "4321"  
  
    fmt.Println(a, b, c, d) // Output: {John 12345} {Mary 67890} {Mike 98765} {Peter 4321}  
    fmt.Println(checkPassword(a, "1234")) // Output: false  
    fmt.Println(checkPassword2(&a, "12345")) // Output: true  
}  
  
func checkPassword(u user, password string) bool {  
    return u.password == password  
}  
  
func checkPassword2(u *user, password string) bool {  
    return u.password == password  
}
```

## 结构体方法

```go
package main  
  
import "fmt"  
  
type user struct {  
    name     string  
    password string  
}  
  
func (u user) checkPassword(password string) bool {  
    return u.password == password  
}  
  
func (u *user) resetPassword(password string) {  
    u.password = password  
}  
  
func main() {  
    a := user{name: "John", password: "12345"}  
    b := user{"Mary", "67890"}  
    c := user{name: "Mike"}  
    c.password = "98765"  
    var d user  
    d.name = "Peter"  
    d.password = "4321"  

    fmt.Println(a.checkPassword("12345"))  
}
```

## 错误处理

一般在做错误处理时需返回 error，如果有错误就返回 `errors.New("错误介绍")`，否则返回 `nil`

```go
package main  
  
import (  
    "errors"  
    "fmt")  
  
type user struct {  
    name     string  
    password string  
}  
  
func findUser(users []user, name string) (v *user, err error) {  
    for _, u := range users {  
       if u.name == name {  
          return &u, nil  
       }  
    }  
    return nil, errors.New("not found")  
}  
  
func main() {  
    u, err := findUser([]user{{"Alice", "123456"}}, "Alice")  
    if err != nil {  
       fmt.Println(err)  
       return  
    }  
    fmt.Println(u.name)  
  
    if u, err = findUser([]user{{"wang", "123"}}, "li"); err != nil {  
       fmt.Println(err)  
       return  
    } else {  
       fmt.Println(u.name)  
    }  
}
```

## 字符串操作

HasPrefix函数用于判断第二个参数代表的字符串/字节切片是不是第一个参数的前缀
HasSuffix函数则用于判断第二个参数是不是第一个参数的后缀

```go
package main  
  
import (  
    "fmt"  
    "strings")  
  
func main() {  
    a := "hello"  
    fmt.Println(strings.Contains(a, "ll"))                // true  
    fmt.Println(strings.Count(a, "l"))                    // 2  
    fmt.Println(strings.HasPrefix(a, "he"))               // true  
    fmt.Println(strings.HasSuffix(a, "llo"))              // true  
    fmt.Println(strings.Index(a, "ll"))                   // 2  
    fmt.Println(strings.Join([]string{"he", "llo"}, "-")) // "he-llo"  
    fmt.Println(strings.Repeat(a, 2))                     // "hellohello"  
    fmt.Println(strings.Replace(a, "e", "E", -1))         // "hEllo"  
    fmt.Println(strings.Split("a-b-c", "-"))              // ["a", "b", "c"]  
    fmt.Println(strings.ToLower(a))                       // "hello"  
    fmt.Println(strings.ToUpper(a))                       // "HELLO"  
    fmt.Println(len(a))                                   // 5  
  
    b := "你好"  
    fmt.Println(len(b)) //6  
}
```

## 字符串格式化

```go
package main  
  
import "fmt"  
  
type point struct {  
    x, y int  
}  
  
func main() {  
    s := "hello"  
    n := 123  
    p := point{1, 2}  
    fmt.Println(s, n, p) // Output: hello 123 {1 2}  
  
    fmt.Printf("s=%v\n", s) // Output: s=hello  
    fmt.Printf("n=%v\n", n) // Output: n=123  
    fmt.Printf("p=%v\n", p) // Output: p={1 2}  
    fmt.Printf("p=%+v\n", p) // Output: p=point{x:1, y:2}  
    fmt.Printf("p=%#v\n", p) // Output: p=main.point{x:1, y:2}  
  
    f := 3.1415926  
    fmt.Println(f) // Output: 3.1415926  
    fmt.Printf("%.2f\n", f) // Output: 3.14  
}
```

## JSON处理

```go
package main  
  
import (  
    "encoding/json"  
    "fmt")  
  
type userInfo struct {  
    Name  string  
    Age   int `json:"age"`  
    Hobby []string  
}  
  
func main() {  
    a := userInfo{Name: "John", Age: 25, Hobby: []string{"Golang", "typeScript"}}  
    buf, err := json.Marshal(a) // 序列化  
    if err != nil {  
       panic(err)  
    }  
    fmt.Println(buf) // 输出序列化后的json字符串 [123 34 78 97 109...]    fmt.Println(string(buf)) // 输出序列化后的json字符串 {"Name":"John","age":25,"Hobby":["Golang","typeScript"]}  
    buf, err = json.MarshalIndent(a, "", "\t")  
    if err != nil {  
       panic(err)  
    }  
    fmt.Println(string(buf))  
    /*  
    {       "Name": "John",       "age": 25,       "Hobby": [          "Golang",          "typeScript"       ]    }    */  
    var b userInfo  
    err = json.Unmarshal(buf, &b)  
    if err != nil {  
       panic(err)  
    }  
    fmt.Println(b) // 输出反序列化后的结构体 {John 25 [Golang typeScript]}}
```

## 时间处理

```go
package main  
  
import (  
    "fmt"  
    "time")  
  
func main() {  
    now := time.Now()  
    fmt.Println(now) // 2025-01-23 15:36:01.0802031 +0800 CST m=+0.000000001  
    t := time.Date(2021, 10, 1, 12, 30, 0, 0, time.UTC)  
    t2 := time.Date(2021, 9, 1, 12, 30, 0, 0, time.UTC)  
    fmt.Println(t)                                                              // 2021-10-01 12:30:00 +0000 UTC  
    fmt.Println(t.Year(), t.Month(), t.Day(), t.Hour(), t.Minute(), t.Second()) // 2021 10 1 12 30 0  
    fmt.Println(t.Format("2006-01-02 15:04:05"))                                // 2021-10-01 12:30:00  
  
    diff := t2.Sub(t)  
    fmt.Println(diff)                           // -720h0m0s  
    fmt.Println(diff.Minutes(), diff.Seconds()) // -43200 -2.592e+06  
    t3, err := time.Parse("2006-01-02 15:04:05", "2021-10-01 12:30:00")  
    if err != nil {  
       fmt.Println(err)  
    }  
    fmt.Println(t3 == t)   // true  
    fmt.Println(t3.Unix()) // 1633091400  
}
```

## 数字解析

```go
package main  
  
import (  
    "fmt"  
    "strconv")  
  
func main() {  
    f, _ := strconv.ParseFloat("3.14", 64)  
    fmt.Println(f) // Output: 3.14  
  
    n, _ := strconv.ParseInt("111", 10, 64)  // 10是指十进制，传0的表示自动识别，64表示精度为64
    fmt.Println(n) // Output: 111  
  
    n, _ = strconv.ParseInt("0x1234", 0, 64)  
    fmt.Println(n) // Output: 4660  
  
    n2, _ := strconv.Atoi("123")  
    fmt.Println(n2) // Output: 123  
  
    n2, err := strconv.Atoi("abc")  
    fmt.Println(n2, err) // Output: 0 strconv.ParseInt: parsing "abc": invalid syntax  
}
```

## 进程信息

```go
package main  
  
import (  
    "fmt"  
    "os"    "os/exec")  
  
func main() {  
    fmt.Println(os.Args)  
  
    fmt.Println(os.Getenv("PATH"))  
    fmt.Println(os.Setenv("AA", "BB"))  
  
    buf, err := exec.Command("grep", "127.0.0.1", "/etc/hosts").CombinedOutput()  
    if err != nil {  
       fmt.Println(err)  
    }  
    fmt.Println(string(buf))  
}
```

# 综合练习

## 猜数字

```go
package main  
  
import (  
    "bufio"  
    "fmt"    "math/rand"    "os"    "strconv"    "strings"    "time")  
  
func main() {  
    maxNum := 100  
    rand.Seed(time.Now().UnixNano())  
    secretNumber := rand.Intn(maxNum)  
  
    for {  
       fmt.Println("Please input your guess")  
       reader := bufio.NewReader(os.Stdin)  
       input, err := reader.ReadString('\n')  
       if err != nil {  
          fmt.Println("An error occurred while reading input, please try again", err)  
          continue  
       }  
       input = strings.TrimSuffix(input, "\n")  
       guess, err := strconv.Atoi(input)  
       if err != nil {  
          fmt.Println("Invalid input, please try again", err)  
          continue  
       }  
       if guess > secretNumber {  
          fmt.Println("Too high, try again")  
       } else if guess < secretNumber {  
          fmt.Println("Too low, try again")  
       } else {  
          fmt.Println("Congratulations, you guessed the number", secretNumber)  
          break  
       }  
    }  
}
```

## 在线词典

**第一步**
首先打开[彩云小译官网 - 高效准确的翻译工具 | 文字翻译 | 文档翻译 | 网页翻译 | 浏览器插件 | 双语对照 | 术语库](https://fanyi.caiyunapp.com/)

按键盘上的 F12 或者右键页面打开检查，随后点击网络

![](MarsCode学习笔记/5.Go/p1.png)

从下往上找第一个dict，右键复制-->复制cURL(bash)

然后打开[curl to Go](https://curlconverter.com/go/)，把复制的代码放在里面，生成 Go

```go
package main  
  
import (  
    "fmt"  
    "io"    "log"    "net/http"    "strings")  
  
func main() {  
    client := &http.Client{}  
    var data = strings.NewReader(`{"trans_type":"zh2en","source":"帅"}`)  
    req, err := http.NewRequest("POST", "https://api.interpreter.caiyunai.com/v1/dict", data)  
    if err != nil {  
       log.Fatal(err)  
    }  
    req.Header.Set("accept", "application/json, text/plain, */*")  
    req.Header.Set("accept-language", "zh")  
    req.Header.Set("app-name", "xiaoyi")  
    req.Header.Set("authorization", "Bearer")  
    req.Header.Set("content-type", "application/json;charset=UTF-8")  
    req.Header.Set("device-id", "")  
    req.Header.Set("origin", "https://fanyi.caiyunapp.com")  
    req.Header.Set("os-type", "web")  
    req.Header.Set("os-version", "")  
    req.Header.Set("priority", "u=1, i")  
    req.Header.Set("referer", "https://fanyi.caiyunapp.com/")  
    req.Header.Set("sec-ch-ua", `"Not A(Brand";v="8", "Chromium";v="132", "Microsoft Edge";v="132"`)  
    req.Header.Set("sec-ch-ua-mobile", "?0")  
    req.Header.Set("sec-ch-ua-platform", `"Windows"`)  
    req.Header.Set("sec-fetch-dest", "empty")  
    req.Header.Set("sec-fetch-mode", "cors")  
    req.Header.Set("sec-fetch-site", "cross-site")  
    req.Header.Set("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36 Edg/132.0.0.0")  
    req.Header.Set("x-authorization", "token:qgemv4jr1y38jyq6vhvi")  
    resp, err := client.Do(req)  
    if err != nil {  
       log.Fatal(err)  
    }  
    defer resp.Body.Close()  
    bodyText, err := io.ReadAll(resp.Body)  
    if err != nil {  
       log.Fatal(err)  
    }  
    fmt.Printf("%s\n", bodyText)  
}
```

**第二步**

我们需要把所需的文本转成 json

```go
package main  
  
import (  
    "bytes"  
    "encoding/json"    "log"    "net/http")  
  
type DictRequest struct {  
    TranType string `json:"tran_type"`  
    Source   string `json:"source"`  
    UserID   string `json:"user_id"`  
}  
  
func main() {  
    client := &http.Client{}  
    request := DictRequest{TranType: "EN-ZH", Source: "good"}  
    buf, err := json.Marshal(request)  
    if err != nil {  
       log.Fatal(err)  
    }  
    var data = bytes.NewReader(buf)  
    req, err := http.NewRequest("POST", "https://api.interpreter.caiyunai.com/v1/dict", data)  
    if err != nil {  
       log.Fatal(err)  
    }  
}
```

后因工具因素暂未完成（工具网址暂停运用了），大概工作是对照所需要的 json 来生成 struct，最后全部拼接到一起