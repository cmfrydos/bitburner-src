/**
 * React Component for displaying the total production and production rate
 * of scripts on the 'Active Scripts' UI page
 */
import * as React from "react";

import { Money } from "../React/Money";
import { MoneyRate } from "../React/MoneyRate";
import { Player } from "@player";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { Theme } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Table\index.js
// @ts-ignore
import Table from "@mui\\material\\node\\Table\\Table.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableBody\index.js
// @ts-ignore
import TableBody from "@mui\\material\\node\\TableBody\\TableBody.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableCell\index.js
// @ts-ignore
import TableCell from "@mui\\material\\node\\TableCell\\TableCell.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableRow\index.js
// @ts-ignore
import TableRow from "@mui\\material\\node\\TableRow\\TableRow.js";
// @ts-ignore


const useStyles = makeStyles()((theme: Theme) => ({
  cell: {
    borderBottom: "none",
    padding: theme.spacing(1),
    margin: theme.spacing(1),
    whiteSpace: "nowrap",
  },
  size: {
    width: "1px",
  },
}));
export function ScriptProduction(): React.ReactElement {
  const { classes } = useStyles();
  const prodRateSinceLastAug = Player.scriptProdSinceLastAug / (Player.playtimeSinceLastAug / 1000);

  return (
    <Table size="small" classes={{ root: classes.size }}>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
            <Typography variant="body2">Total production since last Augment Installation:</Typography>
          </TableCell>
          <TableCell align="left" classes={{ root: classes.cell }}>
            <Typography variant="body2">
              <Money money={Player.scriptProdSinceLastAug} />
            </Typography>
          </TableCell>
          <TableCell align="left" classes={{ root: classes.cell }}>
            <Typography variant="body2">
              (<MoneyRate money={prodRateSinceLastAug} />)
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
