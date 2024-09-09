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

import { Money } from "../../ui/React/Money";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\better-react-mathjax\esm\index.js
// @ts-ignore
import MathJax from "better-react-mathjax\\MathJax\\MathJax.js";
// @ts-ignore


interface IProps {
  rerender: () => void;
}

export function CoresButton(props: IProps): React.ReactElement {
  const homeComputer = Player.getHomeComputer();
  const maxCores = Player.bitNodeOptions.restrictHomePCUpgrade || homeComputer.cpuCores >= 8;
  if (maxCores) {
    return <Button>Upgrade 'home' cores - MAX</Button>;
  }

  const cost = Player.getUpgradeHomeCoresCost();

  function buy(): void {
    if (maxCores) return;
    if (!Player.canAfford(cost)) return;
    Player.loseMoney(cost, "servers");
    homeComputer.cpuCores++;
    props.rerender();
  }

  return (
    <Tooltip title={<MathJax>{`\\(\\large{cost = 10^9 \\cdot 7.5 ^{\\text{cores}}}\\)`}</MathJax>}>
      <span>
        <br />
        <Typography>
          <i>"Cores increase the effectiveness of grow() and weaken() on 'home'"</i>
        </Typography>
        <br />
        <Button disabled={!Player.canAfford(cost)} onClick={buy}>
          Upgrade 'home' cores ({homeComputer.cpuCores} -&gt; {homeComputer.cpuCores + 1}) -&nbsp;
          <Money money={cost} forPurchase={true} />
        </Button>
      </span>
    </Tooltip>
  );
}
