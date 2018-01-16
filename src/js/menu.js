var menuState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        var background = game.add.image(0, 0, 'space2');
        background.scale.setTo(1.2);
        var title = game.add.image(game.world.centerX, 150,'title');
        title.anchor.set(0.5, 0.5);
        title.scale.setTo(1.6);
        var button = game.add.button(game.world.centerX, 350, 'playButton', actionOnClick1, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        function actionOnClick1 () {
            game.state.start('play');
        }
        var button2 = game.add.button(game.world.centerX, 440, 'controlsButton', actionOnClick2, this, 2, 1, 0);
        button2.anchor.set(0.5, 0.5);
        function actionOnClick2 () {
            game.state.start('controls');
        }
        var button3 = game.add.button(game.world.centerX, 530, 'creditsButton', actionOnClick3, this, 2, 1, 0);
        button3.anchor.set(0.5, 0.5);
        function actionOnClick3 () {
            game.state.start('credits');
        }
    }
};
