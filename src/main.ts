import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
    private player!: Phaser.GameObjects.Sprite;
    private targetX: number = 0;
    private targetY: number = 0;
    private isMovingToTarget: boolean = false;
    private ultimaDireccion: string = 'down';

    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.spritesheet('player', './player/Walk.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('playerIdle', './player/Idle.png', { frameWidth: 32, frameHeight: 32 });
    }

    create() {
        this.player = this.add.sprite(200, 200, 'player').setScale(2);
        
        this.targetX = this.player.x;
        this.targetY = this.player.y;
        this.isMovingToTarget = false;
        this.ultimaDireccion = 'down';

        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (pointer.y > 500) { 
                return; 
            }

            this.targetX = pointer.x;
            this.targetY = pointer.y;
            this.isMovingToTarget = true;
        });

        // Animaciones de caminata
        this.anims.create({
            key: 'walkright',
            frames: this.anims.generateFrameNumbers('player', { start: 13, end: 18 }),
            repeat: -1,
            frameRate: 6
        });

        this.anims.create({
            key: 'walkUp',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 11 }),
            repeat: -1,
            frameRate: 6
        });

        this.anims.create({
            key: 'walkDown',
            frames: this.anims.generateFrameNumbers('player', { start: 1, end: 5 }),
            repeat: -1,
            frameRate: 6
        });

        // Animaciones de Idle
        this.anims.create({
            key: 'idleDown',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 0, end: 3 }),
            repeat: -1,
            frameRate: 5 
        });

        this.anims.create({
            key: 'idleUp',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 4, end: 7 }),
            repeat: -1,
            frameRate: 5
        });

        this.anims.create({
            key: 'idleRight',
            frames: this.anims.generateFrameNumbers('playerIdle', { start: 8, end: 11 }),
            repeat: -1,
            frameRate: 5
        });
    }

    update() {
        const speed = 2;
        let movingX = 0;
        let movingY = 0;

        if (this.isMovingToTarget) {
            let distX = this.targetX - this.player.x;
            let distY = this.targetY - this.player.y;
            let distance = Math.sqrt(distX * distX + distY * distY);

            if (distance < 2) {
                this.player.x = this.targetX;
                this.player.y = this.targetY;
                this.isMovingToTarget = false;
            } else {
                let angle = Math.atan2(distY, distX);
                movingX = Math.cos(angle) * speed;
                movingY = Math.sin(angle) * speed;

                if (Math.abs(distX) > Math.abs(distY)) {
                    this.player.anims.play('walkright', true);
                    if (distX < 0) {
                        this.player.flipX = true;
                        this.ultimaDireccion = 'left';
                    } else {
                        this.player.flipX = false;
                        this.ultimaDireccion = 'right';
                    }
                } else {
                    if (distY < 0) {
                        this.player.anims.play('walkUp', true);
                        this.ultimaDireccion = 'up';
                    } else {
                        this.player.anims.play('walkDown', true);
                        this.ultimaDireccion = 'down';
                    }
                }
            }
        }

        this.player.x += movingX;
        this.player.y += movingY;

        // --- IDLE / QUIETO ---
        if (!this.isMovingToTarget) {
            if (this.ultimaDireccion === 'down') {
                this.player.anims.play('idleDown', true);
            } else if (this.ultimaDireccion === 'up') {
                this.player.anims.play('idleUp', true);
            } else if (this.ultimaDireccion === 'right') {
                this.player.anims.play('idleRight', true);
                this.player.flipX = false;
            } else if (this.ultimaDireccion === 'left') {
                this.player.anims.play('idleRight', true); 
                this.player.flipX = true;
            }
        }
    }
}

// Configuración global del juego apuntando a la clase
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#049cd8',
    parent: 'game',
    scene: GameScene
};

new Phaser.Game(config);