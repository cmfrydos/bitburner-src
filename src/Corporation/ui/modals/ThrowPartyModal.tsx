import React, { useState } from "react";
import { formatMultiplier, formatPercent } from "../../../ui/formatNumber";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { OfficeSpace } from "../../OfficeSpace";
import * as actions from "../../Actions";
import { MoneyCost } from "../MoneyCost";
import { Modal } from "../../../ui/React/Modal";
import { useCorporation } from "../Context";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

import { KEY } from "../../../utils/helpers/keyCodes";

interface IProps {
  open: boolean;
  onClose: () => void;
  office: OfficeSpace;
  rerender: () => void;
}

export function ThrowPartyModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const [cost, setCost] = useState(0);

  const totalCost = cost * props.office.numEmployees;
  const canParty = corp.funds >= totalCost;
  function changeCost(event: React.ChangeEvent<HTMLInputElement>): void {
    let x = parseFloat(event.target.value);
    if (isNaN(x)) x = 0;
    setCost(x);
  }

  function throwParty(): void {
    if (cost === null || isNaN(cost) || cost < 0) {
      dialogBoxCreate("Invalid value entered");
    } else if (!canParty) {
      dialogBoxCreate("You don't have enough company funds to throw a party!");
    } else {
      const mult = actions.throwParty(corp, props.office, cost);
      // Each 10% multiplier gives an extra flat +1 to morale to make recovering from low morale easier.
      const increase = mult > 1 ? (mult - 1) * 0.1 : 0;

      if (mult > 0) {
        dialogBoxCreate(
          "You threw a party for the office! The morale of each employee increased by " +
            formatPercent(increase) +
            " and was multiplied by " +
            formatMultiplier(mult),
        );
      }

      props.rerender();
      props.onClose();
    }
  }

  function EffectText(): React.ReactElement {
    if (isNaN(cost) || cost < 0) return <Typography>Invalid value entered!</Typography>;
    return (
      <Typography>
        Throwing this party will cost a total of <MoneyCost money={totalCost} corp={corp} />
      </Typography>
    );
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) throwParty();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>Enter the amount of money you would like to spend PER EMPLOYEE on this office party</Typography>
      <EffectText />
      <Box display="flex" alignItems="center">
        <TextField
          autoFocus={true}
          type="number"
          placeholder="$ / employee"
          value={cost}
          onChange={changeCost}
          onKeyDown={onKeyDown}
        />
        <Button disabled={!canParty} onClick={throwParty}>
          Throw Party
        </Button>
      </Box>
    </Modal>
  );
}
