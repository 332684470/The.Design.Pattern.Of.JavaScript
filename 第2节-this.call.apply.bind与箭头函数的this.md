# 第2节-this.call.apply.bind与箭头函数的this

## this

在JS中this不太一样,他的指向是运行时根据调用方式的不同动态决定的,
而并非声明时就定好(但新增的箭头函数例外).

一般情况下,有以下几种情况

```Javascript
// 1.作为对象的方法调用
// 当函数作为对象的方法调用时,this指向该对象
let obj={
    name:'obj',
    getName:function(){
        console.log(this.name,this);
    }
}
obj.getName();//obj {name: 'obj', getName: ƒ}


// 2.作为普通函数调用
// 当函数作为普通函数调用时,this指向全局对象
// 而浏览器中全局对象即为window对象
console.log(this===window);//true
window.name='白金之星';
let obj={
    name:'杀手皇后',
    getName:function(){
        return this.name;
    }
}
let getName=obj.getName;
console.log(obj.getName());//杀手皇后
console.log(getName());//白金之星

// 但严格模式下,这种情况的this不会指向window而是undefined
function fn(){
    "use strict";
    console.log(this);
}
fn()//undefined


// 3.构造器调用
// 我们已经知道,通过new调用函数可以使其成为构造器,创建对象
// 所以我们应该知道这种情况下函数会返回一个对象,
// 而this也正是指向这个对象
// 为了便于理解这里采用旧式写法
function Stand(){
    this.name='白金之星';
    }
let obj=new Stand();
console.log(obj.name);//白金之星

// 若设置返回值为一个对象且必须是object类型对象(显式返回),
// 那么该this会指向这个返回的对象
function Stand(){
    this.name='白金之星';
    return {
        name:'杀手皇后'
    };
}
let obj=new Stand();
console.log(obj.name);//杀手皇后
```

## 丢失的this

```JavaScript
let obj={
    standName:'杀手皇后',
    getName:function(){
        console.log(this);
        return this.standName;
    }
}
let getName=obj.getName;
console.log(obj.getName());//杀手皇后
console.log(getName());//undefined
// 不难发现当方法调用方式改变后,this的指向改变了

// 那么如何做到动态地且自主地指定想要的this指向
// ES3给Function的原型(Function.prototype)定义了两个方法
// 即 Function.prototype.call 和 Function.prototype.apply

// 1.Function.prototype.apply
// apply()方法调用一个具有给定 this 值的函数，以及以一个数组（或一个类数组对象）的形式提供的参数
// apply(thisArg)
// apply(thisArg, argsArray)
let fn1=function (a,b,c){
    console.log([a,b,c]);
}
fn1.apply(null,[1,2,3]);//[1, 2, 3]

// 2.Function.prototype.call
// call()方法使用一个指定的 this 值和单独给出的一个或多个参数来调用一个函数
// call(thisArg)
// call(thisArg, arg1, arg2, ...)
let fn2=function (a,b,c){
    console.log([a,b,c]);
}
fn2.call(null,1,2,3);//[1, 2, 3]
```

apply()和call()的作用完全一致,唯一的区别就是传入参数的形式不同

```JavaScript
// thisArg参数
// thisArg参数即apply()和call()方法传入的第一个参数,代表了函数内this的指向
// 当这个参数为null或者undefined的时候,函数内的this会默认地指向宿主对象
// 在浏览器中即window对象,当然严格模式下会失效,即this===null或this===undefined
```

## apply()和call()的用途

1.改变this的指向

```JavaScript
window.name='世界';
let obj1={
    name:'白金之星'
};
let obj2={
    name:'黄金体验'
};
const getName=function (){
    console.log(this);
    console.log(this.name);
}
getName();//Window  世界
getName.apply(obj1);//{name: '白金之星'}  白金之星
getName.call(obj2);//{name: '黄金体验'}  黄金体验



```
2.借用其他对象的方法
插眼------------------------------------------------------------------

## bind()
Function.prototype.bind()和前二者相似,但是返回的是一个函数,且不会立即执行
```JavaScript
// bind(thisArg[, arg1[, arg2[, ...]]])
// bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用
let obj={
    standName:"性感手枪",
    getName:function (){
        return this.standName;
    }
};
let noBind=obj.getName;
console.log(noBind());//undefined
let withBind=noBind.bind(obj);
console.log(withBind());//性感手枪
```

## 箭头函数的this
箭头函数不会创建自己的this,他的this是从自己的作用域链的上一层得来
```JavaScript
let obj = {
    standName: '钢链手指',
    getName:()=>{
        console.log(this,this.standName);
    },
    getName1:function (){
        let getName2=()=>{
            console.log(this,this.standName);
        }
        getName2();
    }
}
obj.getName();//Window  undefined
obj.getName1();//{standName: '钢链手指', getName: ƒ, getName1: ƒ} '钢链手指'
// 若getName2是以function声明的函数,调用getName2(),this指向window对象
```
