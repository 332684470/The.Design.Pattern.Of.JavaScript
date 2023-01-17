let singing=function(singer){
    singer.singing();
}
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

class Rapper{
    singing(){
        console.log("sing like a rapper");
    }
}
singing(new Rapper());//sing like a rapper
