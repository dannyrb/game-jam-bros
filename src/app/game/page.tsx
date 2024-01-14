"use client"

import React, { useEffect} from 'react';

export default function Home() {

    useEffect(() => {
        const startGameAsync = async () => {
            const startGame = (await import('@/components/game')).startGame;
            startGame();
        }

        startGameAsync();
    }, [])

  return (
    <></>
  )
}
