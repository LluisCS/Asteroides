
//var preloadState = require('./preload.js');
//var menuState = require('./menu.js');
//var playState = require('./game.js');
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteroides');

game.state.add('preload', preloadState);
game.state.add('menu', menuState);
game.state.add('play', playState);

game.state.start('preload');