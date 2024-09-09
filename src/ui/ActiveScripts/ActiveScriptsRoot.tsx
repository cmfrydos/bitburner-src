/**
 * Root React Component for the "Active Scripts" UI page. This page displays
 * and provides information about all of the player's scripts that are currently running
 */
import React, { useState } from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tabs\index.js
// @ts-ignore
import Tabs from "@mui\\material\\node\\Tabs\\Tabs.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tab\index.js
// @ts-ignore
import Tab from "@mui\\material\\node\\Tab\\Tab.js";
// @ts-ignore


import { ActiveScriptsPage } from "./ActiveScriptsPage";
import { RecentScriptsPage } from "./RecentScriptsPage";
import { useRerender } from "../React/hooks";

export function ActiveScriptsRoot(): React.ReactElement {
  const [tab, setTab] = useState<"active" | "recent">("active");
  useRerender(400);

  function handleChange(event: React.SyntheticEvent, tab: "active" | "recent"): void {
    setTab(tab);
  }
  return (
    <>
      <Tabs variant="fullWidth" value={tab} onChange={handleChange} sx={{ minWidth: "fit-content", maxWidth: "25%" }}>
        <Tab label={"Active"} value={"active"} />
        <Tab label={"Recently Killed"} value={"recent"} />
      </Tabs>

      {tab === "active" && <ActiveScriptsPage />}
      {tab === "recent" && <RecentScriptsPage />}
    </>
  );
}
