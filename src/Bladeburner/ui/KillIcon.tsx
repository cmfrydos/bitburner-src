import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { killIcon } from "../data/Icons";

export function KillIcon(): React.ReactElement {
  return <Tooltip title={<Typography>This action involves retirement</Typography>}>{killIcon}</Tooltip>;
}
