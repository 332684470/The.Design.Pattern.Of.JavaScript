# 第 4 节-异步与Promise

## 同步与异步

同步行为对应着内存中顺序执行的处理器指令

每条指令都会严格按照他们出现的顺序执行,且执行后就能立即获得

存储在系统本地的内容和信息
例如:

```JavaScript
// 简单的同步实例
let a=1;
a=a+1;
console.log(a);//2
```

我们可以发现无论执行多少次,上方代码在输出 a 时,a 都是 2,

且我们作为阅读者在阅读代码时,也能做到判断和推断

同步的代码的确是对程序员友好的,但是在实际生活中,

代码也被设计为访问一些高延迟的资源或者一个需要大量时间运行的函数等等

比如向远程服务器发送请求并等待响应或者循环生成大量内容的代码

耗费长时间去等待显然不是最佳的方案

而异步就是更好的方案

```JavaScript
// 异步实例
let a=1;
setTimeout(()=>a++,10000);
console.log(a);//1
```

从这个异步的代码可以看出程序直到最后输出的 a 的值依旧为 1

同时如果我们等待一定时间(大约 10s),在控制台查询 a 的值的话,会发现它变成了 2

同时我们能预想到,若是代码足够多足够复杂,我们将会失去判断和推断代码运行的能力

那么如果我们想在 a 改变后,知道他改变了然后才使用他,该如何去做呢

## JS 中异步的发展

早期 JS 中,定义回调函数来表明异步操作完成

不过,若是需要用到异步操作完成后返回的值(异步操作的函数无法使用 return 设置返回值),

普遍的的方案是提供一个回调函数给异步操作,这个回调函数包括了需要用到返回值的代码

```javascript
function plusOne(value, callback) {
    setTimeout(() => {
        value += 1;
        callback(value);
    }, 1000);
}
plusOne(1, (value) => {
    console.log("now the value is " + value); //2
});
```

但如果我们需要频繁多次地用到返回的值,就必须进行嵌套

同时也会发现这样的代码及其难以阅读维护和扩展,甚至看一眼都想晕过去,

即臭名昭著的回调地狱问题

```javascript
plusOne(1, (value) => {
    plusOne(value, (value) => {
        plusOne(value, (value) => {
            plusOne(value, (value) => {
                plusOne(value, (value) => {
                    plusOne(value, (value) => {
                        console.log("now the value is " + value);
                    });
                });
            });
        });
    });
});
//now the value is 7
```

## promise

promise 即目前人们经常提起的期约(一部分人称其为承诺)

promise 期约这个概念在上个世纪就已经诞生,是对尚不存在的结果的一个替身

ES6 更新了 Promise 这个引用类型,使用 new 实例化,创建新期约实例时需要传入执行器函数(executor)当作参数

```javascript
let p1 = new Promise(() => {}); //简单示例,传入了一个空函数
console.log(p1); //Promise {<pending>}
```

那么究竟如何理解 promise

首先设想一个场景,一个售卖新款笔记本电脑的商家和一群笔电发烧友

这群笔电发烧友迫不及待地想要买到最新款的笔记本电脑,而商家手里却并没有现货可以售卖

则此时无论发烧友如何哀求,这新款笔记本都是买不到的

不过商家 promise 他会在到货的第一时间通知这群发烧友,则他们就能第一时间买到

```javascript
// 创建promise实例
let promise = new Promise((resolve, reject) => {
    // executor
});

// 传递给new Promise的函数称为executor(执行器)
// 当promise实例被创建时,它(执行器)会自动运行
// 而其中的参数resolve和reject也是回调函数
// 当executor执行并产生最终结果时,应当执行这两个回调函数中的一个
// resolve(value)--->任务成功且带有结果value
// reject(error)---->执行中出现错误error(即error对象)
```

### promise 的内部属性

```javascript
console.log(new Promise((resolve, reject) => {})); //Promise {<pending>}
// 通过控制台查看promise实例时,可以发现两个奇特的隐藏属性
// [[PromiseState]]和[[PromiseResult]]
```

#### [[PromiseState]]与三种状态

```
promise是一个有状态的对象,可能处于三种状态,分别是
pending(待定)状态
fulfilled(兑现,有时也叫解决 resolved)
rejected(拒绝)

promise最初始状态是pending,但并非初始化实例的时候一定得是pending

在pending状态下,promise可以落定(settled)为代表成功的fulfilled状态
和代表代表失败的rejected状态,且该落定行为会且只会有一次,即状态改变后是不可变不可逆的,
故promise可以永远处于pending也可以落定为fulfilled或rejected,一旦落定就不再改变

更应知道的是,[[PromiseState]]属性是私有的,即外部无法访问到也无法进行修改,其目的是为了避免
外界的代码直接通过该属性处理了promise,甚至导致本该是异步的代码被设计成了同步代码的情况
```

#### [[PromiseResult]]

该属性的作用是存储需要的数据,最初为 undefined

```
当调用resolve(value)时,即任务执行成功且带有结果value时,
[[PromiseResult]]属性会从undefined--->value

当调用reject(error)时,即执行中出现错误error(即error对象)时,
[[PromiseResult]]属性的值会从undefined--->error

```

```javascript
let promise = new Promise((resolve, reject) => {
    // 这里假设有一段异步的业务代码(当然resolve和reject也可以立即执行)
    // 然后得到需要的value
    let value;
    setTimeout(() => {
        value = "白金之星";
        resolve(value);
        reject(new Error("世界"));
        console.log(promise);
    }, 1000);
});
console.log(promise);

// Promise {<fulfilled>: '白金之星'}
// 从上方的执行结果可知,该value值被存储在了[[PromiseResult]]里,
// 且[[PromiseState]]状态也变为了fulfilled
// 再者resolve后的reject代码并未生效
// 但如果注释掉上方的resolve(value),
// 可以看到输出变为了Promise {<rejected>: Error: 世界}
// 也即是之前提到的一次落定,再不更改
```

下面再来理清一编具体的顺序

首先回想一遍,我们一般在什么情况下会使用 promise---答案是异步操作

而到目前为止,我们先创建 promise 实例,然后假设在 executor 里写入了了异步操作的业务代码

最后通过传入 executor 的参数(resolve 和 reject 这两个回调函数)对业务代码的最终结果进行了存储

(根据具体调用的是 resolve 还是 reject,[[PromiseState]]改变,[[PromiseResult]]也改变)

这其实在做什么,这不正是在做买卖新款电脑故事中老板的事情吗

> 首先设想一个场景,一个售卖新款笔记本电脑的商家和一群笔电发烧友......(我把电脑生产出来,然后准备卖给发烧友大赚一笔!!!)

```
对于reject(error)的调用,
可以理解为电脑在生产时出现设计缺陷,或工厂材料短缺等等问题导致无法正常进行生产的情况
```

因此接下来需要考虑的就是发烧友的事情了(老板已经生产了电脑,我要下单了!!!),即访问这个 value 且能够操作他.

### Promise.prototype.then(),Promise.prototype.catch()和 Promise.prototype.finally()

根据之前提到的,[[PromiseState]]和[[PromiseResult]]是俩被隐藏的内部属性

如果我们想访问它,必然是通过被封装好的方法进行访问

---

Promise.prototype.then()

```javascript
// Promise.prototype.then()
// 他最多接收两个参数(onFulfilled函数和onRejected函数),且都是可选的,若传入,
// 则会在promise实例分别变为fulfilled和rejected状态时执行

// onFulfilled()
// 当promise的状态变为fulfilled时调用的函数,该函数有一个参数,即接收的最终结果(上面的value)
// 若onFulfilled不为一个函数,则会自动变为(onFulfilled)=>onFulfilled的形式

// onRejected()
// 当promise的状态变为rejected时调用的函数,该函数也有一个参数,即拒绝的原因(一般写作reason)
// 若onRejected不为一个函数,则会自动变为一个thrower函数,即(onRejected)=>{throw onRejected;}

// promise的状态变为fulfilled时
let promise = new Promise((resolve, reject) => {
    // 这里假设有一段异步的业务代码(当然resolve和reject也可以立即执行)
    // 然后得到需要的value
    let value;
    setTimeout(() => {
        value = "白金之星";
        resolve(value);
        reject(new Error("世界"));
        console.log(promise);
    }, 1000);
});
console.log(promise);
promise.then(
    (value) => {
        // 执行
        console.log(value); //白金之星
    },

    (reason) => {
        // 不执行
        console.log(reason);
    }
);
// ---------------------------------------------------------

// promise的状态变为rejected时
let promise = new Promise((resolve, reject) => {
    // 这里假设有一段异步的业务代码(当然resolve和reject也可以立即执行)
    // 然后得到需要的value
    let value;
    setTimeout(() => {
        value = "白金之星";
        // resolve(value);
        reject(new Error("世界"));
        console.log(promise);
    }, 1000);
});
console.log(promise);
promise.then(
    (value) => {
        // 不执行
        console.log(value);
    },

    (reason) => {
        // 执行
        console.log(reason); //Error: 世界
    }
);
```

根据之前提到过的[[PromiseState]]一次落定,再不更改,可知这两个函数必然是互斥的

如果只关心成功的情况,可以只传入一个参数,即 onFulfilled

若只关心错误的情况,第一个参数需要传入 null 或者 undefined,后者传入 onRejected,

当然也可以使用下面要提到的 Promise.prototype.catch()

---

Promise.prototype.catch()

```javascript
// 与Promise.prototype.then()类似的是,catch()也需要传入函数作为参数.不同的是
// 他只接收onRejected作为参数
// 例如
let promise = new Promise((resolve, reject) => {
    reject(new Error("航空史密斯"));
});
promise.catch((reason) => {
    console.log(reason);
}); //Error: 航空史密斯
promise.then(null, (reason) => {
    console.log(reason);
}); //Error: 航空史密斯
promise.then(undefined, (reason) => {
    console.log(reason);
}); //Error: 航空史密斯
// 这三种写法是等价的,因为本质上catch就是then的一个语法糖
```

---

Promise.prototype.finally()

在提到 finally 前,我们最好先了解一个东西,即 Promise 链

---

### Promise 链

到目前为止,我们已经了解了如何存储异步操作的结果和数据,也知道了如何读取数据或错误信息

但是我们继续思考,为什么我们依旧"抛弃"了也能做到这些事情的回调函数呢

因为我们想进一步使用异步操作后的结果,就必须进行嵌套调用,这样的代码只要足够多足够复杂

产生回调地狱几乎是板上钉钉的事情,那 Promise 的诞生是如何解决这个问题的,那就是基于 Promise 的链式调用

```javascript
let p1 = new Promise((resolve, reject) => {
    resolve("辛红辣椒");
});
let pt = new Promise((resolve, reject) => {
    resolve("辛红辣椒");
}).then((value) => {
    console.log(value);
});
let pc = new Promise((resolve, reject) => {
    resolve("辛红辣椒");
}).catch((reason) => {
    console.log(reason);
});

setTimeout(() => {
    console.log(p1, pt, pc);
    console.log(p1 === pt);
    console.log(pt === pc);
}, 1000);

// 从上方代码的执行结果能发现,不管是调用then还是catch,
// 他们返回的结果竟然都是一个promise实例,且并不会改变原promise实例
// 这也就意味着该新的promise实例也能调用then和catch方法,而且是以链式的方式调用

// Promise链式调用
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("面部特写");
    }, 1000);
});
promise
    .then((value) => {
        console.log(value);
    })
    .then((value) => {
        console.log(value);
        value = "黄金体验";
        return value;
    })
    .then((value) => {
        console.log(value);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("黄金体验镇魂曲");
            }, 1000);
        });
    })
    .then((value) => {
        console.log(value);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject("回音ACT1");
            }, 1000);
        });
    })
    .catch((reason) => {
        console.log(reason);
    });

// 输出为:
// 面部特写
// undefined
// 黄金体验
// 黄金体验镇魂曲
// 回音ACT1

// 上方即是一个简单的promise链式调用的例子

// 你可能已经发现,怎么有的then里面的回调函数没有显示地return,有的直接return了一个值,
// 甚至有的主动return了一个自定义的promise实例,
// 这和我们之前提过的then和catch都会返回一个新promise实例有什么关联吗
// 我们需要先了解他们的返回值
```

---

then 和 catch 的返回值

```
then的返回值
如果then中的回调函数:
1.无返回值,则then返回的promise实例会成为fulfilled状态,
且新promise实例里fulfilled状态的回调函数(即resolve)的参数为undefined,
即resolve(undefined)

2.返回一个值(a),则then返回的promise实例会成为fulfilled状态,
且新promise实例里fulfilled状态的回调函数(即resolve)的参数为该值,
即resolve(a);

3.返回一个已经是fulfilled状态的promise实例,
则then的返回的promise实例也是fulfilled状态,
且then中回调函数里的promise的参数值会成为
then返回的新的promise实例中的fulfilled状态的回调函数(即resolve)的参数

4.返回一个已经是rejected状态的promise实例,
则then的返回的promise实例也是rejected状态,
且then中回调函数里的promise的参数值会成为
then返回的新的promise实例中的rejected状态的回调函数(即reject)的参数

5.抛出一个错误,则then的返回的promise实例是rejected状态,
且该错误会成为新promise实例里rejected状态的回调函数(即reject)的参数

6.返回一个pending状态的promise实例,
则then的返回的promise实例也是pending状态,
且then返回的新promise的终态将和then中的回调函数返回的promise终态保持一致
状态改变(pending--->fulfilled或rejected)时其回调(resolve或reject)的参数也是相同的

```

```javascript
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("1");
    }, 1000);
});
let p2 = p1.then((value) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(value);
        }, 10000);
    });
});
// 返回一个pending状态的promise实例(暂时)
// 控制台可见
// 大约10s后 p2由Promise {<pending>}变为Promise {<fulfilled>: '1'}
```

```
catch的返回值
返回一个新的promise实例,无论当前的promise状态如何,
他返回时都会返回状态为pending的新promise实例,
若catch的回调函数(即onRejected)抛出一个错误或者返回一个rejected状态的promise,
那么这个catch返回的新promise实例也为rejected状态,否则新promise最终为fulfilled状态

根据之前提到过的,catch是then的语法糖,及实际上会调用then(undefined,onRejected)
```

```javascript
let p1 = new Promise((resolve, reject) => {
    reject("廉价把戏");
});
let p2 = p1.catch((reason) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("忧郁蓝调");
        }, 10000);
    });
});
// 控制台可见
// p1为Promise {<rejected>: '廉价把戏'}
// p2在较早时间为Promise {<pending>}
// 大约10s后 p2变为Promise {<fulfilled>: '忧郁蓝调'}
```

---

Promise.prototype.finally()

```
需要传入一个回调函数(onFinally)作为参数,但onFinally不传入参数
和catch与then相同,调用finally方法也会返回一个新的promise,
在promise结束时,无论他是fulfilled还是rejected,finally的回调函数都会执行
这样的设计为promise结束后无论成功与否都会执行一些语句的情况提供了更方便的实现方案
```

```
finally()的返回值
finally在本身无异常抛出的情况下,会返回原本的promise(Returns an equivalent Promise),
或者说等价原promise的promise实例.若是onFinally抛出了异常或者返回了一个rejected状态的promise实例,
则finally()会返回rejected状态且带有那个错误值的promise实例,
否则onFinally的返回值不会对原promise的状态有任何影响
```

### promise 链与处理异常

当一个 promise 被 reject 时,控制权将被移交至最近的能处理它的地方

```javascript
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("灰塔");
    }, 1000);
});
promise
    .then((value) => console.log(value))
    .catch((reason) => console.log(reason)); //灰塔
// -------------------------------------------------
let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("灰塔");
    }, 1000);
});
promise.then(
    (value) => console.log(value),
    (reason) => console.log(reason) //灰塔
);

// 以上两种情况可以看出
// 第一种被reject的promise他并未被(无onRejected的)then处理,而是被后面catch处理了
// 即可以看出,catch并非必须是立即的,因此完全可以将他放在promise链的末尾处理异常
```

隐式的 try...catch

```javascript
// 在promise的executor(执行器)和promise处理程序周围存在隐式的try...catch.
// 即所有同步错误都会得到处理
// 如果发生异常,就会自动执行reject()
let promise = new Promise((resolve, reject) => {
    throw new Error("黄色节制");
    // 完全等价于
    // reject(new Error("黄色节制"));
});
promise
    .then((value) => console.log(value))
    .catch((reason) => console.log(reason)); //Error: 黄色节制
```
