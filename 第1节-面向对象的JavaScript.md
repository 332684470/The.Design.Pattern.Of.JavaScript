# 第1节-面向对象的JavaScript
## 动态类型语言和静态类型语言
    静态类型语言(如Java):在编译时就确定了变量的类型.
    动态类型语言(如JS):其变量的类型在程序运行时,待变量的被赋予某个值之后,才会具有某种类型.
## 鸭子类型(duck typing)
    鸭子类型的通俗说法是:如果它走起路来像鸭子,叫起来也像鸭子,那它就是只鸭子.
    鸭子类型指导我们关注对象的行为(HAS-A)而不是关注对象本身(IS-A)
代码演示
```JavaScript
let duck={
    singingLikeDuck:function(){
        console.log("嘎嘎嘎");
    }
}
let chicken={
    singingLikeDuck:function(){
        console.log("嘎嘎嘎");
    }
}
let clubOfDucks=[];
function joinTheClub(animal) {
    if(animal&&typeof animal.singingLikeDuck==="function"){
        console.log("u can sing like a duck,welcome!");
        clubOfDucks.push(animal);
    }
}
joinTheClub(duck);//u can sing like a duck,welcome!
joinTheClub(chicken);//u can sing like a duck,welcome!
```
    在动态类型语言的面向对象设计中,鸭子类型至关重要,根据其思想,
    不必借助超类型的帮助,就可以在动态类型的语言中实现一个原则:面向接口编程而不是面向实现编程.
    在静态类型语言中,实现面向接口编程往往需要通过抽象类和接口将等将对象进行向上转型,
    才能实现互相替换使用,也即是体现多态性的价值.
## 多态
    同一操作作用于不同的对象上面,可产生不同的解释和不同的执行效果,这就是多态.
    其思想是将"谁去做以及如何去做"和"做什么"分离开来,即将"可变的事物"和"不可变的事物"进行分离.
    例如歌手可以歌唱(这是不可变的事物),但孙燕姿唱流行,亚当兰伯特却唱摇滚,不同类型的歌手具体唱什么风格的音乐(这是可变的).
    将不可变的部分分隔出来,可变的部分进行封装,就可以赋予程序开发者拓展程序的能力,也符合了开闭原则(对拓展开放,对修改封闭)
一段"多态的"JS代码
```JavaScript
class RockSinger{}
class PopSinger{}
let singing=function(singer){
    if(singer instanceof RockSinger){
        console.log("sing like a rock star");
    }
    else if(singer instanceof PopSinger){
        console.log("sing like a pop star");
    }
}
singing(new RockSinger());//sing like a rock star
singing(new PopSinger());//sing like a pop star
/*
看上去这段代码似乎完成了多态的实现:同一操作作用于不同的对象上面,
可产生不同的解释和不同的执行效果.但我们如果想再添加说唱歌手,
就得对singing函数进行修改,这无疑未实现开闭原则.
*/
```
因此,正确的做法是,先把不变的部分分离出来,即歌手会唱歌
```JavaScript
let singing=function(singer){
    singer.singing();
}
```
再将可变部分封装起来
```JavaScript
class RockSinger{
    singing(){
        console.log("sing like a rock star");
    }
}
class PopSinger{
    singing(){
        console.log("sing like a pop star");
    }
}
singing(new RockSinger());//sing like a rock star
singing(new PopSinger());//sing like a pop star
```
添加说唱歌手
```JavaScript
class Rapper{
    singing(){
        console.log("sing like a rapper");
    }
}
singing(new Rapper());//sing like a rapper
// 即我们不用对之前的代码进行改动,就可以实现程序的更新
```
## JavaScript与生俱来的多态性
    根据多态的思想,将"谁去做以及如何去做"和"做什么"分离,其实就是消除类型之间的耦合.
    而JavaScript作为一个动态类型语言,
    既没有类型检查的过程,也不检查创建的对象类型,也不检查传递的参数类型,也就没有所谓的类型之间的耦合.
    即不用像Java一样通过向上转型实现多态.
## 多态与面向对象程序设计
    多态最根本的作用就是不用再去判断对象是何类型,然后根据判断结果调用对象的某个方法.
    即可以将代码中的条件分支语句转为对象的多态性,进而消除这些条件分支语句.
## 封装
1.封装数据
```JavaScript
/*
起初的JS中并未像某些其他语言一样提供private public protected等关键字来实现不同的访问权限
即我们只能通过依赖变量的作用域来实现封装特性,而且只能模拟出public和private这两种封装特性
但是随着JS标准的更新,我们已经有了其他的方式可以实现封装特性(let和const的块作用域,#,Symbol等)
*/
//这里演示具有函数作用域的var实现封装数据
var obj = (function () {
    var name = "空条承太郎";
    var standName="白金之星"//私有变量
    return {
        name:name,//公有变量
        getName: function () {
            return name;//公有方法
        },
        getStandName: function () {
            return standName;//公有方法
        }
    }
})();
console.log(obj.name);//空条承太郎
console.log(obj.getName());//空条承太郎
console.log(obj.standName);//undefined
console.log(obj.getStandName());//白金之星
```
2.封装实现
```
封装不仅仅是封装数据,也包括隐藏实现细节 设计细节以及隐藏对象的类型等.
从封装实现来看,封装应使得对象内部的变化和细节对于其他对象是不可见的,
可以让对象间的耦合变松散,只通过公开的API接口实现通信 
```
3.封装类型
```
封装类型是静态类型语言(如Java)中一种重要的封装方式,往往通过把对象真正的类型
隐藏在抽象类和接口之后.
JS中并没有对抽象类和接口的支持,在封装类型的方面,JS没有能力也没必要做得更多
```
4.封装变化
```
从设计模式的角度出发,封装在更为重要的层面体现为封装变化.
通过封装变化,将程序中稳定不变的的部分和可变的部分分隔开,即可保证在程序更新中的稳定性和可拓展性
```
## 原型模式和基于原型继承的JS对象系统
    随着JS标准的更新,我们可以通过Class来创建对象.但是这不意味着JS变成了一门基于类的语言,
    JS依旧是通过原型机制来创建对象
使用Class 创建对象
```JavaScript
class Stand {
    standName;
    standSayHello() {
        console.log(`I am ${this.standName}`);
    }
    constructor(standName){
        this.standName=standName;
    }
}
let starPlatinum=new Stand("starPlatinum");
starPlatinum.standSayHello();//I am starPlatinum
```
但是我们会发现
```JavaScript
console.log(typeof Stand);//function
```
那么旧式写法是什么
```JavaScript
function Stand(standName) {
    this.standName=standName;
}
Stand.prototype.standSayHello=function(){
    console.log("I am "+this.standName);
}
let theWorld=new Stand("theWorld");
theWorld.standSayHello();//I am theWorld
```
且
```JavaScript
console.log(typeof Stand);//function
```
原型与原型链
```JavaScript
由旧式的写法不难看出我们创建'类'(JS没有类的概念,这个所谓的'类'是构造器)
的写法和创建函数惊人的相似,实际上当我们通过new去调用函数时,
该函数就不是普通的函数,而是一个函数构造器.
与其说对象有原型,不如说对象的构造器有原型({Constructor}.prototype)
// __proto__与prototype
// JS中给对象提供了__proto__这个隐藏属性,当对象通过new创建后,其__proto__属性会
// 默认地指向其构造器的原型,即
let obj=new Object();
console.log(obj.__proto__===Object.prototype);//true
// 对象的__proto__连接了对象和其构造器的原型
function Stand(standName) {
    this.standName=standName;
}
obj=new Stand('starPlatinum');
console.log(obj.__proto__===Object.prototype);//false
console.log(obj.__proto__===Stand.prototype);//true
console.log(Stand.prototype.__proto__===Object.prototype);//true

// 原型链和访问不存在的属性
let obj1={
    name:'obj1'
}
// 创建关联到obj1的obj2对象
let obj2=Object.create(obj1);
console.log(obj2);//{} 输出obj2会发现他是一个空对象
// 尝试访问obj2.name
console.log(obj2.name);//obj1
// 访问到了name属性且是obj1的name属性
// 由此我们可以知道若是obj1也是类似obj2的方式生成(关联到某个对象),
// 假设是obj0,obj2和obj1中没有的属性但obj0拥有,obj2和obj1也能访问到该属性
// 这种链式的结构也就是原型链

// 基于原型的继承
// 我们知道JS中应该有一个根对象存在,且所有的对象最初都是由该根对象克隆而来
// 即Object.prototype,且他是根对象也是一个空对象
console.log(Object.prototype.__proto__);//null
// 但是如果JS中仅仅是直接克隆根对象,即继承根对象,而就无法基于原型去实现各种各样的继承关系
// 因此我们可以通过选择性地改变对象构造器的原型的指向就可以实现丰富的继承关系
let obj={
    name:'obj'
};
function Person(){}
let p1=new Person();
console.log(p1.name);//undefined
// 改变构造器原型的指向实现继承
Person.prototype=obj;
let p2=new Person();
console.log(p2.name);//obj

// 模拟'类'继承自'类'
function Animal(){}
Animal.prototype={name:'Animal'};//Animal构造器的原型是一个name属性为'Animal'的对象
function Dog(){}
Dog.prototype=new Animal();//Dog的原型是一个由Animal构造器生成的一个对象
let dog=new Dog();
console.log(dog.name);//Animal

// 新式写法的'类'继承自'类'
class Animal{
    name;
    constructor(){
        this.name='Animal';
    }
}
class Dog extends Animal{
    constructor(){
        super();
    }
}
let dog=new Dog();
console.log(dog.name);//Animal
```

```
内容参考自 
《JavaScript设计模式与开发实践》作者: 曾探 出版社: 人民邮电出版社
https://book.douban.com/subject/26382780/
《你不知道的JavaScript》(上中下) 作者: [美] Kyle Simpson 出版社: 人民邮电出版社
https://github.com/getify/You-Dont-Know-JS

所有内容只作为个人学习用途,不用于其他任何用途
更多可见
https://github.com/332684470/The.Design.Pattern.Of.JavaScript
```
