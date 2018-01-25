
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