import Phaser from 'phaser';
import { PreloaderScene } from './scenes/PreloaderScene';
import { MainScene } from './scenes/MainScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x:0, y: 200 }
    }
  },
  scene: [PreloaderScene, MainScene]
};

export default new Phaser.Game(config);
