/**
 * React component for a panel that lets you purchase upgrades for a Duplicate
 * Sleeve's Memory (through The Covenant)
 */
import React, { useState } from "react";

import { Sleeve } from "../Sleeve";
import { Player } from "@player";

import { formatSleeveMemory } from "../../../ui/formatNumber";
import { Money } from "../../../ui/React/Money";

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

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Paper\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore


interface IProps {
  index: number;
  rerender: () => void;
  sleeve: Sleeve;
}

export function CovenantSleeveMemoryUpgrade(props: IProps): React.ReactElement {
  const [amt, setAmt] = useState(1);

  function changePurchaseAmount(e: React.ChangeEvent<HTMLInputElement>): void {
    let n: number = parseInt(e.target.value);

    if (isNaN(n)) n = 1;
    if (n < 1) n = 1;
    const maxMemory = 100 - props.sleeve.memory;
    if (n > maxMemory) n = maxMemory;

    setAmt(n);
  }

  function getPurchaseCost(): number {
    if (isNaN(amt)) {
      return Infinity;
    }

    const maxMemory = 100 - props.sleeve.memory;
    if (amt > maxMemory) {
      return Infinity;
    }

    return props.sleeve.getMemoryUpgradeCost(amt);
  }

  function purchaseMemory(): void {
    const cost = getPurchaseCost();
    if (Player.canAfford(cost)) {
      props.sleeve.upgradeMemory(amt);
      Player.loseMoney(cost, "sleeves");
      props.rerender();
    }
  }

  // Purchase button props
  const cost = getPurchaseCost();
  const purchaseBtnDisabled = !Player.canAfford(cost);
  let purchaseBtnContent = <></>;
  if (isNaN(amt)) {
    purchaseBtnContent = <>Invalid value</>;
  } else {
    purchaseBtnContent = (
      <>
        Purchase {amt} memory&nbsp;-&nbsp;
        <Money money={cost} forPurchase={true} />
      </>
    );
  }

  return (
    <Paper sx={{ my: 1, p: 1 }}>
      <Typography variant="h6" color="primary">
        Upgrade Memory of Sleeve {props.index}
      </Typography>
      <Typography>
        Purchase a memory upgrade for your sleeve. Note that a sleeve's max memory is 100 (current:{" "}
        {formatSleeveMemory(props.sleeve.memory)})
      </Typography>

      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>Amount of memory to purchase (must be an integer):&nbsp;</Typography>
        <TextField onChange={changePurchaseAmount} type={"number"} value={amt} />
      </Box>
      <br />
      <Button disabled={purchaseBtnDisabled} onClick={purchaseMemory}>
        {purchaseBtnContent}
      </Button>
    </Paper>
  );
}
