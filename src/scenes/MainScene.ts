import Phaser from 'phaser';
import { Player } from '../game/Player';
import { Bullet } from '../game/Bullet';

export class MainScene extends Phaser.Scene {
  private player!: Player;
  private keys!: { [key: string]: Phaser.Input.Keyboard.Key };
  private bullets!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    const canvas = this.sys.game.canvas;
    canvas.style.border = '2px solid white';

    // Add background image
    this.add.image(0, 0, 'grass_background').setOrigin(0).setDisplaySize(canvas.width, canvas.height);

    this.physics.world.setBoundsCollision(true,true,true,true);

    this.player = new Player(this, 400, 300);
    this.bullets = this.add.group();

    if (!this.input.keyboard) {
        throw new Error('Keyboard input is not available');
    }
    this.keys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        SPACE: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        this.player.shoot(pointer.x, pointer.y, this.bullets);
    });
  }

  update() {
    this.player.update(this.keys, this.input.activePointer.x, this.input.activePointer.y);

    this.bullets.getChildren().forEach((bullet) => {
        (bullet as Bullet).update();
    });
  }
}
