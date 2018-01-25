var gameObject = require('./gameObject.js');

var Bullet = function newBullet (self, x, y, rot, speed, ally, bullets, asteroids, player, bossParts, enemies){
    var skin;
        if(ally)
            skin ='bullet2';
        else
            skin ='bullet';
        var bullet = gameObject(self, x, y, skin);
        bullet.scale.setTo(0.5, 0.5);
        self.game.physics.enable(bullet, Phaser.Physics.ARCADE);
        if(ally)
            bullet.lifespan = 1200;
        else
            bullet.lifespan = 2000;                
        bullet.rotation = rot;
        bullet.marked = false;
        bullet.ally = ally;
        bullet.update = function () {
            self.game.physics.arcade.velocityFromRotation(rot, speed, bullet.body.velocity);
            this.screenwarp();
            if (self.game.physics.arcade.overlap(this, asteroids) || self.game.physics.arcade.overlap(this, bossParts)){
                this.marked = true;
                this.createExplosion(0.3);
            }
            if(ally){
                if (self.game.physics.arcade.overlap(this, enemies))
                this.marked = true;
            }
            else
                if (player.immune == 0 && self.game.physics.arcade.overlap(this, player)){
                   this.marked = true;
                   player.marked = true; 
                }
        }
        bullet.lateUpdate = function () {
            if(this.marked)
                this.destroy();
        }
        bullets.add(bullet);
        return bullet;
    }

module.exports = Bullet;