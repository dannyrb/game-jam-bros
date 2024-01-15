import { GameScene } from './scenes/GameScene'

const GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    // width: window.innerWidth * window.devicePixelRatio,
    // height: window.innerHeight * window.devicePixelRatio,
    backgroundColor: '#4eb3e7',
    physics: {
      default: 'arcade',
      arcade: {
        // We'll implement this?
        // gravity: { y: 475 },
      },
    },
    parent: 'game',
    scene: [GameScene],
    input: {
      keyboard: true
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

export { GameConfig }