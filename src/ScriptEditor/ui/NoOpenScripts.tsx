import React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { Settings } from "../../Settings/Settings";

export function NoOpenScripts() {
  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{ color: Settings.theme.primary, fontSize: "20px", textAlign: "center" }}>
        <Typography variant="h4">No open files</Typography>
        <Typography variant="h5">
          Use <code>nano FILENAME</code> in
          <br />
          the terminal to open files
        </Typography>
      </span>
    </div>
  );
}
