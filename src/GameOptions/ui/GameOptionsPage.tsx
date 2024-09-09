// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import React from "react";
import { OptionsTabName } from "./GameOptionsRoot";

interface IProps {
  children: React.ReactNode;
  title: OptionsTabName;
}

export const GameOptionsPage = (props: IProps): React.ReactElement => {
  return (
    <Paper sx={{ height: "fit-content", p: 1 }}>
      <Typography variant="h6">{props.title}</Typography>
      {props.children}
    </Paper>
  );
};
