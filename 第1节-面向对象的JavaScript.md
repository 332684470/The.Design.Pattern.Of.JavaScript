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
    if(animal&&typeof (animal.singingLikeDuck==="function")){
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



