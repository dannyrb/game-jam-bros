import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {
    private movingPlatform: Phaser.Types.Physics.Arcade.ImageWithDynamicBody | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private platforms: Phaser.Physics.Arcade.StaticGroup | undefined;
    private stars: Phaser.Physics.Arcade.Group | undefined;
    private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | undefined;

    constructor() {
        super({
          key: 'MainScene'
        });
      }

    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create ()
    {
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

        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

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

        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        for (const star of this.stars.getChildren() as Phaser.Physics.Arcade.Sprite[])
        {
            star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        }

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.movingPlatform);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.stars, this.movingPlatform);

        // TODO: TS Issue
        // this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
    }

    update ()
    {
        // Exit if undefined
        if (!this.cursors || !this.player || !this.movingPlatform) {
            return;
        }

        const { left, right, up } = this.cursors;

        if (left.isDown)
        {
            this.player.setVelocityX(-160);

            // this.player.anims.play('left', true);
        }
        else if (right.isDown)
        {
            this.player.setVelocityX(160);

            // this.player.anims.play('right', true);
        }
        else
        {
            this.player.setVelocityX(0);

            // this.player.anims.play('turn');
        }

        if (up.isDown) // && this.player.body.touching.down
        {
            this.player.setVelocityY(-330);
        }

        if (this.movingPlatform.x >= 500)
        {
            this.movingPlatform.setVelocityX(-50);
        }
        else if (this.movingPlatform.x <= 300)
        {
            this.movingPlatform.setVelocityX(50);
        }
    }

    collectStar (player: Phaser.Physics.Arcade.Sprite, star: Phaser.Physics.Arcade.Sprite)
    {
        star.disableBody(true, true);
    }
}

export { MainScene }