var gameObject = require('./gameObject.js');
var newBullet = require('./bullet.js');

var Enemy = function newEnemy (self, x, y, bullets, asteroids, bossParts, enemies, player, GameManager){
    var obj = gameObject(self, x, y, 'ship');
    obj.marked = false;
    obj.points = 200;
    obj.shooter = 0;
    self.game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(130);
    var speed;
    if(self.game.rnd.between(0,1))
        obj.angle = 180;
    
        self.game.physics.arcade.accelerationFromRotation(obj.rotation, 30, obj.body.acceleration);
    obj.update = function () {
        if (self.game.physics.arcade.overlap(this, asteroids))
            this.marked = true;
        if (player.immune == 0 && self.game.physics.arcade.overlap(this, player)){
            this.marked = true;
            player.marked = true;
        }
        bullets.forEach(element => {
            if(self.game.physics.arcade.overlap(obj, element) && element.ally){
                obj.marked = true;
                GameManager.addScore(this.points);
            }
        });
        if(self.game.time.now > obj.timer){
            if(this.shooter == 0)
                this.shooter = 1;
            else{
                enBlaster.play();
                newBullet(self, this.x, this.y, self.game.physics.arcade.angleBetween(this, player), 240, false, bullets, asteroids, player, bossParts, enemies);
            }
            obj.timer = self.game.time.now + 3000;
        }
        this.screenwarp();
        }
    obj.lateUpdate = function (){
        if(this.marked){
            explosion.play();
            this.createExplosion(0.6);
            this.destroy();
            destruction.play();
        }
    }
    enemies.add(obj);
    return obj;
}

module.exports = Enemy;