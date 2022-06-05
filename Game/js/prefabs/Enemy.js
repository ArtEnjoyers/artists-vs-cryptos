var Game = Game || {};

Game.enemy = function(state, x, y, data) {
  Phaser.Sprite.call(this, state.game, x, y, data.asset);

  this.state = state;
  this.game = state.game;
  this.anchor.setTo(0.5);
  if (data.asset == "amongus"){
    this.scale.setTo(0.4);
  }

  //cridar fisiques
  this.game.physics.arcade.enable(this);

  this.reset(x, y, data);
};

Game.enemy.prototype = Object.create(Phaser.Sprite.prototype);
Game.enemy.prototype.constructor = Game.enemy;

Game.enemy.prototype.reset = function(x, y, data) {
  Phaser.Sprite.prototype.reset.call(this, x, y, data.health);

  //canviar l'imatge de l'enemic
  this.loadTexture(data.asset);

  //crear una animacio si en te alguna 
  this.animationName = null;
  if(data.animationFrames) {
    this.animationName = data.asset + 'Anim';
    this.animations.add(this.animationName, data.animationFrames, 6, true);
    this.play(this.animationName);
  }

  //guardar propietats
  this.attack = data.attack;
  this.defaultVelocity = data.velocity;
  this.body.velocity.x = data.velocity;

};

Game.enemy.prototype.damage = function(amount) {
    Phaser.Sprite.prototype.damage.call(this, amount);

    var emitter = this.game.add.emitter(this.x, this.y, 50);
    emitter.makeParticles('bloodParticle');
    emitter.minParticleSpeed.setTo(-100, -100);
    emitter.maxParticleSpeed.setTo(100, 100);
    emitter.gravity = 300;
    emitter.start(true, 200, null, 100);

    if(this.health <= 0) {
        var corpse = this.game.add.sprite(this.x, this.bottom, 'deadZombie');
        corpse.anchor.setTo(0.5, 1);
    }
};
