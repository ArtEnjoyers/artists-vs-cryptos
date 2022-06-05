var Game = Game || {};

Game.GameState = {

    /*Posicions Y:
    Primera fila: 24
    Segona fila: 74
    Tercera fila: 124
    Quarta fila: 174
    Cinquena fila: 224
    */
  init: function(currentLevel) {
    //mirar el nivell actual
    this.currentLevel = currentLevel ? currentLevel : 'level1';

    //constants
    this.HOUSE_X = 60;
    this.SUN_FREQUENCY = 3;
    this.SUN_VELOCITY = 50;
    this.ENEMY_FREQUENCY = 7;

    //no hi ha gravetat y
    this.game.physics.arcade.gravity.y = 0;
  },
  create: function() {
    this.background = this.add.sprite(0, 0, 'background');
    this.createLandPatches();

    this.hitSound = this.add.audio('hit');

    this.enemyCount = 0;
    
    //grup dels objectes de la classe
    this.bullets = this.add.group();
    this.Arts = this.add.group();
    this.enemys = this.add.group();
    this.suns = this.add.group();

    this.numSuns = 100;

    this.levelData = JSON.parse(this.game.cache.getText(this.currentLevel));

    this.createGui();

    this.sunGenerationTimer = this.game.time.create(false);
    this.sunGenerationTimer.start();
    this.scheduleSunGeneration();

    this.enemyGenerationTimer = this.game.time.create(false);
    this.enemyGenerationTimer.start();
    this.scheduleEnemyGeneration();
  },
  update: function() {
    this.game.physics.arcade.collide(this.Arts, this.enemys, this.attackArt, null, this);
    this.game.physics.arcade.collide(this.bullets, this.enemys, this.hitenemy, null, this);

    if(this.enemyCount == this.levelData.enemys.length + 3 ){
        this.state.start('Game', {currentLevel: this.levelData.nextLevel});
    }    

    this.enemys.forEachAlive(function(enemy){
      //enemics necessiten mantenir la velocitat
      enemy.body.velocity.x = enemy.defaultVelocity;
        
      //si arriben al final, s'acaba el joc
      if(enemy.x <= this.HOUSE_X) {
        this.gameOver();
      }
    }, this);
  },
  gameOver: function() {
    this.game.state.start('Game');
  },
  attackArt: function(Art, enemy) {
    Art.damage(enemy.attack);
},
createEnemy: function(x, y, data) {
    var newElement = this.enemys.getFirstDead();

    if(!newElement) {
        newElement = new Game.enemy(this, x, y, data);
        this.enemys.add(newElement);
    }
    else {
        newElement.reset(x ,y , data);
    }

    return newElement;
},
createArt: function(x, y, data) {
    var newElement = this.enemys.getFirstDead();

    if(!newElement) {
        newElement = new Game.Art(this, x, y, data);
        this.Arts.add(newElement);
    }
    else {
        newElement.reset(x ,y , data);
    }

    return newElement;
},
createGui: function() {
    var sun = this.add.sprite(10, this.game.height - 20, 'energia');
    sun.anchor.setTo(0.5);
    sun.scale.setTo(0.05);

    var style = {font: '14px Arial', fill: '#fff'};
    this.sunLabel = this.add.text(22, this.game.height - 28, '', style);

    //Fer un update del label, sino no surtiria be
    this.updateStats();

    //ensenyar button 
    this.buttonData = JSON.parse(this.game.cache.getText('buttonData'));

    //grup dels botons
    this.buttons = this.add.group();

    var button;
    this.buttonData.forEach(function(element, index) {
        button = new Phaser.Button(this.game, 80 + index * 40, this.game.height - 35, element.btnAsset, this.clickButton, this);
        this.buttons.add(button);
        button.scale.setTo(0.3);
        

        //passar les dades al botó
        button.ArtData = element;
    }, this);

    this.ArtLabel = this.add.text(300, this.game.height - 28, '', style);
},
updateStats: function() {
    this.sunLabel.text = this.numSuns;
},
increaseSun: function(amount) {
    this.numSuns += amount;
    this.updateStats();
},
//Cada x temps es genera un sol i es torna a cridar a la mateixa funcio
scheduleSunGeneration: function() {
    this.sunGenerationTimer.add(Phaser.Timer.SECOND * this.SUN_FREQUENCY, function() {
        this.generateRandomSun();
        this.scheduleSunGeneration();
    }, this);
},
//Cada x temps es genera un enemic i es torna a cridar a la mateixa funcio
scheduleEnemyGeneration: function(){
    this.enemyGenerationTimer.add(Phaser.Timer.SECOND * this.ENEMY_FREQUENCY, function(){
        if(this.enemyCount <= this.levelData.enemys.length - 1)
            this.generateRandomEnemy();
        this.enemyCount ++;
        this.scheduleEnemyGeneration();
    }, this);
},
generateRandomSun: function() {
    var y = -20;
    var x = 40 + 420 * Math.random();

    var sun = this.createSun(x, y);

    sun.body.velocity.y = this.SUN_VELOCITY;
},
generateRandomEnemy: function(){
    var x = 450;
    var fila = 1 + 5 * Math.random();
    fila = Math.round(fila);
    var y = 0;
    //De forma aleatoria s'escull en quina fila esta l'enemic, i segons la fila la y canvia
    switch (fila) {
        case 1:
            y = 24;
            break;
        case 2:
            y = 74;
            break;
        case 3:
            y = 124;
            break;
        case 4:
            y = 174;
            break;
        case 5:
            y = 224;
            break;
        default:
            y = 224;
            break;
    }
    var enemyData;

    //L'enemic correspon al seguent de la llista del Json
    enemyData = this.levelData.enemys[this.enemyCount];

    var enemy = this.createEnemy(x,y,enemyData);
},
createSun: function(x, y) {
    var newElement = this.suns.getFirstDead();

    if(!newElement) {
        newElement = new Game.Sun(this, x, y);
        this.suns.add(newElement);
    }
    else {
        newElement.reset(x ,y);
    }

    return newElement;
},
hitenemy: function(bullet, enemy) {
    bullet.kill();
    enemy.damage(1);
    this.hitSound.play();
},
clickButton: function(button) {
    if(!button.selected) {
        this.clearSelection();
        this.ArtLabel.text = 'Cost: ' + button.ArtData.cost;
        button.selected = true;
        button.alpha = 0.5;

        //Mirar si pots comprar l'Art
        if(this.numSuns >= button.ArtData.cost) {
            this.ArtLabel.fill = "white";

            this.currentSelection = button.ArtData;

            this.currentCost = button.ArtData.cost;
        }
        else {
            this.ArtLabel.fill = "red";
        }
    }
    else {
        this.clearSelection();
    }
},
clearSelection: function() {
    this.ArtLabel.text = '';
    this.currentSelection = null;
    this.currentCost = null;

    this.buttons.forEach(function(button){
        button.alpha = 1;
        button.selected = false;
    }, this);
},
//Crear botons per poder clickar i colocar unitats
createLandPatches: function() {
    this.patches = this.add.group();

    //Rectangles per clickar
    var rectangle = this.add.bitmapData(40, 50);
    rectangle.ctx.fillStyle = '#000';
    rectangle.ctx.fillRect(0, 0, 40, 50);

    var j, patch;
    var dark = false;

    for(var i = 0; i < 10; i++) {
        for(j = 0; j < 5; j++) {
            patch = new Phaser.Sprite(this.game, 64 + i * 40, 24 + j * 50, rectangle);
            this.patches.add(patch);
            alpha = dark ? 0.2 : 0.1;
            dark = !dark;

            patch.alpha = alpha;
            patch.posX = 64 + i * 40;
            patch.posY = 24 + j * 50;

            //Colocar una unitat si has seleccionat un lloc
            patch.inputEnabled = true;
            patch.events.onInputDown.add(this.paintArt, this);
        }
    }
},
//Colocar unitats
paintArt: function(patch) {
    if (this.currentSelection != null && this.numSuns >= this.currentCost){
        this.createArt(patch.posX,patch.posY,this.currentSelection);
        this.numSuns -= this.currentCost;
        this.updateStats();
        this.clearSelection();
    }
}
};
