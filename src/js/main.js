var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteroides', { preload: preload, create: create, update: update, render: render });

//game.state.add('menu', menuState);
//game.state.add('play', playState);



WebFontConfig = {
        //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
        google: {
          families: ['Press Start 2P']
        }
    };

function preload() {

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    game.load.image('space', 'images/deep-space.jpg');
    game.load.image('bullet', 'images/bullets3.png');
    game.load.image('bullet2', 'images/bullets2.png');
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
    game.load.image('head', 'images/DevourerHead.png');
    game.load.image('body', 'images/DevourerBody.png');
    game.load.image('tail', 'images/DevourerTail.png');
    game.load.spritesheet('expAnim', 'images/explosion_anim.png', 134, 134, 12);
    game.load.audio('blaster', 'audio/blaster.mp3');
    game.load.audio('destruct', 'audio/destruction.mp3');
    game.load.audio('explode', 'audio/explosion.mp3');
    game.load.audio('enemyBlaster', 'audio/enemyBlaster.mp3');
    game.load.audio('ambientMusic', 'audio/DM DOKURO - Scourge of The Universe.mp3')
    }
    //game.state.play('menu', menuState);

/*var menuState = function() {
    game.add.tileSprite(0, 0, game.width, game.height, 'space');
    game.state.PLAY('play', playState);
}
*/
var player;
var cursors;
var GameManager;
var laser, destruction, explosion, enBlaster, music;
var scoreText;

var bullets;
var asteroids;
var enemies;
var livesUI;
var bulletTime = 0;
var bossBody, bossHead;

function create() {
    laser = game.add.audio('blaster', 0.1);
    destruction = game.add.audio('destruct', 0.1);
    explosion = game.add.audio('explode', 0.2);
    enBlaster = game.add.audio('enemyBlaster', 0.3);
    music = game.add.audio('ambientMusic', 0.07);
    //music.play();

    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    GameManager = newGameManager();

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {
    GameManager.update();
    player.lateUpdate();
    asteroids.callAll('lateUpdate');
    bullets.callAll('lateUpdate');
    enemies.callAll('lateUpdate');
    if  (GameManager.bossKilled == false)
        bossHead.lateUpdate();
}

function newBullet (x, y, rot, speed, ally) {
    var skin;
    if(ally)
        skin ='bullet2';
    else
        skin ='bullet';
    var bullet = game.add.sprite(x, y, skin);
    bullet.anchor.set(0.5);
    bullet.scale.setTo(0.5, 0.5);
    game.physics.enable(bullet, Phaser.Physics.ARCADE);
    if(ally)
        bullet.lifespan = 1200;
    else
        bullet.lifespan = 2000;                
    bullet.rotation = rot;
    bullet.marked = false;
    bullet.ally = ally;
    bullet.update = function () {
        game.physics.arcade.velocityFromRotation(rot, speed, this.body.velocity);
        screenWrap(this);
        if(game.physics.arcade.overlap(this, asteroids) || game.physics.arcade.overlap(this, bossHead) || game.physics.arcade.overlap(this, bossBody)){
            this.marked = true;
            createExplosion(this.x  , this.y , 0.3);
        }
        if(ally){
            if (game.physics.arcade.overlap(this, enemies))
            this.marked = true;
        }
        else
            if (player.immune == 0 && game.physics.arcade.overlap(this, player)){
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
function newPlayer () {
    var obj = game.add.sprite(300, 300, 'ship2');
    obj.anchor.set(0.5);
    game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(400);
    obj.power = 0;
    obj.marked = 0;
    obj.immune = 0;
    obj.timer = 0;
    obj.period = 0;
    this.components = [];

    obj.shoot = shoot;
    obj.move = playerMov;
    obj.update = function () {
        obj.shoot(obj.power);
        obj.move();
        if (obj.immune == 0 && (game.physics.arcade.overlap(this, asteroids) || game.physics.arcade.overlap(this, bossHead) || game.physics.arcade.overlap(this, bossBody))){
            this.marked = 1;
            }
        if (obj.immune == 1){
            if (game.time.now > this.timer){
                if(this.alpha == 1)
                    this.alpha = 0.5;
                else 
                    this.alpha = 1;
                this.timer = game.time.now + 300; 
            }
            if(game.time.now > obj.period + 3000){
                obj.immune = 0;
                this.alpha = 1;
            }
        }
    }
    obj.lateUpdate = function (){
        if(this.marked == 1){
            explosion.play();
            createExplosion(this.x  , this.y , 0.9);
            this.marked = 0;
            GameManager.playerDeath();
        }
    }
    obj.revive = function (){
        obj.immune = 1;
        this.body.acceleration.set(0);
        this.body.velocity.set(0);
        this.x = 400;
        this.y = 300;
        obj.period = game.time.now;
    }
    return obj;
}
function newEnemy (x, y) {
    var obj = game.add.sprite(x, y, 'ship');
    obj.anchor.set(0.5);
    obj.marked = false;
    obj.points = 200;
    obj.timer = 0;
    obj.shooter = 0;
    game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(130);
    var speed;
    if(game.rnd.between(0,1))
        obj.angle = 180;
    
    game.physics.arcade.accelerationFromRotation(obj.rotation, 30, obj.body.acceleration);
    obj.update = function () {
        if (game.physics.arcade.overlap(this, asteroids))
            this.marked = true;
        if (player.immune == 0 && game.physics.arcade.overlap(this, player)){
            this.marked = true;
            player.marked = true;
        }
        bullets.forEach(element => {
            if(game.physics.arcade.overlap(obj, element) && element.ally){
                obj.marked = true;
                GameManager.addScore(this.points);
            }
        });
        if(game.time.now > obj.timer){
            if(this.shooter == 0)
                this.shooter = 1;
            else{
                enBlaster.play();
                newBullet(this.x, this.y, game.physics.arcade.angleBetween(this, player), 240, false);
            }
            obj.timer = game.time.now + 3000;
        }
        screenWrap(this);
        }
    obj.lateUpdate = function (){
        if(this.marked){
            explosion.play();
            createExplosion(this.x  , this.y , 0.6);
            this.destroy();
            destruction.play();
        }
    }
    enemies.add(obj);
    return obj;
}
function newAsteroid (size, x , y) {
    if (size > 0 && size < 4){
        type = game.rnd.between(1,3);
        var asteroid = game.add.sprite(x, y, size + 'Asteroid' + type);
        if(size == 3)
            asteroid.points = 20;
        else if(size == 2)
            asteroid.points = 50;
        else
            asteroid.points = 100;
        asteroid.anchor.set(0.5);
        asteroid.marked = false;
        game.physics.enable(asteroid, Phaser.Physics.ARCADE);
        asteroid.body.drag.set(100);
        var rotI = game.rnd.between(0,360);
        asteroid.angle  = rotI;
        var speed = 185 - size * 20 - game.rnd.between(0, 80);
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
                GameManager.addScore(this.points);
                this.marked = true;
            }
            if(game.physics.arcade.overlap(this, enemies))
                this.marked = true;
            if (player.immune == 0 && game.physics.arcade.overlap(this, player))
                this.marked = true;
        }
        asteroid.lateUpdate = function () {
            if(this.marked)
            {
                destruction.play();
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
            laser.play();
            newBullet (this.body.x + 28, this.body.y + 20, this.rotation, 450, true); 
            bulletTime = game.time.now + 350;
            if (power == 1){
            newBullet (this.body.x + 28, this.body.y + 20, this.rotation+0.2, 450, true);
            newBullet (this.body.x + 28, this.body.y + 20, this.rotation-0.2, 450, true);
            }
        }
    }
};

function newBoss () {
    var spacing = 7;
    var sections = 20 + GameManager.level;
    bossBody = new Array();
    var bossPath = new Array();
    for (var i = sections - 1; i >= 1; i--){
        if (i == sections - 1)
            bossBody[i] = game.add.sprite(40, 40, 'tail');
        else
            bossBody[i] = game.add.sprite(40, 40, 'body');
        bossBody[i].anchor.setTo(0.5,0.5);
        game.physics.enable(bossBody[i], Phaser.Physics.ARCADE);
    }
    bossHead = game.add.sprite(50, 40, 'head');
    bossHead.timer = 0;
    bossHead.anchor.set(0.5, 0.5);
    game.physics.enable(bossHead, Phaser.Physics.ARCADE);
    bossHead.hp = 60 + GameManager.level;
    for (var i = 0; i <= sections * spacing; i++)
    {
        bossPath[i] = new Phaser.Point(40, 40);
        bossPath[i].angle = 0;
    }
    bossHead.update = function () {
        if (game.time.now > bossHead.timer){
            if (game.rnd.between(0, 1) == 0)
                bossHead.body.angularVelocity = game.rnd.between(10, 50);
            else
                bossHead.body.angularVelocity = game.rnd.between(-50, -10);
            bossHead.timer = game.time.now + 1500 + game.rnd.between(0, 800)
        }
        bossHead.body.velocity.setTo(0, 0);
        game.physics.arcade.velocityFromRotation(bossHead.rotation, GameManager.level * 4 + 250, this.body.velocity);
        
        var part = bossPath.pop();

        part.setTo(bossHead.x, bossHead.y);
        part.angle = bossHead.angle;

        bossPath.unshift(part);

        for (var i = 1; i <= sections - 1; i++)
        {
            bossBody[i].x = (bossPath[i * spacing]).x;
            bossBody[i].y = (bossPath[i * spacing]).y;
            bossBody[i].angle = bossPath[i * spacing].angle;
    }
    if (game.physics.arcade.overlap(bullets, bossHead) || game.physics.arcade.overlap(bullets, bossBody))
        bossHead.hp --;
    screenWrap(bossHead);
    }
    bossHead.lateUpdate = function () {
        if (bossHead.hp <= 0){
            GameManager.addScore(1000);
            for (var i = 1; i <= sections - 1; i++)
        {
            bossBody[i].destroy();
            createExplosion(bossBody[i].x , bossBody[i].y, 1);
        }
            bossHead.destroy();
            createExplosion(bossHead.x, bossHead.y, 2);
            GameManager.bossKilled = true;
        }
    }
}
var playerMov = function () {
    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(this.rotation, 230, this.body.acceleration);
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
function createExplosion (x, y, size){
    exp = game.add.sprite(x, y, 'expAnim');
    exp.anchor.setTo(0.5,0.5);
    exp.scale.set(size);
    anim = exp.animations.add('boom');
    anim.play(25, false);
    anim.onComplete.add(EndAnimation, this);
}
function EndAnimation(sprite, animation){
    sprite.destroy();
}
function render() {
}

function newGameManager (){
    var GameManager = {};
    GameManager.level = 1;
    GameManager.lifes = 5;
    GameManager.timer = 0;
    GameManager.score = 0;
    GameManager.ini = false;
    GameManager.bossKilled = true;
    player = newPlayer();
    bullets = game.add.group();
    asteroids = game.add.group();
    enemies = game.add.group();
    livesUI = game.add.group();
    scoreText = game.add.text(75, 20, "Score 0");
    scoreText.anchor.setTo(0.5);
    scoreText.font = 'Press Start 2P';
    scoreText.fontSize = 13;
    scoreText.fill ='#ffffff';
    LvlText = game.add.text(400, 300, "L E V E L  1");
    LvlText.anchor.setTo(0.5);
    LvlText.font = 'Press Start 2P';
    LvlText.fontSize = 60;
    LvlText.fill ='#ffffff';
    LvlText.visible = false;
    GameManager.update = function (){
        if(!this.ini){
            if (asteroids.length == 0 && this.bossKilled == true){
                GameManager.updateUI();
                player.x = 400;
                player.y = 300;
                bullets.removeAll(true);
                enemies.removeAll(true);
                game.world.bringToTop(LvlText);
                LvlText.setText("L E V E L  " + this.level);
                LvlText.visible = true;
                this.ini = true;
                this.timer = game.time.now + 2300;
            }
            else
                if(game.time.now > this.timer && this.bossKilled == true){
                    if(game.rnd.between(0, 100) + GameManager.level * 2 > 85)
                        newEnemy(0, game.rnd.between(50,550));
                    this.timer = game.time.now + 4500;
                }
            }
        else{
            if (game.time.now > this.timer){
                LvlText.visible = false;
                this.createLevel();
                this.ini = false;
            }
        }
    }
    GameManager.updateUI = function() {
        livesUI.removeAll(true);
        for (var i = 0; i < GameManager.lifes; i++){
            var ship = game.add.sprite (30 + i*20, 65, 'ship2');
            ship.angle -= 90;
            ship.scale.setTo(0.7,0.7);
            livesUI.add(ship);
        }

    }
    GameManager.createLevel = function (){
        if (GameManager.level%5 == 0){
            newBoss();
            GameManager.bossKilled = false;
        }
        else{
            for (var i = 0; i < 2 + this.level - 1;i++){
                if (i % 2 == 0)
                    newAsteroid(3,game.rnd.between(0,800),game.rnd.between(0,100));
                else
                    newAsteroid(3,game.rnd.between(0,800),game.rnd.between(500,600));
            }
        }
        game.world.bringToTop(scoreText);
        game.world.bringToTop(livesUI);
        this.level++;
    }
    GameManager.playerDeath = function (){
        if(GameManager.lifes > 0){
            player.revive();
            GameManager.lifes--;
        }
        else {
            for (var i = 1; i <= sections - 1; i++)
        {
            bossBody[i].destroy();
            createExplosion(bossBody[i].x , bossBody[i].y, 1);
        }
            bossHead.destroy();
            createExplosion(bossHead.x, bossHead.y, 2);
            GameManager.bossKilled = true;
           this.resetGame();
        }
        GameManager.updateUI();
    }
    GameManager.resetGame = function (){
        player.destroy();
        player = newPlayer();
        this.lifes = 3;
        this.level = 1;
        this.score = 0;
        scoreText.setText("Score: "+ GameManager.score);
        asteroids.removeAll(true);
        bullets.removeAll(true);
        enemies.removeAll(true);
    }
    GameManager.addScore = function(points ){
        GameManager.score += points;
        scoreText.setText("Score "+ GameManager.score);
    }
    return GameManager;
}
