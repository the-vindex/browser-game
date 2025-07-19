import Phaser from 'phaser';
import { Bullet } from './Bullet';
import Color = Phaser.Display.Color;

export class Player extends Phaser.GameObjects.Container {
    private head: Phaser.GameObjects.Arc;
    private gun: Phaser.GameObjects.Line;
    private playerBody: Phaser.GameObjects.Line;
    private isRecharging: boolean = false;
    private rechargeStartTime: number = 0;
    private rechargeDuration: number = 500; // 0.5 seconds

    public GUN_COLOR_READY = 0xffffff;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.head = new Phaser.GameObjects.Arc(scene, 0, 0, 10, 0, 360, false, 0xffffff, 1);
        this.gun = new Phaser.GameObjects.Line(scene, 0, 0, 0, -20, 0, 20, 0xffffff);
        // Gun points right (positive X) when rotation is 0
        this.playerBody = new Phaser.GameObjects.Line(scene, 0, 0, 0, 0, 20, 0, 0xffffff);

        this.add([this.head, this.gun, this.playerBody]);

        scene.add.existing(this);
    }

    public shoot(targetX: number, targetY: number, bulletGroup: Phaser.GameObjects.Group) {
        if (this.isRecharging) {
            return;
        }

        const bullet = new Bullet(this.scene, this.x, this.y);
        bulletGroup.add(bullet);
        bullet.fire(targetX, targetY);

        this.isRecharging = true;
        this.rechargeStartTime = this.scene.time.now;
        (this.gun as Phaser.GameObjects.Line).setStrokeStyle(1, 0xff0000); // Turn playerBody red

        this.scene.time.delayedCall(this.rechargeDuration, () => {
            this.isRecharging = false;
        }, [], this);
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

        // Gradual color change for playerBody
        if (this.isRecharging) {
            const progress = (this.scene.time.now - this.rechargeStartTime) / this.rechargeDuration;
            const clampedProgress = Phaser.Math.Clamp(progress, 0, 1);
            const interpolatedColor = Phaser.Display.Color.Interpolate.ColorWithColor(new Color(0xff0000), new Color(this.GUN_COLOR_READY), 100, clampedProgress * 100);
            (this.gun as Phaser.GameObjects.Line).setStrokeStyle(1, interpolatedColor.color);
        } else if ((this.gun as Phaser.GameObjects.Line).strokeColor !== this.GUN_COLOR_READY) {
            // Ensure playerBody is white when not recharging
            (this.gun as Phaser.GameObjects.Line).setStrokeStyle(1, this.GUN_COLOR_READY);
        }
    }
}

