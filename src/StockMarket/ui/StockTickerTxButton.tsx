/**
 * React Component for a button that initiates a transaction on the Stock Market UI
 * (Buy, Sell, Buy Max, etc.)
 */
import * as React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tooltip\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

interface IProps {
  onClick: () => void;
  text: string;
  tooltip?: JSX.Element | null;
}

export function StockTickerTxButton(props: IProps): React.ReactElement {
  return (
    <Tooltip title={props.tooltip != null ? <Typography>{props.tooltip}</Typography> : ""}>
      <Button onClick={props.onClick}>{props.text}</Button>
    </Tooltip>
  );
}
