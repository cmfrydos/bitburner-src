import React, { useEffect, useState } from "react";
import type { CityName } from "@enums";
import type { Product } from "../../Product";
import * as actions from "../../Actions";
import { Modal } from "../../../ui/React/Modal";
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

import { KEY } from "../../../utils/helpers/keyCodes";

interface IProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  city: CityName;
}

// Create a popup that lets the player limit the production of a product
export function LimitProductProductionModal(props: IProps): React.ReactElement {
  const [limit, setLimit] = useState<number | null>(null);

  // reset modal internal state on modal close
  useEffect(() => {
    if (!props.open) {
      setLimit(null);
    }
  }, [props.open]);

  function limitProductProduction(): void {
    let qty = limit;
    if (qty === null) qty = -1;
    actions.limitProductProduction(props.product, props.city, qty);
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === KEY.ENTER) limitProductProduction();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setLimit(null);
    else setLimit(parseFloat(event.target.value));
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter a limit to the amount of this product you would like to produce per second. Leave the box empty to set no
        limit.
      </Typography>
      <TextField autoFocus={true} placeholder="Limit" type="number" onChange={onChange} onKeyDown={onKeyDown} />
      <Button onClick={limitProductProduction}>Limit production</Button>
    </Modal>
  );
}
