import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    this.load.image('grass_background', 'assets/cartoon_green_texture_grass.jpg');
    this.load.image('marine_character', 'assets/marine_character.png');
  }

  create() {
    this.scene.start('MainScene');
  }
}
