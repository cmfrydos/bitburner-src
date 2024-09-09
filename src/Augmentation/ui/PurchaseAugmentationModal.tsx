import React from "react";

import { Augmentation } from "../Augmentation";
import { Faction } from "../../Faction/Faction";
import { purchaseAugmentation } from "../../Faction/FactionHelpers";
import { getAugCost, isRepeatableAug } from "../AugmentationHelpers";
import { Money } from "../../ui/React/Money";
import { Modal } from "../../ui/React/Modal";
import { Player } from "@player";
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
  faction?: Faction;
  aug?: Augmentation;
}

export function PurchaseAugmentationModal({ aug, faction, onClose, open }: IProps): React.ReactElement {
  if (!aug || !faction || (!isRepeatableAug(aug) && Player.hasAugmentation(aug.name))) {
    return <></>;
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Typography variant="h4">{aug.name}</Typography>
      <Typography whiteSpace={"pre-wrap"}>
        {aug.info}
        <br />
        <br />
        {aug.stats}
        <br />
        <br />
        Would you like to purchase the {aug.name} Augmentation for&nbsp;
        <Money money={getAugCost(aug).moneyCost} />?
        <br />
        <br />
      </Typography>
      <Button
        autoFocus
        onClick={() => {
          purchaseAugmentation(aug, faction);
          onClose();
        }}
      >
        Purchase
      </Button>
    </Modal>
  );
}
