// React components for the levelable upgrade buttons on the overview panel
import React from "react";

import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { CorpUpgrades } from "../data/CorporationUpgrades";
import { MoneyCost } from "./MoneyCost";
import { useCorporation } from "./Context";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

import { ButtonWithTooltip } from "../../ui/Components/ButtonWithTooltip";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Grid\index.js
// @ts-ignore
import Grid from "@mui\\material\\node\\Grid\\Grid.js";
// @ts-ignore

import { calculateMaxAffordableUpgrade, calculateUpgradeCost } from "../helpers";
import { CorpUpgradeName } from "@enums";
import { PositiveInteger } from "../../types";

interface IProps {
  upgradeName: CorpUpgradeName;
  mult: PositiveInteger | "MAX";
  rerender: () => void;
}

export function LevelableUpgrade({ upgradeName, mult, rerender }: IProps): React.ReactElement {
  const corp = useCorporation();
  const data = CorpUpgrades[upgradeName];
  const level = corp.upgrades[upgradeName].level;

  const amount = mult === "MAX" ? calculateMaxAffordableUpgrade(corp, data) : mult;

  const cost = amount === 0 ? 0 : calculateUpgradeCost(corp, data, amount);
  const tooltip = data.desc;
  function onClick(): void {
    if (corp.funds < cost) return;
    const message = corp.purchaseUpgrade(upgradeName, amount);
    if (message) dialogBoxCreate(`Could not upgrade ${upgradeName} ${amount} times:\n${message}`);
    rerender();
  }

  return (
    <Grid item xs={4}>
      <Box display="flex" alignItems="center" flexDirection="row-reverse">
        <ButtonWithTooltip
          disabledTooltip={corp.funds < cost || amount === 0 ? "Insufficient corporation funds" : ""}
          onClick={onClick}
        >
          +{amount} -&nbsp; <MoneyCost money={cost} corp={corp} />
        </ButtonWithTooltip>
        <Tooltip title={tooltip}>
          <Typography>
            {data.name} - lvl {level}
          </Typography>
        </Tooltip>
      </Box>
    </Grid>
  );
}
