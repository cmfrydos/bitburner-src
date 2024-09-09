// React Components for the Unlock upgrade buttons on the overview page
import React from "react";

import { CorpUnlocks } from "../data/CorporationUnlocks";
import { useCorporation } from "./Context";
import { MoneyCost } from "./MoneyCost";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Grid\index.js
// @ts-ignore
import Grid from "@mui\\material\\node\\Grid\\Grid.js";
// @ts-ignore

import { CorpUnlockName } from "@enums";
import { dialogBoxCreate } from "../../ui/React/DialogBox";

interface UnlockProps {
  name: CorpUnlockName;
  rerender: () => void;
}

export function Unlock(props: UnlockProps): React.ReactElement {
  const corp = useCorporation();
  const data = CorpUnlocks[props.name];
  const tooltip = data.desc;
  const price = data.price;

  function onClick(): void {
    // corp.unlock handles displaying a dialog on failure
    const message = corp.purchaseUnlock(props.name);
    if (message) dialogBoxCreate(`Error while attempting to purchase ${props.name}:\n${message}`);
    // Rerenders the parent, which should remove this item if the purchase was successful
    props.rerender();
  }

  return (
    <Grid item xs={4}>
      <Box display="flex" alignItems="center" flexDirection="row-reverse">
        <Button disabled={corp.funds < data.price || corp.unlocks.has(props.name)} sx={{ mx: 1 }} onClick={onClick}>
          <MoneyCost money={price} corp={corp} />
        </Button>
        <Tooltip title={tooltip}>
          <Typography>{data.name}</Typography>
        </Tooltip>
      </Box>
    </Grid>
  );
}
