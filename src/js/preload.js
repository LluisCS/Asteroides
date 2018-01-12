
var preloadState = {


preload: function () {
    WebFontConfig = {
        //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },
        google: {
          families: ['Press Start 2P']
        }
    };
    this.game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    this.game.load.image('space', 'images/deep-space.jpg');
    this.game.load.image('bullet', 'images/bullets3.png');
    this.game.load.image('bullet2', 'images/bullets2.png');
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
    this.game.load.audio('destruct', 'audio/destruction.mp3');
    this.game.load.audio('explode', 'audio/explosion.mp3');
    this.game.load.audio('enemyBlaster', 'audio/enemyBlaster.mp3');
    this.game.load.audio('ambientMusic', 'audio/DM DOKURO - Scourge of The Universe.mp3')
    //this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
    },
 create: function(){
    this.game.state.start('play');
 }
};
