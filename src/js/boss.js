var gameObject = require('./gameObject.js');

var Boss = function newBoss (self, bullets, player, bossParts, GameManager){
    var boss ={};
    var spacing = 7;
    var sections = 18 + GameManager.level;
    boss.Body = new Array();
    var bossPath = new Array();
    for (var i = sections - 1; i >= 1; i--){
        if (i == sections - 1)
            boss.Body[i] = gameObject(self, 40, 40, 'tail');
        else
            boss.Body[i] = gameObject(self, 40, 40, 'body');
        self.game.physics.enable(boss.Body[i], Phaser.Physics.ARCADE);
        bossParts.add(boss.Body[i]);
    }
    boss.Head = gameObject(self, 50, 40, 'head');
    self.game.physics.enable(boss.Head, Phaser.Physics.ARCADE);
    boss.Head.hp = 60 + GameManager.level;
    bossParts.add(boss.Head);
    for (var i = 0; i <= sections * spacing; i++)
    {
        bossPath[i] = new Phaser.Point(40, 40);
        bossPath[i].angle = 0;
    }
    boss.Head.update = function () {
        if (self.game.time.now > boss.Head.timer){
            if (self.game.rnd.between(0, 1) == 0)
                boss.Head.body.angularVelocity = self.game.rnd.between(20, 60);
            else
                boss.Head.body.angularVelocity = self.game.rnd.between(-60, -20);
            boss.Head.timer = self.game.time.now + self.game.rnd.between(600, 1900);
        }
        boss.Head.body.velocity.setTo(0, 0);
        self.game.physics.arcade.velocityFromRotation(boss.Head.rotation, GameManager.level * 4 + 250, this.body.velocity);
        
        var part = bossPath.pop();

        part.setTo(boss.Head.x, boss.Head.y);
        part.angle = boss.Head.angle;

        bossPath.unshift(part);

        for (var i = 1; i <= sections - 1; i++)
        {
            boss.Body[i].x = (bossPath[i * spacing]).x;
            boss.Body[i].y = (bossPath[i * spacing]).y;
            boss.Body[i].angle = bossPath[i * spacing].angle;
    }
    if (self.game.physics.arcade.overlap(bullets, bossParts))
        boss.Head.hp --;
        boss.Head.screenwarp();
    }
    boss.Head.lateUpdate = function () {
        if (boss.Head.hp <= 0){
            GameManager.addScore(2000);
            for (var i = 1; i <= sections - 1; i++)
        {
            boss.Body[i].destroy();
            boss.Body[i].createExplosion(1);
        }
            boss.Head.destroy();
            boss.Head.createExplosion(2);
            GameManager.bossKilled = true;
        }
    }
    return boss;
}

module.exports = Boss;