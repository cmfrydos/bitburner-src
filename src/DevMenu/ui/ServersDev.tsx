import React, { useState } from "react";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Accordion\index.js
// @ts-ignore
import Accordion from "@mui\\material\\node\\Accordion\\Accordion.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionSummary\index.js
// @ts-ignore
import AccordionSummary from "@mui\\material\\node\\AccordionSummary\\AccordionSummary.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\AccordionDetails\index.js
// @ts-ignore
import AccordionDetails from "@mui\\material\\node\\AccordionDetails\\AccordionDetails.js";
// @ts-ignore

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Typography\index.js
// @ts-ignore
import Typography from "@mui\\material\\node\\Typography\\Typography.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Button\index.js
// @ts-ignore
import Button from "@mui\\material\\node\\Button\\Button.js";
// @ts-ignore

import { GetServer, GetAllServers } from "../../Server/AllServers";
import { Server } from "../../Server/Server";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Autocomplete\index.js
// @ts-ignore
import Autocomplete from "@mui\\material\\node\\Autocomplete\\Autocomplete.js";
// @ts-ignore

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\TextField\index.js
// @ts-ignore
import TextField from "@mui\\material\\node\\TextField\\TextField.js";
// @ts-ignore


export function ServersDev(): React.ReactElement {
  const [server, setServer] = useState<string>("home");
  const servers = GetAllServers().map((server) => server.hostname);

  function rootServer(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.hasAdminRights = true;
    s.sshPortOpen = true;
    s.ftpPortOpen = true;
    s.smtpPortOpen = true;
    s.httpPortOpen = true;
    s.sqlPortOpen = true;
    s.openPortCount = 5;
  }

  function rootAllServers(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.hasAdminRights = true;
      s.sshPortOpen = true;
      s.ftpPortOpen = true;
      s.smtpPortOpen = true;
      s.httpPortOpen = true;
      s.sqlPortOpen = true;
      s.openPortCount = 5;
    }
  }

  function backdoorServer(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.backdoorInstalled = true;
  }

  function backdoorAllServers(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.backdoorInstalled = true;
    }
  }

  function minSecurity(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.hackDifficulty = s.minDifficulty;
  }

  function minAllSecurity(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.hackDifficulty = s.minDifficulty;
    }
  }

  function maxMoney(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.moneyAvailable = s.moneyMax;
  }

  function maxAllMoney(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.moneyAvailable = s.moneyMax;
    }
  }

  function minMoney(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.moneyAvailable = 0;
  }

  function minAllMoney(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.moneyAvailable = 0;
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Servers</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Server:</Typography>
              </td>
              <td colSpan={2}>
                <Autocomplete
                  style={{ width: "250px" }}
                  options={servers}
                  value={server}
                  renderInput={(params) => <TextField {...params} />}
                  onChange={(_, server) => {
                    if (!server || GetServer(server) === null) {
                      return;
                    }
                    setServer(server);
                  }}
                ></Autocomplete>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Root:</Typography>
              </td>
              <td>
                <Button onClick={rootServer}>Root one</Button>
              </td>
              <td>
                <Button onClick={rootAllServers}>Root all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Backdoor:</Typography>
              </td>
              <td>
                <Button onClick={backdoorServer}>Backdoor one</Button>
              </td>
              <td>
                <Button onClick={backdoorAllServers}>Backdoor all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Security:</Typography>
              </td>
              <td>
                <Button onClick={minSecurity}>Min one</Button>
              </td>
              <td>
                <Button onClick={minAllSecurity}>Min all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Money:</Typography>
              </td>
              <td>
                <Button onClick={minMoney}>Min one</Button>
              </td>
              <td>
                <Button onClick={minAllMoney}>Min all</Button>
              </td>
              <td>
                <Button onClick={maxMoney}>Max one</Button>
              </td>
              <td>
                <Button onClick={maxAllMoney}>Max all</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
