var Game = Game || {};

Game.PreloadState = {
    //Carregar tota l'informacio necessaria
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        this.preloadBar.scale.setTo(3);

        this.load.setPreloadSprite(this.preloadBar);

        this.load.image('background', 'assets/images/background.jpg');


        this.load.image('chiliButton', 'assets/images/button_chilli.png');
        this.load.image('sunflowerButton', 'assets/images/button_sunflower.png');
        this.load.image('artButton', 'assets/images/button_plant.png');
        this.load.image('olaButton', 'assets/images/ola_boton.png');
        this.load.image('girasolButton', 'assets/images/girasoles_boton.png');


        this.load.image('bloodParticle', 'assets/images/blood.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('sunflower', 'assets/images/sunflower.png');
        this.load.image('chili', 'assets/images/chilli.png');
        this.load.image('deadZombie', 'assets/images/dead_zombie.png');
        this.load.image('energia', 'assets/images/energia.png');
        this.load.image('ola', 'assets/images/ola.png');
        this.load.image('girasol', 'assets/images/girasolPixel.png');
        this.load.image('grito', 'assets/images/gritoPixel.png');
        this.load.image('blackDead', 'assets/images/amongusded.png');
        this.load.image('pinkDead', 'assets/images/amongusded2.png');




        this.load.spritesheet('chicken', 'assets/images/chicken_sheet.png', 25, 25, 3, 1, 2);
        this.load.spritesheet('enemy', 'assets/images/zombie_sheet.png', 30, 50, 3, 1, 2);
        this.load.spritesheet('art', 'assets/images/plant_sheet.png', 24, 40, 3, 1, 2);
        this.load.spritesheet('sun', 'assets/images/sun_sheet.png', 30, 30, 2, 1, 2);
        this.load.spritesheet('amongus', 'assets/images/spritesheet.png', 88, 102, 3);
        this.load.spritesheet('amongusPink', 'assets/images/spritesheetRosa.png', 88, 102, 3);

        this.load.audio('hit', ['assets/audio/hit.mp3', 'assets/audio/hit.png']);

        this.load.text('buttonData', 'assets/data/buttons.json');
        //Tota la informacio dels nivells, nomes accedim al level1 i els enemics tenen un temps determinat pero no es va fer servir al final
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');

    },
    create: function() {
        this.state.start('Game');
    }
};
