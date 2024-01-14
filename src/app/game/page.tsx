"use client"
// TODO: https://phaser.discourse.group/t/htmlvideoelement-is-not-defined-error-in-next-js/13808
// import GameScene from '../../components/GameScene'
import { useOnMountUnsafe } from '@/hooks/useOnMountUnsafe';
import { startGame } from '@/components/game';

export default function Home() {

  useOnMountUnsafe(startGame);

  return (
    <></>
    // <GameScene />
  )
}
