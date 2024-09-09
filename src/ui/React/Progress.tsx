// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\LinearProgress\index.js
// @ts-ignore
import LinearProgress from "@mui\\material\\node\\LinearProgress\\LinearProgress.js";
// @ts-ignore

import { Theme } from "@mui/material/styles";
import { withStyles } from "tss-react/mui";

export const ProgressBar = withStyles(LinearProgress, (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  bar: {
    transition: "none",
    backgroundColor: theme.palette.primary.main,
  },
}));
