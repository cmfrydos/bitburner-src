import React from "react";

import { staneksGift } from "../../CotMG/Helper";
import { Player } from "@player";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Accordion\index.js
// @ts-ignore
import Accordion from "@mui\\material\\node\\Accordion\\Accordion.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionSummary\index.js
// @ts-ignore
import AccordionSummary from "@mui\\material\\node\\AccordionSummary\\AccordionSummary.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionDetails\index.js
// @ts-ignore
import AccordionDetails from "@mui\\material\\node\\AccordionDetails\\AccordionDetails.js";
// @ts-ignore

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { Adjuster } from "./Adjuster";

export function StanekDev(): React.ReactElement {
  function addCycles(): void {
    staneksGift.storedCycles = 1e6;
  }

  function modCycles(modify: number): (x: number) => void {
    return function (cycles: number): void {
      staneksGift.storedCycles += cycles * modify;
    };
  }

  function resetCycles(): void {
    staneksGift.storedCycles = 0;
  }

  function addCharge(): void {
    staneksGift.fragments.forEach((f) => {
      f.highestCharge = 1e21;
      f.numCharge = 1e21;
      Player.applyEntropy(Player.entropy);
    });
  }

  function modCharge(modify: number): (x: number) => void {
    return function (cycles: number): void {
      staneksGift.fragments.forEach((f) => (f.highestCharge += cycles * modify));
      Player.applyEntropy(Player.entropy);
    };
  }

  function resetCharge(): void {
    staneksGift.fragments.forEach((f) => {
      f.highestCharge = 0;
      f.numCharge = 0;
    });
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Stanek's Gift</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Adjuster
                  label="cycles"
                  placeholder="amt"
                  tons={addCycles}
                  add={modCycles(1)}
                  subtract={modCycles(-1)}
                  reset={resetCycles}
                />
              </td>
            </tr>
            <tr>
              <td>
                <Adjuster
                  label="all charge"
                  placeholder="amt"
                  tons={addCharge}
                  add={modCharge(1)}
                  subtract={modCharge(-1)}
                  reset={resetCharge}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
