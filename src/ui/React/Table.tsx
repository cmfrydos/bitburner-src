import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import MuiTable from "@mui\\material\\node\\Table\\Table.js";
// @ts-ignore
import MuiTableCell from "@mui\\material\\node\\TableCell\\TableCell.js";
// @ts-ignore


import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()({
  root: {
    borderBottom: "none",
  },
  small: {
    width: "1px",
  },
});

export const TableCell: React.FC<TableCellProps> = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      classes={{
        root: useStyles().classes.root,
        ...props.classes,
      }}
    />
  );
};

export const Table: React.FC<TableProps> = (props: TableProps) => {
  return (
    <MuiTable
      {...props}
      classes={{
        root: useStyles().classes.small,
        ...props.classes,
      }}
    />
  );
};
