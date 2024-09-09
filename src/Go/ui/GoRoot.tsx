import React from "react";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Container from "@mui\\material\\node\\Container\\Container.js";
// @ts-ignore
import Tab from "@mui\\material\\node\\Tab\\Tab.js";
// @ts-ignore
import Tabs from "@mui\\material\\node\\Tabs\\Tabs.js";
// @ts-ignore


import { GoInstructionsPage } from "./GoInstructionsPage";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\icons-material\esm\index.js
// @ts-ignore
import BorderInnerSharp from "@mui\\icons-material\\BorderInnerSharp.js";
// @ts-ignore
import Help from "@mui\\icons-material\\Help.js";
// @ts-ignore
import History from "@mui\\icons-material\\History.js";
// @ts-ignore
import ManageSearch from "@mui\\icons-material\\ManageSearch.js";
// @ts-ignore

import { GoStatusPage } from "./GoStatusPage";
import { GoHistoryPage } from "./GoHistoryPage";
import { GoGameboardWrapper } from "./GoGameboardWrapper";
import { boardStyles } from "../boardState/goStyles";

export function GoRoot(): React.ReactElement {
  const { classes } = boardStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.SyntheticEvent, tab: number): void {
    setValue(tab);
  }

  function showInstructions() {
    setValue(3);
  }

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Tabs variant="fullWidth" value={value} onChange={handleChange} sx={{ minWidth: "fit-content", maxWidth: "45%" }}>
        <Tab label="IPvGO Subnet" icon={<BorderInnerSharp />} iconPosition={"start"} className={classes.tab} />
        <Tab label="Status" icon={<ManageSearch />} iconPosition={"start"} className={classes.tab} />
        <Tab label="History" icon={<History />} iconPosition={"start"} className={classes.tab} />
        <Tab label="How to Play" icon={<Help />} iconPosition={"start"} className={classes.tab} />
      </Tabs>
      {value === 0 && <GoGameboardWrapper showInstructions={showInstructions} />}
      {value === 1 && <GoStatusPage />}
      {value === 2 && <GoHistoryPage />}
      {value === 3 && <GoInstructionsPage />}
    </Container>
  );
}
