import type { LevelableAction } from "../Types";

import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore
import Switch from "@mui\\material\\node\\Switch\\Switch.js";
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


interface AutoLevelProps {
  action: LevelableAction;
  rerender: () => void;
}

export function Autolevel({ action, rerender }: AutoLevelProps): React.ReactElement {
  function onAutolevel(event: React.ChangeEvent<HTMLInputElement>): void {
    action.autoLevel = event.target.checked;
    rerender();
  }
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Tooltip title={<Typography>Automatically increase operation level when possible</Typography>}>
        <Typography> Autolevel:</Typography>
      </Tooltip>
      <Switch checked={action.autoLevel} onChange={onAutolevel} />
    </Box>
  );
}
