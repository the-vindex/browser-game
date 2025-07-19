import Phaser from 'phaser';
import { Bullet } from './Bullet';
import Color = Phaser.Display.Color;

export class Player extends Phaser.GameObjects.Container {
    private readonly playerBody: Phaser.GameObjects.Sprite;
    private readonly gun: Phaser.GameObjects.Line;
    private isRecharging: boolean = false;
    private rechargeStartTime: number = 0;
    private rechargeDuration: number = 500; // 0.5 seconds
    private isStrafing: boolean = false;
    private lastStrafeTime: number = 0;
    private strafeCooldown: number = 1000; // 1 second
    private strafeDuration: number = 100; // 0.1 seconds
    private strafeSpeed: number = 100;

    public GUN_COLOR_READY = 0xffffff;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.playerBody = new Phaser.GameObjects.Sprite(scene, 0, 0, 'marine_character');
        this.playerBody.setScale(0.05,0.05);
        this.playerBody.setRotation(Math.PI);
        this.gun = new Phaser.GameObjects.Line(scene, 0, 0, 0, -20, 0, 20, 0xffffff);

        this.add([this.playerBody, this.gun]);

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
        if (this.isStrafing) {
            // Disable movement and rotation updates while strafing
            return;
        }
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

        if (keys.SPACE.isDown && !this.isStrafing && this.scene.time.now - this.lastStrafeTime > this.strafeCooldown) {
            const isMoving = keys.W.isDown || keys.A.isDown || keys.S.isDown || keys.D.isDown;
            if (isMoving) {
                this.isStrafing = true;
                this.lastStrafeTime = this.scene.time.now;

                let strafeX = 0;
                let strafeY = 0;

                if (keys.W.isDown) strafeY = -1;
                if (keys.S.isDown) strafeY = 1;
                if (keys.A.isDown) strafeX = -1;
                if (keys.D.isDown) strafeX = 1;

                // Normalize diagonal strafe
                if (strafeX !== 0 && strafeY !== 0) {
                    const length = Math.sqrt(strafeX * strafeX + strafeY * strafeY);
                    strafeX /= length;
                    strafeY /= length;
                }

                const strafeTargetX = this.x + strafeX * this.strafeSpeed;
                const strafeTargetY = this.y + strafeY * this.strafeSpeed;

                this.scene.tweens.add({
                    targets: this,
                    x: strafeTargetX,
                    y: strafeTargetY,
                    duration: this.strafeDuration,
                    ease: 'Power2',
                    onComplete: () => {
                        this.isStrafing = false;
                    }
                });
            }
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

