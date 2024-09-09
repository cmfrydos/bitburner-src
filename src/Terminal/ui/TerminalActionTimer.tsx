import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { useCycleRerender } from "../../ui/React/hooks";
import { Terminal } from "../../Terminal";

export function TerminalActionTimer(): React.ReactElement {
  useCycleRerender();

  return <Typography color="primary">{Terminal.action && Terminal.getProgressText()}</Typography>;
}
