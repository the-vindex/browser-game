import Phaser from 'phaser';

export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.add.text(400, 300, 'Hello, World!', { font: '64px Arial', color: '#ffffff' }).setOrigin(0.5);
  }

  update() {
    // Game logic here
  }
}
