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