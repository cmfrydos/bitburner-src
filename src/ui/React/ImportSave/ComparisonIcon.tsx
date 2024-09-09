import React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Tooltip from "@mui\\material\\node\\Tooltip\\Tooltip.js";
// @ts-ignore


import ThumbUpAlt from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAlt from "@mui/icons-material/ThumbDownAlt";

export const ComparisonIcon = ({ isBetter }: { isBetter: boolean }): JSX.Element => {
  const title = isBetter ? "Imported value is larger!" : "Imported value is smaller!";
  const icon = isBetter ? <ThumbUpAlt color="success" /> : <ThumbDownAlt color="error" />;

  return <Tooltip title={title}>{icon}</Tooltip>;
};
