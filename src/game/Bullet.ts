import Phaser from 'phaser';

export class Bullet extends Phaser.GameObjects.Arc {
    private speed = 10;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 5, 0, 360, false, 0xffff00, 1);
        scene.add.existing(this);
        scene.physics.world.enable(this);

    }

    public fire(targetX: number, targetY: number) {
        const direction = new Phaser.Math.Vector2(targetX - this.x, targetY - this.y).normalize();
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(direction.x * this.speed * 100, direction.y * this.speed * 100);
    }

    public update() {
        if (
            this.x < 0 ||
            this.x > this.scene.sys.game.config.width ||
            this.y < 0 ||
            this.y > this.scene.sys.game.config.height
        ) {
            this.destroy();
        }
    }
}
