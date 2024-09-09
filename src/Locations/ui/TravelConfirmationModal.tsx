import React from "react";
import { CONSTANTS } from "../../Constants";
import { Money } from "../../ui/React/Money";
import { Modal } from "../../ui/React/Modal";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore


interface IProps {
  city: string;
  travel: () => void;

  open: boolean;
  onClose: () => void;
}

export function TravelConfirmationModal(props: IProps): React.ReactElement {
  function travel(): void {
    props.travel();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Would you like to travel to {props.city}? The trip will cost{" "}
        <Money money={CONSTANTS.TravelCost} forPurchase={true} />.
      </Typography>
      <br />
      <br />
      <Button onClick={travel}>
        <Typography>Travel</Typography>
      </Button>
      <Button onClick={() => props.onClose()}>Cancel</Button>
    </Modal>
  );
}
