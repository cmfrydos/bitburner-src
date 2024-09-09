import React from "react";
import { stealthIcon } from "../data/Icons";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


export function StealthIcon(): React.ReactElement {
  return <Tooltip title={<Typography>This action involves stealth</Typography>}>{stealthIcon}</Tooltip>;
}
