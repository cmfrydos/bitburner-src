// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\icons-material\esm\index.js
// @ts-ignore
import CheckBox from "@mui\\icons-material\\CheckBox.js";
// @ts-ignore
import CheckBoxOutlineBlank from "@mui\\icons-material\\CheckBoxOutlineBlank.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

import React from "react";
import { Settings } from "../../Settings/Settings";

Settings.theme.primary;

export interface IReqProps {
  value: string;
  color?: string;
  incompleteColor?: string;
  fulfilled: boolean;
}

export const Requirement = (props: IReqProps): React.ReactElement => {
  const completeColor = props.color || Settings.theme.primary;
  const incompleteColor = props.incompleteColor || Settings.theme.primarydark;

  return (
    <Typography
      sx={{ display: "flex", alignItems: "center", color: props.fulfilled ? completeColor : incompleteColor }}
    >
      {props.fulfilled ? <CheckBox sx={{ mr: 1 }} /> : <CheckBoxOutlineBlank sx={{ mr: 1 }} />}
      {props.value}
    </Typography>
  );
};
