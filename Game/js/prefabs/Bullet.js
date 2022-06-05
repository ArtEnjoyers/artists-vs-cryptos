var Game = Game || {};

Game.Bullet = function(state, x, y) {
    Phaser.Sprite.call(this, state.game, x, y, 'wave');
    this.scale.setTo(0.05);
    this.y = this.y - 10;

    this.state = state;
    this.game = state.game;

    this.game.physics.arcade.enable(this);
    this.body.velocity.x = 100;
};

Game.Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Game.Bullet.prototype.construtor = Game.Bullet;

Game.Bullet.prototype.update = function() {
    //Matar la bala al sortir de la pantalla
    if(this.x >= this.game.width) {
        this.kill();
    }
}
