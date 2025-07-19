import Phaser from 'phaser';
import { Bullet } from './Bullet';

export class Player extends Phaser.GameObjects.Container {
    private head: Phaser.GameObjects.Arc;
    private playerBody: Phaser.GameObjects.Line;
    private gun: Phaser.GameObjects.Line;
    private isRecharging: boolean = false;
    private rechargeStartTime: number = 0;
    private rechargeDuration: number = 500; // 0.5 seconds

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.head = new Phaser.GameObjects.Arc(scene, 0, 0, 10, 0, 360, false, 0xffffff, 1);
        this.playerBody = new Phaser.GameObjects.Line(scene, 0, 0, 0, -20, 0, 20, 0xffffff);
        // Gun points right (positive X) when rotation is 0
        this.gun = new Phaser.GameObjects.Line(scene, 0, 0, 0, 0, 20, 0, 0xffffff);

        this.add([this.head, this.playerBody, this.gun]);

        scene.add.existing(this);
    }

    public shoot(targetX: number, targetY: number, bulletGroup: Phaser.GameObjects.Group) {
        if (this.isRecharging) {
            return;
        }

        const bullet = new Bullet(this.scene, this.x, this.y);
        bulletGroup.add(bullet);
        bullet.fire(targetX, targetY);

        // this.isRecharging = true;
        // this.rechargeStartTime = this.scene.time.now;
        // (this.gun as Phaser.GameObjects.Line).setStrokeStyle(1, 0xff0000); // Turn gun red
        //
        // this.scene.time.delayedCall(this.rechargeDuration, () => {
        //     this.isRecharging = false;
        // }, [], this);
    }

    public update(keys: { [key: string]: Phaser.Input.Keyboard.Key }, mouseX: number, mouseY: number) {
        const speed = 2;

        if (keys.A.isDown) {
            this.x -= speed;
        }
        if (keys.D.isDown) {
            this.x += speed;
        }
        if (keys.W.isDown) {
            this.y -= speed;
        }
        if (keys.S.isDown) {
            this.y += speed;
        }

        const angle = Phaser.Math.Angle.Between(this.x, this.y, mouseX, mouseY);
        this.setRotation(angle + Math.PI / 2);

        // Gradual color change for gun
        // if (this.isRecharging) {
        //     const progress = (this.scene.time.now - this.rechargeStartTime) / this.rechargeDuration;
        //     const clampedProgress = Phaser.Math.Clamp(progress, 0, 1);
        //     const interpolatedColor = Phaser.Display.Color.Interpolate.ColorRGB(0xff0000, 0xffffff, 100, clampedProgress * 100);
        //     (this.gun as Phaser.GameObjects.Line).setStrokeStyle(1, interpolatedColor.color);
        // } else if ((this.gun as Phaser.GameObjects.Line).strokeColor !== 0xffffff) {
        //     // Ensure gun is white when not recharging
        //     (this.gun as Phaser.GameObjects.Line).setStrokeStyle(1, 0xffffff);
        // }
    }
}
