import React from "react";

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

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { Player } from "@player";
import { Adjuster } from "./Adjuster";

export function SleevesDev(): React.ReactElement {
  function sleeveMaxAllShock(): void {
    for (let i = 0; i < Player.sleeves.length; ++i) {
      Player.sleeves[i].shock = 100;
    }
  }

  function sleeveClearAllShock(): void {
    for (let i = 0; i < Player.sleeves.length; ++i) {
      Player.sleeves[i].shock = 0;
    }
  }

  function sleeveSyncMaxAll(): void {
    for (let i = 0; i < Player.sleeves.length; ++i) {
      Player.sleeves[i].sync = 100;
    }
  }

  function sleeveSyncClearAll(): void {
    for (let i = 0; i < Player.sleeves.length; ++i) {
      Player.sleeves[i].sync = 0;
    }
  }

  function sleeveSetStoredCycles(cycles: number): void {
    for (let i = 0; i < Player.sleeves.length; ++i) {
      Player.sleeves[i].storedCycles = cycles;
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Sleeves</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Shock:</Typography>
              </td>
              <td>
                <Button onClick={sleeveMaxAllShock}>Max all</Button>
              </td>
              <td>
                <Button onClick={sleeveClearAllShock}>Clear all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Sync:</Typography>
              </td>
              <td>
                <Button onClick={sleeveSyncMaxAll}>Max all</Button>
              </td>
              <td>
                <Button onClick={sleeveSyncClearAll}>Clear all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Total:</Typography>
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <Adjuster
                  label="Stored Cycles"
                  placeholder="cycles"
                  tons={() => sleeveSetStoredCycles(10000000)}
                  add={sleeveSetStoredCycles}
                  subtract={sleeveSetStoredCycles}
                  reset={() => sleeveSetStoredCycles(0)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
