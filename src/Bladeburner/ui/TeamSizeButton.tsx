import type { Bladeburner } from "../Bladeburner";
import type { BlackOperation, Operation } from "../Actions";

import React, { useState } from "react";
import { TeamSizeModal } from "./TeamSizeModal";
import { formatNumberNoSuffix } from "../../ui/formatNumber";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore


interface TeamSizeButtonProps {
  action: Operation | BlackOperation;
  bladeburner: Bladeburner;
}
export function TeamSizeButton({ action, bladeburner }: TeamSizeButtonProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button style={{ marginLeft: "1rem" }} disabled={bladeburner.teamSize === 0} onClick={() => setOpen(true)}>
        Set Team Size (Curr Size: {formatNumberNoSuffix(action.teamCount, 0)})
      </Button>
      <TeamSizeModal open={open} onClose={() => setOpen(false)} action={action} bladeburner={bladeburner} />
    </>
  );
}
