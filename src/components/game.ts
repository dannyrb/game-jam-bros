import * as Phaser from 'phaser';
import { GameConfig } from './config';

export class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config);
    }
}
  
// window.addEventListener('load', () => {
//     const game = new Game(GameConfig);
// });

const startGame = () => {
    // Doesn't work in SSR
    if(!window) return;

    const game = new Game(GameConfig);
}

export { startGame }