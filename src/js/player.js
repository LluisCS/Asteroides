var gameObject = require('./gameObject.js');
var newBullet = require('./bullet.js');

var Player = function newPlayer (self, bullets, asteroids, bossParts, enemies, cursors, GameManager){
    var obj = gameObject(self, 300, 300, 'ship2');
        self.game.physics.enable(obj, Phaser.Physics.ARCADE);
        obj.body.drag.set(100);
        obj.body.maxVelocity.set(400);
        obj.power = 0;
        obj.marked = 0;
        obj.immune = 0;
        obj.period = 0;
        obj.bulletTime = 0;
    
        obj.shoot = function (power) {
            if (self.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
            {    
                if (self.game.time.now > this.bulletTime)
                {
                    laser.play();
                    if (power == 1){
                        newBullet (self, this.body.x + 28, this.body.y + 20, this.rotation+0.2, 450, true, bullets, asteroids, this, bossParts, enemies);
                        newBullet (self, this.body.x + 28, this.body.y + 20, this.rotation-0.2, 450, true, bullets, asteroids, this, bossParts, enemies);
                    }
                    if(power == 2){
                        newBullet (self, this.body.x + 28, this.body.y + 20, this.rotation + self.game.rnd.between(-3,3)/10, 450, true, bullets, asteroids, player, bossParts, enemies);
                        this.bulletTime = self.game.time.now + 100;
                    }
                    else{
                        newBullet (self, this.body.x + 28, this.body.y + 20, this.rotation, 450, true, bullets, asteroids, player, bossParts, enemies); 
                        this.bulletTime = self.game.time.now + 350;
                    }
                }
            }
        }
        obj.move = function () {
            if (cursors.up.isDown)
            {
                self.game.physics.arcade.accelerationFromRotation(this.rotation, 230, this.body.acceleration);
            }
            else
            {
                this.body.acceleration.set(0);
            }
        
            if (cursors.left.isDown)
            {
                this.body.angularVelocity = -300;
            }
            else if (cursors.right.isDown)
            {
                this.body.angularVelocity = 300;
            }
            else
            {
                this.body.angularVelocity = 0;
            }
            this.screenwarp();
        
        }
        obj.update = function () {
            obj.shoot(obj.power);
            obj.move();
            if (obj.immune == 0 ){
                if  (self.game.physics.arcade.overlap(this, asteroids) || self.game.physics.arcade.overlap(this, bossParts))
                    this.marked = 1;
                else if (this.power > 0 && self.game.time.now > this.period)
                    this.power = 0;
            }
            if (obj.immune == 1){
                if (self.game.time.now > this.timer){
                    if(this.alpha == 1)
                        this.alpha = 0.5;
                    else 
                        this.alpha = 1;
                    this.timer = self.game.time.now + 300; 
                }
                if(self.game.time.now > obj.period + 3000){
                    obj.immune = 0;
                    this.alpha = 1;
                }
            }
        }
        obj.lateUpdate = function (){
            if(this.marked == 1){
                explosion.play();
                this.createExplosion(0.9);
                this.marked = 0;
                GameManager.playerDeath();
            }
        }
        obj.revive = function (){
            this.power = 0;
            obj.immune = 1;
            this.body.acceleration.set(0);
            this.body.velocity.set(0);
            this.x = 400;
            this.y = 300;
            obj.period = self.game.time.now;
        }
        obj.takePower = function (num){
            if(num == 1){
                GameManager.lifes++;
                GameManager.updateUI();
            }
            else if (num == 2){
                this.power = 1;
                this.period = self.game.time.now + 12000;
            }
            else{
                this.power = 2;
                this.period = self.game.time.now + 12000;
            }
        }
        return obj;
    }

module.exports = Player;