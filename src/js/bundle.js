(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./drop.js":6,"./gameObject.js":9}],2:[function(require,module,exports){
var gameObject = require('./gameObject.js');

var Boss = function newBoss (self, bullets, player, bossParts, GameManager){
    var boss ={};
    var spacing = 7;
    var sections = 18 + GameManager.level;
    boss.Body = new Array();
    var bossPath = new Array();
    for (var i = sections - 1; i >= 1; i--){
        if (i == sections - 1)
            boss.Body[i] = gameObject(self, 40, 40, 'tail');
        else
            boss.Body[i] = gameObject(self, 40, 40, 'body');
        self.game.physics.enable(boss.Body[i], Phaser.Physics.ARCADE);
        bossParts.add(boss.Body[i]);
    }
    boss.Head = gameObject(self, 50, 40, 'head');
    self.game.physics.enable(boss.Head, Phaser.Physics.ARCADE);
    boss.Head.hp = 60 + GameManager.level;
    bossParts.add(boss.Head);
    for (var i = 0; i <= sections * spacing; i++)
    {
        bossPath[i] = new Phaser.Point(40, 40);
        bossPath[i].angle = 0;
    }
    boss.Head.update = function () {
        if (self.game.time.now > boss.Head.timer){
            if (self.game.rnd.between(0, 1) == 0)
                boss.Head.body.angularVelocity = self.game.rnd.between(20, 60);
            else
                boss.Head.body.angularVelocity = self.game.rnd.between(-60, -20);
            boss.Head.timer = self.game.time.now + self.game.rnd.between(600, 1900);
        }
        boss.Head.body.velocity.setTo(0, 0);
        self.game.physics.arcade.velocityFromRotation(boss.Head.rotation, GameManager.level * 4 + 250, this.body.velocity);
        
        var part = bossPath.pop();

        part.setTo(boss.Head.x, boss.Head.y);
        part.angle = boss.Head.angle;

        bossPath.unshift(part);

        for (var i = 1; i <= sections - 1; i++)
        {
            boss.Body[i].x = (bossPath[i * spacing]).x;
            boss.Body[i].y = (bossPath[i * spacing]).y;
            boss.Body[i].angle = bossPath[i * spacing].angle;
    }
    if (self.game.physics.arcade.overlap(bullets, bossParts))
        boss.Head.hp --;
        boss.Head.screenwarp();
    }
    boss.Head.lateUpdate = function () {
        if (boss.Head.hp <= 0){
            GameManager.addScore(2000);
            for (var i = 1; i <= sections - 1; i++)
        {
            boss.Body[i].destroy();
            boss.Body[i].createExplosion(1);
        }
            boss.Head.destroy();
            boss.Head.createExplosion(2);
            GameManager.bossKilled = true;
        }
    }
    return boss;
}

module.exports = Boss;
},{"./gameObject.js":9}],3:[function(require,module,exports){
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
},{"./gameObject.js":9}],4:[function(require,module,exports){
var controlsState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        var button = this.game.add.button(this.game.world.centerX, 530, 'backButton', actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        var up = this.game.add.sprite(250, 120, 'up');
        //up.anchor.set(0.5);
        up.scale.setTo(0.8);
        var side = this.game.add.sprite(200, 210, 'side');
        //side.anchor.set(0.5);
        side.scale.setTo(0.8);
        var spacebar = this.game.add.sprite(150, 330, 'spacebar');
        //spacebar.anchor.set(0.5);
        spacebar.scale.setTo(0.8);
        function actionOnClick () {
            this.game.state.start('menu');
        }
    }
};

module.exports = controlsState;

},{}],5:[function(require,module,exports){
var creditsState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        var button = this.game.add.button(this.game.world.centerX, 530, 'backButton', actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        function actionOnClick () {
            this.game.state.start('menu');
        }
        var credits = this.game.add.sprite(400, 300, 'credits');
        credits.anchor.set(0.5);
    }
};

module.exports = creditsState;
},{}],6:[function(require,module,exports){
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
},{"./gameObject.js":9}],7:[function(require,module,exports){
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
},{"./bullet.js":3,"./gameObject.js":9}],8:[function(require,module,exports){
var playState = {

preload: function(){
    var player;
    var cursors;
    var GameManager;
    var laser, destruction, explosion, enBlaster, music;
    var scoreText, LvlText;

    var bullets;
    var asteroids;
    var enemies;
    var livesUI;
    var boss;
    var bossParts;

},


create: function () {
    var self = this;
    laser = this.game.add.audio('blaster', 0.1);
    pUp = this.game.add.audio('Up', 0.4);
    destruction = this.game.add.audio('destruct', 0.1);
    explosion = this.game.add.audio('explode', 0.2);
    enBlaster = this.game.add.audio('enemyBlaster', 0.3);
    music = this.game.add.audio('ambientMusic', 0.07);
    //music.play();

    this.game.renderer.clearBeforeRender = false;
    this.game.renderer.roundPixels = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');

    cursors = this.game.input.keyboard.createCursorKeys();
    this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    var newPlayer = require('./player.js');
    var newEnemy = require('./enemy.js');
    var newAsteroid = require('./asteroid.js');
    var newBoss = require('./boss.js');

    GameManager = newGameManager();

    function newGameManager (){
        var GameManager = {};
        GameManager.level = 1;
        GameManager.lifes = 3;
        GameManager.timer = 0;
        GameManager.score = 0;
        GameManager.ini = false;
        GameManager.bossKilled = true;
        bullets = self.game.add.group();
        asteroids = self.game.add.group();
        enemies = self.game.add.group();
        bossParts = self.game.add.group();
        livesUI = self.game.add.group();
        player = newPlayer(self, bullets, asteroids, bossParts, enemies, cursors, GameManager);
        scoreText = self.game.add.text(75, 20, "Score 0");
        scoreText.anchor.setTo(0.5);
        scoreText.font = 'Press Start 2P';
        scoreText.fontSize = 13;
        scoreText.fill ='#ffffff';
        LvlText = self.game.add.text(400, 300, "L E V E L  1");
        LvlText.anchor.setTo(0.5);
        LvlText.font = 'Press Start 2P';
        LvlText.fontSize = 60;
        LvlText.fill ='#ffffff';
        LvlText.visible = false;
        GameManager.update = function (){
            if(GameManager.lifes == -1 && self.game.time.now > this.timer){
                self.game.state.start('menu');
            }
            if(!this.ini){
                if (asteroids.length == 0 && this.bossKilled == true){
                    GameManager.updateUI();
                    player.x = self.game.world.centerX;
                    player.y = self.game.world.centerY;
                    bullets.removeAll(true);
                    enemies.removeAll(true);
                    self.game.world.bringToTop(LvlText);
                    if(GameManager.level%5 == 0)
                        LvlText.setText("! D A N G E R !");
                    else
                        LvlText.setText("L E V E L  " + this.level);
                    LvlText.visible = true;
                    this.ini = true;
                    this.timer = self.game.time.now + 2300;
                }
                else
                    if(self.game.time.now > this.timer && this.bossKilled == true){
                        if(self.game.rnd.between(0, 100) + GameManager.level * 2 > 85)
                            newEnemy(self, 0, self.game.rnd.between(50,550), bullets, asteroids, bossParts, enemies, player, GameManager);
                        this.timer = self.game.time.now + 4500;
                    }
                }
            else{
                if (self.game.time.now > this.timer){
                    LvlText.visible = false;
                    this.createLevel();
                    this.ini = false;
                }
            }
        }
        GameManager.updateUI = function() {
            livesUI.removeAll(true);
            for (var i = 0; i < GameManager.lifes; i++){
                var ship = self.game.add.sprite (30 + i*20, 65, 'ship2');
                ship.angle -= 90;
                ship.scale.setTo(0.7,0.7);
                livesUI.add(ship);
            }
    
        }
        GameManager.createLevel = function (){
            if (GameManager.level%5 == 0){
                boss = newBoss(self, bullets, player, bossParts, GameManager);
                GameManager.bossKilled = false;
            }
            else{
                GameManager.bossKilled = true;
                for (var i = 0; i < 2 + this.level - 1;i++){
                    if (i % 2 == 0)
                        newAsteroid (self, 3, self.game.rnd.between(0,800), self.game.rnd.between(0,100), bullets, asteroids, enemies, GameManager);
                    else
                        newAsteroid (self, 3, self.game.rnd.between(0,800), self.game.rnd.between(500,600), bullets, asteroids, enemies, GameManager);
                }
            }
            self.game.world.bringToTop(scoreText);
            self.game.world.bringToTop(livesUI);
            this.level++;
        }
        GameManager.playerDeath = function (){
            if(GameManager.lifes > 0){
                player.revive();
            }
            else {
                player.destroy();
                self.game.world.bringToTop(LvlText);
                LvlText.setText("G A M E  O V E R");
                LvlText.fontSize = 47;
                LvlText.visible = true;
                this.timer = self.game.time.now + 2300;
            }
            GameManager.lifes--;
            GameManager.updateUI();
        }
        GameManager.addScore = function(points ){
            GameManager.score += points;
            scoreText.setText("Score "+ GameManager.score);
        }
        return GameManager;
    }

},

    
update: function () {
        GameManager.update();
        player.lateUpdate();
        asteroids.callAll('lateUpdate');
        bullets.callAll('lateUpdate');
        enemies.callAll('lateUpdate');
        if  (GameManager.bossKilled == false)
            boss.Head.lateUpdate();
        },

render: function () {
        }
};

module.exports = playState;
},{"./asteroid.js":1,"./boss.js":2,"./enemy.js":7,"./player.js":12}],9:[function(require,module,exports){
function newGameObject (gameR, x, y, sprite){
    var gameObj = gameR.game.add.sprite(x, y, sprite);
    gameObj.timer = 0;
    gameObj.anchor.set(0.5);
    gameObj.screenwarp = function () {
    
        if (this.x < 0)
        {
            this.x = gameR.game.width;
        }
        else if (this.x > gameR.game.width)
        {
            this.x = 0;
        }
    
        if (this.y < 0)
        {
            this.y = gameR.game.height;
        }
        else if (this.y > gameR.game.height)
        {
            this.y = 0;
        }
    
    }
    gameObj.createExplosion = function ( size){
        var exp = gameR.game.add.sprite(this.x, this.y, 'expAnim');
        exp.anchor.setTo(0.5,0.5);
        exp.scale.set(size);
        var anim = exp.animations.add('boom');
        anim.play(25, false);
        anim.onComplete.add(EndAnimation, this);
    }
    function EndAnimation(sprite, animation){
        sprite.destroy();
    }
    return gameObj;
}

module.exports = newGameObject;
},{}],10:[function(require,module,exports){

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteroides');

var preloadState = require('./preload.js');
var creditsState = require('./credits.js');
var controlsState = require('./controls.js');
var menuState = require('./menu.js');
var playState = require('./game.js');

game.state.add('preload', preloadState);
game.state.add('credits', creditsState);
game.state.add('controls', controlsState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('preload');
},{"./controls.js":4,"./credits.js":5,"./game.js":8,"./menu.js":11,"./preload.js":13}],11:[function(require,module,exports){
var menuState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        var background = this.game.add.image(0, 0, 'space2');
        background.scale.setTo(1.2);
        var title = this.game.add.image(this.game.world.centerX, 150,'title');
        title.anchor.set(0.5, 0.5);
        title.scale.setTo(1.6);
        var button = this.game.add.button(this.game.world.centerX, 350, 'playButton', actionOnClick1, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        function actionOnClick1 () {
            this.game.state.start('play');
        }
        var button2 = this.game.add.button(this.game.world.centerX, 440, 'controlsButton', actionOnClick2, this, 2, 1, 0);
        button2.anchor.set(0.5, 0.5);
        function actionOnClick2 () {
            this.game.state.start('controls');
        }
        var button3 = this.game.add.button(this.game.world.centerX, 530, 'creditsButton', actionOnClick3, this, 2, 1, 0);
        button3.anchor.set(0.5, 0.5);
        function actionOnClick3 () {
            this.game.state.start('credits');
        }
    }
};

module.exports = menuState;

},{}],12:[function(require,module,exports){
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
},{"./bullet.js":3,"./gameObject.js":9}],13:[function(require,module,exports){

var preloadState = {


    preload: function () {
        WebFontConfig = {
            //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
            google: {
              families: ['Press Start 2P']
            }
        };
        this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.game.load.image('playButton', 'images/PlayButton.png');
        this.game.load.image('creditsButton', 'images/Button2.png');
        this.game.load.image('controlsButton', 'images/Button3.png');
        this.game.load.image('backButton', 'images/Button4.png');
        this.game.load.image('credits', 'images/credits.png');
        this.game.load.image('up', 'images/upKey.png');
        this.game.load.image('side', 'images/sideKeys.png');
        this.game.load.image('spacebar', 'images/spacebar.png');
        this.game.load.image('title', 'images/title.png');
        this.game.load.image('space', 'images/deepSpace.jpg');
        this.game.load.image('space2', 'images/menuBackground.jpg');
        this.game.load.image('bullet', 'images/bullets3.png');
        this.game.load.image('bullet2', 'images/bullets2.png');
        this.game.load.image('powerUp1', 'images/1up.png');
        this.game.load.image('powerUp2', 'images/x3.png');
        this.game.load.image('powerUp3', 'images/x3.png');
        this.game.load.image('ship', 'images/ship.png');
        this.game.load.image('ship2', 'images/ship3.png');
        this.game.load.image('3Asteroid1', 'images/BigAsteroid1.png');
        this.game.load.image('3Asteroid2', 'images/BigAsteroid2.png');
        this.game.load.image('3Asteroid3', 'images/BigAsteroid3.png');
        this.game.load.image('2Asteroid1', 'images/MidAsteroid1.png');
        this.game.load.image('2Asteroid2', 'images/MidAsteroid2.png');
        this.game.load.image('2Asteroid3', 'images/MidAsteroid3.png');
        this.game.load.image('1Asteroid1', 'images/LitAsteroid1.png');
        this.game.load.image('1Asteroid2', 'images/LitAsteroid2.png');
        this.game.load.image('1Asteroid3', 'images/LitAsteroid2.png');
        this.game.load.image('head', 'images/DevourerHead.png');
        this.game.load.image('body', 'images/DevourerBody.png');
        this.game.load.image('tail', 'images/DevourerTail.png');
        this.game.load.spritesheet('expAnim', 'images/explosion_anim.png', 134, 134, 12);
        this.game.load.audio('blaster', 'audio/blaster.mp3');
        this.game.load.audio('Up', 'audio/powerUp.mp3');
        this.game.load.audio('destruct', 'audio/destruction.mp3');
        this.game.load.audio('explode', 'audio/explosion.mp3');
        this.game.load.audio('enemyBlaster', 'audio/enemyBlaster.mp3');
        this.game.load.audio('ambientMusic', 'audio/DM DOKURO - Scourge of The Universe.mp3');
        //this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        },
     create: function(){
        this.game.state.start('menu');
     }
    };

    module.exports = preloadState;
},{}]},{},[10]);
