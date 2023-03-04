# 第 7 节-Ajax 与 XMLHttpRequest

## Ajax

### Ajax(Asynchronous JavaScript And XML),即异步的 JavaScript 和 XML

```
其诞生的目的是更好地与服务器进行通信
Ajax 可以使用 JSON，XML，HTML 和 text 文本等格式发送和接收数据(即不一定是 XML)
且最重要的一点是异步(Asynchronous)的 JS 使其可以在不重新刷新页面的情况下与服务器通信,交换数据,或更新页面
即 Ajax 主要做两件事:1.在不重新加载页面的情况下发送请求给服务器 2.接受并使用从服务器发来的数据
```

## XMLHttpRequest 对象

Ajax 在早期能够普及开来,微软创建的 XMLHttpRequest 对象(XHR)功不可没

所有现代浏览器都支持通过 XMLHttpRequest 构造函数去创建 XHR 实例对象

```javascript
let xhr = new XMLHttpRequest();
console.log(xhr);
```

XHR 实例对象的使用

```javascript
let xhr = new XMLHttpRequest();
// 使用XHR实例对象首先需要使用open()方法
// 初始化一个新创建的请求,或重新初始化一个请求(并非是发起请求)
// 为已激活的请求调用此方法,即open()或openRequest()已被调用,相当于调用abort()
// 一般该方法接收三个参数:
// 1.请求类型(get post等 有些浏览器要求必须大写)
// 2.请求URL(相对或绝对都可以)
// 3.请求是否异步的布尔值(可以不传该参数,默认为true,即异步)
// ***只能访问同源 URL,也就是域名相同,端口相同,协议相同
//    如果请求的 URL 与发送请求的页面在任何方面有所不同,则会抛出安全错误
xhr.open("GET", "example.php", false);

// send()方法用于发送HTTP请求
// 如果是异步请求(默认为异步请求),则此方法会在请求发送后立即返回
// 如果是同步请求,则此方法直到响应到达后才会返回
// 该方法接受一个参数作为请求体发送的数据,若不需要传或不能传的情况下建议设置为null
// 尽管不传入该参数,默认也为null,但有些浏览器不支持
xhr.send(null);

// 收到响应后,XHR实例对象的一些属性会被赋值
// responseText:作为响应体返回的文本
// responseXML:如果响应体的内容类型是"text/xml"或"application/xml",
//            那就是包含响应数据的 XML DOM 文档
// status:响应的 HTTP 状态
// statusText:响应的 HTTP 状态描述

// 收到响应后,应先判断响应是否成功返回,即查看status属性
// 一般来说,该属性值为2xx时就表示成功,且此时若responseText或responseXML如果内容类型正确属性中会有内容
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    console.log(xhr.responseText);
} else {
    console.log("error " + xhr.status);
}
```

以上代码是以同步形式书写,但实际上在发送请求方面多数的还是用异步请求更好

既然是异步的请求,那会不会存在某个值和某个事件供我们来判断请求/响应的完成情况呢

---

readyState 与 readystatechange

XHR 实例对象有一个 readyState 属性,表示着当前处于请求/响应的具体阶段

```
readyState 可能的值:
0:未初始化(Uninitialized),未调用 open()方法
1:已打开(Opened),已调用 open()方法,尚未调用 send()方法
2:已发送(Sent),已调用 send()方法,尚未收到响应
3:接收中(Receiving),已经收到部分响应
4:完成(Complete),已经收到所有响应
```

每一次 readyState 的值改变,都会触发一个事件
readystatechange(目前已被 load/error/progress 等所替代)

一般来说只关心值为 4 的时候

```javascript
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status) || xhr.status == 304) {
            console.log(xhr.responseText);
        } else {
            console.log("error " + xhr.status);
        }
    }
};
xhr.open("GET", "example.php", true);
xhr.send(null);
```

在收到响应之前如果想取消异步请求,可以调用 abort()方法

```javascript
xhr.abort();
```



## HTTP 头部

每个 HTTP 请求和响应都带有一些头部字段,他们可能对开发者有所作用

如 Accept Accept-Charset Cookie 等等

若是需要发送额外的请求头部,可以使用 setRequestHeader()方法

该方法接收两个参数,头部字段的名称和值

```javascript
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
    if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status) || xhr.status == 304) {
            console.log(xhr.responseText);
        } else {
            console.log("error " + xhr.status);
        }
    }
};
xhr.open("GET", "example.php", true);
xhr.setRequestHeader("MyHeader", "MyValue");
xhr.send(null);
```

获取响应头可以使用 getResponseHeader()方法

该方法接收一个参数作为要返回的头部字段的名称

如果连接未完成，响应中不存在该字段，或者被 W3C 限制，则返回 null

或者使用 getAllResponseHeaders()去获得所有的响应头部
