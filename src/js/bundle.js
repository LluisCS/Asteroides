(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteroides', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'images/deep-space.jpg');
    game.load.image('bullet', 'images/bullets2.png');
    game.load.image('ship', 'images/ship.png');
    game.load.image('ship2', 'images/ship3.png');
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
var cursors;
var GameManager;
var immune = 0;

var bullets;
var asteroids;
var bulletTime = 0;

function create() {

    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    GameManager = newGameManager();
    /*bullets = game.add.group();
    asteroids = game.add.group();
    player = newPlayer();*/

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {
    GameManager.update();
    player.lateUpdate();
    asteroids.callAll('lateUpdate');
    bullets.callAll('lateUpdate');
}

function newBullet (x, y, rot) {
    var bullet = game.add.sprite(x, y, 'bullet');
    bullet.anchor.set(0.5);
    bullet.scale.setTo(0.5, 0.5);
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    bullet.lifespan = 1800;
    bullet.rotation = rot;
    bullet.marked = false;
    bullet.update = function () {
        game.physics.arcade.velocityFromRotation(rot, 400, this.body.velocity);
        screenWrap(this);
        if(game.physics.arcade.overlap(this, asteroids)){
            this.marked = true;
        }
    }
    bullet.lateUpdate = function () {
        if(this.marked)
            this.destroy();
    }
    bullets.add(bullet);
    return bullet;
}
function newPlayer () {
    var obj = game.add.sprite(300, 300, 'ship2');
    obj.anchor.set(0.5);
    game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(500);
    obj.power = 1;
    obj.marked = 0;
    //obj.immune = 0;
    obj.timer = 0;
    obj.period = 0;
    this.components = [];

    obj.shoot = shoot;
    obj.move = playerMov;
    obj.update = function () {
        obj.shoot(obj.power);
        obj.move();
        if(immune == 0 && game.physics.arcade.overlap(this, asteroids))
            this.marked = 1;
        if(immune == 1){
            if (game.time.now > this.timer){
                if(this.alpha == 1)
                    this.alpha = 0.5;
                else 
                    this.alpha = 1;
                this.timer = game.time.now + 300; 
            }
            if(game.time.now > obj.period + 3000){
                immune = 0;
                this.alpha = 1;
            }
        }
    }
    obj.lateUpdate = function (){
        if(this.marked == 1){
            this.marked = 0;
            GameManager.playerDeath();
        }
    }
    obj.revive = function (){
        immune = 1;
        this.body.acceleration.set(0);
        this.body.velocity.set(0);
        this.x = 400;
        this.y = 300;
        obj.period = game.time.now;
    }
    obj.resetImmune = function () {
        immune = 0;
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
        var asteroid = game.add.sprite(x, y, size + 'Asteroid' + type);
        asteroid.anchor.set(0.5);
        asteroid.marked = false;
        game.physics.enable(asteroid, Phaser.Physics.ARCADE);
        asteroid.body.drag.set(100);
        var rotI = game.rnd.between(0,360);
        asteroid.angle  = rotI;
        var speed = 140 - size * 10 + game.rnd.between(0,20);
        asteroid.body.angularVelocity = 10;
        asteroid.spawn = function ()
        {
            newAsteroid(size-1, this.x + 10, this.y);
            newAsteroid(size-1, this.x - 10, this.y);
        }
        asteroid.update = function () {
            game.physics.arcade.velocityFromRotation(rotI, speed, this.body.velocity);
            screenWrap(this);
            if (game.physics.arcade.overlap(this, bullets)){
                this.marked = true;
            }
            if (immune == 0 && game.physics.arcade.overlap(this, player))
                this.marked = true;
        }
        asteroid.lateUpdate = function () {
            if(this.marked)
            {
                this.spawn();
                this.destroy();
            }
        }
        asteroids.add(asteroid);
        return asteroid;
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
            newBullet (this.body.x + 38, this.body.y + 28, this.rotation); 
            bulletTime = game.time.now + 450;
            if (power == 1){
            newBullet (this.body.x + 38, this.body.y + 28, this.rotation+0.2);
            newBullet (this.body.x + 38, this.body.y + 28, this.rotation-0.2);
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

function newGameManager (){
    var GameManager = {};
    GameManager.level = 0;
    GameManager.lifes = 3;
    player = newPlayer();
    bullets = game.add.group();
    asteroids = game.add.group();
    GameManager.update = function (){
        if (asteroids.length == 0)
            this.createLevel();

    }
    GameManager.createLevel = function (){
        player.x = 400;
        player.y = 300;
        bullets.removeAll(true);
        for (var i = 0; i < 2 + 2 * this.level;i++){
            if (i%2==0)
                newAsteroid(3,game.rnd.between(0,800),game.rnd.between(0,100));
            else
                newAsteroid(3,game.rnd.between(0,800),game.rnd.between(500,600));
        }
        this.level++;
    }
    GameManager.playerDeath = function (){
        if(GameManager.lifes > 0){
            player.revive();
            GameManager.lifes--;
        }
        else {
           this.resetGame();
        }
    }
    GameManager.resetGame = function (){
        player.destroy();
        player = newPlayer();
        this.lifes = 3;
        this.level = 0;
        asteroids.removeAll(true);
        bullets.removeAll(true);
    }
    return GameManager;
}

},{}]},{},[1]);
