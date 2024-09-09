import React, { ReactNode, ReactElement } from "react";

import { Table, TableCell } from "./Table";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import MuiTable from "@mui\\material\\node\\Table\\Table.js";
// @ts-ignore
import TableBody from "@mui\\material\\node\\TableBody\\TableBody.js";
// @ts-ignore
import TableRow from "@mui\\material\\node\\TableRow\\TableRow.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import { makeStyles } from "tss-react/mui";
import type { Property } from "csstype";

interface StatsTableProps {
  rows: ReactNode[][];
  title?: string;
  wide?: boolean;
  textAlign?: Property.TextAlign;
  paddingLeft?: string;
}

const useStyles = (textAlign: Property.TextAlign, paddingLeft: string) =>
  makeStyles()({
    firstCell: { textAlign: "left" },
    nonFirstCell: { textAlign: textAlign, paddingLeft: paddingLeft },
  })();

export function StatsTable({ rows, title, wide, textAlign, paddingLeft }: StatsTableProps): ReactElement {
  const T = wide ? MuiTable : Table;
  const { classes } = useStyles(textAlign ?? "right", paddingLeft ?? "0.5em");
  return (
    <>
      {title && <Typography>{title}</Typography>}
      <T size="small" padding="none">
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className={cellIndex === 0 ? classes.firstCell : classes.nonFirstCell}>
                  <Typography noWrap>{cell}</Typography>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </T>
    </>
  );
}
