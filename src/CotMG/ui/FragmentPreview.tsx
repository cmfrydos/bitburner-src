import * as React from "react";
import { Cell } from "./Cell";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableRow\index.js
// @ts-ignore
import TableRow from "@mui\\material\\node\\TableRow\\TableRow.js";
// @ts-ignore


// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TableBody\index.js
// @ts-ignore
import TableBody from "@mui\\material\\node\\TableBody\\TableBody.js";
// @ts-ignore

import { Table } from "../../ui/React/Table";

interface IProps {
  width: number;
  height: number;
  colorAt: (x: number, y: number) => string;
}

export function FragmentPreview(props: IProps): React.ReactElement {
  // switch the width/length to make axis consistent.
  const elems = [];
  for (let j = 0; j < props.height; j++) {
    const cells = [];
    for (let i = 0; i < props.width; i++) {
      cells.push(<Cell key={i} color={props.colorAt(i, j)} />);
    }
    elems.push(<TableRow key={j}>{cells}</TableRow>);
  }

  return (
    <Table>
      <TableBody>{elems}</TableBody>
    </Table>
  );
}
