/**
 * React component for displaying all of the player's purchased (but not installed)
 * Augmentations on the Augmentations UI.
 */
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import List from "@mui\\material\\node\\List\\List.js";
// @ts-ignore
import ListItemText from "@mui\\material\\node\\ListItemText\\ListItemText.js";
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import * as React from "react";
import { Player } from "@player";
import { Augmentations } from "../Augmentations";
import { AugmentationName } from "@enums";

export function PurchasedAugmentations(): React.ReactElement {
  const augs: React.ReactElement[] = [];
  // Only render the last NeuroFlux (there are no findLastIndex btw)
  let nfgIndex = -1;
  for (let i = Player.queuedAugmentations.length - 1; i >= 0; i--) {
    if (Player.queuedAugmentations[i].name === AugmentationName.NeuroFluxGovernor) {
      nfgIndex = i;
      break;
    }
  }
  for (let i = 0; i < Player.queuedAugmentations.length; i++) {
    const ownedAug = Player.queuedAugmentations[i];
    let displayName: string = ownedAug.name;

    if (ownedAug.name === AugmentationName.NeuroFluxGovernor && i !== nfgIndex) continue;
    const aug = Augmentations[ownedAug.name];

    let level = null;
    if (ownedAug.name === AugmentationName.NeuroFluxGovernor) {
      level = ownedAug.level;
      displayName += ` - Level ${level}`;
    }

    augs.push(
      <Tooltip
        title={
          <Typography whiteSpace={"pre-wrap"}>
            {(() => {
              const info = typeof aug.info === "string" ? <span>{aug.info}</span> : aug.info;
              const tooltip = (
                <>
                  {info}
                  <br />
                  <br />
                  {aug.stats}
                </>
              );
              return tooltip;
            })()}
          </Typography>
        }
        enterNextDelay={500}
        key={displayName}
      >
        <ListItemText sx={{ px: 2, py: 1 }} primary={displayName} />
      </Tooltip>,
    );
  }

  return (
    <Paper sx={{ py: 1, maxHeight: 400, overflowY: "scroll" }}>
      <List sx={{ height: 400, overflowY: "scroll" }} disablePadding>
        {augs}
      </List>
    </Paper>
  );
}
