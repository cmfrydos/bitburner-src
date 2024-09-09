/**
 * React component for the tickers configuration section of the Stock Market UI.
 * This config lets you change the way stock tickers are displayed (watchlist,
 * all/portfolio mode, etc)
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

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore


// numeric enum
export enum TickerDisplayMode {
  AllStocks,
  Portfolio,
}

interface IProps {
  changeDisplayMode: () => void;
  changeWatchlistFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  tickerDisplayMode: TickerDisplayMode;
}

function DisplayModeButton(props: IProps): React.ReactElement {
  let txt = "";
  let tooltip = "";
  if (props.tickerDisplayMode === TickerDisplayMode.Portfolio) {
    txt = "Switch to 'All Stocks' Mode";
    tooltip = "Displays all stocks on the WSE";
  } else {
    txt = "Switch to 'Portfolio' Mode";
    tooltip = "Displays only the stocks for which you have shares or orders";
  }

  return (
    <Tooltip title={<Typography>{tooltip}</Typography>}>
      <Button onClick={props.changeDisplayMode}>{txt}</Button>
    </Tooltip>
  );
}

export function StockTickersConfig(props: IProps): React.ReactElement {
  return (
    <>
      <DisplayModeButton {...props} />
      <br />
      <TextField
        sx={{ width: "100%" }}
        onChange={props.changeWatchlistFilter}
        placeholder="Filter Stocks by symbol (comma-separated list)"
        type="text"
      />
    </>
  );
}
