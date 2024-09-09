/**
 * React component for a selectable option on the Faction UI. These
 * options including working for the faction, hacking missions, purchasing
 * augmentations, etc.
 */
import * as React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Paper\index.js
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Box\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore


interface IProps {
  buttonText: string;
  infoText: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
}

export function Option(props: IProps): React.ReactElement {
  return (
    <Box>
      <Paper sx={{ my: 1, p: 1 }}>
        <Button onClick={props.onClick}>{props.buttonText}</Button>
        <Typography>{props.infoText}</Typography>
      </Paper>
    </Box>
  );
}
