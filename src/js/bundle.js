(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteroides', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'images/deep-space.jpg');
    game.load.image('bullet', 'images/bullets2.png');
    game.load.image('ship', 'images/ship.png');
    game.load.image('ship2', 'images/ship2.png');
    game.load.image('3Asteroid1', 'images/BigAsteroid1.png');
    game.load.image('3Asteroid2', 'images/BigAsteroid2.png');
    game.load.image('3Asteroid3', 'images/BigAsteroid3.png');
    game.load.image('2Asteroid1', 'images/MidAsteroid1.png');
    game.load.image('2Asteroid2', 'images/MidAsteroid2.png');
    game.load.image('2Asteroid3', 'images/MidAsteroid3.png');
    game.load.image('1Asteroid1', 'images/LitAsteroid1.png');
    game.load.image('1Asteroid2', 'images/LitAsteroid2.png');
    game.load.image('1Asteroid3', 'images/LitAsteroid2.png');
    
}

var player;
var enemy;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

function create() {

    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    

    enemy = newEnemy(200, 200);
   
    

    player = newPlayer();
    asteroid = newAsteroid(3, 500, 500);
    asteroid2 = newAsteroid(2, 100, 400);

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {
    game.world.callAll('update');
    game.physics.arcade.collide(player, enemy);
    bullets.forEachExists(screenWrap, this);
    //game.debug.body(player);

}
function newPlayer () {
    var obj = game.add.sprite(300, 300, 'ship2');
    obj.anchor.set(0.5);
    game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(600);
    obj.power = 0;
    this.components = [];

    obj.shoot = shoot;
    obj.move = playerMov;
    obj.update = function () {
        obj.shoot(obj.power);
        obj.move();
        }
    return obj;
}
function newEnemy (x, y) {
    var obj = game.add.sprite(x, y, 'ship');
    obj.anchor.set(0.5);
    game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(200);
    //obj.move = enemyMov();
    game.physics.arcade.accelerationFromRotation(obj.rotation, 30, obj.body.acceleration);
    obj.update = function () {
        screenWrap(this);
        }
    return obj;
}
function newAsteroid (size, x , y) {
    if (size > 0 && size < 4){
        type = game.rnd.between(1,3);
        var obj = game.add.sprite(x, y, size + 'Asteroid' + type);
        obj.anchor.set(0.5);
        game.physics.enable(obj, Phaser.Physics.ARCADE);
        obj.body.drag.set(100);
        var rotI = game.rnd.between(0,360);
        obj.angle  = rotI;
        var speed = 140 - size * 10 + game.rnd.between(0,20);
        obj.body.angularVelocity = 10;
        obj.spawn = function ()
        {
            newAsteroid(size-1, this.x + 10, this.y);
            newAsteroid(size-1, this.x - 10, this.y);
        }
        obj.update = function () {
            game.physics.arcade.velocityFromRotation(rotI, speed, this.body.velocity);
            screenWrap(this);
            if(game.physics.arcade.overlap(this, bullets)){
                bullet.destroy();
                this.spawn();
                this.destroy();
                
            }
        }
        return obj;
    }
}



function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}
var shoot = function (power) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {    
        if (game.time.now > bulletTime)
        {
            
            bullet = bullets.getFirstExists(false);
    
            if (bullet)
            {
                bullet.reset(this.body.x + 42, this.body.y + 25);
                bullet.scale.setTo(0.5, 0.5);
                bullet.lifespan = 1800;
                bullet.rotation = this.rotation;
                game.physics.arcade.velocityFromRotation(this.rotation, 400, bullet.body.velocity);
                bulletTime = game.time.now + 450;
                }
                if (power == 1){
                    bullet = bullets.getFirstExists(false);
                    if (bullet)
                    {
                        bullet.reset(this.body.x + 42, this.body.y + 25);
                        bullet.scale.setTo(0.5, 0.5);
                        bullet.lifespan = 1800;
                        bullet.rotation = this.rotation+0.2;
                        game.physics.arcade.velocityFromRotation(this.rotation+0.2, 400, bullet.body.velocity);
                        bulletTime = game.time.now + 450;
                    }
                    bullet = bullets.getFirstExists(false);
                    if (bullet)
                    {
                        bullet.reset(this.body.x + 42, this.body.y + 25);
                        bullet.scale.setTo(0.5, 0.5);
                        bullet.lifespan = 1800;
                        bullet.rotation = this.rotation-0.2;
                        game.physics.arcade.velocityFromRotation(this.rotation-0.2, 400, bullet.body.velocity);
                        bulletTime = game.time.now + 450;
                    }
            }
        }
    }
};

var playerMov = function () {
    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(this.rotation, 200, this.body.acceleration);
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
    screenWrap(this);

};

var enemyMov = function () {
    screenWrap(this);
};
function render() {
}


},{}]},{},[1]);
