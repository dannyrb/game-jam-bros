"use client"

import Main from './Main';
import { useOnMountUnsafe } from '@/hooks/useOnMountUnsafe';
import 'phaser';

const loadGame = () => {
    if (typeof window !== 'object') {
      return;
    }

    var config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      // width: window.innerWidth * window.devicePixelRatio,
      // height: window.innerHeight * window.devicePixelRatio,
      backgroundColor: '#4eb3e7',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 200 },
        },
      },
      parent: 'game',

      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    var game = new Phaser.Game(config);

    game.scene.add('main', Main);
    game.scene.start('main');
  };

export default function Index() {
    useOnMountUnsafe(loadGame);

  return null;
}