# 第 8 节-Fetch 和 Axios

## fetch()

fetch()是 Fetch API 提供的一个全局方法,是现在比 XHR 使用更多的方案

由于 fetch()是基于 Promise 的,故而 fetch()只用于发起异步的请求(XHR 可以自行选择同步还是异步)

```
fetch()必须传入一个参数 input,这个参数是要获取资源的 URL
还可以传入一个可选参数 init,可以配置对请求的设置,如method(GET,POST等) header等等

fetch()会返回一个promise实例对象,且在resolve后,状态变为fulfilled,
[[PromiseResult]]存储一个Response对象
```

```javascript
let promise = fetch("example.txt");
console.log(promise); //Promise
(async () => {
    let response = await promise;
    console.log(response.ok); //true
    console.log(response.status); //200
    // text()方法返回一个promise实例对象,resolve为取得资源的完整内容
    console.log(response.text().then((text) => console.log(text)));
})();
```

如果 fetch 无法建立一个 HTTP 请求,例如网络问题,亦或是请求的网址不存在,那么 promise 就会 reject
异常的 HTTP 状态，例如 404 或 500，不会导致出现 error,promise 依旧会 resolve

```javascript
let promise = fetch("example_not_exists.txt");
console.log(promise); //Promise
(async () => {
    let response = await promise;
    console.log(response.ok); //false
    console.log(response.status); //404
})();
```

### fetch()发送 JSON 数据

```javascript
let data = JSON.stringify({ standName: "世界" });
let jsonHeaders = new Headers({
    "Content-Type": "application/json",
});
let promise = fetch("example.html", {
    method: "POST",
    body: data,
    headers: jsonHeaders,
});
```

### fetch()在请求体中发送参数

因为请求体支持任意字符串值，所以可以通过它发送请求参数

```javascript
let data = "standName=黄金体验&standNameNew=黄金体验镇魂曲";
let paramHeaders = new Headers({
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
});
let promise = fetch("example.html", {
    method: "POST",
    body: data,
    headers: paramHeaders,
});
```

## Axios

Axios 是一个基于 promise 的网络请求库，可以用于浏览器和 node.js

在服务端它使用原生 node.js http 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests

https://www.axios-http.cn/docs/intro
