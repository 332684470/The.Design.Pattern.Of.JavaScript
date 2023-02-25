let obj={
    name:'杀手皇后',
    getName:function(){
        console.log(this);
        return this.name;
    }
}
let getName=obj.getName;
console.log(obj.getName());//杀手皇后
console.log(getName());//undefined