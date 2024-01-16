import * as Phaser from 'phaser';

import { Player } from '../objects/player'

export default class GameScene extends Phaser.Scene {
    private movingPlatform: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
    private stars: Phaser.Physics.Arcade.Group | undefined;
    // @see https://stackoverflow.com/questions/42273853/in-typescript-what-is-the-exclamation-mark-bang-operator-when-dereferenci
    private player!: Player;
    private collectStar: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;


    constructor() {
        super({
          key: 'GameScene'
        });

        this.collectStar = collectStar;
      }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create () {
        /**
         * SETUP TILEMAP
         */
        
        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        this.movingPlatform = this.physics.add.image(400, 400, 'ground');

        this.movingPlatform.setImmovable(true);
        this.movingPlatform.body.allowGravity = false;
        this.movingPlatform.setVelocityX(50);

        /**
         * GAME OBJECTS
         */

        this.loadObjectsFromTilemap();

        this.player = new Player({
            scene: this,
            x: 100, // this.registry.get('spawn').x,
            y: 450, // this.registry.get('spawn').y,
            texture: 'knightWalking001'
          });
        
        // this.player = this.physics.add.sprite(100, 450, 'dude');
        // this.player.setBounce(0.2);
        // this.player.setCollideWorldBounds(true);

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        for (const star of this.stars.getChildren() as Phaser.Physics.Arcade.Sprite[])
        {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        /**
         * COLLIDERS
         */

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatform);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.stars, this.movingPlatform);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        /**
         * MISC
         */


        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // TODO: check there is a keyboard
        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    update ()
    {
        // Exit if undefined
        if (!this.cursors || !this.player || !this.movingPlatform) {
            return;
        }
        const { left, right, up } = this.cursors;


        this.player.update();

        if (this.movingPlatform.x >= 500)
        {
            this.movingPlatform.setVelocityX(-50);
        }
        else if (this.movingPlatform.x <= 300)
        {
            this.movingPlatform.setVelocityX(50);
        }
    }

    private loadObjectsFromTilemap(): void {

    }
}

type GameObject =  	Phaser.Tilemaps.Tile | Phaser.Types.Physics.Arcade.GameObjectWithBody;

function collectStar (player: GameObject, star: GameObject){
    // https://github.com/phaserjs/phaser/issues/5882
    // https://stackoverflow.com/questions/77063518/typescript-errors-in-phaser-js
    // https://phaser.discourse.group/t/solved-disablebody-is-not-a-function/3037
    // @ts-ignore
    star.disableBody(true, true);
}


export { GameScene }