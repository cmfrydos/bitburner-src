import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/React/Modal";
import { Router } from "../../ui/GameRoot";
import { Page } from "../../ui/Router";
import { EventEmitter } from "../../utils/EventEmitter";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore


export const BitFlumeEvent = new EventEmitter<[]>();

export function BitFlumeModal(): React.ReactElement {
  const [open, setOpen] = useState(false);
  function flume(): void {
    Router.toPage(Page.BitVerse, { flume: true, quick: false });
    setOpen(false);
  }

  useEffect(() => BitFlumeEvent.subscribe(() => setOpen(true)), []);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Typography>
        WARNING: USING THIS PROGRAM WILL CAUSE YOU TO LOSE ALL OF YOUR PROGRESS ON THE CURRENT BITNODE.
        <br />
        <br />
        Do you want to travel to the BitNode Nexus? This allows you to reset the current BitNode and select a new one.
      </Typography>
      <br />
      <br />
      <Button onClick={flume}>Travel to the BitVerse</Button>
    </Modal>
  );
}
