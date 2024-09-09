import * as React from "react";

import { Order } from "../Order";
import { PositionType } from "@enums";

import { formatShares } from "../../ui/formatNumber";
import { Money } from "../../ui/React/Money";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore

import { cancelOrder } from "../StockMarket";

interface IProps {
  order: Order;
}

/** React component for displaying a single order in a stock's order book */
export function StockTickerOrder(props: IProps): React.ReactElement {
  function handleCancelOrderClick(): void {
    cancelOrder({ order: props.order });
  }

  const order = props.order;

  const posTxt = order.pos === PositionType.Long ? "Long Position" : "Short Position";
  const txt = (
    <>
      {order.type} - {posTxt} - {formatShares(order.shares)} @ <Money money={order.price} />
    </>
  );

  return (
    <Box display="flex" alignItems="center">
      <Typography>{txt}</Typography>
      <Button onClick={handleCancelOrderClick}>Cancel Order</Button>
    </Box>
  );
}
