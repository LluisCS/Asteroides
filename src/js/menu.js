var menuState = {
    create: function create(){
        this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space');
        this.game.state.start('play');
    }
};

