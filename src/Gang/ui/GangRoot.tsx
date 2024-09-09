import React from "react";
import { ManagementSubpage } from "./ManagementSubpage";
import { TerritorySubpage } from "./TerritorySubpage";
import { EquipmentsSubpage } from "./EquipmentsSubpage";
import { Player } from "@player";
import { Context } from "./Context";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tabs\index.js
// @ts-ignore
import Tabs from "@mui\\material\\node\\Tabs\\Tabs.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Tab\index.js
// @ts-ignore
import Tab from "@mui\\material\\node\\Tab\\Tab.js";
// @ts-ignore


import { useCycleRerender } from "../../ui/React/hooks";

/** React Component for all the gang stuff. */
export function GangRoot(): React.ReactElement {
  const gang = (function () {
    if (Player.gang === null) throw new Error("Gang should not be null");
    return Player.gang;
  })();
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.SyntheticEvent, tab: number): void {
    setValue(tab);
  }

  useCycleRerender();

  return (
    <Context.Gang.Provider value={gang}>
      <Tabs variant="fullWidth" value={value} onChange={handleChange} sx={{ minWidth: "fit-content", maxWidth: "45%" }}>
        <Tab label="Management" />
        <Tab label="Equipment" />
        <Tab label="Territory" />
      </Tabs>
      {value === 0 && <ManagementSubpage />}
      {value === 1 && <EquipmentsSubpage />}
      {value === 2 && <TerritorySubpage />}
    </Context.Gang.Provider>
  );
}
