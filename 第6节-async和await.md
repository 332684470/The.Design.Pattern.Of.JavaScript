# 第 6 节-async 和 await

与 Promise 一样,async 和 await 也是后面才诞生的

作为关键字,可以让我们更便捷地使用 Promise

## async

```javascript
// async可以放在函数前
async function fn1() {
    console.log("恋人");
}
let fn2 = async function () {
    console.log("太阳");
};
let fn3 = async () => {
    console.log("沙滩男孩");
};
console.log(fn1()); //恋人
console.log(fn2()); //太阳
console.log(fn3()); //沙滩男孩
console.log(fn1().then(console.log)); //undefined

// 我们能发现fn1 fn2 fn3调用后,会返回一个promise实例对象
// 且显示地return一个promise实例对象甚至是自定义返回值最终都会返回promise实例对象

let fn4 = async function () {
    // Promise.resolve(value)会返回一个fulfill状态且带有结果value的promise实例
    // Promise.reject(reason)会返回一个rejected状态且带有原因reason的promise实例
    return Promise.reject("冲击");
};
let fn5 = async function () {
    return Promise.resolve("青春岁月");
};
let fn6 = async function () {
    return 1;
};

// 即这个函数总是返回一个promise,其他值将自动被包装在一个resolved的promise中
```

## await

await 操作符用于等待一个 Promise 落定(settled)并获取其落定之后的值,

且只能在异步函数(即上方的 async 声明)或者模块顶层中使用(不能在普通函数中使用)

await 实际上会暂停函数的执行(包括该函数内 await 后的所有语句,不论是同步或异步)，

直到 promise 状态落定(settled)，然后以 promise 的结果继续执行

这个行为不会耗费任何 CPU 资源，因为 JS 引擎可以同时处理其他任务:执行其他脚本,处理事件等

```javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve("绿洲"), 10000);
});

async function fn() {
    let value = await promise;
    console.log(value);
}
fn(); //绿洲(大约10s后)

let promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("绯红之王");
    }, 10000);
});

async function fn1() {
    let reason = await promise1.catch((reason) => reason);
    console.log(reason);
}
fn1(); //绯红之王(大约10s后)
```
简而言之,作为关键字
```
async会让一个函数总是返回一个promise实例对象,且允许函数内使用await关键字

await会让JS引擎去等待一个promise落定(settled),这个等待实际上是暂停这个运行中的函数,
JS引擎可以去做别的事情,直到该promise状态落定,然后有异常就抛出,无异常就返回结果
```
