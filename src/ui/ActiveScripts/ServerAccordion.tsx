import type { WorkerScript } from "../../Netscript/WorkerScript";
import type { BaseServer } from "../../Server/BaseServer";

import * as React from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\index.js
// @ts-ignore
import Box from "@mui\\material\\node\\Box\\Box.js";
// @ts-ignore
import Collapse from "@mui\\material\\node\\Collapse\\Collapse.js";
// @ts-ignore
import ListItemButton from "@mui\\material\\node\\ListItemButton\\ListItemButton.js";
// @ts-ignore
import ListItemText from "@mui\\material\\node\\ListItemText\\ListItemText.js";
// @ts-ignore
import Paper from "@mui\\material\\node\\Paper\\Paper.js";
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\icons-material\esm\index.js
// @ts-ignore
import ExpandLess from "@mui\\icons-material\\ExpandLess.js";
// @ts-ignore
import ExpandMore from "@mui\\icons-material\\ExpandMore.js";
// @ts-ignore


import { ServerAccordionContent } from "./ServerAccordionContent";

import { createProgressBarText } from "../../utils/helpers/createProgressBarText";

interface ServerAccordionProps {
  server: BaseServer;
  scripts: WorkerScript[];
}

export function ServerAccordion({ server, scripts }: ServerAccordionProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  // Accordion's header text
  // TODO: calculate the longest hostname length rather than hard coding it
  const longestHostnameLength = 18;
  const paddedName = `${server.hostname}${" ".repeat(longestHostnameLength)}`.slice(
    0,
    Math.max(server.hostname.length, longestHostnameLength),
  );
  const barOptions = {
    progress: server.ramUsed / server.maxRam,
    totalTicks: 30,
  };
  const headerTxt = `${paddedName} ${createProgressBarText(barOptions)}`;

  return (
    <Paper>
      <ListItemButton onClick={() => setOpen((old) => !old)}>
        <ListItemText primary={<Typography style={{ whiteSpace: "pre-wrap" }}>{headerTxt}</Typography>} />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Box mx={2}>
        <Collapse in={open} timeout={0} unmountOnExit>
          <ServerAccordionContent scripts={scripts} />
        </Collapse>
      </Box>
    </Paper>
  );
}
