
function newGameManager (){
    var GameManager = {};
    GameManager.level = 1;
    GameManager.lifes = 3;
    GameManager.timer = 0;
    GameManager.score = 0;
    GameManager.ini = false;
    GameManager.bossKilled = true;
    player = newPlayer();
    bullets = game.add.group();
    asteroids = game.add.group();
    enemies = game.add.group();
    bossParts = game.add.group();
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
        if(GameManager.lifes == -1 && game.time.now > this.timer){
            game.state.start('menu');
        }
        if(!this.ini){
            if (asteroids.length == 0 && this.bossKilled == true){
                GameManager.updateUI();
                player.x = game.world.centerX;
                player.y = game.world.centerY;
                bullets.removeAll(true);
                enemies.removeAll(true);
                game.world.bringToTop(LvlText);
                if(GameManager.level%5 == 0)
                    LvlText.setText("! D A N G E R !");
                else
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
            boss = newBoss();
            GameManager.bossKilled = false;
        }
        else{
            GameManager.bossKilled = true;
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
        }
        else {
            player.destroy();
            game.world.bringToTop(LvlText);
            LvlText.setText("G A M E  O V E R");
            LvlText.fontSize = 47;
            LvlText.visible = true;
            this.timer = game.time.now + 2300;
            /*if (!GameManager.bossKilled){
                boss.kill();
                this.resetGame();
            }*/
        }
        GameManager.lifes--;
        GameManager.updateUI();
    }
    /*GameManager.resetGame = function (){
        player.destroy();
        player = newPlayer();
        this.lifes = 3;
        this.level = 1;
        this.score = 0;
        scoreText.setText("Score: "+ GameManager.score);
        asteroids.removeAll(true);
        bullets.removeAll(true);
        enemies.removeAll(true);
    }*/
    GameManager.addScore = function(points ){
        GameManager.score += points;
        scoreText.setText("Score "+ GameManager.score);
    }
    return GameManager;
}

module.exports = newGameManager;