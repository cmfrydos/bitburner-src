/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import React, { useState } from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

import { Blackjack, DECK_COUNT } from "../../Casino/Blackjack";
import { CoinFlip } from "../../Casino/CoinFlip";
import { Roulette } from "../../Casino/Roulette";
import { SlotMachine } from "../../Casino/SlotMachine";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


enum GameType {
  None = "none",
  Coin = "coin",
  Slots = "slots",
  Roulette = "roulette",
  Blackjack = "blackjack",
}

export function CasinoLocation(): React.ReactElement {
  const [game, setGame] = useState(GameType.None);

  function updateGame(game: GameType): void {
    setGame(game);
  }

  return (
    <>
      {game === GameType.None && (
        <Box sx={{ display: "grid", width: "fit-content" }}>
          <Button onClick={() => updateGame(GameType.Coin)}>Play coin flip</Button>
          <Button onClick={() => updateGame(GameType.Slots)}>Play slots</Button>
          <Button onClick={() => updateGame(GameType.Roulette)}>Play roulette</Button>
          <Button onClick={() => updateGame(GameType.Blackjack)}>Play blackjack ({DECK_COUNT} decks)</Button>
        </Box>
      )}
      {game !== GameType.None && (
        <>
          <Button onClick={() => updateGame(GameType.None)}>Stop playing</Button>
          {game === GameType.Coin && <CoinFlip />}
          {game === GameType.Slots && <SlotMachine />}
          {game === GameType.Roulette && <Roulette />}
          {game === GameType.Blackjack && <Blackjack />}
        </>
      )}
    </>
  );
}
