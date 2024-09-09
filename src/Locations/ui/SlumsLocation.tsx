/**
 * React Subcomponent for displaying a location's UI, when that location is a slum
 *
 * This subcomponent renders all of the buttons for committing crimes
 */
import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore


import { Crimes } from "../../Crime/Crimes";

import { formatPercent } from "../../ui/formatNumber";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { Player } from "@player";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

import { Crime } from "../../Crime/Crime";
import { useRerender } from "../../ui/React/hooks";

export function SlumsLocation(): React.ReactElement {
  useRerender(1000);
  const crimes = Object.values(Crimes);

  function doCrime(e: React.MouseEvent<HTMLElement>, crime: Crime) {
    if (!e.isTrusted) return;
    crime.commit();
    Router.toPage(Page.Work);
    Player.focus = true;
  }

  return (
    <Box sx={{ display: "grid", width: "fit-content" }}>
      {crimes.map((crime) => (
        <Tooltip key={crime.workName} title={crime.tooltipText}>
          <Button onClick={(e) => doCrime(e, crime)}>
            {crime.type} ({formatPercent(crime.successRate(Player))} chance of success)
          </Button>
        </Tooltip>
      ))}
    </Box>
  );
}
