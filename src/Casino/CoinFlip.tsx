/**
 * React Subcomponent for displaying a location's UI, when that location is a gym
 *
 * This subcomponent renders all of the buttons for training at the gym
 */
import React, { useState } from "react";

import { BadRNG } from "./RNG";
import { win, reachedLimit } from "./Game";
import { trusted } from "./utils";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


const minPlay = 0;
const maxPlay = 10e3;

export function CoinFlip(): React.ReactElement {
  const [investment, setInvestment] = useState(1000);
  const [result, setResult] = useState(<span> </span>);
  const [status, setStatus] = useState("");
  const [playLock, setPlayLock] = useState(false);

  function updateInvestment(e: React.ChangeEvent<HTMLInputElement>): void {
    let investment: number = parseInt(e.currentTarget.value);
    if (isNaN(investment)) {
      investment = minPlay;
    }
    if (investment > maxPlay) {
      investment = maxPlay;
    }
    if (investment < minPlay) {
      investment = minPlay;
    }
    setInvestment(investment);
  }

  function play(guess: string): void {
    if (reachedLimit()) return;
    const v = BadRNG.random();
    let letter: string;
    if (v < 0.5) {
      letter = "H";
    } else {
      letter = "T";
    }
    const correct: boolean = guess === letter;

    setResult(
      <Box display="flex">
        <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }} color={correct ? "primary" : "error"}>
          {letter}
        </Typography>
      </Box>,
    );
    setStatus(correct ? " win!" : "lose!");
    setPlayLock(true);

    setTimeout(() => setPlayLock(false), 250);
    if (correct) {
      win(investment);
    } else {
      win(-investment);
    }
    if (reachedLimit()) return;
  }

  return (
    <>
      <Typography>Result:</Typography> {result}
      <Box display="flex" alignItems="center">
        <TextField
          type="number"
          onChange={updateInvestment}
          InputProps={{
            endAdornment: (
              <>
                <Button onClick={trusted(() => play("H"))} disabled={playLock}>
                  Head!
                </Button>
                <Button onClick={trusted(() => play("T"))} disabled={playLock}>
                  Tail!
                </Button>
              </>
            ),
          }}
        />
      </Box>
      <Typography variant="h3">{status}</Typography>
    </>
  );
}
