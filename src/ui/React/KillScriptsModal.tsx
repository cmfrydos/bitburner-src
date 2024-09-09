import React from "react";
import { Modal } from "./Modal";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore


interface IProps {
  open: boolean;
  onClose: () => void;
  killScripts: () => void;
}

export function KillScriptsModal(props: IProps): React.ReactElement {
  function onClick(): void {
    props.killScripts();
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>Forcefully kill all running scripts? This will also save your game and reload the game.</Typography>
      <Button onClick={onClick}>KILL</Button>
    </Modal>
  );
}
