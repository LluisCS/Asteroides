var creditsState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        var button = game.add.button(game.world.centerX, 530, 'backButton', actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        function actionOnClick () {
            game.state.start('menu');
        }
    }
};
