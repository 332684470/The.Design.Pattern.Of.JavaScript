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
console.log(fn1().then(console.log));//undefined

// 且我们能发现fn1 fn2 fn3调用后,会返回一个promise实例对象
```
