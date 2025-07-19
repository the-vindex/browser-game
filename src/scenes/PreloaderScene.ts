import Phaser from 'phaser';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    // Load assets here
  }

  create() {
    this.scene.start('MainScene');
  }
}
