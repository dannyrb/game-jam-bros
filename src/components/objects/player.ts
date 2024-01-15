import { ISpriteConstructor } from '../interfaces/sprite.interface';

export class Player extends Phaser.GameObjects.Sprite {
  // PUBLIC STATE
  IsFacingRight: boolean;
	IsWallJumping: boolean;
	IsDashing: boolean;
	IsSliding: boolean;
  //


  // variables

  private maxFallSpeed: number;

  //
  private gravityStrength: number;
  private gravityScale: number;
  // private runAccelAmount: number;
  // private runDeccelAmount: number;
  // private jumpForce: number;
  // private runAcceleration: number;
  // private runDeceleration: number;
  private jumpTimeToApex: number;
  private jumpHeight: number;
  //

  private currentScene: Phaser.Scene;
  private acceleration: number;
  private isJumping: boolean;
  private isDying: boolean;
  private isVulnerable: boolean;

  // input
  private keys: Map<string, Phaser.Input.Keyboard.Key>;

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys;
  }

  public getVulnerable(): boolean {
    return this.isVulnerable;
  }

  /**
   * @param {number} gravityScale - Between 0 and 1
   */
  public setGravityScale(gravityScale: number): void {
    this.gravityScale = gravityScale;
  }

  private getPlayerBody(): Phaser.Physics.Arcade.Body | undefined {
    return _assertPhysicsArcadeBody(this.body);
  }

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);
    const BASE_GRAVITY_STRENGTH = 450;

    // INITIAL STATE
    this.IsFacingRight = true;
    this.IsWallJumping = false;
    this.IsDashing = false;;
    this.IsSliding = false;

    this.isVulnerable = true;
    this.isJumping = false;
    this.isDying = false;

    //
    this.currentScene = aParams.scene;
    this.initSprite();
    this.currentScene.add.existing(this);
    // this.gravityScale = 0;
    this.maxFallSpeed = 1000;
    this.acceleration = 5000;

    //
    // input
    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['JUMP', this.addKey('UP')]
    ]);

    //
    this.jumpHeight = 450;
    this.jumpTimeToApex = 0.4;
    // Calculate gravity strength using the formula (gravity = 2 * jumpHeight / timeToJumpApex^2) 
    this.gravityStrength = -(2 * this.jumpHeight) / (this.jumpTimeToApex * this.jumpTimeToApex);
    // Calculate the rigidbody's gravity scale (ie: gravity strength relative to unity's gravity value, see project settings/Physics2D)
    this.gravityScale = this.gravityStrength / BASE_GRAVITY_STRENGTH;

    console.log('gravityStrength', this.gravityStrength);
    console.log('gravityScale', this.gravityScale);
    //Calculate are run acceleration & deceleration forces using formula: amount = ((1 / Time.fixedDeltaTime) * acceleration) / runMaxSpeed
    // this.runAccelAmount = (50 * this.runAcceleration) / runMaxSpeed;
    // this.runDeccelAmount = (50 * this.runDecceleration) / runMaxSpeed;
      
    //Calculate jumpForce using the formula (initialJumpVelocity = gravity * timeToJumpApex)
    //this.jumpForce = Math.abs(this.gravityStrength) * this.jumpTimeToApex;

    // runAcceleration = Mathf.Clamp(runAcceleration, 0.01f, runMaxSpeed);
    // runDecceleration = Mathf.Clamp(runDecceleration, 0.01f, runMaxSpeed);
  }

  private initSprite() {
    // variables
    // @TODO - Look this up
    // this.marioSize = this.currentScene.registry.get('marioSize');

    // Make this a better state machine
    // this.vulnerableCounter = 100;

    // sprite
    this.setOrigin(0.5, 0.5);
    this.setFlipX(false);

    // physics
    this.currentScene.physics.world.enable(this);

    // @TODO - Set better max values here
    if(this.body && this.body.gameObject) {

      // this.body.allowGravity = false;
      // this.body.gravity = new Phaser.Math.Vector2(0, this.gravityStrength);
      // this.body.bounce = new Phaser.Math.Vector2(0.2, 0.2);

      (this.body as Phaser.Physics.Arcade.Body).maxVelocity.x = 300;
      this.body.maxVelocity.y = 1000;
    }
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    if(!this.currentScene.input.keyboard) {
      throw new Error("No keyboard found")
    }
    return this.currentScene.input.keyboard.addKey(key);
  }

  update(): void {
    const PLAYER_BODY = this.getPlayerBody();

    if(PLAYER_BODY === undefined) {
      return;
    }

    if (!this.isDying) {
      this.handleInput();
      this.handleAnimations();
    } else {
      // this.setFrame(12);
      // if (this.y > this.currentScene.sys.canvas.height) {
        // this.currentScene.scene.stop('GameScene');
        // this.currentScene.scene.stop('HUDScene');
        // this.currentScene.scene.start('MenuScene');
      // }
    }

    // TODO: Always be applying acceleration,
    // but... clamp velocity to max speed
    if(this.isJumping) {
      let JUMPING_STATE = '';

      const mass = 100;
      const jumpForce = 500;
      const gravityStrength = 400;
      const fixedDeltaTime = 200;
      
      const IS_FALLING = PLAYER_BODY.velocity.y > 0;
      const IS_RISING = PLAYER_BODY.velocity.y < 0;

      // this.body.setVelocityX(0);
      // this.body.setAccelerationX(0);

      // currently moving up, but UP key is released
      // (cut the jump's height short)
      if(IS_RISING && !this.keys.get('JUMP')?.isDown) {
        JUMPING_STATE = 'Jump Cut';
        const GRAVITY_SCALE_BASE = 1;
        const JUMP_CUT_GRAVITY_MULTIPLIER = 5;
        this.setGravityScale(GRAVITY_SCALE_BASE * JUMP_CUT_GRAVITY_MULTIPLIER);

        PLAYER_BODY.setAccelerationY(Math.max(PLAYER_BODY.velocity.y, this.maxFallSpeed) * this.gravityScale);
      }
      // Falling
      else if (IS_FALLING) {
        JUMPING_STATE = 'Falling';
        const GRAVITY_SCALE_BASE = 1;
        const FALL_GRAVITY_MULTIPLIER = 3;
        //Higher gravity if falling
				this.setGravityScale(GRAVITY_SCALE_BASE * FALL_GRAVITY_MULTIPLIER);
				// Caps maximum fall speed, so when falling over large distances we don't accelerate to insanely high speeds
				PLAYER_BODY.setAccelerationY(Math.max(PLAYER_BODY.velocity.y, this.maxFallSpeed) * this.gravityScale);
      } 
      // Default Gravity
      else {
        JUMPING_STATE = 'Upwards';
        const GRAVITY_SCALE_BASE = 1;
        const FALL_GRAVITY_MULTIPLIER = 1;

				this.setGravityScale(GRAVITY_SCALE_BASE * FALL_GRAVITY_MULTIPLIER);
        PLAYER_BODY.setAccelerationY(Math.max(PLAYER_BODY.velocity.y, this.maxFallSpeed) * this.gravityScale);
      }

      console.log('JUMPING_STATE', {
        "jumpingState": JUMPING_STATE,
        "gravityScale": this.gravityScale,
        "velocityY": PLAYER_BODY.velocity.y,
        "accelerationY": PLAYER_BODY.acceleration.y,
      });

    }
  }

  private handleInput() {
    const PLAYER_BODY = this.getPlayerBody();

    if(PLAYER_BODY === undefined) {
      return;
    }

    // if (this.y > this.currentScene.sys.canvas.height) {
    //   // mario fell into a hole
    //   this.isDying = true;
    // }

    // evaluate if player is on the floor or on object
    // if neither of that, set the player to be jumping
    if (
      PLAYER_BODY.onFloor() ||
      PLAYER_BODY.touching.down ||
      PLAYER_BODY.blocked.down
    ) {
      this.isJumping = false;
      //this.body.setVelocityY(0);
    }

    // handle movements to left and right
    if (this.keys.get('RIGHT')?.isDown) {
      PLAYER_BODY.setAccelerationX(this.acceleration);
      this.setFlipX(false);
    } else if (this.keys.get('LEFT')?.isDown) {
      PLAYER_BODY.setAccelerationX(-this.acceleration);
      this.setFlipX(true);
    } else {
      PLAYER_BODY.setVelocityX(0);
      PLAYER_BODY.setAccelerationX(0);
    }

    // handle jumping
    if (this.keys.get('JUMP')?.isDown && !this.isJumping) {
      PLAYER_BODY.setVelocityY(-600);
      this.isJumping = true;
    }
  }

  private handleAnimations(): void {
    if(!this.keys || !this.body) {
        return
    }

    if (this.body.velocity.y !== 0) {
      // mario is jumping or falling
      this.anims.stop();
      // this.setFrame(10);
    } else if (this.body.velocity.x !== 0) {
      // mario is moving horizontal

      // check if mario is making a quick direction change
      if (
        (this.body.velocity.x < 0 && this.body.gameObject.acceleration.x > 0) ||
        (this.body.velocity.x > 0 && this.body.gameObject.acceleration.x < 0)
      ) {
        // this.setFrame(11);
      }

      if (this.body.velocity.x > 0) {
        this.anims.play('MarioWalk', true);
      }
    } else {
      // mario is standing still
      this.anims.stop();
      // this.setFrame(6);
    }
  }


  public bounceUpAfterHitEnemyOnHead(): void {
    this.currentScene.add.tween({
      targets: this,
      props: { y: this.y - 5 },
      duration: 200,
      ease: 'Power1',
      yoyo: true
    });
  }

  public gotHit(): void {
    const PLAYER_BODY = this.getPlayerBody();

    if(PLAYER_BODY === undefined) {
      return;
    }

    this.isVulnerable = false;

    // mario is dying
    this.isDying = true;

    // sets acceleration, velocity and speed to zero
    // stop all animations
    PLAYER_BODY.stop();
    this.anims.stop();

    // make last dead jump and turn off collision check
    PLAYER_BODY.setVelocityY(-180);

    // this.body.checkCollision.none did not work for me
    PLAYER_BODY.checkCollision.up = false;
    PLAYER_BODY.checkCollision.down = false;
    PLAYER_BODY.checkCollision.left = false;
    PLAYER_BODY.checkCollision.right = false;
    
  }
}

/**
 * 
 * @see https://www.codecademy.com/learn/learn-typescript/modules/learn-typescript-type-narrowing/cheatsheet
 * @param body 
 * @returns 
 */
function _assertPhysicsArcadeBody(body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | MatterJS.BodyType | null) {
  if (body!== null && 'maxVelocity' in body) {
    return body;
  }
}