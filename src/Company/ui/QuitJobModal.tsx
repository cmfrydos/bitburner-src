import React from "react";
import { Company } from "../Company";
import { Player } from "@player";
import { Modal } from "../../ui/React/Modal";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

import { CompanyName } from "../Enums";

interface IProps {
  open: boolean;
  onClose: () => void;
  companyName: CompanyName;
  company: Company;
  onQuit: () => void;
}

export function QuitJobModal(props: IProps): React.ReactElement {
  function quit(): void {
    Player.quitJob(props.companyName);
    props.onQuit();
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography> Would you like to quit your job at {props.company.name}?</Typography>
      <br />
      <br />
      <Button onClick={quit}>Quit</Button>
    </Modal>
  );
}
