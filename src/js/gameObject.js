function newGameObject (gameR, x, y, sprite){
    var gameObj = gameR.game.add.sprite(x, y, sprite);
    gameObj.timer = 0;
    gameObj.anchor.set(0.5);
    gameObj.screenwarp = function () {
    
        if (this.x < 0)
        {
            this.x = gameR.game.width;
        }
        else if (this.x > gameR.game.width)
        {
            this.x = 0;
        }
    
        if (this.y < 0)
        {
            this.y = gameR.game.height;
        }
        else if (this.y > gameR.game.height)
        {
            this.y = 0;
        }
    
    }
    gameObj.createExplosion = function ( size){
        var exp = gameR.game.add.sprite(this.x, this.y, 'expAnim');
        exp.anchor.setTo(0.5,0.5);
        exp.scale.set(size);
        var anim = exp.animations.add('boom');
        anim.play(25, false);
        anim.onComplete.add(EndAnimation, this);
    }
    function EndAnimation(sprite, animation){
        sprite.destroy();
    }
    return gameObj;
}

module.exports = newGameObject;