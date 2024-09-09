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

// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\Select\index.js
// @ts-ignore
import Select from "@mui\\material\\node\\Select\\Select.js";
// @ts-ignore

import { Player } from "@player";
// parsed barrel: C:\Docs\bb\cmf\bitburner-src\node_modules\@mui\material\MenuItem\index.js
// @ts-ignore
import MenuItem from "@mui\\material\\node\\MenuItem\\MenuItem.js";
// @ts-ignore

import { CompletedProgramName } from "@enums";

export function ProgramsDev(): React.ReactElement {
  const [program, setProgram] = useState(CompletedProgramName.bruteSsh);
  function setProgramDropdown(event: SelectChangeEvent): void {
    setProgram(event.target.value as CompletedProgramName);
  }
  function addProgram(): void {
    Player.getHomeComputer().pushProgram(program);
  }

  function addAllPrograms(): void {
    const home = Player.getHomeComputer();
    for (const name of Object.values(CompletedProgramName)) {
      home.pushProgram(name);
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Programs</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Program:</Typography>
              </td>
              <td>
                <Select onChange={setProgramDropdown} value={program}>
                  {Object.values(CompletedProgramName).map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Add:</Typography>
              </td>
              <td>
                <Button onClick={addProgram}>One</Button>
                <Button onClick={addAllPrograms}>All</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
