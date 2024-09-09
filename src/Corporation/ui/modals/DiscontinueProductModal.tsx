import React from "react";

import { Product } from "../../Product";
import { Modal } from "../../../ui/React/Modal";
import { useDivision } from "../Context";
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
  product: Product;
  rerender: () => void;
}

// Create a popup that lets the player discontinue a product
export function DiscontinueProductModal(props: IProps): React.ReactElement {
  const division = useDivision();
  function discontinue(): void {
    division.discontinueProduct(props.product.name);
    props.onClose();
    props.rerender();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Are you sure you want to do this? Discontinuing a product removes it completely and permanently. You will no
        longer produce this product and all of its existing stock will be removed and left unsold
      </Typography>
      <Button onClick={discontinue}>Discontinue</Button>
    </Modal>
  );
}
