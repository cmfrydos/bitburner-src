import React, { useState } from "react";

import { Modal } from "../../../ui/React/Modal";
import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { StatsTable } from "../../../ui/React/StatsTable";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

import { useCorporation } from "../../ui/Context";
import { removeDivision } from "../../Actions";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { getRecordKeys } from "../../../Types/Record";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function SellDivisionModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const allDivisions = [...corp.divisions.values()];
  const [divisionToSell, setDivisionToSell] = useState(allDivisions[0]);
  if (allDivisions.length === 0) return <></>;
  const price = divisionToSell.calculateRecoupableValue();

  function onDivisionChange(event: SelectChangeEvent): void {
    const div = corp.divisions.get(event.target.value);
    if (!div) return;
    setDivisionToSell(div);
  }

  function sellDivision() {
    const soldPrice = removeDivision(corp, divisionToSell.name);
    props.onClose();
    dialogBoxCreate(
      <Typography>
        Sold <b>{divisionToSell.name}</b> for <Money money={soldPrice} />, you now have space for{" "}
        {corp.maxDivisions - corp.divisions.size} more divisions.
      </Typography>,
    );
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          Would you like to sell a division?
          <br></br>
          You'll get back half the money you've spent on starting the division and expanding to offices and warehouses.
        </Typography>
        <Select value={divisionToSell.name} onChange={onDivisionChange}>
          {allDivisions.map((div) => (
            <MenuItem key={div.name} value={div.name}>
              {div.name}
            </MenuItem>
          ))}
        </Select>
        <Typography>Division {divisionToSell.name} has:</Typography>
        <StatsTable
          rows={[
            [
              "Profit:",
              <MoneyRate
                key="profit"
                money={(divisionToSell.lastCycleRevenue - divisionToSell.lastCycleExpenses) / 10}
              />,
            ],
            ["Cities:", getRecordKeys(divisionToSell.offices).length],
            ["Warehouses:", getRecordKeys(divisionToSell.warehouses).length],
            divisionToSell.makesProducts ? ["Products:", divisionToSell.products.size] : [],
          ]}
        />
        <br />
        <Typography>
          Sell price: <Money money={price} />
        </Typography>
        <Button onClick={sellDivision}>Sell division</Button>
      </>
    </Modal>
  );
}
