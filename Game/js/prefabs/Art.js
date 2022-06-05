var Game = Game || {};

Game.Art = function(state, x, y, data) {
  Phaser.Sprite.call(this, state.game, x, y, data.artAsset);

  this.state = state;
  this.game = state.game;
  this.bullets = state.bullets;
  this.suns = state.suns;

  this.anchor.setTo(0.5);
  if (data.artAsset == 'ola' ){
    this.scale.setTo(0.1);
  }
  if (data.artAsset == "girasol"){
      this.scale.setTo(0.05);
  }
  if (data.artAsset == "grito"){
    this.scale.setTo(0.1);
}

  //iniciar les fisiques del cos
  this.game.physics.arcade.enable(this);
  this.body.immovable = true;

  //crear timers
  this.shootingTimer = this.game.time.create(false);
  this.producingTimer = this.game.time.create(false);

  this.reset(x, y, data);
};

Game.Art.prototype = Object.create(Phaser.Sprite.prototype);
Game.Art.prototype.constructor = Game.Art;

Game.Art.prototype.reset = function(x, y, data){
  Phaser.Sprite.prototype.reset.call(this, x, y, data.health);
  if (data.artAsset == 'ola'){
    this.x = this.x + 10;
    this.y = this.y + 10;
  }
  if (data.artAsset == 'grito'){
    this.x = this.x + 10;
    this.y = this.y + 10;
  }

  //cambiar l'imatge de l'Art
  this.loadTexture(data.artAsset);

  /*this.animationName = null;
  if(data.animationFrames) {
    this.animationName = data.artAsset + 'Anim';
    this.animations.add(this.animationName, data.animationFrames, 6, false);
    this.play(this.animationName);
  }
  */

  this.isShooter = data.isShooter;
  this.isSunProducer = data.isSunProducer;

  if(this.isShooter) {
      this.shootingTimer.start();
      this.scheduleShooting();
  }

  if(this.isSunProducer) {
      this.producingTimer.start();
      this.scheduleProduction();
  }
};

Game.Art.prototype.kill = function() {
    Phaser.Sprite.prototype.kill.call(this);

    this.shootingTimer.stop();
    this.producingTimer.stop();
};

Game.Art.prototype.scheduleShooting = function() {
    this.shoot();

    //Arts dispara una vegada per segon
    this.shootingTimer.add(Phaser.Timer.SECOND, this.scheduleShooting, this);
};

Game.Art.prototype.scheduleProduction = function() {
    this.produceSun();

    //Arts crea sun una vegada per 5 segons
    this.producingTimer.add(Phaser.Timer.SECOND * 5, this.scheduleProduction, this);
};

Game.Art.prototype.shoot = function() {
    //animacio disparar
    if(this.animations.getAnimation(this.animationName)) {
        this.play(this.animationName);
    }

    //lloc de la bala y
    var y = this.y - 10;
    var newElement = this.bullets.getFirstDead();

    if(!newElement) {
        newElement = new Game.Bullet(this, this.x, y);
        this.bullets.add(newElement);
    }
    else {
        newElement.reset(this.x, y);
    }

    newElement.body.velocity.x = 100;
};

Game.Art.prototype.produceSun = function() {
    var diffX = -40 + Math.random() * 80;
    var diffY = -40 + Math.random() * 80;

    this.state.createSun(this.x + diffX, this.y + diffY);
};
