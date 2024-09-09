/**
 * Root React Component for the "Active Scripts" UI page. This page displays
 * and provides information about all of the player's scripts that are currently running
 */
import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore


import { recentScripts } from "../../Netscript/RecentScripts";
import { RecentScriptAccordion } from "./RecentScriptAccordion";

export function RecentScriptsPage(): React.ReactElement {
  return (
    <>
      <Typography>List of all recently killed scripts.</Typography>
      {recentScripts.map((r) => (
        <RecentScriptAccordion key={r.runningScript.pid} recentScript={r} />
      ))}
    </>
  );
}
