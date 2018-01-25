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