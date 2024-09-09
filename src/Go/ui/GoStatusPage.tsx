import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Grid from "@mui\\material\\node\\Grid\\Grid.js";
// @ts-ignore
import Table from "@mui\\material\\node\\Table\\Table.js";
// @ts-ignore
import TableBody from "@mui\\material\\node\\TableBody\\TableBody.js";
// @ts-ignore
import TableCell from "@mui\\material\\node\\TableCell\\TableCell.js";
// @ts-ignore
import TableRow from "@mui\\material\\node\\TableRow\\TableRow.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { Go } from "../Go";
import { getScore } from "../boardAnalysis/scoring";
import { GoGameboard } from "./GoGameboard";
import { boardStyles } from "../boardState/goStyles";
import { useRerender } from "../../ui/React/hooks";
import { getBonusText } from "../effects/effect";
import { GoScoreSummaryTable } from "./GoScoreSummaryTable";
import { getRecordKeys } from "../../Types/Record";
import { GoOpponent } from "@enums";

export const GoStatusPage = (): React.ReactElement => {
  useRerender(400);
  const { classes } = boardStyles();
  const score = getScore(Go.currentGame);
  const opponent = Go.currentGame.ai;
  const playedOpponentList = getRecordKeys(Go.stats).filter((o) => o !== GoOpponent.none);

  return (
    <div>
      <Grid container>
        <Grid item>
          <div className={classes.statusPageScore}>
            <Typography variant="h5">Current Subnet:</Typography>
            <GoScoreSummaryTable score={score} opponent={opponent} />
          </div>
        </Grid>
        <Grid item>
          <div className={classes.statusPageGameboard}>
            <GoGameboard
              boardState={Go.currentGame}
              traditional={false}
              clickHandler={(x, y) => ({ x, y })}
              hover={false}
            />
          </div>
        </Grid>
      </Grid>
      <br />
      <Typography variant="h5">Summary of All Subnet Boosts:</Typography>
      <br />
      <Table sx={{ display: "table", mb: 1, width: "550px" }}>
        <TableBody>
          <TableRow>
            <TableCell className={classes.cellNone}>
              <strong>Faction:</strong>
            </TableCell>
            <TableCell className={classes.cellNone}>
              <strong>Effect:</strong>
            </TableCell>
          </TableRow>
          {playedOpponentList.map((faction, index) => {
            return (
              <TableRow key={index}>
                <TableCell className={classes.cellNone}>
                  <br />
                  <span>{faction}:</span>
                </TableCell>
                <TableCell className={classes.cellNone}>
                  <br />
                  <strong className={classes.keyText}>{getBonusText(faction)}</strong>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
