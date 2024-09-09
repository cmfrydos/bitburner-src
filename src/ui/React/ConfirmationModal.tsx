import React from "react";
import { Modal } from "./Modal";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmationText: string | React.ReactNode;
  additionalButton?: React.ReactNode;
}

export function ConfirmationModal(props: IProps): React.ReactElement {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>{props.confirmationText}</Typography>
        <Button
          onClick={() => {
            props.onConfirm();
          }}
        >
          Confirm
        </Button>
        {props.additionalButton && <>{props.additionalButton}</>}
      </>
    </Modal>
  );
}
