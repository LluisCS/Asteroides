var gameObject = require('./gameObject.js');
var newDrop = require('./drop.js');

var Asteroid = function newAsteroid (self, size, x, y, bullets, asteroids, enemies, GameManager){
    if (size > 0 && size < 4){
        type = self.game.rnd.between(1,3);
        var asteroid = gameObject(self, x, y, size + 'Asteroid' + type);
        if(size == 3)
            asteroid.points = 20;
        else if(size == 2)
            asteroid.points = 50;
        else
            asteroid.points = 100;
        asteroid.marked = false;
        self.game.physics.enable(asteroid, Phaser.Physics.ARCADE);
        asteroid.body.drag.set(100);
        var rotI = self.game.rnd.between(0,360);
        asteroid.angle  = rotI;
        var speed = 185 - size * 20 - self.game.rnd.between(0, 80);
        asteroid.body.angularVelocity = 10;
        asteroid.spawn = function ()
        {
            newAsteroid (self, size-1, this.x + 10, this.y, bullets, asteroids, enemies, GameManager)
            newAsteroid (self, size-1, this.x - 10, this.y, bullets, asteroids, enemies, GameManager)
        }
        asteroid.update = function () {
            self.game.physics.arcade.velocityFromRotation(rotI, speed, this.body.velocity);
            this.screenwarp();
            if (self.game.physics.arcade.overlap(this, bullets)){
                GameManager.addScore(this.points);
                this.marked = true;
            }
            if(self.game.physics.arcade.overlap(this, enemies))
                this.marked = true;
            if (player.immune == 0 && self.game.physics.arcade.overlap(this, player))
                this.marked = true;
        }
        asteroid.lateUpdate = function () {
            if(this.marked)
            {   
                if(self.game.rnd.between(0, 100) <= 7)
                    newDrop(self, this.x, this.y, player);
                destruction.play();
                this.spawn();
                this.destroy();
            }
        }
        asteroids.add(asteroid);
        return asteroid;
    }
    }

module.exports = Asteroid;