import type { Bladeburner } from "../Bladeburner";

import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore


interface StopButtonProps {
  bladeburner: Bladeburner;
  rerender: () => void;
}
export function StopButton({ bladeburner, rerender }: StopButtonProps): React.ReactElement {
  function onClick(): void {
    bladeburner.resetAction();
    rerender();
  }

  return (
    <Button style={{ marginLeft: "1rem" }} onClick={onClick}>
      Stop
    </Button>
  );
}
