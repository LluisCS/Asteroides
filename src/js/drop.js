var gameObject = require('./gameObject.js');

var Drop = function newDrop (self, x, y, player) {
    var num;
    var dropNum = self.game.rnd.between(0,10);
    if (dropNum <= 3){
        num = 1;
    }
    else if(dropNum <= 6){
        num = 2;
    }
    else{
        num = 3;
    }
    var obj = gameObject(self, x, y, 'powerUp' + num);
    obj.anchor.set(0.5);
    self.game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.num = num;
    obj.update = function (){
        if (player.immune == 0 && self.game.physics.arcade.overlap(this, player)){
            pUp.play();    
            player.takePower(obj.num);
            this.destroy();
        }
    }
}

module.exports = Drop;