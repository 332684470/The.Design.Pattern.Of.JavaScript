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


