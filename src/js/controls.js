var controlsState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        var button = game.add.button(game.world.centerX, 530, 'backButton', actionOnClick, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        var up = game.add.sprite(250, 120, 'up');
        //up.anchor.set(0.5);
        up.scale.setTo(0.8);
        var side = game.add.sprite(200, 210, 'side');
        //side.anchor.set(0.5);
        side.scale.setTo(0.8);
        var spacebar = game.add.sprite(150, 330, 'spacebar');
        //spacebar.anchor.set(0.5);
        spacebar.scale.setTo(0.8);
        function actionOnClick () {
            game.state.start('menu');
        }
    }
};
