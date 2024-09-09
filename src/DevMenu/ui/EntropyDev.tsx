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

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { Player } from "@player";
import { Adjuster } from "./Adjuster";

// TODO: Update as additional BitNodes get implemented

export function EntropyDev(): React.ReactElement {
  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Entropy</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Adjuster
          label="Set entropy"
          placeholder="entropy"
          add={(num) => {
            Player.entropy += num;
            Player.applyEntropy(Player.entropy);
          }}
          subtract={(num) => {
            Player.entropy -= num;
            Player.applyEntropy(Player.entropy);
          }}
          tons={() => {
            Player.entropy += 1e12;
            Player.applyEntropy(Player.entropy);
          }}
          reset={() => {
            Player.entropy = 0;
            Player.applyEntropy(Player.entropy);
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
}
