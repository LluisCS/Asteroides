var menuState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        backgorund = game.add.tileSprite(0, 0, game.width, game.height, 'space');
        title = game.add.image(game.world.centerX, 200,'title');
        title.anchor.set(0.5, 0.5);
        title.scale.setTo(1.5);
        button = game.add.button(game.world.centerX, 400, 'playButton', actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        //button.onInputOver.add(over, this);
        //button.onInputOut.add(out, this);
        //button.onInputUp.add(up, this);
        function actionOnClick () {
            game.state.start('play');
        }
    }
};

