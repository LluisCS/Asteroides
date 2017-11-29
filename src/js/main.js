var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'asteroides', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('space', 'images/deep-space.jpg');
    game.load.image('bullet', 'images/bullets2.png');
    game.load.image('ship', 'images/ship2.png');
}

var player;
var cursors;

var bullet;
var bullets;
var bulletTime = 0;

function create() {

    game.renderer.clearBeforeRender = false;
    game.renderer.roundPixels = true;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.tileSprite(0, 0, game.width, game.height, 'space');

    
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(40, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 0.5);
    

    player = newPlayer();

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

function update() {
    
    player.update();

    bullets.forEachExists(screenWrap, this);

}
function newPlayer () {
    var obj = game.add.sprite(300, 300, 'ship');
    obj.anchor.set(0.5);
    game.physics.enable(obj, Phaser.Physics.ARCADE);
    obj.body.drag.set(100);
    obj.body.maxVelocity.set(200);
    obj.power = 1;
    this.components = [];

    obj.shoot = shoot;
    obj.move = movement;
    obj.update = function () {
        obj.shoot(this.power);
        obj.move();
        }
    return obj;
}



function screenWrap (sprite) {

    if (sprite.x < 0)
    {
        sprite.x = game.width;
    }
    else if (sprite.x > game.width)
    {
        sprite.x = 0;
    }

    if (sprite.y < 0)
    {
        sprite.y = game.height;
    }
    else if (sprite.y > game.height)
    {
        sprite.y = 0;
    }

}
var shoot = function (power) {
    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {    
        if (game.time.now > bulletTime)
        {
            
            bullet = bullets.getFirstExists(false);
    
            if (bullet)
            {
                bullet.reset(this.body.x + 42, this.body.y + 25);
                bullet.scale.setTo(0.5, 0.5);
                bullet.lifespan = 2000;
                bullet.rotation = this.rotation;
                game.physics.arcade.velocityFromRotation(this.rotation, 400, bullet.body.velocity);
                bulletTime = game.time.now + 300;
                }
                if (power == 1){
                    bullet = bullets.getFirstExists(false);
                    if (bullet)
                    {
                        bullet.reset(this.body.x + 42, this.body.y + 25);
                        bullet.scale.setTo(0.5, 0.5);
                        bullet.lifespan = 2000;
                        bullet.rotation = this.rotation+0.2;
                        game.physics.arcade.velocityFromRotation(this.rotation+0.2, 400, bullet.body.velocity);
                        bulletTime = game.time.now + 300;
                    }
                    bullet = bullets.getFirstExists(false);
                    if (bullet)
                    {
                        bullet.reset(this.body.x + 42, this.body.y + 25);
                        bullet.scale.setTo(0.5, 0.5);
                        bullet.lifespan = 2000;
                        bullet.rotation = this.rotation-0.2;
                        game.physics.arcade.velocityFromRotation(this.rotation-0.2, 400, bullet.body.velocity);
                        bulletTime = game.time.now + 300;
                    }
            }
        }
    }
};

var movement = function () {
    if (cursors.up.isDown)
    {
        game.physics.arcade.accelerationFromRotation(this.rotation, 200, this.body.acceleration);
    }
    else
    {
        this.body.acceleration.set(0);
    }

    if (cursors.left.isDown)
    {
        this.body.angularVelocity = -300;
    }
    else if (cursors.right.isDown)
    {
        this.body.angularVelocity = 300;
    }
    else
    {
        this.body.angularVelocity = 0;
    }
    screenWrap(this);

};

function render() {
}