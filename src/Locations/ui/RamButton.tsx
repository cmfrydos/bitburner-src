import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { Player } from "@player";
import { purchaseRamForHomeComputer } from "../../Server/ServerPurchases";

import { Money } from "../../ui/React/Money";
import { formatRam } from "../../ui/formatNumber";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\better-react-mathjax\esm\index.js
// @ts-ignore
import MathJax from "better-react-mathjax\\MathJax\\MathJax.js";
// @ts-ignore

import { currentNodeMults } from "../../BitNode/BitNodeMultipliers";
import { ServerConstants } from "../../Server/data/Constants";

interface IProps {
  rerender: () => void;
}

export function RamButton(props: IProps): React.ReactElement {
  const homeComputer = Player.getHomeComputer();
  if (
    (Player.bitNodeOptions.restrictHomePCUpgrade && homeComputer.maxRam >= 128) ||
    homeComputer.maxRam >= ServerConstants.HomeComputerMaxRam
  ) {
    return <Button>Upgrade 'home' RAM - MAX</Button>;
  }

  const cost = Player.getUpgradeHomeRamCost();

  function buy(): void {
    purchaseRamForHomeComputer();
    props.rerender();
  }

  const bnMult = currentNodeMults.HomeComputerRamCost === 1 ? "" : `\\cdot ${currentNodeMults.HomeComputerRamCost}`;

  return (
    <Tooltip
      title={
        <MathJax>{`\\(\\large{cost = ram \\cdot 3.2 \\cdot 10^4 \\cdot 1.58^{log_2{(ram)}}} ${bnMult}\\)`}</MathJax>
      }
    >
      <span>
        <br />
        <Typography>
          <i>"More RAM means more scripts on 'home'"</i>
        </Typography>
        <br />
        <Button disabled={!Player.canAfford(cost)} onClick={buy}>
          Upgrade 'home' RAM ({formatRam(homeComputer.maxRam)} -&gt;&nbsp;
          {formatRam(homeComputer.maxRam * 2)}) -&nbsp;
          <Money money={cost} forPurchase={true} />
        </Button>
      </span>
    </Tooltip>
  );
}
