var menuState = {
    preload: function(){
        var button;
        var background;
        var title;
    },
    create: function (){
        var background = this.game.add.image(0, 0, 'space2');
        background.scale.setTo(1.2);
        var title = this.game.add.image(this.game.world.centerX, 150,'title');
        title.anchor.set(0.5, 0.5);
        title.scale.setTo(1.6);
        var button = this.game.add.button(this.game.world.centerX, 350, 'playButton', actionOnClick1, this, 2, 1, 0);
        button.anchor.set(0.5, 0.5);
        function actionOnClick1 () {
            this.game.state.start('play');
        }
        var button2 = this.game.add.button(this.game.world.centerX, 440, 'controlsButton', actionOnClick2, this, 2, 1, 0);
        button2.anchor.set(0.5, 0.5);
        function actionOnClick2 () {
            this.game.state.start('controls');
        }
        var button3 = this.game.add.button(this.game.world.centerX, 530, 'creditsButton', actionOnClick3, this, 2, 1, 0);
        button3.anchor.set(0.5, 0.5);
        function actionOnClick3 () {
            this.game.state.start('credits');
        }
    }
};

module.exports = menuState;
